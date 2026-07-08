'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';
import LanguageSelector from '../../../components/LanguageSelector';
import esDict from '../../../dictionaries/es.json';
import enDict from '../../../dictionaries/en.json';
import { Post } from '../../../types/blog';
import { calculators } from '../../../calculators';

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const dict = lang === 'en' ? enDict : esDict;

  // Authentication State
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langFilter, setLangFilter] = useState<'all' | 'es' | 'en'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Editor Form State
  const [isEditing, setIsEditing] = useState(false);
  const [activePost, setActivePost] = useState<Partial<Post> | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [editorError, setEditorError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load auth token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sat_admin_token');
      if (token) {
        setAuthToken(token);
      }
    }
  }, []);

  // Fetch posts when authenticated
  useEffect(() => {
    if (authToken) {
      fetchDashboardPosts();
    }
  }, [authToken]);

  // Handle Notifications auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const fetchDashboardPosts = async () => {
    if (!authToken) return;
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.status === 401) {
        // Token expired or invalid
        handleLogout();
        showNotification(lang === 'en' ? 'Session expired. Please log in again.' : 'Sesión expirada. Por favor ingresa de nuevo.', 'error');
      } else if (!res.ok) {
        throw new Error('Failed to fetch posts');
      } else {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error fetching posts', 'error');
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsVerifying(true);
    setAuthError('');
    try {
      // Test password by attempting to fetch posts
      const res = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (res.ok) {
        localStorage.setItem('sat_admin_token', password);
        setAuthToken(password);
        showNotification(lang === 'en' ? 'Authenticated successfully!' : '¡Autenticado correctamente!', 'success');
      } else {
        setAuthError(lang === 'en' ? 'Incorrect password. Try again.' : 'Contraseña incorrecta. Inténtalo de nuevo.');
      }
    } catch (err) {
      setAuthError(lang === 'en' ? 'Server connection error.' : 'Error de conexión con el servidor.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sat_admin_token');
    setAuthToken(null);
    setPassword('');
    setPosts([]);
  };

  const startNewPost = () => {
    setActivePost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      lang: 'es',
      category: 'SAT',
      status: 'draft',
      author: lang === 'en' ? 'Admin' : 'Administrador'
    });
    setEditorMode('edit');
    setEditorError('');
    setIsEditing(true);
  };

  const startEditPost = (post: Post) => {
    setActivePost(post);
    setEditorMode('edit');
    setEditorError('');
    setIsEditing(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm(lang === 'en' ? 'Are you sure you want to delete this post?' : '¿Estás seguro de que deseas eliminar esta entrada?')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (res.ok) {
        showNotification(lang === 'en' ? 'Post deleted successfully!' : '¡Entrada eliminada correctamente!', 'success');
        fetchDashboardPosts();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete');
      }
    } catch (err: any) {
      showNotification(err.message || 'Error deleting post', 'error');
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !activePost.title?.trim() || !activePost.content?.trim()) {
      setEditorError(lang === 'en' ? 'Title and Content are required.' : 'El título y el contenido son requeridos.');
      return;
    }

    setIsSaving(true);
    setEditorError('');
    try {
      const method = activePost.id ? 'PUT' : 'POST';
      const res = await fetch('/api/posts', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(activePost)
      });

      if (res.ok) {
        showNotification(
          lang === 'en' 
            ? `Post ${activePost.id ? 'updated' : 'created'} successfully!` 
            : `¡Entrada ${activePost.id ? 'actualizada' : 'creada'} correctamente!`,
          'success'
        );
        setIsEditing(false);
        setActivePost(null);
        fetchDashboardPosts();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save post');
      }
    } catch (err: any) {
      setEditorError(err.message || 'Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  const autoGenerateSlug = (title: string) => {
    if (activePost?.id) return; // Don't auto-change slug when editing existing post unless requested
    const generated = title
      .toLowerCase()
      .trim()
      .normalize('NFD') // Remove accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setActivePost(prev => prev ? { ...prev, title, slug: generated } : null);
  };

  const insertLinkAtCursor = (markdownLink: string) => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea || !activePost) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = activePost.content || '';
    
    const newContent = text.substring(0, startPos) + markdownLink + text.substring(endPos);
    
    setActivePost(prev => prev ? { ...prev, content: newContent } : null);
    
    // Focus back on the textarea and place cursor after inserted link
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + markdownLink.length;
      textarea.selectionEnd = startPos + markdownLink.length;
    }, 50);
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea || !activePost) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = activePost.content || '';
    const selectedText = text.substring(startPos, endPos);
    
    let replacement = '';
    let placeholderLength = 0;
    
    if (prefix === '# ' || prefix === '## ' || prefix === '### ') {
      const headingPlaceholder = lang === 'en' ? 'Heading' : 'Título';
      const headingText = selectedText || headingPlaceholder;
      replacement = `\n${prefix}${headingText}\n`;
      placeholderLength = headingText.length;
    } else if (prefix === '[' && suffix === '](url)') {
      const linkPlaceholder = lang === 'en' ? 'link text' : 'texto del enlace';
      const linkText = selectedText || linkPlaceholder;
      replacement = `[${linkText}](url)`;
      placeholderLength = linkText.length;
    } else {
      const generalPlaceholder = lang === 'en' ? 'text' : 'texto';
      const wrappedText = selectedText || generalPlaceholder;
      replacement = prefix + wrappedText + suffix;
      placeholderLength = wrappedText.length;
    }
    
    const newContent = text.substring(0, startPos) + replacement + text.substring(endPos);
    setActivePost(prev => prev ? { ...prev, content: newContent } : null);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.selectionStart = startPos;
        textarea.selectionEnd = startPos + replacement.length;
      } else {
        if (prefix === '# ' || prefix === '## ' || prefix === '### ') {
          // Select the placeholder text (offset by newline and prefix)
          textarea.selectionStart = startPos + 1 + prefix.length;
          textarea.selectionEnd = startPos + 1 + prefix.length + placeholderLength;
        } else if (prefix === '[' && suffix === '](url)') {
          // Select 'url' so they can type it immediately
          const offset = 1 + placeholderLength + 2; // '[' + placeholderLength + ']('
          textarea.selectionStart = startPos + offset;
          textarea.selectionEnd = startPos + offset + 3; // 'url' length is 3
        } else {
          // Select general placeholder text
          textarea.selectionStart = startPos + prefix.length;
          textarea.selectionEnd = startPos + prefix.length + placeholderLength;
        }
      }
    }, 50);
  };

  // Basic Markdown Parser for Preview
  const parseMarkdown = (md: string): string => {
    if (!md) return '';
    return md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-5 mb-2 text-slate-900 dark:text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold mt-6 mb-3 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-8 mb-4 text-slate-900 dark:text-white">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        const isInternal = url.startsWith('/') || url.startsWith('#') || !url.includes('://');
        const target = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${url}" class="text-blue-600 dark:text-blue-450 hover:underline font-bold animate-pulse-subtle"${target}>${text}</a>`;
      })
      .replace(/^- (.*$)/gim, '<li class="ml-5 list-disc text-slate-700 dark:text-slate-350 my-1">$1</li>')
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<a')) {
          return line;
        }
        return `<p class="mb-4 text-slate-650 dark:text-slate-350 leading-relaxed">${line}</p>`;
      })
      .join('\n');
  };

  // Filter lists
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLang = langFilter === 'all' || post.lang === langFilter || post.lang === 'all';
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesLang && matchesStatus;
  });

  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-250">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-55 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-bounce-short ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-250' 
            : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-250'
        }`}>
          <span className="text-xl">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <p className="font-semibold text-sm">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href={lang === 'en' ? '/en' : '/'} className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
              Calculadora<span className="text-blue-600">SAT</span>
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            {authToken && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-350 transition"
              >
                <i className="bi bi-box-arrow-right"></i> {lang === 'en' ? 'Log out' : 'Salir'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!authToken ? (
          /* Password login gate */
          <div className="max-w-md mx-auto my-12">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
              
              {/* Decorative accent gradients */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl"></div>
              
              <div className="text-center mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔐
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Administrative Access' : 'Acceso Administrativo'}
                </h2>
                <p className="text-slate-500 text-xs mt-2">
                  {lang === 'en' ? 'Enter password to publish news, blog posts, and regulatory updates.' : 'Ingresa la contraseña para publicar noticias, artículos del blog y novedades fiscales.'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 relative">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'Admin Password' : 'Contraseña de Administrador'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <i className="bi bi-shield-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                  {authError && (
                    <p className="text-xs text-rose-600 dark:text-rose-450 font-semibold mt-2.5 flex items-center gap-1.5">
                      ⚠️ {authError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {isVerifying && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                  {!isVerifying && <i className="bi bi-box-arrow-in-right"></i>}
                  <span>
                    {isVerifying 
                      ? (lang === 'en' ? 'Verifying...' : 'Verificando...') 
                      : (lang === 'en' ? 'Unlock Dashboard' : 'Desbloquear Panel')}
                  </span>
                </button>
              </form>
            </div>
          </div>
        ) : isEditing && activePost ? (
          /* Editor Interface */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
            
            {/* Editor Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setActivePost(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 font-bold mb-2 transition"
                >
                  <i className="bi bi-arrow-left"></i> {lang === 'en' ? 'Back to dashboard' : 'Volver al panel'}
                </button>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  {activePost.id 
                    ? (lang === 'en' ? 'Edit Publication' : 'Editar Publicación') 
                    : (lang === 'en' ? 'New Publication' : 'Nueva Publicación')}
                </h2>
              </div>

              {/* Editor Tabs (Form / Preview) */}
              <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-200/40 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    editorMode === 'edit'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <i className="bi bi-pencil-square"></i> {lang === 'en' ? 'Editor' : 'Editor'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                    editorMode === 'preview'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <i className="bi bi-eye"></i> {lang === 'en' ? 'Live Preview' : 'Vista Previa'}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {editorError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 text-sm font-semibold flex items-center gap-2">
                ⚠️ {editorError}
              </div>
            )}

            {/* Main Form content or preview container */}
            <form onSubmit={handleSavePost} className="space-y-6">
              {editorMode === 'edit' ? (
                /* Form fields */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Title and Content */}
                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'en' ? 'Title' : 'Título'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={activePost.title || ''}
                        onChange={(e) => {
                          setActivePost(prev => prev ? { ...prev, title: e.target.value } : null);
                          autoGenerateSlug(e.target.value);
                        }}
                        placeholder={lang === 'en' ? 'e.g., Guide to ISR Declarations 2026' : 'Ej: Guía de Declaración Anual de ISR 2026'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {lang === 'en' ? 'URL Slug (Dynamic/Editable)' : 'Slug de URL (Dinámico/Editable)'}
                        </label>
                        <input
                          type="text"
                          value={activePost.slug || ''}
                          onChange={(e) => setActivePost(prev => prev ? { ...prev, slug: e.target.value } : null)}
                          placeholder="e.g., guide-to-isr-2026"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {lang === 'en' ? 'Category' : 'Categoría'}
                        </label>
                        <input
                          type="text"
                          value={activePost.category || ''}
                          onChange={(e) => setActivePost(prev => prev ? { ...prev, category: e.target.value } : null)}
                          placeholder="e.g., SAT, ISR, RESICO, Finanzas"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Settings */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'en' ? 'Language target' : 'Idioma de destino'}
                      </label>
                      <select
                        value={activePost.lang || 'es'}
                        onChange={(e: any) => setActivePost(prev => prev ? { ...prev, lang: e.target.value } : null)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="all">{lang === 'en' ? 'All (Both)' : 'Todos (Ambos)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'en' ? 'Author' : 'Autor'}
                      </label>
                      <input
                        type="text"
                        value={activePost.author || ''}
                        onChange={(e) => setActivePost(prev => prev ? { ...prev, author: e.target.value } : null)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'en' ? 'Publication Status' : 'Estado de Publicación'}
                      </label>
                      <select
                        value={activePost.status || 'draft'}
                        onChange={(e: any) => setActivePost(prev => prev ? { ...prev, status: e.target.value } : null)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                      >
                        <option value="draft">{lang === 'en' ? 'Draft (Internal)' : 'Borrador (Interno)'}</option>
                        <option value="published">{lang === 'en' ? 'Published (Public)' : 'Publicado (Público)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {lang === 'en' ? 'Short Excerpt' : 'Resumen Breve'}
                      </label>
                      <textarea
                        value={activePost.excerpt || ''}
                        onChange={(e) => setActivePost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                        rows={1}
                        placeholder={lang === 'en' ? 'Brief 1-2 sentence description' : 'Breve descripción de 1 o 2 oraciones para la lista'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                      {/* Markdown Formatting Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          {lang === 'en' ? 'Content' : 'Contenido'} <span className="text-rose-500">*</span>
                        </label>
                        
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('# ')}
                            className="px-2 py-0.5 text-xs font-black hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Heading 1"
                          >
                            H1
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('## ')}
                            className="px-2 py-0.5 text-xs font-black hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Heading 2"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('### ')}
                            className="px-2 py-0.5 text-xs font-black hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Heading 3"
                          >
                            H3
                          </button>
                          <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-800 mx-0.5"></div>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('**', '**')}
                            className="px-2 py-0.5 text-xs hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Bold"
                          >
                            <i className="bi bi-type-bold"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('*', '*')}
                            className="px-2 py-0.5 text-xs hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Italic"
                          >
                            <i className="bi bi-type-italic"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('[', '](url)')}
                            className="px-2 py-0.5 text-xs hover:bg-white dark:hover:bg-slate-800 rounded transition text-slate-700 dark:text-slate-300"
                            title="Insert Link"
                          >
                            <i className="bi bi-link-45deg"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* Dynamic Link Inserter Selector */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-455 whitespace-nowrap">
                          🔗 {lang === 'en' ? 'Quick Link:' : 'Enlace rápido:'}
                        </span>
                        <select
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            insertLinkAtCursor(val);
                            e.target.value = ''; // Reset
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-350 max-w-[150px]"
                        >
                          <option value="">{lang === 'en' ? 'Select Calculator...' : 'Seleccionar...'}</option>
                          {/* Group by category */}
                          {Object.entries(
                            calculators.reduce((acc, calc) => {
                              const cat = calc.category;
                              if (!acc[cat]) acc[cat] = [];
                              acc[cat].push(calc);
                              return acc;
                            }, {} as Record<string, typeof calculators>)
                          ).map(([cat, calcs]) => (
                            <optgroup key={cat} label={cat}>
                              {calcs.map(calc => (
                                <option key={calc.id} value={`[${calc.title}](/${lang === 'en' ? 'en/' : ''}calculadoras/${calc.categorySlug}/${calc.slug})`}>
                                  {calc.title}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <textarea
                      id="post-content-textarea"
                      value={activePost.content || ''}
                      onChange={(e) => setActivePost(prev => prev ? { ...prev, content: e.target.value } : null)}
                      rows={12}
                      placeholder={lang === 'en' ? '## Subheading\nUse markdown for headings, bold, lists...\n- Point A\n- Point B' : '## Subtítulo\nUsa markdown para títulos, negritas, viñetas...\n- Punto A\n- Punto B'}
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono leading-relaxed"
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Live Preview Mode */
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 min-h-[300px]">
                  <div className="max-w-3xl mx-auto">
                    {/* Meta info preview */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-450 border-b border-slate-200/50 dark:border-slate-800 pb-4 mb-6">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-350 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {activePost.category || 'General'}
                      </span>
                      <span>•</span>
                      <span>✍️ {activePost.author || 'Admin'}</span>
                      <span>•</span>
                      <span>📅 {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        🌐 <span className="uppercase font-bold">{activePost.lang || 'es'}</span>
                      </span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activePost.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-350' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-350'
                      }`}>
                        {activePost.status === 'published' ? (lang === 'en' ? 'Published' : 'Publicado') : (lang === 'en' ? 'Draft' : 'Borrador')}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-none mb-4">
                      {activePost.title || (lang === 'en' ? 'Untitled Post' : 'Entrada sin Título')}
                    </h1>

                    {activePost.excerpt && (
                      <p className="text-lg text-slate-500 dark:text-slate-400 italic mb-8 border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 leading-relaxed">
                        {activePost.excerpt}
                      </p>
                    )}

                    <div 
                      className="prose dark:prose-invert max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(activePost.content || '') }}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-row justify-end items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setActivePost(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                  {!isSaving && <i className="bi bi-save"></i>}
                  <span>
                    {isSaving 
                      ? (lang === 'en' ? 'Saving...' : 'Guardando...') 
                      : (lang === 'en' ? 'Save Publication' : 'Guardar Publicación')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Dashboard Main Panel */
          <div className="space-y-8 animate-fade-in">
            
            {/* Stats Widget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">
                    {lang === 'en' ? 'Total Publications' : 'Total de Publicaciones'}
                  </span>
                  <span className="text-3xl font-black text-slate-950 dark:text-white mt-1 block">
                    {totalPosts}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                  📝
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">
                    {lang === 'en' ? 'Published' : 'Publicados'}
                  </span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-450 mt-1 block">
                    {publishedCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-xl">
                  🚀
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">
                    {lang === 'en' ? 'Drafts' : 'Borradores'}
                  </span>
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-450 mt-1 block">
                    {draftCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-xl">
                  ⚙️
                </div>
              </div>
            </div>

            {/* Control Bar: Search & Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full md:max-w-sm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search posts...' : 'Buscar publicaciones...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                />
              </div>

              {/* Filters & Add Button */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-2">
                  {/* Lang filter */}
                  <select
                    value={langFilter}
                    onChange={(e: any) => setLangFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">🌐 {lang === 'en' ? 'All Languages' : 'Todos los Idiomas'}</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="en">🇺🇸 English</option>
                  </select>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">📋 {lang === 'en' ? 'All Statuses' : 'Todos los Estados'}</option>
                    <option value="published">🚀 {lang === 'en' ? 'Published' : 'Publicados'}</option>
                    <option value="draft">⚙️ {lang === 'en' ? 'Drafts' : 'Borradores'}</option>
                  </select>
                </div>

                <button
                  onClick={startNewPost}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <i className="bi bi-plus-lg"></i>
                  {lang === 'en' ? 'New Post' : 'Nueva Entrada'}
                </button>
              </div>
            </div>

            {/* Publications List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              {loadingPosts ? (
                <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold">{lang === 'en' ? 'Loading publications...' : 'Cargando publicaciones...'}</span>
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-450">
                        <th className="py-4 px-6">{lang === 'en' ? 'Title' : 'Título'}</th>
                        <th className="py-4 px-6">{lang === 'en' ? 'Category' : 'Categoría'}</th>
                        <th className="py-4 px-6">{lang === 'en' ? 'Language' : 'Idioma'}</th>
                        <th className="py-4 px-6">{lang === 'en' ? 'Date' : 'Fecha'}</th>
                        <th className="py-4 px-6">{lang === 'en' ? 'Status' : 'Estado'}</th>
                        <th className="py-4 px-6 text-right">{lang === 'en' ? 'Actions' : 'Acciones'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm font-medium">
                      {filteredPosts.map((post) => (
                        <tr 
                          key={post.id} 
                          className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-extrabold text-slate-950 dark:text-white max-w-xs sm:max-w-md truncate">
                                {post.title}
                              </div>
                              <div className="text-slate-500 text-xs truncate max-w-xs sm:max-w-md mt-0.5">
                                /{post.slug}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="uppercase text-xs font-extrabold flex items-center gap-1 text-slate-700 dark:text-slate-350">
                              🌐 {post.lang}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX')}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                              post.status === 'published' 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                            }`}>
                              {post.status === 'published' ? (lang === 'en' ? 'Published' : 'Publicado') : (lang === 'en' ? 'Draft' : 'Borrador')}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                onClick={() => startEditPost(post)}
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition"
                                title={lang === 'en' ? 'Edit' : 'Editar'}
                              >
                                <i className="bi bi-pencil-fill text-xs"></i>
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-450 flex items-center justify-center transition"
                                title={lang === 'en' ? 'Delete' : 'Eliminar'}
                              >
                                <i className="bi bi-trash-fill text-xs"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-550 dark:text-slate-450 font-medium">
                  {lang === 'en' ? 'No publications found.' : 'No se encontraron publicaciones.'}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
