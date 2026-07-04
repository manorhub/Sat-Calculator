import { CalculatorConfig } from '../../types/calculator';

export const horasExtraCalculator: CalculatorConfig = {
  id: 'calculo-horas-extra',
  title: 'Calculadora de Horas Extra y Prima Dominical',
  shortDescription: 'Calcula cuánto te corresponde de pago por horas extras (dobles y triples) y la prima dominical de acuerdo con la LFT.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-horas-extra-prima',
  seo: {
    metaTitle: 'Calculadora de Horas Extra y Prima Dominical LFT 2026',
    metaDescription: 'Simula el pago de tus horas extras laboradas y la prima dominical (25% extra). Herramienta alineada con la Ley Federal del Trabajo en México.',
    keywords: ['calculadora horas extra', 'prima dominical lft', 'horas extras dobles', 'horas extras triples', 'ley federal del trabajo horas'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'sueldo_mensual',
      label: 'Sueldo Mensual Bruto ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Ingresa tu sueldo ordinario mensual',
      suffix: 'MXN'
    },
    {
      id: 'horas_extra',
      label: 'Horas Extras Laboradas en la Semana (Horas)',
      type: 'number',
      defaultValue: 5,
      placeholder: 'Ej: 5 horas'
    },
    {
      id: 'domingos_trabajados',
      label: 'Domingos Trabajados en el Período',
      type: 'number',
      defaultValue: 1,
      placeholder: 'Ej: 1'
    }
  ],
  calculate: (inputs) => {
    const sueldo = parseFloat(inputs.sueldo_mensual) || 0;
    const horas = Math.max(0, parseFloat(inputs.horas_extra) || 0);
    const domingos = Math.max(0, parseInt(inputs.domingos_trabajados) || 0);

    const salarioDiario = sueldo / 30;
    const salarioHora = salarioDiario / 8; // Jornada estándar de 8 horas

    // Regla de la LFT (Art. 67-68):
    // Las primeras 9 horas extras a la semana se pagan al doble (100% más).
    // Las que excedan de 9 horas extras a la semana se pagan al triple (200% más).
    const horasDobles = Math.min(9, horas);
    const horasTriples = Math.max(0, horas - 9);

    const pagoDobles = horasDobles * (salarioHora * 2);
    const pagoTriples = horasTriples * (salarioHora * 3);
    const pagoHorasExtraTotal = pagoDobles + pagoTriples;

    // Prima Dominical (Art. 71 LFT):
    // Al menos un 25% adicional sobre el salario diario ordinario
    const pagoPrimaDominical = domingos * (salarioDiario * 0.25);

    const totalExtra = pagoHorasExtraTotal + pagoPrimaDominical;

    const steps = [
      {
        description: `Se calcula el salario diario base y el salario por hora base asumiendo una jornada laboral ordinaria de 8 horas diarias.`,
        mathFormula: `Salario\\ Diario = \\frac{$${sueldo.toFixed(2)}}{30} = $${salarioDiario.toFixed(2)}\\\\Salario\\ por\\ Hora = \\frac{$${salarioDiario.toFixed(2)}}{8} = $${salarioHora.toFixed(2)}`
      },
      {
        description: `Se clasifican las horas extras acumuladas en la semana. Las primeras 9 horas son Dobles y el excedente es Triple.`,
        mathFormula: `Dobles = ${horasDobles}\\ hrs,\\\\Triples = ${horasTriples}\\ hrs`
      },
      {
        description: `Se calcula el importe de las horas extras multiplicando las horas dobles por $${(salarioHora * 2).toFixed(2)} ($salarioHora x 2) y las triples por $${(salarioHora * 3).toFixed(2)} ($salarioHora x 3).`,
        mathFormula: `Pago\\ Dobles = ${horasDobles} \\times ($${salarioHora.toFixed(2)} \\times 2) = $${pagoDobles.toFixed(2)}\\\\Pago\\ Triples = ${horasTriples} \\times ($${salarioHora.toFixed(2)} \\times 3) = $${pagoTriples.toFixed(2)}`
      },
      {
        description: `Se calcula la Prima Dominical aplicando el 25% sobre el salario diario base por cada domingo trabajado (${domingos}).`,
        mathFormula: `Prima\\ Dominical = ${domingos} \\times ($${salarioDiario.toFixed(2)} \\times 0.25) = $${pagoPrimaDominical.toFixed(2)}`
      },
      {
        description: `Se suma el total de horas extras y prima dominical para obtener la remuneración extraordinaria bruta.`,
        mathFormula: `Total\\ Remuneraci\\acute{o}n\\ Extra = $${pagoHorasExtraTotal.toFixed(2)} + $${pagoPrimaDominical.toFixed(2)} = $${totalExtra.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Salario Diario Base', value: salarioDiario, formatted: `$${salarioDiario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Pago Horas Extras Dobles', value: pagoDobles, formatted: `$${pagoDobles.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Pago Horas Extras Triples', value: pagoTriples, formatted: `$${pagoTriples.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Pago Prima Dominical', value: pagoPrimaDominical, formatted: `$${pagoPrimaDominical.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total Extra Bruto a Pagar', value: totalExtra, formatted: `$${totalExtra.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'De acuerdo a la Ley Federal del Trabajo (LFT) de México, las jornadas de trabajo extraordinario tienen límites estrictos y deben retribuirse con montos preferenciales. Adicionalmente, el domingo es el día de descanso obligatorio genérico, por lo que laborar en ese día otorga el derecho a percibir un incentivo del 25% sobre el sueldo diario ordinario (Prima Dominical).',
    formula: 'Fórmulas LFT:\nSalario Diario = Sueldo Mensual / 30\nSalario Hora = Salario Diario / Horas de Jornada\nPago Horas Dobles = Horas Dobles (hasta 9) * Salario Hora * 2\nPago Horas Triples = Horas Triples (exceso de 9) * Salario Hora * 3\nPrima Dominical = Domingos Laborados * Salario Diario * 0.25',
    example: 'Si ganas $15,000 pesos al mes bruto y trabajas 12 horas extras en una semana, además de laborar un domingo:\nSalario diario = $500 pesos\nSalario por hora = $62.50 pesos\nHoras extras: 9 dobles y 3 triples.\nPago dobles = 9 * 125 = $1,125 pesos\nPago triples = 3 * 187.50 = $562.50 pesos\nPrima dominical = 1 * 500 * 0.25 = $125 pesos\nEl pago extraordinario de esa semana será de $1,812.50 pesos brutos.',
    legislation: 'Artículos 67 y 68 de la Ley Federal del Trabajo (relativos a las horas extras y sus límites semanales), y Artículo 71 de la misma ley (concerniente a la prima dominical).',
    faqs: [
      {
        question: '¿Qué es el límite de horas extras permitido por la ley?',
        answer: 'La LFT señala en el Artículo 66 que las horas de trabajo extraordinario no deben exceder de tres horas diarias ni de tres veces en una semana (máximo 9 horas semanales ordinarias dobles).'
      },
      {
        question: '¿Por qué se pagan horas triples?',
        answer: 'Si el trabajador excede de las 9 horas extraordinarias semanales, la LFT obliga al patrón a pagar ese tiempo excedente al triple (300% del sueldo por hora ordinario), como una medida de penalización y protección laboral.'
      },
      {
        question: '¿La prima dominical aplica para trabajadores que descansan entre semana?',
        answer: 'Sí. El Artículo 71 establece que los trabajadores que presten servicio en día domingo tendrán derecho a una prima adicional de un veinticinco por ciento, por lo menos, sobre el salario de los días ordinarios de trabajo, sin importar si tienen otro día de descanso fijado.'
      }
    ],
    tips: [
      'Lleva un control de tus tarjetas de asistencia o bitácora de horarios para sustentar y cotejar el pago correcto en tu recibo de nómina.',
      'Recuerda que las horas extras tienen una parte exenta del pago de impuesto (ISR) para trabajadores con salario mínimo o hasta el 50% exento para quienes ganan más de dicho salario, con límites legales.'
    ],
    errors: [
      'Suponer que todas las horas extras de la semana se pagan al doble sin importar si excedieron el límite legal de 9 horas.',
      'No registrar el salario diario real integrado para el cálculo de horas extras de acuerdo a los contratos individuales.'
    ]
  }
};
