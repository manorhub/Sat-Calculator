import { CalculatorConfig } from '../../types/calculator';

// Monthly ISR Brackets
const MONTHLY_ISR_BRACKETS = [
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

const UMA_2024 = 108.57;

function calculateISR(baseAmount: number): number {
  if (baseAmount <= 0) return 0;
  let bracket = MONTHLY_ISR_BRACKETS[0];
  for (let i = 0; i < MONTHLY_ISR_BRACKETS.length; i++) {
    if (baseAmount >= MONTHLY_ISR_BRACKETS[i].limitInferior) {
      bracket = MONTHLY_ISR_BRACKETS[i];
    } else {
      break;
    }
  }
  const excedente = baseAmount - bracket.limitInferior;
  return bracket.cuotaFija + (excedente * (bracket.tasa / 100));
}

function getVacationDays(years: number): number {
  if (years <= 1) return 12;
  if (years === 2) return 14;
  if (years === 3) return 16;
  if (years === 4) return 18;
  if (years === 5) return 20;
  if (years <= 10) return 22;
  if (years <= 15) return 24;
  if (years <= 20) return 26;
  if (years <= 25) return 28;
  return 30;
}

export const vacationsCalculator: CalculatorConfig = {
  id: 'calculo-vacaciones',
  title: 'Calculadora de Vacaciones y Prima Vacacional',
  shortDescription: 'Calcula tus días de vacaciones de ley, el pago correspondiente y tu prima vacacional neta después de impuestos.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-vacaciones-prima',
  seo: {
    metaTitle: 'Calculadora de Vacaciones Dignas y Prima Vacacional 2026',
    metaDescription: 'Calcula tus días de vacaciones según la ley de Vacaciones Dignas en México, el sueldo por los días disfrutados, y tu prima vacacional exenta de ISR.',
    keywords: ['calculadora vacaciones', 'prima vacacional', 'vacaciones dignas mexico', 'dias de vacaciones lft', 'prima vacacional exenta'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'sueldo_mensual',
      label: 'Sueldo Mensual Bruto ($)',
      type: 'number',
      defaultValue: 16000,
      placeholder: 'Ingresa tu salario mensual bruto',
      suffix: 'MXN'
    },
    {
      id: 'antiguedad',
      label: 'Años de servicio (Antigüedad)',
      type: 'number',
      defaultValue: 1,
      placeholder: 'Ej: 1 año'
    },
    {
      id: 'tasa_prima',
      label: 'Porcentaje de Prima Vacacional (%)',
      type: 'number',
      defaultValue: 25,
      placeholder: 'Mínimo de ley es 25%'
    },
    {
      id: 'dias_tomar',
      label: 'Días de vacaciones a tomar (0 para tomar el año completo de ley)',
      type: 'number',
      defaultValue: 0,
      placeholder: 'Ej: 6 días'
    }
  ],
  calculate: (inputs) => {
    const sueldoMensual = parseFloat(inputs.sueldo_mensual) || 0;
    const years = Math.max(1, parseFloat(inputs.antiguedad) || 1);
    const tasaPrima = parseFloat(inputs.tasa_prima) || 25;
    let diasTomar = parseFloat(inputs.dias_tomar) || 0;

    const diasLeyTotal = getVacationDays(years);
    if (diasTomar <= 0 || diasTomar > diasLeyTotal) {
      diasTomar = diasLeyTotal;
    }

    const sueldoDiario = sueldoMensual / 30;
    const pagoVacaciones = sueldoDiario * diasTomar;
    const primaBruta = pagoVacaciones * (tasaPrima / 100);

    // Exemption limit: 15 UMA
    const exentoLimite = 15 * UMA_2024;
    const montoExento = Math.min(primaBruta, exentoLimite);
    const montoGravado = Math.max(0, primaBruta - montoExento);

    // Incremental ISR calculation
    const isrSinPrima = calculateISR(sueldoMensual);
    const isrConPrima = calculateISR(sueldoMensual + montoGravado);
    const isrPrima = Math.max(0, isrConPrima - isrSinPrima);

    const primaNeta = primaBruta - isrPrima;

    const steps = [
      {
        description: `De acuerdo a la Ley de Vacaciones Dignas, para un empleado con ${years} año(s) de antigüedad, corresponden ${diasLeyTotal} días de vacaciones pagados al año. Se tomarán ${diasTomar} días.`,
        mathFormula: `D\\acute{\\imath}as = ${diasTomar}`
      },
      {
        description: `Se calcula el Salario Diario dividiendo el sueldo mensual bruto entre 30.`,
        mathFormula: `Salario\\ Diario = \\frac{$${sueldoMensual.toFixed(2)}}{30} = $${sueldoDiario.toFixed(2)}`
      },
      {
        description: `Se calcula el pago por concepto de los días de vacaciones disfrutados.`,
        mathFormula: `Pago\\ Vacaciones = Salario\\ Diario \\times D\\acute{\\imath}as = $${sueldoDiario.toFixed(2)} \\times ${diasTomar} = $${pagoVacaciones.toFixed(2)}`
      },
      {
        description: `Se calcula la Prima Vacacional Bruta multiplicando el pago de las vacaciones por el porcentaje asignado (${tasaPrima}%).`,
        mathFormula: `Prima\\ Bruta = Pago\\ Vacaciones \\times Tasa\\ Prima = $${pagoVacaciones.toFixed(2)} \\times ${(tasaPrima / 100).toFixed(2)} = $${primaBruta.toFixed(2)}`
      },
      {
        description: `La Prima Vacacional cuenta con una exención de ISR hasta por 15 UMAS ($${exentoLimite.toFixed(2)}).`,
        mathFormula: `Monto\\ Exento = M\\acute{\\imath}n(Prima,\\ $${exentoLimite.toFixed(2)}) = $${montoExento.toFixed(2)}`
      },
      {
        description: `Se calcula la retención de ISR estimada mediante el método incremental aplicado al monto gravado de la prima vacacional ($${montoGravado.toFixed(2)}).`,
        mathFormula: `ISR\\ Retenido = $${isrPrima.toFixed(2)}`
      },
      {
        description: `Se resta el ISR de la Prima Bruta para obtener la Prima Vacacional Neta libre.`,
        mathFormula: `Prima\\ Neta = Prima\\ Bruta - ISR = $${primaBruta.toFixed(2)} - $${isrPrima.toFixed(2)} = $${primaNeta.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Días de Vacaciones por Ley', value: diasLeyTotal, formatted: `${diasLeyTotal} días` },
        { label: 'Días Calculados en este Período', value: diasTomar, formatted: `${diasTomar} días` },
        { label: 'Pago de Sueldo de Vacaciones', value: pagoVacaciones, formatted: `$${pagoVacaciones.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Prima Vacacional Bruta', value: primaBruta, formatted: `$${primaBruta.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Exento de ISR (15 UMAS)', value: montoExento, formatted: `$${montoExento.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de ISR sobre Prima', value: isrPrima, formatted: `$${isrPrima.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Prima Vacacional Neta a Recibir (Libre)', value: primaNeta, formatted: `$${primaNeta.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'La prima vacacional es una cantidad adicional en efectivo de carácter obligatorio que los patrones en México otorgan a los trabajadores para solventar gastos durante sus vacaciones. Con la reforma de "Vacaciones Dignas", el piso de descanso obligatorio del primer año aumentó a 12 días laborables, lo que incrementa proporcionalmente la prima. Ésta goza de una exención fiscal equivalente a 15 UMAS.',
    formula: 'Pago de Vacaciones = Salario Diario * Días de Vacaciones Disfrutados\n\nPrima Vacacional Bruta = Pago de Vacaciones * Porcentaje de Prima\n\nPrima Vacacional Neta = Prima Vacacional Bruta - ISR (sobre el excedente gravado)',
    example: 'Para un sueldo mensual bruto de $16,000 con 1 año de antigüedad (12 días de vacaciones) y una prima del 25%:\nSalario Diario = $533.33 pesos.\nPago de vacaciones = $533.33 * 12 = $6,400 pesos.\nPrima Bruta = $6,400 * 25% = $1,600 pesos.\nExención UMA = 15 * $108.57 = $1,628.55 pesos.\nDado que la prima ($1,600) es menor al límite exento ($1,628.55), está exenta de ISR al 100%.\nPrima Neta Libre = $1,600 pesos.',
    legislation: 'Ley Federal del Trabajo (LFT), Artículos 76 (Vacaciones Obligatorias) y 80 (Derecho a Prima Vacacional); Ley de Impuesto sobre la Renta (LISR), Artículo 93, Fracción XIV.',
    faqs: [
      {
        question: '¿Cuándo se paga la prima vacacional?',
        answer: 'Por regla general, se paga en la fecha en que el trabajador toma efectivamente sus días de descanso. Sin embargo, algunas empresas acostumbran pagarla de manera automática al cumplir el año de antigüedad (aniversario del empleado).'
      },
      {
        question: '¿La prima vacacional se calcula sobre salario bruto o neto?',
        answer: 'Se calcula en base al salario bruto integrado ordinario (antes de impuestos y retenciones de seguridad social).'
      }
    ],
    tips: [
      'Si tu contrato colectivo establece un porcentaje de prima superior al mínimo (ejemplo: 50% o 100%), ingresa esa tasa en la calculadora para un desglose real.',
      'Recuerda que los días de descanso acumulados no son canjeables por dinero directo, a menos que finalice la relación laboral y no se hayan disfrutado.'
    ],
    errors: [
      'Utilizar las tablas de vacaciones previas a la reforma de Vacaciones Dignas (donde correspondían solo 6 días el primer año). Las nuevas tablas aumentaron a 12 días base.',
      'Suponer que la prima vacacional no paga ISR en ningún escenario. El límite exento es estricto de 15 UMAS; cualquier monto por encima de esto se suma a tus ingresos gravables del mes.'
    ]
  }
};
