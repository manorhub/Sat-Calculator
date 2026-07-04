import { CalculatorConfig } from '../../types/calculator';

const UMA_HISTORIC_RATES: Record<number, { diario: number, mensual: number, anual: number }> = {
  2024: { diario: 108.57, mensual: 3300.53, anual: 39606.36 },
  2023: { diario: 103.74, mensual: 3153.70, anual: 37844.40 },
  2022: { diario: 96.22, mensual: 2925.09, anual: 35101.08 }
};

export const umaCalculator: CalculatorConfig = {
  id: 'calculo-uma',
  title: 'Conversor de UMA a Pesos',
  shortDescription: 'Convierte unidades de UMA (Unidad de Medida y Actualización) a pesos mexicanos para el cálculo de multas, créditos e impuestos.',
  category: 'Conversiones',
  categorySlug: 'conversiones',
  slug: 'calculadora-conversor-uma',
  seo: {
    metaTitle: 'Calculadora de UMA a Pesos 2026 - Conversor Histórico Oficial',
    metaDescription: 'Convierte de UMA (Unidad de Medida y Actualización) a pesos mexicanos. Histórico oficial del INEGI de valores diarios, mensuales y anuales.',
    keywords: ['conversor uma a pesos', 'valor de la uma 2024', 'equivalencia uma sat', 'unidad de medida y actualizacion', 'calculo uma pesos'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'unidades_uma',
      label: 'Cantidad de UMA a convertir',
      type: 'number',
      defaultValue: 10,
      placeholder: 'Ej: 10 UMAS'
    },
    {
      id: 'ano_uma',
      label: 'Año fiscal',
      type: 'select',
      defaultValue: 2024,
      options: [
        { label: '2024', value: 2024 },
        { label: '2023', value: 2023 },
        { label: '2022', value: 2022 }
      ]
    },
    {
      id: 'frecuencia_uma',
      label: 'Tipo de Valor UMA',
      type: 'select',
      defaultValue: 'diario',
      options: [
        { label: 'Diario', value: 'diario' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Anual', value: 'anual' }
      ]
    }
  ],
  calculate: (inputs) => {
    const unidades = parseFloat(inputs.unidades_uma) || 0;
    const ano = parseInt(inputs.ano_uma) || 2024;
    const frecuencia = inputs.frecuencia_uma;

    const rates = UMA_HISTORIC_RATES[ano] || UMA_HISTORIC_RATES[2024];
    const rateValue = rates[frecuencia as 'diario' | 'mensual' | 'anual'] || rates.diario;

    const pesosEquivalentes = unidades * rateValue;

    const steps = [
      {
        description: `Se identifica el valor de la UMA para el año ${ano} bajo el tipo de valor "${frecuencia}". El valor oficial publicado por el INEGI es de $${rateValue.toFixed(2)} pesos.`,
      },
      {
        description: `Se multiplica la cantidad de UMAS ingresadas (${unidades}) por el valor unitario en pesos correspondiente.`,
        mathFormula: `Pesos\\ Equivalentes = UMAS \\times Valor\\ UMA = ${unidades} \\times $${rateValue.toFixed(2)} = $${pesosEquivalentes.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Valor de 1 UMA Oficial', value: rateValue, formatted: `$${rateValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'UMA Diario del año', value: rates.diario, formatted: `$${rates.diario.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'UMA Mensual del año', value: rates.mensual, formatted: `$${rates.mensual.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'UMA Anual del año', value: rates.anual, formatted: `$${rates.anual.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'Pesos Mexicanos Equivalentes', value: pesosEquivalentes, formatted: `$${pesosEquivalentes.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'La UMA (Unidad de Medida y Actualización) es la referencia económica en pesos creada en 2016 para sustituir el esquema de "Veces Salario Mínimo" (VSM). Se utiliza para desvincular los aumentos del salario mínimo de las tarifas de multas, créditos de vivienda (Infonavit), impuestos federales y aportaciones sociales (IMSS). El INEGI actualiza y publica el valor de la UMA anualmente en el Diario Oficial de la Federación, entrando en vigor cada 1 de febrero.',
    formula: 'Pesos Equivalentes = Unidades de UMA * Valor de UMA (Diario, Mensual o Anual)',
    example: 'Si tienes una multa de tránsito federal cuya penalización es de 10 UMAS diarios en el año 2024:\nValor de 1 UMA Diario 2024 = $108.57 pesos.\nEquivalencia en pesos = 10 * $108.57 = $1,085.70 pesos.',
    legislation: 'Artículo 26, Apartado B, párrafo sexto de la Constitución Política de los Estados Unidos Mexicanos y Ley para Determinar el Valor de la Unidad de Medida y Actualización.',
    faqs: [
      {
        question: '¿Por qué se creó la UMA?',
        answer: 'Se creó para desindexar el salario mínimo. Anteriormente, si aumentaba el salario mínimo, aumentaban automáticamente las multas y el saldo de los créditos hipotecarios de Infonavit en VSM, lo que generaba deudas impagables e inflación. La UMA permitió que el salario mínimo aumentara de forma independiente para beneficio de los trabajadores.'
      },
      {
        question: '¿Cuándo cambia el valor de la UMA?',
        answer: 'El valor de la UMA es anunciado por el INEGI en los primeros días del mes de enero de cada año de acuerdo a la inflación, pero entra en vigor de forma oficial a partir del 1 de febrero del mismo año.'
      }
    ],
    tips: [
      'Al calcular exenciones fiscales en nómina (como aguinaldo o prima vacacional), recuerda que el SAT mide los topes exentos siempre en valores UMA, no en salarios mínimos.',
      'Si tienes un crédito de vivienda Infonavit antiguo cotizado en Veces Salario Mínimo (VSM), verifica si ya fue reestructurado para ajustarse al incremento menor de la UMA o solicítalo en la plataforma de Infonavit.'
    ],
    errors: [
      'Confundir el valor de la UMA con el Salario Mínimo. A partir de 2016 son valores totalmente distintos. El Salario Mínimo General en 2024 es de $248.93 pesos diarios, mientras que la UMA es de $108.57 pesos diarios.',
      'Calcular multas o recargos usando el valor de la UMA mensual multiplicado por días sueltos; las multas se cotizan usualmente sobre el valor de la UMA diario.'
    ]
  }
};
