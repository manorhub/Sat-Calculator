'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

export default function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: lang === 'en' ? 'General Inquiry' : 'Consulta General',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (lang === 'en') {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-sans flex flex-col justify-between">
        <div>
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

          <main className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Contact Information */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm">
                  <span className="text-3xl">📬</span>
                  <h1 className="text-2xl font-black text-slate-950 dark:text-white mt-4">
                    Contact Us
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Have questions, suggestions, or need support with any of our calculators? We are here to help.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">✉️</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inquiry Email</h4>
                        <a href="mailto:fkdigitalmedia@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          fkdigitalmedia@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">⏱️</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Office Hours</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Monday to Friday from 9:00 AM to 6:00 PM (Mexico Central Time)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg">💡 Did you know?</h3>
                  <p className="text-xs text-blue-100/90 mt-2 leading-relaxed">
                    All our tools use updated formulas according to the Official Gazette of the Federation (DOF) in Mexico. If you believe there is an error in any rate or calculation, please let us know by email.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  ✉️ Send a Message
                </h2>

                {submitted ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-xl text-center space-y-3">
                    <span className="text-3xl block">🎉</span>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Message Sent Successfully!</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      Thank you for your message. We will get in touch with you shortly at the email address provided.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. your-email@example.com"
                        className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Calculator Suggestion">Calculator Suggestion / Improvement</option>
                        <option value="Report a Bug">Report a Calculation Bug</option>
                        <option value="Commercial Contact">Commercial Contact / Advertising</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your query or detailed comment here..."
                        className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Send Message 🚀
                    </button>
                  </form>
                )}
              </div>
            </div>
          </main>
        </div>

        <footer className="border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 py-8 text-center text-slate-500 text-xs mt-12">
          <p>© 2026 Calculadora SAT. All rights reserved. Inquiries to fkdigitalmedia@gmail.com</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-955 min-h-screen text-slate-800 dark:text-slate-200 font-sans flex flex-col justify-between">
      <div>
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

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Contact Information */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm">
                <span className="text-3xl">📬</span>
                <h1 className="text-2xl font-black text-slate-950 dark:text-white mt-4">
                  Contacto
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  ¿Tienes dudas, sugerencias o necesitas soporte con alguna de nuestras calculadoras? Estamos aquí para ayudarte.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">✉️</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Correo de Consultas</h4>
                      <a href="mailto:fkdigitalmedia@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                        fkdigitalmedia@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">⏱️</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Horario de Atención</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Lunes a Viernes de 9:00 AM a 6:00 PM (Hora Centro de México)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg">💡 ¿Sabías que?</h3>
                <p className="text-xs text-blue-100/95 mt-2 leading-relaxed">
                  Todas nuestras herramientas utilizan fórmulas actualizadas de acuerdo al Diario Oficial de la Federación (DOF) de México. Si crees que hay un error en alguna tasa o cálculo, háznoslo saber por correo.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                ✉️ Enviar un Mensaje
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-xl text-center space-y-3">
                  <span className="text-3xl block">🎉</span>
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Agradecemos tu mensaje. Nos pondremos en contacto contigo a la brevedad en el correo indicado.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ej: tu-correo@ejemplo.com"
                      className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Asunto
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Consulta General">Consulta General</option>
                      <option value="Sugerencia de Calculadora">Sugerencia de Calculadora / Mejora</option>
                      <option value="Reportar un Fallo">Reportar un Fallo en Cálculo</option>
                      <option value="Contacto Comercial">Contacto Comercial / Publicidad</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Escribe aquí tu consulta o comentario detallado..."
                      className="w-full px-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Enviar Mensaje 🚀
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 py-8 text-center text-slate-500 text-xs mt-12">
        <p>© 2026 Calculadora SAT. Todos los derechos reservados. Consultas a fkdigitalmedia@gmail.com</p>
      </footer>
    </div>
  );
}
