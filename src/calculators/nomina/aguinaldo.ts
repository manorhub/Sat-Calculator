import { CalculatorConfig } from '../../types/calculator';

// Monthly ISR Brackets for incremental ISR calculation
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

export const aguinaldoCalculator: CalculatorConfig = {
  id: 'calculo-aguinaldo',
  title: 'Calculadora de Aguinaldo',
  shortDescription: 'Calcula el monto de tu aguinaldo de fin de año o tu parte proporcional por días trabajados, incluyendo la exención de ISR.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-aguinaldo',
  seo: {
    metaTitle: 'Calculadora de Aguinaldo 2026 - Parte Proporcional e ISR',
    metaDescription: 'Calcula tu aguinaldo proporcional en México. Ingresa tus días trabajados, sueldo mensual y conoce el total bruto, exención de ISR del SAT y neto libre.',
    keywords: ['calculadora aguinaldo', 'aguinaldo proporcional', 'calcular aguinaldo mexico', 'aguinaldo exento isr', 'sat aguinaldo'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'sueldo_mensual',
      label: 'Sueldo Mensual Bruto ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Ingresa tu salario mensual bruto',
      suffix: 'MXN'
    },
    {
      id: 'dias_aguinaldo',
      label: 'Días de Aguinaldo al año (Ley exige mínimo 15)',
      type: 'number',
      defaultValue: 15,
      placeholder: 'Ej: 15 días'
    },
    {
      id: 'dias_trabajados',
      label: 'Días trabajados en el año actual (Año completo = 365)',
      type: 'number',
      defaultValue: 365,
      placeholder: 'Ej: 365 días'
    }
  ],
  calculate: (inputs) => {
    const sueldoMensual = parseFloat(inputs.sueldo_mensual) || 0;
    const diasAguinaldo = parseFloat(inputs.dias_aguinaldo) || 15;
    const diasTrabajados = Math.min(365, parseFloat(inputs.dias_trabajados) || 0);

    const sueldoDiario = sueldoMensual / 30;

    // Proportional calculation
    const aguinaldoBrutoAnual = sueldoDiario * diasAguinaldo;
    const aguinaldoBruto = (aguinaldoBrutoAnual / 365) * diasTrabajados;

    // ISR Exemption limit: 30 UMA
    const exentoLimite = 30 * UMA_2024;
    const montoExento = Math.min(aguinaldoBruto, exentoLimite);
    const montoGravado = Math.max(0, aguinaldoBruto - montoExento);

    // Incremental ISR Calculation
    const isrSinAguinaldo = calculateISR(sueldoMensual);
    const isrConAguinaldo = calculateISR(sueldoMensual + montoGravado);
    const isrAguinaldo = Math.max(0, isConAguinaldoResult() ? isrConAguinaldo - isrSinAguinaldo : 0);

    function isConAguinaldoResult() {
      return isrConAguinaldo > isrSinAguinaldo;
    }

    const aguinaldoNeto = aguinaldoBruto - isrAguinaldo;

    const steps = [
      {
        description: `Se calcula el Salario Diario dividiendo el sueldo mensual bruto entre 30.`,
        mathFormula: `Salario\\ Diario = \\frac{$${sueldoMensual.toFixed(2)}}{30} = $${sueldoDiario.toFixed(2)}`
      },
      {
        description: `Se calcula el Aguinaldo Anual correspondiente (por 365 días) multiplicando el salario diario por los días de aguinaldo.`,
        mathFormula: `Aguinaldo\\ Anual = $${sueldoDiario.toFixed(2)} \\times ${diasAguinaldo} = $${aguinaldoBrutoAnual.toFixed(2)}`
      },
      {
        description: `Se calcula la parte proporcional del aguinaldo según los días trabajados en el año actual (${diasTrabajados} días).`,
        mathFormula: `Aguinaldo\\ Proporcional = \\frac{$${aguinaldoBrutoAnual.toFixed(2)}}{365} \\times ${diasTrabajados} = $${aguinaldoBruto.toFixed(2)}`
      },
      {
        description: `Por ley, el aguinaldo está exento de impuestos hasta por el valor de 30 UMAS ($${exentoLimite.toFixed(2)}).`,
        mathFormula: `Monto\\ Exento = M\\acute{\\imath}n(Aguinaldo,\\ $${exentoLimite.toFixed(2)}) = $${montoExento.toFixed(2)}`
      },
      {
        description: `El excedente exento es gravable y se le aplica la tarifa correspondiente de ISR.`,
        mathFormula: `Monto\\ Gravable = Aguinaldo\\ Proporcional - Monto\\ Exento = $${aguinaldoBruto.toFixed(2)} - $${montoExento.toFixed(2)} = $${montoGravado.toFixed(2)}`
      },
      {
        description: `Se calcula la retención de ISR estimada mediante el método incremental (diferencia de ISR de sueldo mensual con y sin aguinaldo gravado).`,
        mathFormula: `ISR\\ Retenido = ISR\\ Incremental = $${isrAguinaldo.toFixed(2)}`
      },
      {
        description: `Se resta el ISR del Aguinaldo Proporcional para obtener el Aguinaldo Neto a recibir.`,
        mathFormula: `Aguinaldo\\ Neto = Aguinaldo\\ Proporcional - ISR = $${aguinaldoBruto.toFixed(2)} - $${isrAguinaldo.toFixed(2)} = $${aguinaldoNeto.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Salario Diario', value: sueldoDiario, formatted: `$${sueldoDiario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Aguinaldo Bruto Proporcional', value: aguinaldoBruto, formatted: `$${aguinaldoBruto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Exento de ISR (30 UMAS)', value: montoExento, formatted: `$${montoExento.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Gravado (Sujeto a ISR)', value: montoGravado, formatted: `$${montoGravado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de ISR Estimada', value: isrAguinaldo, formatted: `$${isrAguinaldo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Aguinaldo Neto a Recibir (Libre)', value: aguinaldoNeto, formatted: `$${aguinaldoNeto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El aguinaldo es un derecho anual para todos los trabajadores subordinados en México, establecido en la Ley Federal del Trabajo. Equivale a un pago mínimo de 15 días de salario diario si se laboró el año completo. Si el periodo de trabajo fue menor, se calcula la parte proporcional exacta en base a los días laborados. Fiscalmente cuenta con una exención de impuestos de hasta 30 veces el valor de la UMA.',
    formula: 'Aguinaldo Proporcional = ( Sueldo Diario * Días de Aguinaldo / 365 ) * Días Trabajados\n\nISR sobre Aguinaldo = ISR(Sueldo + Aguinaldo Gravado) - ISR(Sueldo)\n\nAguinaldo Neto = Aguinaldo Proporcional - ISR',
    example: 'Para un sueldo mensual bruto de $15,000 con 15 días de aguinaldo y habiendo trabajado todo el año (365 días):\nSueldo Diario = $500 pesos.\nAguinaldo Bruto = $500 * 15 = $7,500 pesos.\nExención UMA = 30 * $108.57 = $3,257.10 pesos.\nMonto Gravado = $7,500 - $3,257.10 = $4,242.90 pesos.\nEl ISR incremental para este excedente de $4,242.90 es de aprox $712.50 pesos.\nAguinaldo Neto Libre = $7,500 - $712.50 = $6,787.50 pesos.',
    legislation: 'Ley Federal del Trabajo (LFT), Artículo 87; y Ley de Impuesto sobre la Renta (LISR), Artículo 93, Fracción XIV (Exención del Aguinaldo).',
    faqs: [
      {
        question: '¿Cuándo es la fecha límite para recibir el aguinaldo?',
        answer: 'De acuerdo con el Artículo 87 de la Ley Federal del Trabajo (LFT), los patrones tienen la obligación de entregar el aguinaldo a los trabajadores antes del 20 de diciembre de cada año.'
      },
      {
        question: '¿Si renuncié o me despidieron, tengo derecho a aguinaldo?',
        answer: 'Sí. Los trabajadores que dejen su empleo antes de fin de año tienen derecho a que se les pague la parte proporcional de su aguinaldo por el tiempo laborado, la cual se integra y calcula como parte de su finiquito o liquidación.'
      }
    ],
    tips: [
      'Si tu empresa te otorga prestaciones superiores a la ley (ejemplo: 30 días de aguinaldo), realiza tu cálculo modificando los días en la herramienta.',
      'Recuerda que el aguinaldo no puede descontarse por faltas normales o metas incumplidas, salvo en casos especiales autorizados por la ley (ej. pensiones alimenticias decretadas por juez).'
    ],
    errors: [
      'Creer que el aguinaldo está 100% libre de impuestos. Solo está exento el límite de las 30 UMAS ($3,257.10 MXN), por lo que cualquier monto superior genera descuento de ISR.',
      'Calcular los días laborados restando incapacidades por maternidad o accidentes de riesgo de trabajo. Estos periodos cuentan por ley como laborados activos para el aguinaldo.'
    ]
  }
};
