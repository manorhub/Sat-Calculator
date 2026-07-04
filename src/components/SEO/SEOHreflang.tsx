'use client';

import { usePathname } from 'next/navigation';

export default function SEOHreflang() {
  const pathname = usePathname();

  if (!pathname) return null;

  // Clean pathname and remove /en prefix to get the base route
  const basePath = pathname.replace(/^\/en/, '').replace(/\/+/g, '/');
  
  const domain = 'https://www.calculadorasat.org';
  const canonicalUrl = `${domain}${basePath === '/' ? '' : basePath}`;
  const englishUrl = `${domain}/en${basePath === '/' ? '' : basePath}`;

  const currentCanonical = pathname.startsWith('/en') ? englishUrl : canonicalUrl;

  return (
    <>
      <link rel="canonical" href={currentCanonical} />
      <link rel="alternate" hrefLang="es-MX" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-US" href={englishUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </>
  );
}
