'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  // Detect current language from pathname
  const currentLang = pathname.startsWith('/en') ? 'en' : 'es';

  const handleLanguageChange = (newLang: 'es' | 'en') => {
    if (newLang === currentLang) return;

    let newPath = pathname;
    if (newLang === 'en') {
      newPath = `/en${pathname}`;
    } else {
      newPath = pathname.replace(/^\/en/, '') || '/';
    }

    // Sanitize path (remove duplicate slashes)
    newPath = newPath.replace(/\/+/g, '/');
    if (newPath.endsWith('/') && newPath.length > 1) {
      newPath = newPath.slice(0, -1);
    }

    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 text-xs font-bold border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
          currentLang === 'es'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm scale-100'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Cambiar a Español"
      >
        ES 🇲🇽
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm scale-100'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        aria-label="Switch to English"
      >
        EN 🇺🇸
      </button>
    </div>
  );
}
