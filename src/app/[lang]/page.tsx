'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { calculators } from '../../calculators';
import AIAssistant from '../../components/AI/AIAssistant';
import LanguageSelector from '../../components/LanguageSelector';
import esDict from '../../dictionaries/es.json';
import enDict from '../../dictionaries/en.json';


export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const dict = lang === 'en' ? enDict : esDict;
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentCalculations, setRecentCalculations] = useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const favs = JSON.parse(localStorage.getItem('sat_calc_favorites') || '[]');
      setFavoriteIds(favs);
      
      const hist = JSON.parse(localStorage.getItem('sat_calc_history') || '[]');
      setRecentCalculations(hist.slice(0, 3));
    }
  }, []);

  const localizedCalculators = React.useMemo(() => {
    return calculators.map(calc => {
      if (lang === 'en' && calc.translations?.en) {
        const trans = calc.translations.en;
        return {
          ...calc,
          title: trans.title || calc.title,
          shortDescription: trans.shortDescription || calc.shortDescription,
          category: trans.category || calc.category,
        };
      }
      return calc;
    });
  }, [lang]);

  const filteredCalculators = localizedCalculators.filter((calc) =>
    calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { name: lang === 'en' ? 'Federal Taxes' : 'Impuestos Federales', slug: 'sat', icon: '🏛️' },
    { name: 'RESICO', slug: 'resico', icon: '🌱' },
    { name: lang === 'en' ? 'Payroll & Labor' : 'Nómina y LFT', slug: 'nomina', icon: '💼' },
    { name: lang === 'en' ? 'Personal Finance' : 'Finanzas Personales', slug: 'finanzas-personales', icon: '🪙' },
    { name: lang === 'en' ? 'Mortgages' : 'Hipotecas', slug: 'hipotecas', icon: '🏠' },
    { name: lang === 'en' ? 'Loans' : 'Préstamos', slug: 'prestamos', icon: '💸' },
    { name: lang === 'en' ? 'Investments' : 'Inversiones', slug: 'inversiones', icon: '📈' },
    { name: lang === 'en' ? 'Compound Interest' : 'Interés Compuesto', slug: 'interes-compuesto', icon: '🔄' },
    { name: lang === 'en' ? 'Exchange Rate' : 'Tipo de Cambio', slug: 'tipo-de-cambio', icon: '💱' },
    { name: lang === 'en' ? 'Business' : 'Negocios', slug: 'negocios', icon: '🏢' },
    { name: lang === 'en' ? 'Accounting' : 'Contabilidad', slug: 'contabilidad', icon: '📊' },
    { name: lang === 'en' ? 'Conversions' : 'Conversiones', slug: 'conversiones', icon: '⚖️' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href={lang === 'en' ? '/en' : '/'} className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
            Calculadora<span className="text-blue-600">SAT</span>
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <nav className="flex space-x-4 sm:space-x-6">
              <Link href={lang === 'en' ? '/en/calendario-fiscal' : '/calendario-fiscal'} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 whitespace-nowrap">
                📅 {dict.nav.calendar}
              </Link>
            </nav>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-indigo-700 text-white py-20 sm:py-32">

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-100 uppercase tracking-wider mb-6">
            {dict.home.hero_badge}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            {dict.home.hero_title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto font-medium">
            {dict.home.hero_desc}
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative rounded-2xl shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.home.search_placeholder}
                className="w-full px-6 py-4 rounded-2xl border-0 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {searchQuery ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'en' ? 'Search Results' : 'Resultados de Búsqueda'} ({filteredCalculators.length})
            </h2>
            {filteredCalculators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCalculators.map((calc) => (
                  <Link
                    key={calc.id}
                    href={`${lang === 'en' ? '/en' : ''}/calculadoras/${calc.categorySlug}/${calc.slug}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {calc.category}
                      </span>
                      <h3 className="text-lg font-bold mt-2 text-slate-950 dark:text-white">
                        {calc.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                        {calc.shortDescription}
                      </p>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-4 flex items-center">
                      {lang === 'en' ? 'Go to calculate ➔' : 'Ir a calcular ➔'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                {lang === 'en' ? 'No calculators found matching your search.' : 'No se encontraron calculadoras que coincidan con tu búsqueda.'}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Favorites & Recents Dashboard */}
            {(favoriteIds.length > 0 || recentCalculations.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Favorites Panel */}
                {favoriteIds.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      ⭐ {dict.home.favorites_title}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {localizedCalculators
                        .filter((c) => favoriteIds.includes(c.id))
                        .map((calc) => (
                          <Link
                            key={calc.id}
                            href={`${lang === 'en' ? '/en' : ''}/calculadoras/${calc.categorySlug}/${calc.slug}`}
                            className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-950 dark:hover:bg-slate-850 transition duration-200"
                          >
                            <span className="font-semibold text-sm text-slate-880 dark:text-slate-200">
                              {calc.title}
                            </span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                              {lang === 'en' ? 'Calculate ➔' : 'Calcular ➔'}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recents Panel */}
                {recentCalculations.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      📁 {lang === 'en' ? 'Recent Saved Calculations' : 'Cálculos Recientes Guardados'}
                    </h3>
                    <div className="space-y-3">
                      {recentCalculations.map((entry) => {
                        const params = new URLSearchParams();
                        Object.entries(entry.inputs).forEach(([k, v]) => params.set(k, String(v)));
                        const linkUrl = `${lang === 'en' ? '/en' : ''}/calculadoras/${entry.categorySlug}/${entry.calcSlug}?${params.toString()}`;
                        return (
                          <Link
                            key={entry.id}
                            href={linkUrl}
                            className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-950 dark:hover:bg-slate-850 transition duration-200"
                          >
                            <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {entry.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(entry.timestamp).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX')} - {entry.results[entry.results.length - 1].formatted}
                              </div>
                            </div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                              {lang === 'en' ? 'Open ➔' : 'Abrir ➔'}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Featured Section */}
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-8 flex items-center">
              🔥 {lang === 'en' ? 'Popular Tools' : 'Herramientas Populares'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {localizedCalculators.map((calc) => (
                <Link
                  key={calc.id}
                  href={`${lang === 'en' ? '/en' : ''}/calculadoras/${calc.categorySlug}/${calc.slug}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {calc.category}
                    </span>
                    <h3 className="text-lg font-bold mt-2 text-slate-950 dark:text-white">
                      {calc.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {calc.shortDescription}
                    </p>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-4 flex items-center">
                    {lang === 'en' ? 'Go to calculate ➔' : 'Ir a calcular ➔'}
                  </span>
                </Link>
              ))}
            </div>

            {/* Categories Section */}
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white mb-8">
              📂 {dict.home.categories_title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
              {categories.map((cat) => {
                const count = calculators.filter(c => c.categorySlug === cat.slug).length;
                return (
                  <Link
                    key={cat.slug}
                    href={`${lang === 'en' ? '/en' : ''}/calculadoras/${cat.slug}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="text-3xl mb-3">{cat.icon}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {cat.name}
                    </h3>
                    <span className="text-slate-500 text-xs mt-1">
                      {count} {lang === 'en' ? (count === 1 ? 'calculator' : 'calculators') : (count === 1 ? 'calculadora' : 'calculadoras')}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* AI Callout Section */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between shadow-lg">
              <div className="max-w-xl text-center lg:text-left mb-6 lg:mb-0">
                <span className="px-3 py-1 bg-white/15 text-violet-200 rounded-full text-xs font-semibold tracking-wider uppercase">
                  {dict.ai_callout.badge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
                  {dict.ai_callout.title}
                </h2>
                <p className="text-violet-100/90 text-sm sm:text-base mt-3">
                  {dict.ai_callout.desc}
                </p>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-ai-assistant'));
                  }
                }}
                className="px-6 py-3.5 bg-white text-indigo-700 hover:bg-slate-100 transition duration-200 rounded-xl font-bold text-base shadow-md whitespace-nowrap"
              >
                {dict.ai_callout.button}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <span className="font-extrabold text-slate-900 dark:text-white text-base">
              Calculadora<span className="text-blue-600">SAT</span>
            </span>
            <p className="mt-1">{dict.footer.rights} {dict.footer.disclaimer}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 mt-4 md:mt-0">
            <Link href={lang === 'en' ? '/en/calendario-fiscal' : '/calendario-fiscal'} className="hover:text-slate-700 transition font-bold text-blue-600 dark:text-blue-400">{dict.nav.calendar}</Link>
            <Link href={lang === 'en' ? '/en/developer' : '/developer'} className="hover:text-slate-700 transition font-bold text-indigo-600 dark:text-indigo-400">{dict.nav.developer}</Link>
            <Link href={lang === 'en' ? '/en/privacy' : '/privacy'} className="hover:text-slate-700 transition">{dict.footer.privacy}</Link>
            <Link href={lang === 'en' ? '/en/terms' : '/terms'} className="hover:text-slate-700 transition">{dict.footer.terms}</Link>
            <Link href={lang === 'en' ? '/en/about' : '/about'} className="hover:text-slate-700 transition">{dict.nav.about}</Link>
            <Link href={lang === 'en' ? '/en/contact' : '/contact'} className="hover:text-slate-700 transition">{dict.nav.contact}</Link>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}

