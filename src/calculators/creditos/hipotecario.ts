import { CalculatorConfig } from '../../types/calculator';

export const hipotecarioCalculator: CalculatorConfig = {
  id: 'calculo-hipotecario',
  title: 'Calculadora de Crédito Hipotecario',
  shortDescription: 'Calcula tu mensualidad fija para comprar casa usando amortización francesa, desglosando capital, intereses y seguro.',
  category: 'Hipotecas',
  categorySlug: 'hipotecas',
  slug: 'calculadora-credito-hipotecario',
  seo: {
    metaTitle: 'Calculadora de Crédito Hipotecario 2026 - Amortización y Mensualidad',
    metaDescription: 'Simula tu hipoteca bancaria o Infonavit en México. Calcula el pago mensual, el enganche requerido, desglose de intereses y tabla francesa.',
    keywords: ['calculadora hipotecaria', 'credito hipotecario bancario', 'tabla amortizacion francesa', 'comprar casa mensualidad', 'enganche casa mexico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'valor_propiedad',
      label: 'Valor de la Propiedad ($)',
      type: 'number',
      defaultValue: 1500000,
      placeholder: 'Ej: $1,500,000 pesos',
      suffix: 'MXN'
    },
    {
      id: 'enganche_porcentaje',
      label: 'Porcentaje de Enganche (%)',
      type: 'number',
      defaultValue: 20,
      placeholder: 'Mínimo suele ser 10% o 20%'
    },
    {
      id: 'plazo_anos',
      label: 'Plazo del Crédito (Años)',
      type: 'select',
      defaultValue: 20,
      options: [
        { label: '5 años', value: 5 },
        { label: '10 años', value: 10 },
        { label: '15 años', value: 15 },
        { label: '20 años', value: 20 }
      ]
    },
    {
      id: 'tasa_anual',
      label: 'Tasa de Interés Anual Fija (%)',
      type: 'number',
      defaultValue: 10.50,
      placeholder: 'Ej: 10.50 %'
    },
    {
      id: 'seguros_adicionales',
      label: 'Seguros y comisiones mensuales ($)',
      type: 'number',
      defaultValue: 750,
      placeholder: 'Seguro de vida y daños mensual promedio',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const valor = parseFloat(inputs.valor_propiedad) || 0;
    const enganchePct = parseFloat(inputs.enganche_porcentaje) || 20;
    const anos = parseInt(inputs.plazo_anos) || 20;
    const tasaAnual = parseFloat(inputs.tasa_anual) || 10.50;
    const seguros = parseFloat(inputs.seguros_adicionales) || 0;

    const montoEnganche = valor * (enganchePct / 100);
    const montoCredito = Math.max(0, valor - montoEnganche);

    const tasaMensual = tasaAnual / 12 / 100;
    const n = anos * 12;

    let mensualidadBase = 0;
    if (montoCredito > 0 && tasaMensual > 0) {
      mensualidadBase = (montoCredito * tasaMensual * Math.pow(1 + tasaMensual, n)) / (Math.pow(1 + tasaMensual, n) - 1);
    } else if (montoCredito > 0) {
      mensualidadBase = montoCredito / n;
    }

    const mensualidadTotal = mensualidadBase + seguros;
    const totalPagadoTotal = mensualidadTotal * n;
    const totalIntereses = (mensualidadBase * n) - montoCredito;

    const steps = [
      {
        description: `Se calcula el Enganche Requerido y el monto neto del Crédito a financiar restándolo del valor de la propiedad.`,
        mathFormula: `Enganche = $${valor.toFixed(2)} \\times ${enganchePct}\\% = $${montoEnganche.toFixed(2)}\\\\Cr\\acute{e}dito = $${valor.toFixed(2)} - $${montoEnganche.toFixed(2)} = $${montoCredito.toFixed(2)}`
      },
      {
        description: `Se convierte la tasa anual fija del ${tasaAnual.toFixed(2)}% a tasa mensual.`,
        mathFormula: `Tasa\\ Mensual = \\frac{${tasaAnual.toFixed(2)}\\%}{12} = ${(tasaMensual * 100).toFixed(4)}\\% = ${tasaMensual.toFixed(6)}`
      },
      {
        description: `Se aplica la fórmula de amortización francesa para calcular la Mensualidad Base Fija (Capital + Interés) sobre un plazo de ${n} mensualidades (${anos} años).`,
        mathFormula: `Mensualidad\\ Base = \\frac{Cr\\acute{e}dito \\times r \\times (1 + r)^n}{(1 + r)^n - 1} = $${mensualidadBase.toFixed(2)}`
      },
      {
        description: `Se suman los seguros mensuales y comisiones obligatorias de administración para obtener la Mensualidad Total Final.`,
        mathFormula: `Mensualidad\\ Total = Mensualidad\\ Base + Seguros = $${mensualidadBase.toFixed(2)} + $${seguros.toFixed(2)} = $${mensualidadTotal.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Monto del Enganche', value: montoEnganche, formatted: `$${montoEnganche.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Neto del Crédito', value: montoCredito, formatted: `$${montoCredito.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Mensualidad Base (Solo Hipoteca)', value: mensualidadBase, formatted: `$${mensualidadBase.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Costo de Seguros Mensuales', value: seguros, formatted: `$${seguros.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total Intereses a Pagar en el Plazo', value: totalIntereses, formatted: `$${totalIntereses.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total de Pagos Sumados (Suma del Plazo)', value: totalPagadoTotal, formatted: `$${totalPagadoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Mensualidad Total Estimada', value: mensualidadTotal, formatted: `$${mensualidadTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El crédito hipotecario permite adquirir un inmueble mediante financiamiento a largo plazo. En México, la mayoría de los bancos y el Infonavit operan bajo el sistema de amortización francés. Bajo este esquema, la mensualidad que pagas es constante durante todo el plazo, pero en los primeros años la mayor parte del dinero se destina a cubrir intereses acumulados y solo una pequeña parte abona al capital real; esto se invierte gradualmente hacia el final del plazo.',
    formula: 'Pago Mensual Base = [ P * r * (1 + r)^n ] / [ (1 + r)^n - 1 ]\nDonde:\nP = Monto de Crédito\nr = Tasa de interés mensual\nn = Número total de pagos (meses)',
    example: 'Para comprar una casa de $1,500,000 con el 20% de enganche ($300,000), pides un crédito de $1,200,000 a 20 años al 10.5% anual:\nTasa mensual = 10.5% / 12 = 0.875%.\nMensualidad base = $1,200,000 * 0.00875 * (1.00875)^240 / [ (1.00875)^240 - 1 ] = $11,985.34 pesos.\nSi sumas $750 de seguros, la mensualidad total final es de $12,735.34 pesos.',
    legislation: 'Código Civil Federal (regula los contratos de garantía hipotecaria) y Ley de Instituciones de Crédito en México.',
    faqs: [
      {
        question: '¿Qué seguros incluye el pago mensual hipotecario?',
        answer: 'Por regulación oficial, cualquier crédito hipotecario bancario o Infonavit debe incluir de forma obligatoria un seguro de vida (que liquida la deuda en caso de fallecimiento del titular) y un seguro de daños materiales del inmueble (para sismos, incendios o desastres).'
      },
      {
        question: '¿Conviene realizar pagos adelantados a capital?',
        answer: 'Sí. Cualquier abono extra directo a capital reduce el saldo insoluto sobre el que se calculan los intereses del mes siguiente. Esto te permite reducir drásticamente los años totales de tu deuda o bajar tu mensualidad fija en el banco, sin penalizaciones.'
      }
    ],
    tips: [
      'Asegúrate de contar con un ahorro extra equivalente al 10% del valor de la casa para cubrir los gastos de escrituración, notariales e impuestos de adquisición, que no se incluyen en el crédito.',
      'Compara el CAT (Costo Anual Total) de diferentes bancos; a veces un banco con tasa nominal ligeramente más alta ofrece seguros más económicos, resultando en un CAT más bajo.',
      'Si necesitas financiamiento de menor monto y a corto/mediano plazo sin garantía de propiedad, te sugerimos usar la [Calculadora de Préstamos Personales](/calculadoras/prestamos/calculadora-prestamo-personal).'
    ],
    errors: [
      'Creer que el enganche es el único gasto inicial. Debes considerar comisiones de apertura, avalúo del inmueble e impuestos de adquisición local.',
      'Contratar un crédito con tasa de interés variable o en Veces Salarios Mínimos (VSM). En periodos inflacionarios tu mensualidad aumentará drásticamente. Elige siempre tasa fija en pesos.'
    ]
  }
};
