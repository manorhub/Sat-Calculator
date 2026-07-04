import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Post } from '../../../types/blog';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'posts.json');

// Helper to handle and format errors
function handleError(error: any) {
  console.error('API Error:', error);
  if (error.message === 'STORAGE_ERROR_READ_ONLY') {
    return NextResponse.json({ 
      error: 'Error de almacenamiento: El sistema de archivos es de solo lectura. Para guardar publicaciones en producción, debes habilitar Vercel KV en el panel de control de tu proyecto Vercel.' 
    }, { status: 507 });
  }
  return NextResponse.json({ error: error.message }, { status: 500 });
}

// Helper to read posts (supports Vercel KV with local file fallback)
async function readPosts(): Promise<Post[]> {
  // Read local file fallback first as baseline
  let localPosts: Post[] = [];
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    localPosts = JSON.parse(data);
  } catch (error) {
    // ignore if local file doesn't exist
  }

  // If Vercel KV is configured (production), fetch from KV
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['GET', 'posts']),
        cache: 'no-store' // Do not cache dynamic database reads
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return JSON.parse(data.result);
        } else {
          // If KV is connected but empty, warm it up with local sample posts
          if (localPosts.length > 0) {
            await writePosts(localPosts);
          }
          return localPosts;
        }
      } else {
        console.error('KV GET failed:', res.status, await res.text());
      }
    } catch (error) {
      console.error('Failed to read from Vercel KV, falling back to local posts:', error);
    }
  }

  return localPosts;
}

// Helper to write posts (supports Vercel KV with local file fallback and EROFS detection)
async function writePosts(posts: Post[]): Promise<void> {
  // If Vercel KV is configured (production), write to KV
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'posts', JSON.stringify(posts)])
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Vercel KV write failed: ${errText}`);
      }
      return;
    } catch (error) {
      console.error('Failed to write to Vercel KV:', error);
      throw error;
    }
  }

  // Fallback to local file system (development)
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error: any) {
    if (error.code === 'EROFS' || error.message?.includes('read-only') || error.message?.includes('EROFS')) {
      throw new Error('STORAGE_ERROR_READ_ONLY');
    }
    throw error;
  }
}

// Simple admin validation
function validateAdmin(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedPassword = process.env.ADMIN_PASSWORD || 'satadmin2026';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7); // "Bearer " is 7 chars
  return token === expectedPassword;
}

// GET: Fetch posts (filtered or full list based on admin status)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const lang = searchParams.get('lang'); // 'es' | 'en'
    
    const isAdmin = validateAdmin(request);
    let posts = await readPosts();
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // If not admin, return only published posts
    if (!isAdmin) {
      posts = posts.filter(post => post.status === 'published');
    }
    
    // Filter by ID if requested
    if (id) {
      const post = posts.find(p => p.id === id);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    // Filter by Slug if requested
    if (slug) {
      const post = posts.find(p => p.slug === slug);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    // Filter by Lang if requested
    if (lang) {
      posts = posts.filter(p => p.lang === lang || p.lang === 'all');
    }
    
    return NextResponse.json(posts);
  } catch (error: any) {
    return handleError(error);
  }
}

// POST: Create a new post (Admin only)
export async function POST(request: Request) {
  try {
    if (!validateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, excerpt, content, lang, category, status, author } = body;
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    const posts = await readPosts();
    
    // Generate slug from title
    const slug = body.slug || title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    // Check if slug is already used
    if (posts.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      slug,
      excerpt: excerpt || title,
      content,
      lang: lang || 'es',
      category: category || 'General',
      date: new Date().toISOString(),
      author: author || 'Administrador',
      status: status || 'draft',
    };
    
    posts.push(newPost);
    await writePosts(posts);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT: Update an existing post (Admin only)
export async function PUT(request: Request) {
  try {
    if (!validateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, title, slug, excerpt, content, lang, category, status, author } = body;
    
    if (!id || !title || !content) {
      return NextResponse.json({ error: 'ID, title and content are required' }, { status: 400 });
    }
    
    let posts = await readPosts();
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Verify slug uniqueness if updated
    const finalSlug = slug || title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    if (posts.some((p, idx) => p.slug === finalSlug && idx !== index)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    
    const updatedPost: Post = {
      ...posts[index],
      title,
      slug: finalSlug,
      excerpt: excerpt || title,
      content,
      lang: lang || posts[index].lang,
      category: category || posts[index].category,
      status: status || posts[index].status,
      author: author || posts[index].author,
    };
    
    posts[index] = updatedPost;
    await writePosts(posts);
    
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE: Delete a post (Admin only)
export async function DELETE(request: Request) {
  try {
    if (!validateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    let posts = await readPosts();
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    posts.splice(index, 1);
    await writePosts(posts);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleError(error);
  }
}
