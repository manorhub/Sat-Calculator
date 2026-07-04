'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:right-8 md:left-auto md:max-w-md bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 dark:border-slate-850 p-6 rounded-2xl shadow-2xl z-[9999] transition-all animate-bounce-subtle">
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1">🍪</div>
        <div>
          <h3 className="font-bold text-white text-sm mb-1">Control de Cookies</h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Utilizamos cookies propias y de terceros para analizar el tráfico del sitio y mejorar tu experiencia. Puedes ver más información en nuestra{' '}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Política de Privacidad
            </Link>
            .
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-blue-900/20"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
