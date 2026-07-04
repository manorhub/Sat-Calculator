import { CalculatorConfig } from '../../types/calculator';

// Monthly ISR Brackets for 2024/2026 in Mexico
const MONTHLY_BRACKETS = [
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

export const isrPfCalculator: CalculatorConfig = {
  id: 'calculo-isr-pf',
  title: 'Calculadora de ISR Personas Físicas',
  shortDescription: 'Calcula el Impuesto sobre la Renta (ISR) para personas físicas bajo el régimen de actividad profesional, empresarial o arrendamiento.',
  category: 'Impuestos Federales',
  categorySlug: 'sat',
  slug: 'calculadora-isr-pf',
  seo: {
    metaTitle: 'Calculadora de ISR 2026 - Personas Físicas México',
    metaDescription: 'Calcula el ISR a pagar al SAT de forma mensual o anual para personas físicas. Basado en las tablas de la Ley de Impuesto sobre la Renta vigentes.',
    keywords: ['calculadora isr', 'calcular isr personas fisicas', 'isr sat 2026', 'tablas isr mensual', 'isr sobre honorarios'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'ingresos',
      label: 'Ingresos Acumulables ($)',
      type: 'number',
      defaultValue: 25000,
      placeholder: 'Ingresa tus ingresos brutos del período',
      suffix: 'MXN'
    },
    {
      id: 'deducciones',
      label: 'Deducciones Autorizadas ($)',
      type: 'number',
      defaultValue: 5000,
      placeholder: 'Ingresa tus gastos deducibles del período',
      suffix: 'MXN'
    },
    {
      id: 'periodo',
      label: 'Período del cálculo',
      type: 'select',
      defaultValue: 'mensual',
      options: [
        { label: 'Mensual', value: 'mensual' },
        { label: 'Anual', value: 'anual' }
      ]
    }
  ],
  calculate: (inputs) => {
    const ingresos = parseFloat(inputs.ingresos) || 0;
    const deducciones = parseFloat(inputs.deducciones) || 0;
    const periodo = inputs.periodo;

    // Base Gravable = Ingresos - Deducciones
    const baseGravable = Math.max(0, ingresos - deducciones);

    // Get correct brackets based on period
    const brackets = periodo === 'anual'
      ? MONTHLY_BRACKETS.map(b => ({
          limitInferior: b.limitInferior * 12,
          cuotaFija: b.cuotaFija * 12,
          tasa: b.tasa
        }))
      : MONTHLY_BRACKETS;

    // Find the correct bracket
    let bracket = brackets[0];
    for (let i = 0; i < brackets.length; i++) {
      if (baseGravable >= brackets[i].limitInferior) {
        bracket = brackets[i];
      } else {
        break;
      }
    }

    const excedente = baseGravable - bracket.limitInferior;
    const impuestoMarginal = excedente * (bracket.tasa / 100);
    const isrRetenido = bracket.cuotaFija + impuestoMarginal;
    const ingresoNeto = ingresos - deducciones - isrRetenido;

    const steps = [
      {
        description: `Se calcula la Base Gravable restando las Deducciones Autorizadas de los Ingresos Acumulables.`,
        mathFormula: `Base\\ Gravable = Ingresos - Deducciones = $${ingresos.toFixed(2)} - $${deducciones.toFixed(2)} = $${baseGravable.toFixed(2)}`
      },
      {
        description: `Se identifica el rango de la tabla de ISR que corresponde a la Base Gravable ($${baseGravable.toFixed(2)}). El límite inferior del rango es $${bracket.limitInferior.toFixed(2)}. Se resta este límite de la base para obtener el Excedente.`,
        mathFormula: `Excedente = Base\\ Gravable - L\\acute{\\imath}mite\\ Inferior = $${baseGravable.toFixed(2)} - $${bracket.limitInferior.toFixed(2)} = $${excedente.toFixed(2)}`
      },
      {
        description: `Se aplica la tasa correspondiente al excedente (${bracket.tasa.toFixed(2)}%) para calcular el Impuesto Marginal.`,
        mathFormula: `Impuesto\\ Marginal = Excedente \\times Tasa = $${excedente.toFixed(2)} \\times ${(bracket.tasa / 100).toFixed(4)} = $${impuestoMarginal.toFixed(2)}`
      },
      {
        description: `Se suma la Cuota Fija del rango ($${bracket.cuotaFija.toFixed(2)}) al Impuesto Marginal para obtener el ISR Causado total.`,
        mathFormula: `ISR\\ Causado = Cuota\\ Fija + Impuesto\\ Marginal = $${bracket.cuotaFija.toFixed(2)} + $${impuestoMarginal.toFixed(2)} = $${isrRetenido.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Base Gravable', value: baseGravable, formatted: `$${baseGravable.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Límite Inferior Aplicado', value: bracket.limitInferior, formatted: `$${bracket.limitInferior.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Excedente sobre Límite', value: excedente, formatted: `$${excedente.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Impuesto Marginal', value: impuestoMarginal, formatted: `$${impuestoMarginal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Cuota Fija de la Tabla', value: bracket.cuotaFija, formatted: `$${bracket.cuotaFija.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'ISR Causado (A Pagar)', value: isrRetenido, formatted: `$${isrRetenido.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true },
        { label: 'Ingreso Neto Estimado', value: ingresoNeto, formatted: `$${ingresoNeto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` }
      ],
      steps
    };
  },
  content: {
    explanation: 'El Impuesto sobre la Renta (ISR) es el impuesto directo principal que grava los ingresos de personas físicas y morales en México. Para las personas físicas, el cálculo no es lineal, sino progresivo; se basa en tarifas con límites inferiores y superiores, una cuota fija y una tasa sobre el excedente del límite inferior, la cual aumenta a medida que suben los ingresos del contribuyente (del 1.92% al 35%).',
    formula: 'ISR = Cuota Fija + [ ( Base Gravable - Límite Inferior ) * Tasa Excedente ]\nDonde:\nBase Gravable = Ingresos Acumulables - Deducciones Autorizadas',
    example: 'Para un ingreso mensual de $25,000 con deducciones de $5,000, la base gravable es de $20,000.\nEl rango aplicable tiene un Límite Inferior de $15,487.72, Cuota Fija de $1,640.18 y Tasa de 21.36%.\nExcedente = $20,000 - $15,487.72 = $4,512.28\nImpuesto Marginal = $4,512.28 * 21.36% = $963.82\nISR total a pagar = $1,640.18 + $963.82 = $2,604.00',
    legislation: 'Ley del Impuesto sobre la Renta (LISR), Título IV, Capítulo II (De los ingresos por actividades empresariales y profesionales) y Anexo 8 de la Resolución Miscelánea Fiscal vigente (RMF).',
    faqs: [
      {
        question: '¿Qué son las deducciones autorizadas?',
        answer: 'Son los gastos indispensables que realizas para poder llevar a cabo tu actividad económica, como compra de materia prima, renta de oficina, papelería, internet y sueldos de empleados.'
      },
      {
        question: '¿Cuál es la diferencia entre el ISR provisional y el anual?',
        answer: 'Los provisionales son pagos a cuenta mensuales que realizas a lo largo del año. En la declaración anual, se suman todos los ingresos y deducciones del año, se recalcula con la tabla anual y se restan los pagos provisionales ya realizados.'
      }
    ],
    tips: [
      'Asegúrate de solicitar facturas (CFDI) con el uso de CFDI correcto para todos tus gastos indispensables para que sean deducibles.',
      'Si eres asalariado, también puedes deducir gastos personales en tu declaración anual (gastos médicos, colegiaturas, aportaciones voluntarias al afore, intereses de créditos hipotecarios).'
    ],
    errors: [
      'Creer que el impuesto es simplemente multiplicar tu ingreso por la tasa máxima (por ejemplo, el 30%). Recuerda que en México el ISR se calcula en escalones por brackets.',
      'Intentar deducir gastos personales (como despensa de hogar o ropa general) en tus declaraciones provisionales de actividad empresarial; estos solo aplican en la declaración anual.'
    ]
  }
};
