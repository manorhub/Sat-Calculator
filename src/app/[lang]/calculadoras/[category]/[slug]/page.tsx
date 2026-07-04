import React from 'react';
import { notFound } from 'next/navigation';
import { getCalculatorBySlug } from '../../../../../calculators';
import CalculatorEngine from '../../../../../components/CalculatorEngine';
import RichSnippets from '../../../../../components/SEO/RichSnippets';
import AIAssistant from '../../../../../components/AI/AIAssistant';
import LanguageSelector from '../../../../../components/LanguageSelector';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
}

function getLocalizedConfig(config: any, lang: string) {
  if (lang === 'es' || !config.translations || !config.translations[lang]) {
    return config;
  }
  const trans = config.translations[lang];
  return {
    ...config,
    title: trans.title || config.title,
    shortDescription: trans.shortDescription || config.shortDescription,
    category: trans.category || config.category,
    seo: {
      ...config.seo,
      ...(trans.seo || {})
    }
  };
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const baseCalculator = getCalculatorBySlug(resolvedParams.slug);

  if (!baseCalculator) {
    return {
      title: lang === 'en' ? 'Calculator Not Found' : 'Calculadora no encontrada',
      description: lang === 'en' ? 'The requested calculator does not exist.' : 'La calculadora solicitada no existe o ha sido movida.',
    };
  }

  const calculator = getLocalizedConfig(baseCalculator, lang);

  return {
    title: calculator.seo.metaTitle,
    description: calculator.seo.metaDescription,
    keywords: calculator.seo.keywords.join(', '),
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const baseCalculator = getCalculatorBySlug(resolvedParams.slug);

  if (!baseCalculator) {
    notFound();
  }

  const calculator = getLocalizedConfig(baseCalculator, lang);
  const currentUrl = `https://calculadorasat.org/${lang === 'en' ? 'en/' : ''}calculadoras/${resolvedParams.category}/${resolvedParams.slug}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      {/* Dynamic SEO JSON-LD Schemas */}
      <RichSnippets config={calculator} url={currentUrl} />

      {/* Navigation Breadcrumbs & Language Selector */}
      <div className="max-w-6xl mx-auto px-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <nav className="flex text-sm text-slate-500 dark:text-slate-400">
          <Link href={lang === 'en' ? '/en' : '/'} className="hover:text-blue-600 transition-colors">
            {lang === 'en' ? 'Home' : 'Inicio'}
          </Link>
          <span className="mx-2">/</span>
          <Link href={lang === 'en' ? `/en/calculadoras/${resolvedParams.category}` : `/calculadoras/${resolvedParams.category}`} className="hover:text-blue-600 transition-colors capitalize">
            {calculator.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {calculator.title}
          </span>
        </nav>
        <LanguageSelector />
      </div>

      {/* Main Engine Component */}
      <CalculatorEngine slug={resolvedParams.slug} lang={lang} />

      {/* Contextual AI Assistant Drawer */}
      <AIAssistant activeCalculatorContext={calculator.title} />
    </main>
  );
}
