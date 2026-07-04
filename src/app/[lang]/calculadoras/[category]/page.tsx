import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCalculatorsByCategory } from '../../../../calculators';
import AIAssistant from '../../../../components/AI/AIAssistant';
import LanguageSelector from '../../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

const categoryTranslations: Record<string, Record<string, { name: string; desc: string; icon: string }>> = {
  'es': {
    'sat': {
      name: 'Impuestos Federales',
      desc: 'Calcula tus obligaciones fiscales ante el SAT como el IVA, ISR personas físicas y corporativo.',
      icon: '🏛️'
    },
    'resico': {
      name: 'RESICO',
      desc: 'Simuladores y comparadores para el Régimen Simplificado de Confianza del SAT.',
      icon: '🌱'
    },
    'nomina': {
      name: 'Nómina y LFT',
      desc: 'Calcula salarios netos, aguinaldo, vacaciones, finiquitos, utilidades y otras prestaciones de la Ley Federal del Trabajo.',
      icon: '💼'
    },
    'finanzas-personales': {
      name: 'Finanzas Personales',
      desc: 'Herramientas de planificación financiera personal y organización de presupuestos como la regla 50/30/20.',
      icon: '🪙'
    },
    'hipotecas': {
      name: 'Hipotecas',
      desc: 'Simula mensualidades y tablas de amortización para créditos hipotecarios y compra de casas.',
      icon: '🏠'
    },
    'prestamos': {
      name: 'Préstamos',
      desc: 'Calcula los pagos fijos y el costo de intereses para préstamos personales y créditos de nómina.',
      icon: '💸'
    },
    'inversiones': {
      name: 'Inversiones',
      desc: 'Proyecta el rendimiento de tus inversiones en CETES y otros instrumentos financieros.',
      icon: '📈'
    },
    'interes-compuesto': {
      name: 'Interés Compuesto',
      desc: 'Simula el crecimiento exponencial de tu dinero reinvirtiendo ganancias a mediano y largo plazo.',
      icon: '🔄'
    },
    'tipo-de-cambio': {
      name: 'Tipo de Cambio',
      desc: 'Convertidor oficial y de mercado entre dólares estadounidenses (USD) y pesos mexicanos (MXN).',
      icon: '💱'
    },
    'negocios': {
      name: 'Negocios',
      desc: 'Herramientas financieras para emprendedores como cálculo del punto de equilibrio y rentabilidad.',
      icon: '🏢'
    },
    'contabilidad': {
      name: 'Contabilidad',
      desc: 'Calculadoras contables para administración de activos, depreciaciones y registro financiero corporativo.',
      icon: '📊'
    },
    'conversiones': {
      name: 'Conversiones',
      desc: 'Herramientas útiles de conversión económica como unidades de referencia oficiales UMA.',
      icon: '⚖️'
    }
  },
  'en': {
    'sat': {
      name: 'Federal Taxes',
      desc: 'Calculate your tax obligations with the SAT such as VAT (IVA), personal and corporate ISR.',
      icon: '🏛️'
    },
    'resico': {
      name: 'RESICO',
      desc: 'Simulators and comparisons for the Simplified Trust Regime (RESICO) of the SAT.',
      icon: '🌱'
    },
    'nomina': {
      name: 'Payroll & LFT',
      desc: 'Calculate net salaries, Christmas bonus (Aguinaldo), vacations, severance pay (Finiquito), profit sharing (PTU), and other benefits of the Federal Labor Law.',
      icon: '💼'
    },
    'finanzas-personales': {
      name: 'Personal Finance',
      desc: 'Tools for personal financial planning and budget organization like the 50/30/20 rule.',
      icon: '🪙'
    },
    'hipotecas': {
      name: 'Mortgages',
      desc: 'Simulate monthly payments and amortization schedules for mortgage loans and home purchases.',
      icon: '🏠'
    },
    'prestamos': {
      name: 'Loans',
      desc: 'Calculate fixed payments and interest costs for personal loans and payroll credits.',
      icon: '💸'
    },
    'inversiones': {
      name: 'Investments',
      desc: 'Project the return on your investments in CETES and other financial instruments.',
      icon: '📈'
    },
    'interes-compuesto': {
      name: 'Compound Interest',
      desc: 'Simulate the exponential growth of your money by reinvesting earnings in the medium and long term.',
      icon: '🔄'
    },
    'tipo-de-cambio': {
      name: 'Exchange Rate',
      desc: 'Official and market converter between United States Dollars (USD) and Mexican Pesos (MXN).',
      icon: '💱'
    },
    'negocios': {
      name: 'Business',
      desc: 'Financial tools for entrepreneurs such as break-even point and profitability calculations.',
      icon: '🏢'
    },
    'contabilidad': {
      name: 'Accounting',
      desc: 'Accounting calculators for asset management, depreciation, and corporate financial records.',
      icon: '📊'
    },
    'conversiones': {
      name: 'Conversions',
      desc: 'Useful economic conversion tools such as official UMA reference units.',
      icon: '⚖️'
    }
  }
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const categoryInfo = categoryTranslations[lang]?.[resolvedParams.category] || categoryTranslations['es'][resolvedParams.category];

  if (!categoryInfo) {
    return {
      title: lang === 'en' ? 'Category Not Found' : 'Categoría no encontrada',
      description: lang === 'en' ? 'The requested category does not exist.' : 'La categoría de calculadora solicitada no existe.',
    };
  }

  return {
    title: lang === 'en' ? `Calculators for ${categoryInfo.name} 2026 - SAT & Finance` : `Calculadoras de ${categoryInfo.name} 2026 - SAT y Finanzas`,
    description: categoryInfo.desc,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';
  const categorySlug = resolvedParams.category;
  
  const categoryInfo = categoryTranslations[lang]?.[categorySlug] || categoryTranslations['es'][categorySlug];

  if (!categoryInfo) {
    notFound();
  }

  const baseCalculators = getCalculatorsByCategory(categorySlug);
  const categoryCalculators = baseCalculators.map(calc => {
    if (lang === 'en' && calc.translations?.en) {
      const trans = calc.translations.en;
      return {
        ...calc,
        title: trans.title || calc.title,
        shortDescription: trans.shortDescription || calc.shortDescription,
        category: trans.category || calc.category
      };
    }
    return calc;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href={lang === 'en' ? '/en' : '/'} className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
            Calculadora<span className="text-blue-600">SAT</span>
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <nav className="flex space-x-4 sm:space-x-6">
              <Link href={lang === 'en' ? '/en' : '/'} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap">
                {lang === 'en' ? '🏠 Home' : '🏠 Inicio'}
              </Link>
              <Link href={lang === 'en' ? '/en/calendario-fiscal' : '/calendario-fiscal'} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition whitespace-nowrap">
                📅 {lang === 'en' ? 'Tax Calendar' : 'Calendario Fiscal'}
              </Link>
            </nav>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="text-5xl bg-white/10 p-5 rounded-2xl border border-white/10 shadow-inner">
            {categoryInfo.icon}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {categoryInfo.name}
            </h1>
            <p className="mt-2 text-blue-100/90 max-w-2xl font-medium text-sm sm:text-base">
              {categoryInfo.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-12 flex-grow">
        {/* Navigation Breadcrumbs */}
        <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link href={lang === 'en' ? '/en' : '/'} className="hover:text-blue-600 transition-colors">
            {lang === 'en' ? 'Home' : 'Inicio'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{categoryInfo.name}</span>
        </nav>

        {categoryCalculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCalculators.map((calc) => (
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
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-6 flex items-center">
                  {lang === 'en' ? 'Go to calculate ➔' : 'Ir a calcular ➔'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            {lang === 'en' ? 'No calculators have been published under this category yet. Check back soon for new tools.' : 'Aún no se han publicado calculadoras bajo esta categoría. Vuelve pronto para ver nuevas herramientas.'}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs sm:text-sm text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <span className="font-extrabold text-slate-900 dark:text-white text-base">
              Calculadora<span className="text-blue-600">SAT</span>
            </span>
            <p className="mt-1">
              {lang === 'en' 
                ? '© 2026 All rights reserved. This site is not affiliated with the official SAT.' 
                : '© 2026 Todos los derechos reservados. Este sitio no está afiliado al SAT oficial.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 mt-4 md:mt-0">
            <Link href={lang === 'en' ? '/en' : '/'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Home' : 'Inicio'}</Link>
            <Link href={lang === 'en' ? '/en/privacy' : '/privacy'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Privacy' : 'Privacidad'}</Link>
            <Link href={lang === 'en' ? '/en/terms' : '/terms'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Terms' : 'Términos'}</Link>
            <Link href={lang === 'en' ? '/en/contact' : '/contact'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Contact' : 'Contacto'}</Link>
          </div>
        </div>
      </footer>

      {/* Contextual AI Assistant */}
      <AIAssistant activeCalculatorContext={`Categoría ${categoryInfo.name}`} />
    </div>
  );
}
