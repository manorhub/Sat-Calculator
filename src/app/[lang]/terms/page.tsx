import React from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function TermsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';

  if (lang === 'en') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
        <header className="border-b border-slate-200 dark:border-slate-850 py-6 bg-white dark:bg-slate-900 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
            <Link href="/en" className="font-extrabold text-xl text-slate-900 dark:text-white">
              Calculadora<span className="text-blue-600 dark:text-blue-400">SAT</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/en" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                ← Back to Home
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📄</span>
              <h1 className="text-3xl font-extrabold text-slate-955 dark:text-white">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Last updated: July 03, 2026
            </p>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              <p>
                Welcome to <strong>Calculadora SAT</strong>. These terms and conditions describe the rules and regulations for the use of our website, located at <code>calculadorasat.org</code>.
              </p>

              <p>
                By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Calculadora SAT if you do not agree to all of the terms stated on this page.
              </p>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Use of Service and License</h2>
              <p>
                You are granted a limited, non-exclusive, and non-transferable license to access and use the Service for your personal or commercial tax calculation use, subject to these Terms and Conditions.
              </p>
              <p>
                You are not permitted to collect automated information from the API or the site using scrapers, spiders, or robots for resale purposes without our express commercial authorization.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Disclaimer (Informational Purposes)</h2>
              <div className="p-4 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl leading-relaxed">
                ⚠️ <strong>IMPORTANT:</strong> The calculators and tools provided on this platform are solely for informational and educational simulation purposes. **They do not constitute, under any scenario, formal tax, accounting, legal, or financial advice.** We recommend verifying results with a certified public accountant before making tax payments to the SAT or making decisions about employee terminations.
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Accuracy of Information and SAT Law</h2>
              <p>
                We do our best to keep progressive ISR rates, IMSS quotas, UMA values, and LFT regulations fully updated to the current reforms in Mexico. However, we are not responsible for possible inconsistencies resulting from late legislative updates or minor rounding differences.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
              <p>
                In no event shall Calculadora SAT, its administrators, partners, or developers be liable for financial losses, surcharges, fines, or tax discrepancies resulting from SAT audits after using the information on this site.
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact</h2>
              <p>
                For any legal clarification regarding our terms, you can contact us at <strong>legal@calculadorasat.mx</strong>.
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
    <div className="bg-slate-50 dark:bg-slate-955 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <header className="border-b border-slate-200 dark:border-slate-850 py-6 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-extrabold text-xl text-slate-900 dark:text-white">
            Calculadora<span className="text-blue-600 dark:text-blue-400">SAT</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              ← Volver al Inicio
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📄</span>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Términos y Condiciones
            </h1>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Última actualización: 03 de Julio de 2026
          </p>

          <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
            <p>
              Bienvenido a <strong>Calculadora SAT</strong>. Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestro sitio web, ubicado en <code>calculadorasat.org</code>.
            </p>

            <p>
              Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes utilizando Calculadora SAT si no estás de acuerdo con todos los términos establecidos en esta página.
            </p>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Uso del Servicio y Licencia</h2>
            <p>
              Se te otorga una licencia limitada, no exclusiva e intransferible para acceder y utilizar el Servicio para tu uso personal o comercial de cálculo fiscal, sujeto a estos Términos y Condiciones.
            </p>
            <p>
              No está permitido recopilar información automatizada de la API o del sitio mediante scrapers, spiders o robots para fines de reventa sin autorización comercial expresa de nuestra parte.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Exclusión de Responsabilidad (Fines Informativos)</h2>
            <div className="p-4 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl leading-relaxed">
              ⚠️ <strong>IMPORTANTE:</strong> Las calculadoras y herramientas proporcionadas en esta plataforma son exclusivamente de carácter informativo y con fines de simulación didáctica. **No constituyen bajo ningún escenario asesoría fiscal, contable, legal o financiera formal.** Le recomendamos verificar los resultados con un contador público certificado antes de realizar pagos de declaraciones al SAT o tomar decisiones sobre bajas laborales.
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Exactitud de la Información y Ley del SAT</h2>
            <p>
              Hacemos todo lo posible para mantener las tarifas progresivas del ISR, cuotas del IMSS, valores de la UMA y regulaciones de la LFT totalmente actualizadas a las reformas vigentes en México. No obstante, no nos hacemos responsables de posibles inconsistencias resultantes de actualizaciones legislativas tardías o redondeos menores.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Calculadora SAT, sus administradores, socios o desarrolladores serán responsables por pérdidas financieras, recargos, multas o discrepancias fiscales derivadas de auditorías del SAT tras utilizar la información de este sitio.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contacto</h2>
            <p>
              Para cualquier aclaración legal sobre nuestros términos, puedes contactarnos en <strong>legal@calculadorasat.mx</strong>.
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
