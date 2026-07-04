'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  activeCalculatorContext?: string;
}

export default function AIAssistant({ activeCalculatorContext }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: '¡Hola! Soy tu Asistente Fiscal IA de Calculadora SAT. 🇲🇽\n\n¿Tienes alguna duda sobre tus impuestos, el cálculo de nómina, RESICO o qué gastos puedes deducir ante el SAT este año? ¡Pregúntame lo que quieras!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open-ai-assistant', handleOpen);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-ai-assistant', handleOpen);
      }
    };
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(1), // Exclude initial welcome message
          context: activeCalculatorContext
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: 'Ups, no pude obtener respuesta. Inténtalo de nuevo.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Error de conexión. Revisa tu red.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const suggestions = [
    '¿Qué es y cómo funciona el RESICO?',
    '¿Cómo calculo el IVA acreditable?',
    '¿Qué gastos médicos son deducibles?',
    '¿Cuándo se paga el aguinaldo por ley?',
    'Diferencia entre sueldo neto y bruto'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Abrir Asistente Fiscal IA"
        >
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-sm mr-1">Asistente Fiscal IA</span>
          <span className="text-lg">✨</span>
        </button>
      )}

      {/* Slide-out Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🤖</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Asistente Fiscal Inteligente</h3>
              <p className="text-xs text-blue-100/80">SAT & Nómina México - IA Activa</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-blue-200 font-bold p-2 text-xl"
            aria-label="Cerrar Asistente Fiscal IA"
          >
            ✕
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 text-slate-500 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 rounded-bl-none flex items-center space-x-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">Preguntas populares:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-slate-750 transition text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Drawer Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 flex space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregunta algo al asistente fiscal..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
