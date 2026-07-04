'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCalculatorBySlug } from '../calculators';
import esDict from '../dictionaries/es.json';
import enDict from '../dictionaries/en.json';

// Helper function to merge translations with base config
function getLocalizedConfig(config: any, lang: string): any {
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
    },
    inputs: config.inputs.map((input: any) => {
      const transInput = trans.inputs?.find((i: any) => i.id === input.id);
      if (transInput) {
        return {
          ...input,
          label: transInput.label || input.label,
          placeholder: transInput.placeholder || input.placeholder,
          options: input.options?.map((opt: any) => {
            const transOpt = transInput.options?.find((o: any) => o.value === opt.value);
            return transOpt ? { ...opt, label: transOpt.label } : opt;
          })
        };
      }
      return input;
    }),
    content: {
      ...config.content,
      ...(trans.content || {})
    }
  };
}

// Helper function to render text with Markdown links [label](url)
function renderTextWithLinks(text: string) {
  if (!text) return null;
  
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, label, url] = match;
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    
    const isExternal = url.startsWith('http');
    parts.push(
      <Link 
        key={matchIndex} 
        href={url}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        {label}
      </Link>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

interface CalculatorEngineProps {
  slug: string;
  lang?: string;
}

interface HistoryEntry {
  id: string;
  name: string;
  timestamp: number;
  inputs: Record<string, any>;
  results: { label: string; formatted: string }[];
}

export default function CalculatorEngine({ slug, lang = 'es' }: CalculatorEngineProps) {
  const baseConfig = getCalculatorBySlug(slug);
  const config = baseConfig ? getLocalizedConfig(baseConfig, lang) : null;
  const dict = lang === 'en' ? enDict.engine : esDict.engine;

  if (!config) {
    return (
      <div className="text-center py-12 text-slate-500">
        {lang === 'en' ? 'Calculator not found.' : 'Calculadora no encontrada.'}
      </div>
    );
  }

  // Initialize state based on inputs
  const [inputs, setInputs] = useState<Record<string, any>>(() => {

    const initial: Record<string, any> = {};
    if (config) {
      config.inputs.forEach((input: any) => {
        initial[input.id] = input.defaultValue;
      });
    }
    return initial;
  });


  const [activeTab, setActiveTab] = useState<'calculator' | 'explanation' | 'faq'>('calculator');
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Local history and favorite states
  const [isFavorite, setIsFavorite] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Sync URL query params and localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Sync query params
      const params = new URLSearchParams(window.location.search);
      const updated = { ...inputs };
      let hasChanges = false;
      
      config.inputs.forEach((input: any) => {
        if (params.has(input.id)) {
          const val = params.get(input.id);
          if (input.type === 'number') {
            updated[input.id] = parseFloat(val || '0');
          } else if (input.type === 'boolean') {
            updated[input.id] = val === 'true';
          } else {
            updated[input.id] = val;
          }
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setInputs(updated);
      }

      // 2. Check if marked as favorite
      const favorites = JSON.parse(localStorage.getItem('sat_calc_favorites') || '[]');
      setIsFavorite(favorites.includes(config.id));

      // 3. Load history for this specific calculator
      const fullHistory: HistoryEntry[] = JSON.parse(localStorage.getItem('sat_calc_history') || '[]');
      const filtered = fullHistory.filter(h => (h as any).calcId === config.id);
      setHistory(filtered);
    }
  }, [config.id]);

  // Fetch live exchange rate if it's the currency converter
  useEffect(() => {
    if (slug === 'calculadora-tipo-de-cambio') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('tipo_cambio')) {
        return;
      }
      const fetchRate = async () => {
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/USD');
          if (res.ok) {
            const data = await res.json();
            if (data && data.rates && data.rates.MXN) {
              const liveRate = parseFloat(data.rates.MXN);
              if (liveRate > 0) {
                setInputs((prev) => ({
                  ...prev,
                  tipo_cambio: parseFloat(liveRate.toFixed(4)),
                }));
              }
            }
          }
        } catch (err) {
          console.error('Error fetching live exchange rate:', err);
        }
      };
      fetchRate();
    }
  }, [slug]);

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const { results, steps } = config.calculate(inputs, lang);

  const mainResult = results.find((r: any) => r.isMain) || results[0];
  const secondaryResults = results.filter((r: any) => !r.isMain);

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      const textToCopy = results
        .map((r: any) => `${r.label}: ${r.formatted}`)
        .join('\n');
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateShareLink = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      Object.entries(inputs).forEach(([key, val]) => {
        params.set(key, String(val));
      });
      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(shareUrl);
      alert(lang === 'en' ? 'Calculation link copied to clipboard!' : '¡Enlace de cálculo copiado al portapapeles!');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Toggle Favorite in LocalStorage
  const toggleFavorite = () => {
    if (typeof window === 'undefined') return;
    const favorites = JSON.parse(localStorage.getItem('sat_calc_favorites') || '[]');
    let updated: string[];

    if (favorites.includes(config.id)) {
      updated = favorites.filter((id: string) => id !== config.id);
      setIsFavorite(false);
    } else {
      updated = [...favorites, config.id];
      setIsFavorite(true);
    }

    localStorage.setItem('sat_calc_favorites', JSON.stringify(updated));
  };

  // Save to history list in LocalStorage
  const saveToHistory = () => {
    if (!saveName.trim()) return;

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      name: saveName,
      timestamp: Date.now(),
      inputs,
      results: results.map((r: any) => ({ label: r.label, formatted: r.formatted }))
    };
    (newEntry as any).calcId = config.id;
    (newEntry as any).calcSlug = config.slug;
    (newEntry as any).categorySlug = config.categorySlug;

    const fullHistory = JSON.parse(localStorage.getItem('sat_calc_history') || '[]');
    const updated = [newEntry, ...fullHistory];

    localStorage.setItem('sat_calc_history', JSON.stringify(updated));
    setHistory(prev => [newEntry, ...prev]);
    setSaveName('');
    setShowSaveModal(false);
    alert(lang === 'en' ? 'Calculation saved successfully!' : '¡Cálculo guardado con éxito!');
  };

  // Load a historic entry back into inputs
  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInputs(entry.inputs);
    alert(lang === 'en' ? `Loaded saved calculation: "${entry.name}"` : `Se cargó el cálculo guardado: "${entry.name}"`);
  };

  // Delete a history entry
  const deleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullHistory = JSON.parse(localStorage.getItem('sat_calc_history') || '[]');
    const updated = fullHistory.filter((h: any) => h.id !== id);
    localStorage.setItem('sat_calc_history', JSON.stringify(updated));
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  // Export to CSV File
  const exportToCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += lang === 'en' ? `Calculator,${config.title}\n` : `Calculadora,${config.title}\n`;
    csvContent += lang === 'en' ? `Date,${new Date().toLocaleDateString('en-US')}\n\n` : `Fecha,${new Date().toLocaleDateString('es-MX')}\n\n`;
    
    csvContent += lang === 'en' ? 'INPUT PARAMETERS\n' : 'PARÁMETROS DE ENTRADA\n';
    config.inputs.forEach((input: any) => {
      csvContent += `${input.label},${inputs[input.id]}\n`;
    });
    
    csvContent += lang === 'en' ? '\nCALCULATION RESULTS\n' : '\nRESULTADOS DEL CÁLCULO\n';
    results.forEach((res: any) => {
      csvContent += `${res.label},"${res.formatted.replace('MXN', '').trim()}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `calculo_${config.slug}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            {config.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight flex items-center gap-3">
            {config.title}
            <button
              onClick={toggleFavorite}
              className="text-2xl text-slate-400 hover:text-yellow-500 transition duration-200"
              title={isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {config.shortDescription}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'calculator'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <i className="bi bi-calculator-fill mr-2"></i>{dict.tab_calculator}
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'explanation'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <i className="bi bi-info-circle-fill mr-2"></i>{dict.tab_guide}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'faq'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <i className="bi bi-question-circle-fill mr-2"></i>{dict.tab_faq}
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <i className="bi bi-sliders text-blue-600 mr-2"></i> {dict.input_header}
              </h2>
              <div className="space-y-6">
                {config.inputs.map((input: any) => (
                  <div key={input.id} className="flex flex-col">
                    <label
                      htmlFor={input.id}
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                    >
                      {input.label}
                    </label>
                    {input.type === 'number' && (
                      <div className="relative rounded-lg shadow-sm">
                        <input
                          type="number"
                          name={input.id}
                          id={input.id}
                          value={inputs[input.id]}
                          onChange={(e) =>
                            handleInputChange(input.id, parseFloat(e.target.value) || 0)
                          }
                          className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                          placeholder={input.placeholder}
                        />
                        {input.suffix && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 sm:text-sm">{input.suffix}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {input.type === 'select' && (
                      <select
                        id={input.id}
                        name={input.id}
                        value={inputs[input.id]}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      >
                        {input.options?.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {input.type === 'boolean' && (
                      <div className="flex items-center mt-1">
                        <input
                          id={input.id}
                          name={input.id}
                          type="checkbox"
                          checked={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, e.target.checked)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {input.label}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Local Saved History Panel */}
            {history.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <i className="bi bi-clock-history text-slate-500 mr-2"></i> {dict.history_title}
                </h3>
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => loadHistoryEntry(entry)}
                      className="group flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-950 dark:hover:bg-slate-850 transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {entry.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(entry.timestamp).toLocaleDateString()} - {entry.results[entry.results.length - 1].formatted}
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteHistoryEntry(entry.id, e)}
                        className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition duration-200"
                        title={lang === 'en' ? 'Delete entry' : 'Eliminar registro'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100 opacity-90">
                {mainResult.label}
              </span>
              <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight">
                {mainResult.formatted}
              </div>
              <p className="text-sm text-blue-100/80 mt-2">
                {dict.result_disclaimer}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-200"
                >
                  <i className={`bi ${copied ? 'bi-check-lg text-emerald-300' : 'bi-clipboard'} mr-2`}></i>
                  {copied ? dict.btn_copied : dict.btn_copy}
                </button>
                <button
                  onClick={generateShareLink}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-200"
                >
                  <i className="bi bi-share mr-2"></i>{dict.btn_share}
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-200"
                >
                  <i className="bi bi-bookmark-plus mr-2"></i>{dict.btn_save}
                </button>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-200"
                >
                  <i className="bi bi-file-earmark-excel mr-2"></i>{dict.btn_excel}
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-200"
                >
                  <i className="bi bi-printer mr-2"></i>{dict.btn_print}
                </button>
              </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {dict.save_modal_title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {dict.save_modal_desc}
                  </p>
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder={dict.save_modal_placeholder}
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-semibold"
                    >
                      {dict.btn_cancel}
                    </button>
                    <button
                      onClick={saveToHistory}
                      disabled={!saveName.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-sm font-semibold rounded-lg"
                    >
                      {dict.btn_confirm}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Results */}
            {secondaryResults.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  {dict.desglose_title}
                </h3>
                <div className="space-y-3">
                  {secondaryResults.map((res: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 last:border-0"
                    >
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {res.label}
                      </span>
                      <span className="text-slate-950 dark:text-white font-bold">
                        {res.formatted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps Accordion */}
            {steps.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex justify-between items-center w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 transition duration-200 font-semibold text-slate-850 dark:text-white"
                >
                  <span className="flex items-center">
                    <i className="bi bi-info-square-fill text-blue-600 mr-2"></i> {dict.steps_title}
                  </span>
                  <i className={`bi ${showSteps ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
                {showSteps && (
                  <div className="px-6 py-4 bg-white dark:bg-slate-900/50 space-y-4">
                    {steps.map((step: any, idx: number) => (
                      <div key={idx} className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {dict.step_prefix} {idx + 1}
                        </div>
                        <p className="text-slate-800 dark:text-slate-300 text-sm mb-2">
                          {step.description}
                        </p>
                        {step.mathFormula && (
                          <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-900 dark:text-slate-100">
                            {step.mathFormula}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guide Tab */}
      {activeTab === 'explanation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-3">
              {dict.guide_title}
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {renderTextWithLinks(config.content.explanation)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white mb-2 flex items-center">
                <i className="bi bi-file-code-fill text-indigo-500 mr-2"></i> {dict.guide_formula}
              </h3>
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {config.content.formula}
              </pre>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-950 dark:text-white mb-2 flex items-center">
                <i className="bi bi-lightbulb-fill text-yellow-500 mr-2"></i> {dict.guide_example}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {renderTextWithLinks(config.content.example)}
              </p>
            </div>
          </div>

          {config.content.tips && config.content.tips.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white mb-3 flex items-center">
                <i className="bi bi-bookmark-check-fill text-emerald-500 mr-2"></i> {dict.guide_tips}
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 dark:text-slate-300 text-sm">
                {config.content.tips.map((tip: any, index: number) => (
                  <li key={index}>{renderTextWithLinks(tip)}</li>
                ))}
              </ul>
            </div>
          )}

          {config.content.errors && config.content.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 rounded-xl">
              <h3 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center">
                <i className="bi bi-exclamation-octagon-fill text-red-500 mr-2"></i> {dict.guide_errors}
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-2 text-red-700 dark:text-red-400 text-sm">
                {config.content.errors.map((error: any, index: number) => (
                  <li key={index}>{renderTextWithLinks(error)}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-2 flex items-center">
              <i className="bi bi-briefcase-fill text-blue-500 mr-2"></i> {dict.guide_legislation}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm italic">
              {config.content.legislation}
            </p>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">
            {dict.faq_title}
          </h2>
          <div className="space-y-6">
            {config.content.faqs.map((faq: any, index: number) => (
              <div key={index} className="border-b border-slate-200 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">Q.</span>
                  {faq.question}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-6 whitespace-pre-line">
                  {renderTextWithLinks(faq.answer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
