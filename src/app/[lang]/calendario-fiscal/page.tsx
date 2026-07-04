'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

interface CalendarEvent {
  day: number;
  title: string;
  type: 'urgente' | 'importante' | 'info';
  description: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  readTime: string;
  icon: string;
}

export default function CalendarioFiscal({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';

  const [selectedMonth, setSelectedMonth] = useState('Abril');
  const [emailAlert, setEmailAlert] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Events for selected months (Spanish)
  const monthlyEventsEs: Record<string, CalendarEvent[]> = {
    Mensual: [
      { day: 17, title: 'Pago Provisional de ISR e IVA', type: 'urgente', description: 'Fecha límite para que personas físicas y morales presenten sus declaraciones mensuales provisionales correspondientes al mes inmediato anterior.' },
      { day: 17, title: 'Declaración de Retenciones de ISR y de IVA', type: 'importante', description: 'Fecha límite para enterar las retenciones de impuestos realizadas a terceros (empleados, profesionistas por honorarios, fletes).' },
      { day: 17, title: 'Presentación de la DIOT', type: 'info', description: 'Fecha límite para presentar la Declaración Informativa de Operaciones con Terceros (DIOT) para reportar el pago de IVA a proveedores.' }
    ],
    Marzo: [
      { day: 17, title: 'Pagos Provisionales Mensuales', type: 'importante', description: 'Declaración mensual de impuestos del mes de febrero.' },
      { day: 31, title: 'Declaración Anual de Personas Morales', type: 'urgente', description: 'Último día para que las empresas (Personas Morales) presenten su Declaración Anual de Impuestos del ejercicio inmediato anterior ante el SAT.' }
    ],
    Abril: [
      { day: 17, title: 'Pagos Provisionales Mensuales', type: 'importante', description: 'Declaración mensual de impuestos del mes de marzo.' },
      { day: 30, title: 'Declaración Anual de Personas Físicas', type: 'urgente', description: 'Último día para que todos los ciudadanos (Personas Físicas) presenten su Declaración Anual de Impuestos ante el SAT para poder solicitar devolución de saldos a favor.' }
    ],
    Mayo: [
      { day: 17, title: 'Pagos Provisionales Mensuales', type: 'importante', description: 'Declaración mensual de impuestos del mes de abril.' },
      { day: 31, title: 'Límite para el Reparto de Utilidades (PTU) - Empresas', type: 'urgente', description: 'Fecha límite para que las Personas Morales realicen el reparto de utilidades a sus trabajadores correspondientes a las ganancias del año anterior.' }
    ],
    Junio: [
      { day: 30, title: 'Límite para el Reparto de Utilidades (PTU) - Patrones Físicos', type: 'urgente', description: 'Fecha límite para que las Personas Físicas con actividad empresarial que tengan empleados realicen el reparto de utilidades (PTU).' }
    ],
    Diciembre: [
      { day: 17, title: 'Pagos Provisionales Mensuales', type: 'importante', description: 'Declaración mensual de impuestos del mes de noviembre.' },
      { day: 20, title: 'Límite para Pago de Aguinaldo', type: 'urgente', description: 'Fecha límite de ley establecida por el Artículo 87 de la LFT para entregar el aguinaldo de fin de año a todos los empleados subordinados.' }
    ]
  };

  // Events for selected months (English)
  const monthlyEventsEn: Record<string, CalendarEvent[]> = {
    Mensual: [
      { day: 17, title: 'Provisional ISR and IVA Payment', type: 'urgente', description: 'Deadline for individuals and corporations to file their provisional monthly tax returns corresponding to the immediately preceding month.' },
      { day: 17, title: 'Declaration of ISR and IVA Withholdings', type: 'importante', description: 'Deadline to report tax withholdings made to third parties (employees, professionals on fees, freight).' },
      { day: 17, title: 'DIOT Presentation', type: 'info', description: 'Deadline to submit the Informative Declaration of Operations with Third Parties (DIOT) to report VAT payments to suppliers.' }
    ],
    Marzo: [
      { day: 17, title: 'Monthly Provisional Payments', type: 'importante', description: 'Monthly tax return for the month of February.' },
      { day: 31, title: 'Annual Tax Return for Corporations', type: 'urgente', description: 'Last day for companies (Corporations) to file their Annual Tax Return for the immediately preceding tax year with the SAT.' }
    ],
    Abril: [
      { day: 17, title: 'Monthly Provisional Payments', type: 'importante', description: 'Monthly tax return for the month of March.' },
      { day: 30, title: 'Annual Tax Return for Individuals', type: 'urgente', description: 'Last day for all citizens (Individuals) to file their Annual Tax Return with the SAT to be able to request refunds for favorable balances.' }
    ],
    Mayo: [
      { day: 17, title: 'Monthly Provisional Payments', type: 'importante', description: 'Monthly tax return for the month of April.' },
      { day: 31, title: 'Deadline for Profit Sharing (PTU) - Corporations', type: 'urgente', description: 'Deadline for companies (Corporations) to distribute profit sharing (PTU) to their workers corresponding to the previous year earnings.' }
    ],
    Junio: [
      { day: 30, title: 'Deadline for Profit Sharing (PTU) - Individual Employers', type: 'urgente', description: 'Deadline for individual employers with business activities who have employees to distribute profit sharing (PTU).' }
    ],
    Diciembre: [
      { day: 17, title: 'Monthly Provisional Payments', type: 'importante', description: 'Monthly tax return for the month of November.' },
      { day: 20, title: 'Deadline for Christmas Bonus (Aguinaldo) Payment', type: 'urgente', description: 'Legal deadline established by Article 87 of the LFT to deliver the year-end Christmas bonus (Aguinaldo) to all subordinate employees.' }
    ]
  };

  const newsEs: NewsItem[] = [
    {
      id: 'news-1',
      title: 'SAT Actualiza Tablas de Retención de ISR para el Ejercicio Vigente',
      summary: 'El Servicio de Administración Tributaria publicó en el Diario Oficial de la Federación (DOF) el Anexo 8 que contiene las tablas de tarifas acumulativas ajustadas por inflación.',
      date: 'Hace 2 días',
      category: 'SAT',
      readTime: '3 min de lectura',
      icon: '🏛️'
    },
    {
      id: 'news-2',
      title: 'Reforma de Vacaciones Dignas: Efectos en la Integración del SBC en el IMSS',
      summary: 'Recordatorio para departamentos de recursos humanos: el incremento a 12 días mínimos de vacaciones modifica el factor de integración de cotización del IMSS para el primer año.',
      date: 'Hace 5 días',
      category: 'Nómina',
      readTime: '4 min de lectura',
      icon: '💼'
    },
    {
      id: 'news-3',
      title: 'Deducciones Personales: Gastos que Puedes Facturar para tu Devolución Anual',
      summary: 'Conoce los requisitos clave para deducir honorarios médicos, dentales, hospitalarios, colegiaturas e intereses reales hipotecarios y asegurar saldo a favor en abril.',
      date: 'Hace 1 semana',
      category: 'Finanzas',
      readTime: '5 min de lectura',
      icon: '🪙'
    },
    {
      id: 'news-4',
      title: 'Novedades de RESICO: Reglas para la Permanencia en el Régimen Simplificado',
      summary: 'El SAT emite aclaraciones sobre las causales de expulsión automática del RESICO si no se cuenta con Buzón Tributario activo o firma electrónica vigente.',
      date: 'Hace 2 semanas',
      category: 'Reforma',
      readTime: '4 min de lectura',
      icon: '🌱'
    }
  ];

  const newsEn: NewsItem[] = [
    {
      id: 'news-1',
      title: 'SAT Updates ISR Withholding Tables for the Current Tax Year',
      summary: 'The Tax Administration Service published Annex 8 in the Official Gazette of the Federation (DOF) containing adjusted cumulative rate tables for inflation.',
      date: '2 days ago',
      category: 'SAT',
      readTime: '3 min read',
      icon: '🏛️'
    },
    {
      id: 'news-2',
      title: 'Dignified Vacation Reform: Effects on SBC Integration at IMSS',
      summary: 'Reminder for HR departments: the increase to 12 minimum days of vacation modifies the IMSS integration factor starting from the first year.',
      date: '5 days ago',
      category: 'Payroll',
      readTime: '4 min read',
      icon: '💼'
    },
    {
      id: 'news-3',
      title: 'Personal Deductions: Expenses You Can Invoice for Your Annual Return',
      summary: 'Learn the key requirements to deduct medical, dental, hospital fees, tuition, and real mortgage interest to ensure a favorable tax balance in April.',
      date: '1 week ago',
      category: 'Finance',
      readTime: '5 min read',
      icon: '🪙'
    },
    {
      id: 'news-4',
      title: 'RESICO Updates: Rules for Permanence in the Simplified Regime',
      summary: 'The SAT issues clarifications on the grounds for automatic expulsion from RESICO if there is no active Tax Mailbox (Buzón Tributario) or valid electronic signature.',
      date: '2 weeks ago',
      category: 'Reform',
      readTime: '4 min read',
      icon: '🌱'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailAlert.trim()) {
      setAlertSuccess(true);
      setEmailAlert('');
      setTimeout(() => setAlertSuccess(false), 5000);
    }
  };

  const monthlyEvents = lang === 'en' ? monthlyEventsEn : monthlyEventsEs;
  const news = lang === 'en' ? newsEn : newsEs;
  const activeEvents = monthlyEvents[selectedMonth] || monthlyEvents['Mensual'];

  const monthLabel = (m: string) => {
    if (lang !== 'en') return m;
    const mapping: Record<string, string> = {
      'Mensual': 'Monthly',
      'Marzo': 'March',
      'Abril': 'April',
      'Mayo': 'May',
      'Junio': 'June',
      'Diciembre': 'December'
    };
    return mapping[m] || m;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href={lang === 'en' ? '/en' : '/'} className="font-extrabold text-xl text-slate-900 dark:text-white hover:opacity-90 transition">
            Calculadora<span className="text-blue-600">SAT</span>
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href={lang === 'en' ? '/en' : '/'} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
              {lang === 'en' ? '← Back to Calculators' : '← Regresar a Calculadoras'}
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tax Calendar */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                  📅 {lang === 'en' ? 'Tax Calendar 2026' : 'Calendario Fiscal 2026'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'en' ? 'Stay on top of SAT and IMSS tax deadlines.' : 'Mantente al tanto de las fechas de vencimiento del SAT e IMSS.'}
                </p>
              </div>

              {/* Month Selector dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-xl border-slate-350 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm p-2.5 border"
              >
                <option value="Mensual">{lang === 'en' ? 'Monthly (Recurring Obligations)' : 'Mensual (Obligaciones Recurrentes)'}</option>
                <option value="Marzo">{lang === 'en' ? 'March (Corporations Annual)' : 'Marzo (Empresas Anual)'}</option>
                <option value="Abril">{lang === 'en' ? 'April (Individuals Annual)' : 'Abril (Ciudadanos Anual)'}</option>
                <option value="Mayo">{lang === 'en' ? 'May (PTU Corporations)' : 'Mayo (PTU Empresas)'}</option>
                <option value="Junio">{lang === 'en' ? 'June (PTU Individual Employers)' : 'Junio (PTU Personas Físicas)'}</option>
                <option value="Diciembre">{lang === 'en' ? 'December (Year-End Bonus)' : 'Diciembre (Aguinaldos)'}</option>
              </select>
            </div>

            {/* Simulated monthly Calendar representation */}
            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950 mb-8">
              <div className="text-center font-bold text-lg mb-3 text-blue-600 dark:text-blue-400">
                {selectedMonth === 'Mensual' 
                  ? (lang === 'en' ? 'Payment Month Deadlines' : 'Vencimientos del Mes de Pago') 
                  : `${monthLabel(selectedMonth)} 2026`}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-850 pb-2">
                {lang === 'en' 
                  ? <><div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div></>
                  : <><div>DOM</div><div>LUN</div><div>MAR</div><div>MIE</div><div>JUE</div><div>VIE</div><div>SAB</div></>}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm pt-3 font-semibold">
                {Array.from({ length: 30 }, (_, i) => {
                  const dayNum = i + 1;
                  const isHighlighted = activeEvents.some(e => e.day === dayNum);
                  return (
                    <div
                      key={dayNum}
                      className={`p-2 rounded-xl flex items-center justify-center relative ${
                        isHighlighted
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {dayNum}
                      {isHighlighted && (
                        <span className="absolute bottom-1 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List of obligations */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📌 {lang === 'en' ? 'Period Obligations: ' : 'Obligaciones del Período: '} {monthLabel(selectedMonth)}
            </h2>
            <div className="space-y-4">
              {activeEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400">
                      {lang === 'en' ? `Day ${evt.day}` : `Día ${evt.day}`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        evt.type === 'urgente'
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                          : evt.type === 'importante'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}
                    >
                      {evt.type === 'urgente' 
                        ? (lang === 'en' ? 'urgent' : 'urgente') 
                        : (evt.type === 'importante' ? (lang === 'en' ? 'important' : 'importante') : 'info')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-950 dark:text-white mt-2">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: News & Alert Signup */}
          <div className="lg:col-span-5 space-y-8">
            {/* Alarm Signup */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                {lang === 'en' ? '🔔 DEADLINE ALERTS' : '🔔 ALERTAS DE VENCIMIENTO'}
              </span>
              <h2 className="text-2xl font-black mt-3">
                {lang === 'en' ? 'Never forget to file' : 'No olvides declarar'}
              </h2>
              <p className="text-sm text-indigo-200/90 mt-2 leading-relaxed">
                {lang === 'en' 
                  ? 'Subscribe to receive an automatic email reminder 3 days before each critical SAT tax deadline.' 
                  : 'Suscríbete para recibir un recordatorio automático por correo electrónico 3 días antes de cada fecha de vencimiento crítica del SAT.'}
              </p>
              
              {alertSuccess ? (
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-sm font-semibold text-center">
                  {lang === 'en' ? 'Subscription successful! We will send you tax alerts.' : '¡Suscripción exitosa! Te enviaremos alertas fiscales.'}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={emailAlert}
                    onChange={(e) => setEmailAlert(e.target.value)}
                    placeholder={lang === 'en' ? 'Your email address' : 'Tu correo electrónico'}
                    className="flex-1 px-4 py-3 rounded-xl border-0 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition whitespace-nowrap"
                  >
                    {lang === 'en' ? 'Activate Alerts' : 'Activar Alertas'}
                  </button>
                </form>
              )}
            </div>

            {/* Fiscal News Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-6">
                {lang === 'en' ? '📰 Recent Tax News' : '📰 Noticias Fiscales Recientes'}
              </h2>
              <div className="space-y-6">
                {news.map((item) => (
                  <article key={item.id} className="group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-sm sm:text-base leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                        <span className="text-xs text-slate-400 block mt-2">
                          {item.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <span className="font-extrabold text-slate-900 dark:text-white text-base">
              Calculadora<span className="text-blue-600">SAT</span>
            </span>
            <p className="mt-1">
              {lang === 'en' 
                ? '© 2026 All rights reserved. This site is not affiliated with the official Tax Administration Service (SAT).'
                : '© 2026 Todos los derechos reservados. Este sitio no está afiliado al Servicio de Administración Tributaria (SAT) oficial.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 mt-4 md:mt-0">
            <Link href={lang === 'en' ? '/en/privacy' : '/privacy'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Privacy' : 'Privacidad'}</Link>
            <Link href={lang === 'en' ? '/en/terms' : '/terms'} className="hover:text-slate-700 transition">{lang === 'en' ? 'Terms' : 'Términos'}</Link>
            <Link href={lang === 'en' ? '/en/about' : '/about'} className="hover:text-slate-700 transition">{lang === 'en' ? 'About Us' : 'Acerca de'}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
