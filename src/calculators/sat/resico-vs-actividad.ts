import { CalculatorConfig } from '../../types/calculator';

// Monthly RESICO brackets
const RESICO_MONTHLY_BRACKETS = [
  { limit: 25000, tasa: 1.00 },
  { limit: 50000, tasa: 1.10 },
  { limit: 83333.33, tasa: 1.50 },
  { limit: 208333.33, tasa: 2.00 },
  { limit: 291666.67, tasa: 2.50 }
];

// Monthly ISR Brackets for Actividad Empresarial
const ISR_MONTHLY_BRACKETS = [
  { limitInferior: 0.01, cuotaFija: 0.00, tasa: 1.92 },
  { limitInferior: 746.05, cuotaFija: 14.32, tasa: 6.40 },
  { limitInferior: 6332.06, cuotaFija: 371.83, tasa: 10.88 },
  { limitInferior: 11128.02, cuotaFija: 893.55, tasa: 16.00 },
  { limitInferior: 12935.83, cuotaFija: 1182.81, tasa: 17.92 },
  { limitInferior: 15487.72, cuotaFija: 1640.18, tasa: 21.36 },
  { limitInferior: 31236.50, cuotaFija: 5004.12, tasa: 23.52 },
  { limitInferior: 49235.83, cuotaFija: 9236.89, tasa: 30.00 },
  { limitInferior: 93993.91, cuotaFija: 22664.36, tasa: 32.00 },
  { limitInferior: 125325.21, cuotaFija: 32690.40, tasa: 34.00 },
  { limitInferior: 375975.62, cuotaFija: 117911.48, tasa: 35.00 }
];

