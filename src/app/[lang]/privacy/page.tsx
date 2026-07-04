import React from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function PrivacyPage({ params }: PageProps) {
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
              <span className="text-3xl">🛡️</span>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Last updated: July 03, 2026
            </p>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              <p>
                At <strong>Calculadora SAT</strong>, accessible from our portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains the types of information collected and recorded by Calculadora SAT and how we use it.
              </p>

              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
              </p>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Information We Collect</h2>
              <p>
                Calculadora SAT operates under the principle of <strong>minimal data collection</strong>. All calculations are performed locally in the user's browser, and we do not store the amounts or variables entered in our calculators in external databases in any way.
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-4">1. Technical Information</h3>
              <p>
                Like many websites, we collect standard technical information that your browser sends every time you visit our site. This information may include:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Anonymized IP address</li>
                <li>Browser type and version used</li>
                <li>Pages of our site that you visit</li>
                <li>Time and date of your visit</li>
                <li>Time spent on those pages</li>
              </ul>

              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Contact Form</h3>
              <p>
                If you choose to contact us directly by email, we will collect your email address, name, and message in order to resolve your technical or consulting queries. This information is used exclusively to answer your questions and is never shared with third parties.
              </p>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Use of Cookies and Consent</h2>
              <p>
                Calculadora SAT uses first-party and third-party cookies (such as Google Analytics) to improve the user experience. Cookies are small text files that websites place on your computer to remember basic information and collect aggregated data about site traffic.
              </p>
              <p>
                Upon entering the platform, you will be shown a cookie consent banner where you can choose whether to accept or reject their use. In addition, you can choose to configure your browser to disable cookies completely at any time.
              </p>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Protection Rights (GDPR / LFPDPPP)</h2>
              <p>
                We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to request rectification, erasure, restriction, or objection to the processing of any personal data collected through the technical support form by writing to us at <strong>privacy@calculadorasat.mx</strong>.
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
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Última actualización: 03 de Julio de 2026
          </p>

          <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-355">
            <p>
              En <strong>Calculadora SAT</strong>, accesible desde nuestro portal, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de información que se recolectan y registran por Calculadora SAT y cómo la utilizamos.
            </p>

            <p>
              Si tienes preguntas adicionales o requieres más información sobre nuestra Política de Privacidad, no dudes en contactarnos.
            </p>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Información que Recolectamos</h2>
            <p>
              Calculadora SAT opera bajo el principio de <strong>mínima recolección de datos</strong>. Todos los cálculos se realizan de forma local en el navegador del usuario y no almacenamos de ninguna forma en bases de datos externas los montos o variables introducidas en nuestras calculadoras.
            </p>

            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-4">1. Información Técnica</h3>
            <p>
              Como muchos sitios web, recopilamos información técnica estándar que tu navegador envía cada vez que visitas nuestro sitio. Esta información puede incluir:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Dirección IP (anonimizada)</li>
              <li>Tipo de navegador y versión utilizada</li>
              <li>Páginas de nuestro sitio que visitas</li>
              <li>Hora y fecha de tu visita</li>
              <li>Tiempo dedicado a esas páginas</li>
            </ul>

            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-4">2. Formulario de Contacto</h3>
            <p>
              Si decides contactarnos directamente por correo electrónico, recopilaremos tu dirección de correo electrónico, nombre y mensaje con el fin de resolver tus dudas técnicas o de consultoría. Esta información se utiliza exclusivamente para responder a tus preguntas y nunca se comparte con terceros.
            </p>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Uso de Cookies y Consentimiento</h2>
            <p>
              Calculadora SAT utiliza cookies propias y de terceros (como Google Analytics) para mejorar la experiencia del usuario. Las cookies son pequeños archivos de texto que los sitios web colocan en tu ordenador para recordar información básica y recopilar datos agregados sobre el tráfico del sitio.
            </p>
            <p>
              Al ingresar a la plataforma, se te mostrará un banner de consentimiento de cookies donde podrás elegir si deseas aceptar o rechazar el uso de las mismas. Además, puedes optar por configurar tu navegador para desactivar cookies por completo en cualquier momento.
            </p>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Derechos de Protección de Datos (GDPR / LFPDPPP)</h2>
            <p>
              Queremos asegurarnos de que estés completamente informado de todos tus derechos de protección de datos. Todo usuario tiene derecho a solicitar la rectificación, supresión, limitación u oposición del tratamiento de cualquier dato personal recopilado a través del formulario de soporte técnico escribiéndonos a <strong>privacy@calculadorasat.mx</strong>.
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
