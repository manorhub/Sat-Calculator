import { CalculatorConfig } from '../../types/calculator';

export const depreciacionCalculator: CalculatorConfig = {
  id: 'calculo-depreciacion-activos',
  title: 'Calculadora de Depreciación de Activos',
  shortDescription: 'Calcula la depreciación anual, mensual y acumulada de tus activos fijos de acuerdo con los porcentajes de la Ley del ISR del SAT.',
  category: 'Contabilidad',
  categorySlug: 'contabilidad',
  slug: 'calculadora-depreciacion-activos',
  seo: {
    metaTitle: 'Calculadora de Depreciación Fiscal de Activos SAT - Ley del ISR',
    metaDescription: 'Simula la depreciación fiscal de tus activos en línea recta. Conoce las tasas autorizadas por el SAT para cómputo, mobiliario, vehículos y maquinaria.',
    keywords: ['depreciacion de activos fijos', 'depreciacion fiscal sat', 'porcentajes depreciacion lisr', 'monto original de la inversion moi', 'depreciacion linea recta mexico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'moi',
      label: 'Monto Original de la Inversión (MOI) ($)',
      type: 'number',
      defaultValue: 25000,
      placeholder: 'Costo total de adquisición del activo',
      suffix: 'MXN'
    },
    {
      id: 'tipo_activo',
      label: 'Tipo de Activo Fijo (Tasa SAT)',
      type: 'select',
      defaultValue: 'computadoras',
      options: [
        { label: 'Equipo de Cómputo (30% anual)', value: 'computadoras' },
        { label: 'Mobiliario y Equipo de Oficina (10% anual)', value: 'mobiliario' },
        { label: 'Vehículos de Transporte (25% anual)', value: 'vehiculos' },
        { label: 'Maquinaria y Equipo General (10% anual)', value: 'maquinaria' },
        { label: 'Edificios y Construcciones (5% anual)', value: 'construcciones' }
      ]
    },
    {
      id: 'meses_uso',
      label: 'Meses de uso en el año fiscal',
      type: 'number',
      defaultValue: 12,
      placeholder: 'Máximo 12 meses',
      suffix: 'meses'
    }
  ],
  calculate: (inputs) => {
    const moi = parseFloat(inputs.moi) || 0;
    const tipoActivo = inputs.tipo_activo;
    const meses = Math.min(12, Math.max(0, parseInt(inputs.meses_uso) || 0));

    let tasa = 0.10;
    let descripcionActivo = 'Maquinaria y Equipo';

    switch (tipoActivo) {
      case 'computadoras':
        tasa = 0.30;
        descripcionActivo = 'Equipo de Cómputo';
        break;
      case 'mobiliario':
        tasa = 0.10;
        descripcionActivo = 'Mobiliario y Equipo de Oficina';
        break;
      case 'vehiculos':
        tasa = 0.25;
        descripcionActivo = 'Vehículos';
        break;
      case 'maquinaria':
        tasa = 0.10;
        descripcionActivo = 'Maquinaria y Equipo General';
        break;
      case 'construcciones':
        tasa = 0.05;
        descripcionActivo = 'Edificios y Construcciones';
        break;
    }

    const depreciacionAnual = moi * tasa;
    const depreciacionMensual = depreciacionAnual / 12;
    const depreciacionProporcional = depreciacionMensual * meses;
    const valorLibros = Math.max(0, moi - depreciacionProporcional);

    const steps = [
      {
        description: `Se identifica la tasa de depreciación anual del SAT aplicable para ${descripcionActivo}: ${(tasa * 100).toFixed(0)}%.`,
        mathFormula: `Tasa\\ Anual = ${(tasa * 100).toFixed(0)}\\%`
      },
      {
        description: `Se calcula la depreciación anual multiplicando el Monto Original de la Inversión (MOI) por la tasa de depreciación.`,
        mathFormula: `Depreciaci\\acute{o}n\\ Anual = MOI \\times Tasa = $${moi.toFixed(2)} \\times ${tasa.toFixed(2)} = $${depreciacionAnual.toFixed(2)}`
      },
      {
        description: `Se determina la depreciación mensual dividiendo el monto anual entre 12 meses del año.`,
        mathFormula: `Depreciaci\\acute{o}n\\ Mensual = \\frac{Depreciaci\\acute{o}n\\ Anual}{12} = \\frac{$${depreciacionAnual.toFixed(2)}}{12} = $${depreciacionMensual.toFixed(2)}`
      },
      {
        description: `Se calcula la depreciación proporcional para el ejercicio según los meses de uso indicados (${meses} meses).`,
        mathFormula: `Depreciaci\\acute{o}n\\ Proporcional = Depreciaci\\acute{o}n\\ Mensual \\times Meses = $${depreciacionMensual.toFixed(2)} \\times ${meses} = $${depreciacionProporcional.toFixed(2)}`
      },
      {
        description: `Se obtiene el Valor en Libros residual restando la depreciación proporcional acumulada del MOI.`,
        mathFormula: `Valor\\ en\\ Libros = MOI - Depreciaci\\acute{o}n\\ Proporcional = $${moi.toFixed(2)} - $${depreciacionProporcional.toFixed(2)} = $${valorLibros.toFixed(2)}`
      }
    ];

    // Check vehicles deductible limits for warning
    if (tipoActivo === 'vehiculos' && moi > 175000) {
      steps.push({
        description: `⚠️ NOTA CONTABLE: Conforme al Artículo 36 de la Ley del ISR, la deducibilidad de inversiones en automóviles está topada a un máximo de $175,000 MXN para vehículos de combustión, o $250,000 MXN para híbridos/eléctricos. Aunque contablemente deprecias sobre el MOI total, fiscalmente la parte excedente es no deducible.`,
        mathFormula: `L\\acute{i}mite\\ Deducible\\ Veh\\acute{i}culos = $175,000.00\\ MXN`
      });
    }

    return {
      results: [
        { label: 'Depreciación Mensual', value: depreciacionMensual, formatted: `$${depreciacionMensual.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Depreciación Anual Completa', value: depreciacionAnual, formatted: `$${depreciacionAnual.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Depreciación Proporcional del Ejercicio', value: depreciacionProporcional, formatted: `$${depreciacionProporcional.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true },
        { label: 'Valor Residual en Libros (Fin de año)', value: valorLibros, formatted: `$${valorLibros.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` }
      ],
      steps
    };
  },
  content: {
    explanation: 'La depreciación fiscal de activos consiste en recuperar, mediante la aplicación de porcentajes máximos autorizados por la Ley del ISR, el costo de las inversiones en activos fijos adquiridos por las personas físicas y morales en sus actividades empresariales o profesionales. El método adoptado por el SAT en México es el de Línea Recta (depreciación lineal constante).',
    formula: 'Fórmula de Depreciación Lineal:\nDepreciación Anual = MOI * Tasa de Depreciación Anual\nDepreciación Proporcional = (Depreciación Anual / 12) * Meses Utilizados en el Año',
    example: 'Si compras equipo de cómputo (computadora portátil) con un costo de $25,000 pesos (MOI) y lo utilizas los 12 meses del ejercicio fiscal:\nTasa máxima SAT para cómputo = 30% anual\nDepreciación anual = $25,000 * 0.30 = $7,500 pesos.\nDepreciación mensual = $7,500 / 12 = $625 pesos mensuales.',
    legislation: 'Artículos 33, 34, 35 y 36 de la Ley del Impuesto sobre la Renta (LISR) en México, que establecen las reglas de amortización de activos intangibles y depreciación de activos fijos tangibles.',
    faqs: [
      {
        question: '¿Qué es el Monto Original de la Inversión (MOI)?',
        answer: 'El MOI comprende el precio del bien, los impuestos pagados por su adquisición o importación (excepto el IVA acreditable), los derechos, fletes, acarreos, seguros y comisiones pagadas con motivo de la compra.'
      },
      {
        question: '¿A partir de cuándo se empieza a depreciar un activo?',
        answer: 'De acuerdo al Artículo 31 de la Ley del ISR, el contribuyente puede elegir comenzar a depreciar a partir del ejercicio en que se inicie la utilización del bien, o bien, a partir del ejercicio siguiente.'
      },
      {
        question: '¿Qué pasa si vendo el activo antes de terminar su vida útil fiscal?',
        answer: 'Debes calcular la utilidad o pérdida en venta de activo fijo, restando del valor de venta el saldo pendiente de depreciar (valor en libros) actualizado por inflación. La ganancia generada acumula para impuestos.'
      }
    ],
    tips: [
      'Recuerda actualizar los montos de la depreciación por efectos de inflación. La ley permite multiplicar el importe de la depreciación por el factor de actualización del período desde el mes de adquisición hasta el último mes de la primera mitad del ejercicio de uso.',
      'Lleva un control de inventarios físico relacionado con el registro de depreciación para evitar sanciones en auditorías del SAT.'
    ],
    errors: [
      'Deducir el 100% de la compra de una computadora en el mes de adquisición. Fiscalmente debe depreciarse a la tasa del 30% anual salvo que seas RESICO de Personas Morales y califiques para deducción inmediata temporal.',
      'Ignorar los límites de deducibilidad en vehículos. Comprar un auto de $500,000 pesos de combustión interna no te permite deducir vía depreciación el costo total, sino únicamente hasta los $175,000 pesos de tope de ley.'
    ]
  }
};
