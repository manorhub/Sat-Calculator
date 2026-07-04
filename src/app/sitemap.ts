import type { MetadataRoute } from 'next';
import { calculators } from '@/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = 'https://www.calculadorasat.org';
  const currentDate = new Date();

  // 1. Static routes
  const staticPaths = [
    '',
    'about',
    'contact',
    'developer',
    'privacy',
    'terms',
    'calendario-fiscal',
  ];

  const staticEntries = staticPaths.map((path) => {
    const segment = path ? `/${path}` : '';
    return {
      url: `${domain}${segment}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          es: `${domain}${segment}`,
          en: `${domain}/en${segment}`,
        },
      },
    };
  });

  // 2. Category routes
  // Extract unique category slugs from calculators
  const uniqueCategories = Array.from(
    new Set(calculators.map((calc) => calc.categorySlug))
  );

  const categoryEntries = uniqueCategories.map((categorySlug) => {
    const segment = `/calculadoras/${categorySlug}`;
    return {
      url: `${domain}${segment}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          es: `${domain}${segment}`,
          en: `${domain}/en${segment}`,
        },
      },
    };
  });

  // 3. Calculator detail routes
  const calculatorEntries = calculators.map((calc) => {
    const segment = `/calculadoras/${calc.categorySlug}/${calc.slug}`;
    return {
      url: `${domain}${segment}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${domain}${segment}`,
          en: `${domain}/en${segment}`,
        },
      },
    };
  });

  return [...staticEntries, ...categoryEntries, ...calculatorEntries];
}
