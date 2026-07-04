import { CalculatorConfig } from '../../types/calculator';

export const isrPmCalculator: CalculatorConfig = {
  id: 'calculo-isr-pm',
  title: 'Calculadora de ISR Persona Moral',
  shortDescription: 'Calcula los pagos provisionales mensuales de ISR para personas morales bajo el régimen general usando el coeficiente de utilidad.',
  category: 'Impuestos Federales',
  categorySlug: 'sat',
  slug: 'calculadora-isr-pm',
  seo: {
    metaTitle: 'Calculadora de ISR Personas Morales 2026 - Pagos Provisionales',
    metaDescription: 'Determina los pagos provisionales mensuales del SAT para Personas Morales en el Régimen General. Usa el coeficiente de utilidad y aplica el 30% de ISR.',
    keywords: ['calculadora isr persona moral', 'pagos provisionales sat', 'coeficiente de utilidad', 'isr empresas mexico', 'regimen general personas morales'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'ingresos_periodo',
      label: 'Ingresos Nominales del Periodo Acumulados ($)',
      type: 'number',
      defaultValue: 250000,
      placeholder: 'Ingresa los ingresos del mes o acumulados en el año',
      suffix: 'MXN'
    },
    {
      id: 'coeficiente',
      label: 'Coeficiente de Utilidad (del ejercicio anterior)',
      type: 'number',
      defaultValue: 0.1524,
      placeholder: 'Ej: 0.1524'
    },
    {
      id: 'pagos_previos',
      label: 'Pagos Provisionales Realizados Anteriormente ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Pagos acumulados ya enterados al SAT',
      suffix: 'MXN'
    },
    {
      id: 'retenciones_banco',
      label: 'Retenciones de ISR por Instituciones Bancarias ($)',
      type: 'number',
      defaultValue: 500,
      placeholder: 'Ej: retención sobre intereses',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const ingresos = parseFloat(inputs.ingresos_periodo) || 0;
    const coeficiente = parseFloat(inputs.coeficiente) || 0;
    const pagosPrevios = parseFloat(inputs.pagos_previos) || 0;
    const retenciones = parseFloat(inputs.retenciones_banco) || 0;

    // 1. Calculate Estimated Profit (Utilidad Fiscal Estimada)
    const utilidadEstimada = ingresos * coeficiente;

    // 2. Apply flat corporate rate (30% in Mexico)
    const rate = 0.30;
    const isrCausado = utilidadEstimada * rate;

    // 3. Deduct previous payments and withholdings
    const isrNeto = Math.max(0, isrCausado - pagosPrevios - retenciones);

    const steps = [
      {
        description: `Se calcula la Utilidad Fiscal Estimada del periodo multiplicando los Ingresos Nominales Acumulados por el Coeficiente de Utilidad aprobado.`,
        mathFormula: `Utilidad\\ Estimada = Ingresos \\times Coeficiente = $${ingresos.toFixed(2)} \\times ${coeficiente.toFixed(4)} = $${utilidadEstimada.toFixed(2)}`
      },
      {
        description: `Se aplica la tasa impositiva fija del 30% establecida en el Artículo 9 de la LISR para Personas Morales sobre la Utilidad Estimada.`,
        mathFormula: `ISR\\ Causado = Utilidad\\ Estimada \\times 30\\% = $${utilidadEstimada.toFixed(2)} \\times 0.30 = $${isrCausado.toFixed(2)}`
      },
      {
        description: `Se restan los pagos provisionales de ISR acreditados con anterioridad ($${pagosPrevios.toFixed(2)}) y las retenciones bancarias ($${retenciones.toFixed(2)}).`,
        mathFormula: `ISR\\ Neto = ISR\\ Causado - Pagos\\ Previos - Retenciones = $${isrCausado.toFixed(2)} - $${pagosPrevios.toFixed(2)} - $${retenciones.toFixed(2)} = $${isrNeto.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Utilidad Fiscal Estimada del Periodo', value: utilidadEstimada, formatted: `$${utilidadEstimada.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Tasa Corporativa LISR', value: 30, formatted: '30.00 %' },
        { label: 'ISR Causado Acumulado', value: isrCausado, formatted: `$${isrCausado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Pagos Provisionales Previos Acreditables', value: pagosPrevios, formatted: `$${pagosPrevios.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retenciones Bancarias Acreditables', value: retenciones, formatted: `$${retenciones.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'ISR Neto Provisional a Pagar', value: isrNeto, formatted: `$${isrNeto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'Las Personas Morales en México bajo el régimen general no tributan en sus pagos provisionales mensuales sobre la base de su flujo o utilidad real de efectivo del mes, sino de forma estimada. Multiplican sus ingresos acumulados desde el inicio del año por un factor de ganancias del año anterior, denominado Coeficiente de Utilidad, y aplican una tasa corporativa fija del 30%.',
    formula: 'Utilidad Fiscal Estimada = Ingresos Nominales Acumulados * Coeficiente de Utilidad\n\nISR Causado Acumulado = Utilidad Fiscal Estimada * 30%\n\nISR a Pagar del Mes = ISR Causado Acumulado - Pagos Provisionales Anteriores - Retenciones de ISR',
    example: 'Para una empresa con ingresos nominales acumulados de $250,000 en el mes y un coeficiente de 0.1524:\nUtilidad Estimada = $250,000 * 0.1524 = $38,100 pesos.\nISR Causado Acumulado = $38,100 * 30% = $11,430 pesos.\nSi ya realizó pagos anteriores por $8,000 y tuvo retenciones de $100:\nISR Neto a Pagar del periodo = $11,430 - $8,000 - $100 = $3,330 pesos.',
    legislation: 'Ley del Impuesto sobre la Renta (LISR), Artículo 9 (Tasa corporativa del 30%) y Artículo 14 (Procedimiento para la presentación de pagos provisionales mensuales).',
    faqs: [
      {
        question: '¿Qué es el Coeficiente de Utilidad?',
        answer: 'Es un factor numérico decimal que representa el porcentaje de margen de utilidad neta fiscal que obtuvo la empresa en el ejercicio inmediato anterior. Se calcula dividiendo la Utilidad Fiscal entre los Ingresos Nominales del año.'
      },
      {
        question: '¿Qué pasa si la empresa tuvo pérdidas el año anterior y no tiene coeficiente?',
        answer: 'Deberá usar el coeficiente de utilidad del ejercicio más reciente dentro de los últimos 5 años en los que sí haya tenido utilidad. Si no tiene en ninguno de esos años, el coeficiente será de cero y no pagará ISR en sus provisionales.'
      }
    ],
    tips: [
      'Si notas que tu coeficiente estimado sobrepasa con creces tu rentabilidad real del año en curso, puedes solicitar al SAT una autorización para disminuir tus pagos provisionales a partir del segundo semestre del ejercicio.',
      'Recuerda acumular siempre los ingresos nominales acumulados desde el 1 de enero hasta el mes del cálculo.'
    ],
    errors: [
      'Deducir las compras o gastos mensuales para calcular los pagos provisionales de ISR. Las deducciones de gastos de Personas Morales se aplican únicamente en la declaración anual, no en los provisionales mensuales de ISR (a menos que tributes bajo RESICO Persona Moral).',
      'Confundir los ingresos cobrados con los facturados. En el Régimen General de Personas Morales, el ISR provisional se causa en el momento en que se emite la factura o se entrega el bien, independientemente de si ya se cobró o no.'
    ]
  }
};
