import { CalculatorConfig } from '../../types/calculator';

export const cetesCalculator: CalculatorConfig = {
  id: 'calculo-cetes',
  title: 'Calculadora de Rendimiento en CETES',
  shortDescription: 'Calcula las ganancias estimadas de invertir en Certificados de la Tesorería de la Federación (CETES) con tasas reales del Banco de México.',
  category: 'Inversiones',
  categorySlug: 'inversiones',
  slug: 'calculadora-cetes-directo',
  seo: {
    metaTitle: 'Calculadora de CETES Directo 2026 - Rendimiento Neto e ISR',
    metaDescription: 'Simula tu inversión en CETES a plazos de 28, 91, 182 y 364 días. Calcula tus intereses brutos, la retención fiscal de ISR y el capital neto final.',
    keywords: ['calculadora cetes', 'cetes directo mexico', 'rendimiento cetes 28 dias', 'retencion isr inversiones', 'banco de mexico cetes'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto_invertir',
      label: 'Monto a Invertir ($)',
      type: 'number',
      defaultValue: 10000,
      placeholder: 'Ej: $10,000 pesos',
      suffix: 'MXN'
    },
    {
      id: 'plazo_dias',
      label: 'Plazo de la Inversión (Días)',
      type: 'select',
      defaultValue: 28,
      options: [
        { label: '28 días', value: 28 },
        { label: '91 días', value: 91 },
        { label: '182 días', value: 182 },
        { label: '364 días', value: 364 }
      ]
    },
    {
      id: 'tasa_anual',
      label: 'Tasa de Interés Anual (%)',
      type: 'number',
      defaultValue: 11.00,
      placeholder: 'Ej: 11.00 %'
    },
    {
      id: 'tasa_isr_anual',
      label: 'Tasa de Retención de ISR Anual (%)',
      type: 'number',
      defaultValue: 0.50,
      placeholder: 'Tasa de retención de la Ley de Ingresos'
    }
  ],
  calculate: (inputs) => {
    const principal = parseFloat(inputs.monto_invertir) || 0;
    const plazo = parseInt(inputs.plazo_dias) || 28;
    const tasaAnual = parseFloat(inputs.tasa_anual) || 0;
    const tasaIsr = parseFloat(inputs.tasa_isr_anual) || 0.50;

    // Financial standard in Mexican money market uses 360 days base for CETES
    const rendimientoBruto = principal * (tasaAnual / 100) * (plazo / 360);

    // Capital gains withholding tax (ISR) is calculated on principal base
    const retencionIsr = principal * (tasaIsr / 100) * (plazo / 360);

    const rendimientoNeto = rendimientoBruto - retencionIsr;
    const montoFinal = principal + rendimientoNeto;

    const steps = [
      {
        description: `Se calcula el rendimiento bruto multiplicando el capital invertido por la tasa anual prorrateada por el plazo de inversión (base de 360 días del mercado financiero).`,
        mathFormula: `Rendimiento\\ Bruto = Capital \\times \\left( \\frac{Tasa\\ Anual}{100} \\right) \\times \\left( \\frac{Plazo}{360} \\right) = $${principal.toFixed(2)} \\times ${(tasaAnual / 100).toFixed(4)} \\times \\left( \\frac{${plazo}}{360} \\right) = $${rendimientoBruto.toFixed(2)}`
      },
      {
        description: `Se calcula la retención provisional de ISR sobre el capital invertido aplicando la tasa oficial de la Ley de Ingresos de la Federación prorrateada por el plazo.`,
        mathFormula: `Retenci\\acute{o}n\\ ISR = Capital \\times \\left( \\frac{Tasa\\ ISR}{100} \\right) \\times \\left( \\frac{Plazo}{360} \\right) = $${principal.toFixed(2)} \\times ${(tasaIsr / 100).toFixed(4)} \\times \\left( \\frac{${plazo}}{360} \\right) = $${retencionIsr.toFixed(2)}`
      },
      {
        description: `Se restan las retenciones de ISR del rendimiento bruto para obtener la ganancia neta.`,
        mathFormula: `Rendimiento\\ Neto = Rendimiento\\ Bruto - Retenci\\acute{o}n = $${rendimientoBruto.toFixed(2)} - $${retencionIsr.toFixed(2)} = $${rendimientoNeto.toFixed(2)}`
      },
      {
        description: `Se suma el capital inicial más el rendimiento neto para obtener el saldo disponible al vencimiento.`,
        mathFormula: `Monto\\ Final = Capital + Rendimiento\\ Neto = $${principal.toFixed(2)} + $${rendimientoNeto.toFixed(2)} = $${montoFinal.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Capital Inicial Invertido', value: principal, formatted: `$${principal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Intereses Brutos Generados', value: rendimientoBruto, formatted: `$${rendimientoBruto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención Provisional de ISR (SAT)', value: retencionIsr, formatted: `$${retencionIsr.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Interés Neto Ganado (Libre)', value: rendimientoNeto, formatted: `$${rendimientoNeto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Capital Total al Vencimiento', value: montoFinal, formatted: `$${montoFinal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'Los CETES (Certificados de la Tesorería) son instrumentos de deuda bursátil emitidos por el Gobierno Federal de México. Al comprar un CETE estás prestando dinero al gobierno a cambio de un interés. Se consideran la inversión de menor riesgo en México porque cuentan con el respaldo del erario federal. Su cálculo utiliza una convención financiera estándar de año comercial de 360 días.',
    formula: 'Interés Bruto = Capital * Tasa Anual * ( Plazo en Días / 360 )\n\nISR Retenido = Capital * Tasa ISR Anual * ( Plazo en Días / 360 )\n\nCapital Final = Capital + Interés Bruto - ISR Retenido',
    example: 'Si inviertes $10,000 pesos en CETES a 28 días con una tasa anual del 11.00% y retención de ISR del 0.50%:\nRendimiento Bruto = $10,000 * 11.00% * (28 / 360) = $85.56 pesos.\nRetención ISR = $10,000 * 0.50% * (28 / 360) = $3.89 pesos.\nRendimiento Neto = $85.56 - $3.89 = $81.67 pesos.\nTotal al vencimiento = $10,081.67 pesos.',
    legislation: 'Ley del Mercado de Valores y Ley de Ingresos de la Federación (establece la tasa de retención del ISR sobre el capital de las inversiones financieras año con año).',
    faqs: [
      {
        question: '¿Qué es la retención provisional de ISR sobre inversiones?',
        answer: 'Es un porcentaje de impuesto que las instituciones financieras (incluyendo la plataforma Cetes Directo) te descuentan de manera automática al momento de pagarte rendimientos. Funciona como un pago a cuenta que declaras en tu declaración anual del SAT.'
      },
      {
        question: '¿Por qué se usa un año de 360 días para los cálculos de CETES?',
        answer: 'Es una convención internacional en los mercados de dinero (mercado de renta fija) que simplifica el cómputo de intereses diarios utilizando meses de 30 días.'
      }
    ],
    tips: [
      'Monitorea las subastas semanales del Banco de México para verificar cómo se ajustan las tasas de rendimiento de acuerdo a la inflación y decisiones de política monetaria.',
      'Si reinviertes automáticamente tus intereses al vencimiento (interés compuesto), tus ganancias crecerán de forma exponencial a mediano y largo plazo.'
    ],
    errors: [
      'Creer que las ganancias de CETES están totalmente exentas de impuestos. Tienen un descuento de retención anual directo que varía de acuerdo a lo decretado en la Ley de Ingresos de la Federación.',
      'Comparar plazos sin anualizar las tasas. Una tasa de Cete del 11% es anual; no significa que vayas a ganar el 11% al final de los 28 días, sino la proporción equivalente a esos 28 días.'
    ]
  }
};
