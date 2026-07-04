'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import LanguageSelector from '../../../components/LanguageSelector';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default function DeveloperPortal({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'es';

  const [selectedCalc, setSelectedCalc] = useState('calculo-iva');
  const [jsonInputs, setJsonInputs] = useState(JSON.stringify({ monto: 10000, tipo_accion: 'agregar', tasa: 16 }, null, 2));
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTestAPI = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculatorId: selectedCalc,
          inputs: JSON.parse(jsonInputs)
        })
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error: any) {
      setApiResponse({ error: lang === 'en' ? 'Invalid input JSON or server error.' : 'JSON de entrada inválido o error en el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalcChange = (id: string) => {
    setSelectedCalc(id);
    if (id === 'calculo-iva') {
      setJsonInputs(JSON.stringify({ monto: 10000, tipo_accion: 'agregar', tasa: 16 }, null, 2));
    } else if (id === 'calculo-isr-pf') {
      setJsonInputs(JSON.stringify({ ingresos: 35000, deducciones: 8000, periodo: 'mensual' }, null, 2));
    } else if (id === 'calculo-resico-pf') {
      setJsonInputs(JSON.stringify({ ingresos: 45000, factura_persona_moral: true, ingresos_persona_moral: 20000 }, null, 2));
    } else if (id === 'calculo-salario') {
      setJsonInputs(JSON.stringify({ monto: 25000, tipo_calculo: 'bruto_a_neto', antiguedad: 1 }, null, 2));
    }
  };

  const curlSnippet = `curl -X POST https://calculadorasat.org/api/calculate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY_HERE" \\
  -d '{
    "calculatorId": "${selectedCalc}",
    "inputs": ${jsonInputs.replace(/\n/g, '\n    ')}
  }'`;

  const nodeSnippet = `const response = await fetch('https://calculadorasat.org/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    calculatorId: '${selectedCalc}',
    inputs: ${jsonInputs.replace(/\n/g, '\n    ')}
  })
});
const data = await response.json();
console.log(data);`;

  if (lang === 'en') {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 font-sans">
        {/* Navigation Header */}
        <header className="border-b border-slate-800 py-6 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <Link href="/en" className="font-extrabold text-xl text-white">
              Calculadora<span className="text-blue-500">SAT</span> <span className="text-xs uppercase bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full font-bold">Devs</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/en" className="text-sm font-semibold text-blue-400 hover:underline">
                ← Back to Portal
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="mb-16 text-center md:text-left">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/40 rounded-full border border-blue-900/50">
              Financial and SAT Mexico Calculations API
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mt-4 sm:text-5xl">
              Integrate our formulas into your software
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Connect your ERP, CRM, human resources, or billing software to our commercial tax calculation API. Obtain 100% updated ISR, IMSS, and VAT (IVA) withholdings according to the current legal framework.
            </p>
          </section>

          {/* API Playground Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Playground Panel */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🔌 API Playground (Test the API live)
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Select a calculator and adjust the input variables in JSON format to see the response returned by the server.
              </p>

              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Select the Calculator
              </label>
              <select
                value={selectedCalc}
                onChange={(e) => handleCalcChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              >
                <option value="calculo-iva">VAT Calculator (sat/calculadora-iva)</option>
                <option value="calculo-isr-pf">ISR Individuals Calculator (sat/calculadora-isr-pf)</option>
                <option value="calculo-resico-pf">RESICO Individuals Calculator (resico/calculadora-resico-pf)</option>
                <option value="calculo-salario">Net/Gross Salary Calculator (nomina/calculadora-salario-neto-bruto)</option>
              </select>

              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Input Parameters (JSON Body)
              </label>
              <textarea
                rows={6}
                value={jsonInputs}
                onChange={(e) => setJsonInputs(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <button
                onClick={handleTestAPI}
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
              >
                {loading ? 'Executing API Request...' : 'Send POST Request ➔'}
              </button>
            </div>

            {/* Response Panel */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📦 Server Response (JSON)
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  The server processes the calculation and returns a complete breakdown of structured results and mathematical steps.
                </p>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[340px] text-blue-300">
                  {apiResponse ? (
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <span className="text-slate-600">Click &quot;Send POST Request&quot; to see the response here.</span>
                  )}
                </div>
              </div>
              {apiResponse && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-xl text-xs text-blue-400 leading-relaxed">
                  ℹ️ <strong>Status {apiResponse.status === 'success' ? '200 OK' : 'Error'}</strong>: Observe how the <code>results</code> field includes the final breakdowns formatted and ready to be injected into any interface.
                </div>
              )}
            </div>
          </div>

          {/* Integration Code Snippets */}
          <section className="bg-slate-955 border border-slate-850 rounded-2xl p-6 sm:p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              🛠️ Code Integration Examples
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">cURL Command</h3>
                <pre className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {curlSnippet}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">JavaScript (Fetch API)</h3>
                <pre className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {nodeSnippet}
                </pre>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-sm">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-extrabold text-white text-base">
                Calculadora<span className="text-blue-500">SAT</span> <span className="text-xs font-semibold text-slate-600">DevPortal</span>
              </span>
              <p className="mt-1">© 2026 All rights reserved. B2B License subject to commercial terms of service.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/en" className="hover:text-slate-300 transition">Calculators</Link>
              <Link href="/en/privacy" className="hover:text-slate-300 transition">Privacy</Link>
              <Link href="/en/terms" className="hover:text-slate-300 transition">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 py-6 bg-slate-955">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-extrabold text-xl text-white">
            Calculadora<span className="text-blue-500">SAT</span> <span className="text-xs uppercase bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full font-bold">Devs</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-blue-400 hover:underline">
              ← Regresar al Portal
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-955/40 rounded-full border border-blue-900/50">
            API de Cálculos Financieros y SAT México
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mt-4 sm:text-5xl">
            Integra nuestras fórmulas en tu software
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl">
            Conecta tu ERP, CRM, software de recursos humanos o facturación a nuestra API comercial de cálculos fiscales. Obtén retenciones de ISR, IMSS e IVA 100% actualizadas al marco legal vigente.
          </p>
        </section>

        {/* API Playground Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Playground Panel */}
          <div className="lg:col-span-6 bg-slate-955 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🔌 API Playground (Prueba la API en vivo)
            </h2>
            <p className="text-xs text-slate-450 mb-6">
              Selecciona una calculadora y ajusta las variables de entrada en formato JSON para ver la respuesta devuelta por el servidor.
            </p>

            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              1. Selecciona la Calculadora
            </label>
            <select
              value={selectedCalc}
              onChange={(e) => handleCalcChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="calculo-iva">Calculadora de IVA (sat/calculadora-iva)</option>
              <option value="calculo-isr-pf">Calculadora de ISR Personas Físicas (sat/calculadora-isr-pf)</option>
              <option value="calculo-resico-pf">Calculadora de RESICO Persona Física (resico/calculadora-resico-pf)</option>
              <option value="calculo-salario">Calculadora de Salario Neto/Bruto (nomina/calculadora-salario-neto-bruto)</option>
            </select>

            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              2. Parámetros de Entrada (JSON Body)
            </label>
            <textarea
              rows={6}
              value={jsonInputs}
              onChange={(e) => setJsonInputs(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            <button
              onClick={handleTestAPI}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
            >
              {loading ? 'Ejecutando Consulta API...' : 'Enviar Petición POST ➔'}
            </button>
          </div>

          {/* Response Panel */}
          <div className="lg:col-span-6 bg-slate-955 border border-slate-850 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📦 Respuesta del Servidor (JSON)
              </h2>
              <p className="text-xs text-slate-450 mb-6">
                El servidor procesa el cálculo y retorna un desglose completo de resultados y pasos matemáticos estructurados.
              </p>

              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[340px] text-blue-300">
                {apiResponse ? (
                  <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                ) : (
                  <span className="text-slate-650">Haz clic en &quot;Enviar Petición POST&quot; para ver la respuesta aquí.</span>
                )}
              </div>
            </div>
            {apiResponse && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-xl text-xs text-blue-400 leading-relaxed">
                ℹ️ <strong>Estatus {apiResponse.status === 'success' ? '200 OK' : 'Error'}</strong>: Observa cómo el campo <code>results</code> incluye los desgloses finales formateados y listos para inyectarse en cualquier interfaz.
              </div>
            )}
          </div>
        </div>

        {/* Integration Code Snippets */}
        <section className="bg-slate-955 border border-slate-850 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            🛠️ Ejemplos de Integración de Código
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">cURL Command</h3>
              <pre className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {curlSnippet}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">JavaScript (Fetch API)</h3>
              <pre className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {nodeSnippet}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-955 py-12 text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-extrabold text-white text-base">
              Calculadora<span className="text-blue-500">SAT</span> <span className="text-xs font-semibold text-slate-655">DevPortal</span>
            </span>
            <p className="mt-1">© 2026 Todos los derechos reservados. Licencia B2B sujeta a términos de servicio comerciales.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-slate-350 transition">Calculadoras</Link>
            <Link href="/privacy" className="hover:text-slate-350 transition">Privacidad</Link>
            <Link href="/terms" className="hover:text-slate-350 transition">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
