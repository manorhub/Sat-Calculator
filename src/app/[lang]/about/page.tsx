import React from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';

  if (lang === 'en') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
        <header className="border-b border-slate-200 dark:border-slate-850 py-6 bg-white dark:bg-slate-900 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/en" className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
              Calculadora<span className="text-blue-600 dark:text-blue-400">SAT</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/en" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
                ← Back to Home
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👥</span>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
                About Us
              </h1>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-355">
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                Calculadora SAT was born with a clear mission: to simplify complex tax calculations in Mexico and make them understandable and accessible to all citizens.
              </p>

              <p>
                In a country where tax and payroll regulations change constantly, our platform provides free tools that allow freelancers, SMEs, accountants, and entrepreneurs to simulate their ISR, IMSS withholdings, VAT breakdowns, and severance pay without needing to be accounting specialists.
              </p>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              <p>
                Democratize access to reliable, robust, and updated fiscal calculation tools in accordance with the Mexican legal framework (LISR, LIVA, LFT, and IMSS), empowering taxpayers to plan their cash flow and audit their payroll stubs.
              </p>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">🎯 Precision</h3>
                  <p className="text-xs text-slate-400">We mathematically update and audit our rates against the official SAT publications in the Federation Official Gazette (DOF).</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">⚡ Speed</h3>
                  <p className="text-xs text-slate-400">We develop a fast-loading SPA architecture with instant processing directly in the browser.</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">🔒 Total Privacy</h3>
                  <p className="text-xs text-slate-400">Your data is never uploaded or saved to external databases; everything runs locally.</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">💡 Accessibility</h3>
                  <p className="text-xs text-slate-400">We design a clean UI that breaks down complex arithmetic operations step-by-step.</p>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Team</h2>
              <p>
                We are a multidisciplinary team composed of accounting advisors, software developers, and Mexican tax experts. We combine technical expertise with a deep understanding of Mexican tax legislation to design educational and practical solutions for everyday use.
              </p>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 py-8 text-center text-slate-500 text-xs">
          <p>© 2026 Calculadora SAT. All rights reserved. Designed under the tax legal framework of Mexico.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <header className="border-b border-slate-200 dark:border-slate-850 py-6 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
            Calculadora<span className="text-blue-600 dark:text-blue-400">SAT</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
              ← Volver al Inicio
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">👥</span>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Acerca de Nosotros
            </h1>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
              Calculadora SAT nació con una misión clara: simplificar los complejos cálculos fiscales en México y hacerlos comprensibles y accesibles para todos los ciudadanos.
            </p>

            <p>
              En un país donde los trámites tributarios y de nómina cambian de forma constante, nuestra plataforma proporciona herramientas gratuitas que permiten a trabajadores independientes, pymes, contadores y emprendedores simular sus retenciones de ISR, IMSS, desgloses de IVA y liquidaciones sin necesidad de ser especialistas contables.
            </p>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuestra Misión</h2>
            <p>
              Democratizar el acceso a herramientas de cálculo fiscal confiables, robustas y actualizadas de acuerdo al marco legal mexicano (LISR, LIVA, LFT e IMSS), empoderando a los contribuyentes para planificar su flujo de caja y auditar sus recibos de nómina.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuestros Valores Fundamentales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">🎯 Precisión</h3>
                <p className="text-xs text-slate-450">Actualizamos y auditamos matemáticamente nuestras tarifas contra las publicaciones del DOF del SAT.</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">⚡ Velocidad</h3>
                <p className="text-xs text-slate-450">Desarrollamos una arquitectura SPA de carga inmediata y procesamiento instantáneo en el navegador.</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">🔒 Privacidad Total</h3>
                <p className="text-xs text-slate-450">Tus datos nunca se suben ni se registran en bases de datos externas; todo corre de forma local.</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">💡 Accesibilidad</h3>
                <p className="text-xs text-slate-450">Diseñamos una UI limpia que desglosa paso a paso las operaciones aritméticas complejas.</p>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuestro Equipo</h2>
            <p>
              Somos un equipo multidisciplinario compuesto por asesores contables, desarrolladores de software y expertos en fiscalidad mexicana. Combinamos experiencia técnica con un conocimiento profundo de la legislación tributaria mexicana para diseñar soluciones didácticas útiles para el día a día.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 py-8 text-center text-slate-500 text-xs">
        <p>© 2026 Calculadora SAT. Todos los derechos reservados. Diseñado bajo el marco legal tributario de México.</p>
      </footer>
    </div>
  );
}