export const resicoVsActividadCalculator: CalculatorConfig = {
  id: 'calculo-resico-vs-actividad',
  title: 'Comparador RESICO vs Actividad Empresarial',
  shortDescription: 'Compara de forma interactiva cuánto pagarías de ISR bajo RESICO contra el Régimen de Actividad Empresarial para elegir la mejor opción.',
  category: 'RESICO',
  categorySlug: 'resico',
  slug: 'comparador-resico-actividad-empresarial',
  seo: {
    metaTitle: 'Comparador RESICO vs Actividad Empresarial 2026 - México',
    metaDescription: '¿Qué régimen fiscal te conviene más? Compara el pago de ISR de RESICO (sin deducciones) contra Actividad Profesional con gastos deducibles.',
    keywords: ['comparador resico actividad empresarial', 'resico vs regimen general', 'que regimen me conviene', 'isr deducciones sat', 'fiscal mexico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'ingresos_mensuales',
      label: 'Ingresos Mensuales Brutos ($)',
      type: 'number',
      defaultValue: 35000,
      placeholder: 'Tus ingresos mensuales facturados sin IVA',
      suffix: 'MXN'
    },
    {
      id: 'gastos_deducibles',
      label: 'Gastos Mensuales Deducibles ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Gastos indispensables facturados relacionados con tu actividad',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const ingresos = parseFloat(inputs.ingresos_mensuales) || 0;
    const gastos = parseFloat(inputs.gastos_deducibles) || 0;

    // 1. CALCULATE RESICO ISR
    let tasaResico = 2.50;
    for (let i = 0; i < RESICO_MONTHLY_BRACKETS.length; i++) {
      if (ingresos <= RESICO_MONTHLY_BRACKETS[i].limit) {
        tasaResico = RESICO_MONTHLY_BRACKETS[i].tasa;
        break;
      }
    }
    const isrResico = ingresos * (tasaResico / 100);
    const netoResico = ingresos - isrResico;

    // 2. CALCULATE ACTIVIDAD EMPRESARIAL ISR
    const baseGravableActividad = Math.max(0, ingresos - gastos);
    let bracket = ISR_MONTHLY_BRACKETS[0];
    for (let i = 0; i < ISR_MONTHLY_BRACKETS.length; i++) {
      if (baseGravableActividad >= ISR_MONTHLY_BRACKETS[i].limitInferior) {
        bracket = ISR_MONTHLY_BRACKETS[i];
      } else {
        break;
      }
    }
    const excedente = baseGravableActividad - bracket.limitInferior;
    const isrActividad = bracket.cuotaFija + (excedente * (bracket.tasa / 100));
    const netoActividad = ingresos - isrActividad - gastos; // Deducting actual expenses too for cash flow

    const diferenciaIsr = Math.abs(isrActividad - isrResico);
    const convieneResico = isrResico < isrActividad;

    const steps = [
      {
        description: `Bajo RESICO, el ISR se calcula multiplicando tu ingreso bruto por la tasa asignada (${tasaResico.toFixed(2)}%). No se consideran gastos deducibles.`,
        mathFormula: `ISR\\ RESICO = $${ingresos.toFixed(2)} \\times ${tasaResico.toFixed(2)}\\% = $${isrResico.toFixed(2)}`
      },
      {
        description: `Bajo Actividad Empresarial, se restan los gastos deducibles para obtener la base gravable y luego se aplica la tarifa mensual de ISR.`,
        mathFormula: `Base\\ Gravable = $${ingresos.toFixed(2)} - $${gastos.toFixed(2)} = $${baseGravableActividad.toFixed(2)}\\\\ISR\\ Actividad = $${isrActividad.toFixed(2)}`
      },
      {
        description: convieneResico
          ? `RESICO te conviene más. Pagarás $${diferenciaIsr.toLocaleString('es-MX', { minimumFractionDigits: 2 })} pesos MENOS de ISR en comparación con el régimen general.`
          : `El régimen general de Actividad Empresarial te conviene más. Debido a tu alto volumen de gastos deducibles, pagarás $${diferenciaIsr.toLocaleString('es-MX', { minimumFractionDigits: 2 })} pesos MENOS de ISR en comparación con RESICO.`
      }
    ];

    return {
      results: [
        { label: 'Tasa RESICO Aplicable', value: tasaResico, formatted: `${tasaResico.toFixed(2)} %` },
        { label: 'ISR a Pagar en RESICO', value: isrResico, formatted: `$${isrResico.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'ISR a Pagar en Actividad Empresarial', value: isrActividad, formatted: `$${isrActividad.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Diferencia en ISR (Ahorro potencial)', value: diferenciaIsr, formatted: `$${diferenciaIsr.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Régimen Recomendado (Menos Impuesto)', value: convieneResico ? 1 : 0, formatted: convieneResico ? 'RESICO ⭐' : 'Actividad Empresarial ⭐', isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'Elegir entre el Régimen Simplificado de Confianza (RESICO) y el Régimen de Actividad Empresarial es una de las decisiones más comunes al iniciar un negocio en México. RESICO ofrece tasas fijas bajísimas de ISR (1% al 2.5%), pero tiene la restricción de que no permite deducir gastos. El Régimen General de Actividad Empresarial calcula el ISR progresivamente (hasta 35%) sobre la utilidad real neta tras deducir gastos indispensables.',
    formula: 'ISR RESICO = Ingresos Brutos * Tasa Directa (1% a 2.5%)\n\nISR Actividad Empresarial = Tarifa SAT Progresiva sobre ( Ingresos Brutos - Gastos Deducibles )',
    example: 'Tienes ingresos de $35,000 y gastos deducibles de $15,000 mensuales:\nEn RESICO: pagas 1.10% de ISR sobre $35,000 = $385 pesos de ISR.\nEn Actividad Empresarial: base gravable = $20,000. Aplicando la tabla progresiva de ISR, pagas $2,604 pesos.\nAhorro con RESICO = $2,604 - $385 = $2,219 pesos mensuales de menos impuesto.',
    legislation: 'Ley del Impuesto sobre la Renta (LISR), Artículos 113-E (RESICO) y Artículos 100 al 110 (Actividad Empresarial y Profesional).',
    faqs: [
      {
        question: '¿Qué pasa si mis gastos mensuales son muy altos?',
        answer: 'Si tus gastos indispensables representan más del 80% o 90% de tus ingresos, el Régimen de Actividad Empresarial podría convenirte más, ya que tu base gravable final será muy pequeña y pagarás un ISR menor en pesos que el porcentaje plano de RESICO.'
      },
      {
        question: '¿Puedo cambiarme de régimen fiscal cuando quiera?',
        answer: 'Los cambios de régimen fiscal generalmente se realizan a través de un aviso de actualización de actividades ante el SAT, y suelen tener efectos al inicio de cada año fiscal (enero).'
      }
    ],
    tips: [
      'Si tus clientes son principalmente Personas Morales (empresas), recuerda que ellas te retendrán el 1.25% de ISR en RESICO, lo cual puedes acreditar en tu pago mensual.',
      'Aunque estés en RESICO, sigue solicitando facturas de tus gastos indispensables; aunque no disminuyan tu ISR, te servirán para acreditar y disminuir el IVA a pagar.'
    ],
    errors: [
      'Creer que RESICO siempre es la mejor opción. Si tus márgenes de ganancia son sumamente bajos (por ejemplo, en comercialización de productos con poca ganancia unitaria pero alto costo de inventario), pagar ISR sobre ingresos brutos puede absorber todo tu beneficio.',
      'Calcular la decisión sumando gastos personales (como colegiaturas o seguros médicos) en tus proyecciones mensuales; éstos sólo disminuyen el impuesto en la declaración anual del régimen general.'
    ]
  }
};
