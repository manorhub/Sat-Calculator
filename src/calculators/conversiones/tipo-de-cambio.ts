import { CalculatorConfig } from '../../types/calculator';

export const tipoCambioCalculator: CalculatorConfig = {
  id: 'calculo-tipo-de-cambio',
  title: 'Convertidor de Tipo de Cambio',
  shortDescription: 'Convierte montos entre dólares estadounidenses (USD) y pesos mexicanos (MXN) usando la tasa de cambio actual.',
  category: 'Tipo de Cambio',
  categorySlug: 'tipo-de-cambio',
  slug: 'calculadora-tipo-de-cambio',
  seo: {
    metaTitle: 'Calculadora de Tipo de Cambio 2026 - Convertidor USD a MXN',
    metaDescription: 'Convierte dólares estadounidenses a pesos mexicanos de forma rápida y sencilla. Conoce las reglas del SAT y el Banco de México para transacciones fiscales.',
    keywords: ['tipo de cambio sat', 'convertir dolares a pesos', 'usd to mxn calculator', 'dolar oficial mexico', 'dolar banxico fix'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto',
      label: 'Monto a Convertir',
      type: 'number',
      defaultValue: 100,
      placeholder: 'Ingresa la cantidad'
    },
    {
      id: 'direccion',
      label: 'Dirección de Conversión',
      type: 'select',
      defaultValue: 'usd_to_mxn',
      options: [
        { label: 'Dólares (USD) a Pesos (MXN)', value: 'usd_to_mxn' },
        { label: 'Pesos (MXN) a Dólares (USD)', value: 'mxn_to_usd' }
      ]
    },
    {
      id: 'tipo_cambio',
      label: 'Tipo de Cambio (MXN por USD)',
      type: 'number',
      defaultValue: 18.50,
      placeholder: 'Ej: 18.50'
    }
  ],
  calculate: (inputs) => {
    const monto = parseFloat(inputs.monto) || 0;
    const direccion = inputs.direccion;
    const tipoCambio = parseFloat(inputs.tipo_cambio) || 18.50;

    let resultado = 0;
    const steps = [];

    if (direccion === 'usd_to_mxn') {
      resultado = monto * tipoCambio;
      steps.push({
        description: `Se multiplica la cantidad en dólares (USD) por la tasa de cambio especificada para obtener el equivalente en pesos mexicanos (MXN).`,
        mathFormula: `MXN = USD \\times Tipo\\ de\\ Cambio = $${monto.toFixed(2)} \\times ${tipoCambio.toFixed(4)} = $${resultado.toFixed(2)}`
      });
    } else {
      resultado = monto / tipoCambio;
      steps.push({
        description: `Se divide la cantidad en pesos mexicanos (MXN) entre la tasa de cambio especificada para obtener el equivalente en dólares (USD).`,
        mathFormula: `USD = \\frac{MXN}{Tipo\\ de\\ Cambio} = \\frac{$${monto.toFixed(2)}}{${tipoCambio.toFixed(4)}} = $${resultado.toFixed(2)}`
      });
    }

    return {
      results: [
        {
          label: direccion === 'usd_to_mxn' ? 'Monto en USD' : 'Monto en MXN',
          value: monto,
          formatted: direccion === 'usd_to_mxn' ? `$${monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`
        },
        {
          label: 'Tasa de Cambio Utilizada',
          value: tipoCambio,
          formatted: `$${tipoCambio.toLocaleString('es-MX', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} MXN por USD`
        },
        {
          label: direccion === 'usd_to_mxn' ? 'Resultado Neto en MXN' : 'Resultado Neto en USD',
          value: resultado,
          formatted: direccion === 'usd_to_mxn' ? `$${resultado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` : `$${resultado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
          isMain: true
        }
      ],
      steps
    };
  },
  content: {
    explanation: 'El tipo de cambio indica el valor de una divisa extranjera con respecto a la moneda local. En México, para fines de pago de impuestos y contribuciones oficiales, la tasa aplicable es el Tipo de Cambio FIX que publica el Banco de México (Banxico) en el Diario Oficial de la Federación (DOF) el día hábil bancario inmediato anterior a aquél en que se hagan los pagos.',
    formula: 'Conversión de USD a MXN:\nMXN = USD * Tipo de Cambio\n\nConversión de MXN a USD:\nUSD = MXN / Tipo de Cambio',
    example: 'Si deseas facturar o registrar un ingreso de $500 dólares estadounidenses (USD) y la tasa de cambio oficial del SAT para ese día es de 18.50 pesos por dólar:\nMXN = 500 * 18.50 = $9,250 pesos mexicanos (MXN).',
    legislation: 'Artículo 20 del Código Fiscal de la Federación (CFF), que regula la conversión de contribuciones y operaciones en moneda extranjera para efectos fiscales en México.',
    faqs: [
      {
        question: '¿Qué tipo de cambio se debe usar para declarar impuestos en el SAT?',
        answer: 'De acuerdo al CFF Art. 20, se debe utilizar el tipo de cambio oficial publicado por el Banco de México en el Diario Oficial de la Federación el día hábil inmediato anterior al día en que se cause o pague la contribución.'
      },
      {
        question: '¿Qué es el Dólar FIX y en qué se diferencia del dólar interbancario?',
        answer: 'El Dólar FIX es el tipo de cambio determinado por el Banco de México en base a un promedio de cotizaciones del mercado de cambios al mayoreo. El interbancario es la cotización en tiempo real entre instituciones financieras.'
      },
      {
        question: '¿Las facturas de exportación se deben emitir con tipo de cambio fiscal?',
        answer: 'Sí, el CFDI de ingresos que involucre transacciones internacionales debe indicar la moneda en USD e incluir el tipo de cambio de la fecha de la operación para efectos fiscales.'
      }
    ],
    tips: [
      'Al realizar tu declaración mensual, consulta el tipo de cambio histórico en la página oficial del Banco de México para asegurar que tus totales en pesos coincidan perfectamente con la legislación fiscal.',
      'Si tienes una cuenta bancaria en dólares, los intereses y las ganancias cambiarias también están sujetas a cálculo de ISR en tu declaración anual.'
    ],
    errors: [
      'Utilizar el tipo de cambio comercial (el de las casas de cambio de los aeropuertos o ventanilla bancaria estándar) para tus declaraciones fiscales ante el SAT.',
      'Calcular el tipo de cambio a la inversa (multiplicar cuando corresponde dividir) para compras de importación.'
    ]
  }
};
