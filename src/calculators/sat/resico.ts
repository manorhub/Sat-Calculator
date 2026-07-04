import { CalculatorConfig } from '../../types/calculator';

// Monthly RESICO brackets for Personas Físicas
const RESICO_MONTHLY_BRACKETS = [
  { limit: 25000, tasa: 1.00 },
  { limit: 50000, tasa: 1.10 },
  { limit: 83333.33, tasa: 1.50 },
  { limit: 208333.33, tasa: 2.00 },
  { limit: 291666.67, tasa: 2.50 }
];

export const resicoCalculator: CalculatorConfig = {
  id: 'calculo-resico-pf',
  title: 'Calculadora de RESICO Persona Física',
  shortDescription: 'Calcula el ISR simplificado para personas físicas bajo el Régimen Simplificado de Confianza (RESICO).',
  category: 'RESICO',
  categorySlug: 'resico',
  slug: 'calculadora-resico-pf',
  seo: {
    metaTitle: 'Calculadora RESICO 2026 - Personas Físicas México',
    metaDescription: 'Calcula el ISR a pagar en RESICO para Personas Físicas. Ingresa tus ingresos mensuales y calcula las tasas del 1% al 2.5% y retenciones del 1.25%.',
    keywords: ['calculadora resico', 'resico personas fisicas', 'isr resico sat', 'retencion resico 1.25', 'impuestos resico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'ingresos',
      label: 'Ingresos Brutos Mensuales ($)',
      type: 'number',
      defaultValue: 30000,
      placeholder: 'Ingresa tus ingresos totales facturados en el mes',
      suffix: 'MXN'
    },
    {
      id: 'factura_persona_moral',
      label: '¿Facturas a Personas Morales (Empresas)?',
      type: 'boolean',
      defaultValue: false
    },
    {
      id: 'ingresos_persona_moral',
      label: 'Monto facturado a Personas Morales ($)',
      type: 'number',
      defaultValue: 10000,
      placeholder: 'Monto facturado a empresas sujeto a retención',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const ingresos = parseFloat(inputs.ingresos) || 0;
    const facturaPM = inputs.factura_persona_moral === true;
    const ingresosPM = facturaPM ? Math.min(ingresos, parseFloat(inputs.ingresos_persona_moral) || 0) : 0;

    // Find the RESICO rate based on monthly income
    let tasa = 2.50;
    for (let i = 0; i < RESICO_MONTHLY_BRACKETS.length; i++) {
      if (ingresos <= RESICO_MONTHLY_BRACKETS[i].limit) {
        tasa = RESICO_MONTHLY_BRACKETS[i].tasa;
        break;
      }
    }

    // Calculate gross ISR
    const isrBruto = ingresos * (tasa / 100);

    // Calculate PM retention (1.25% of ingresosPM)
    const retencion = ingresosPM * 0.0125;

    // Calculate net ISR to pay
    const isrNetoAPagar = Math.max(0, isrBruto - retencion);

    const steps = [
      {
        description: `Se determina la tasa de ISR aplicable en RESICO según la tabla mensual oficial basada en los ingresos brutos ($${ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}). La tasa correspondiente es del ${tasa.toFixed(2)}%.`,
        mathFormula: `Tasa\\ Aplicable = ${tasa.toFixed(2)}\\%`
      },
      {
        description: `Se calcula el ISR Bruto multiplicando los ingresos totales por la tasa asignada.`,
        mathFormula: `ISR\\ Bruto = Ingresos \\times Tasa = $${ingresos.toFixed(2)} \\times ${(tasa / 100).toFixed(4)} = $${isrBruto.toFixed(2)}`
      }
    ];

    if (facturaPM && ingresosPM > 0) {
      steps.push({
        description: `Dado que facturas a Personas Morales, estas retienen por ley el 1.25% de los ingresos facturados a ellas ($${ingresosPM.toFixed(2)}).`,
        mathFormula: `Retenci\\acute{o}n = Monto\\ PM \\times 1.25\\% = $${ingresosPM.toFixed(2)} \\times 0.0125 = $${retencion.toFixed(2)}`
      });
      steps.push({
        description: `Se resta el impuesto retenido por las empresas del ISR Bruto para obtener el ISR Neto a pagar en la declaración mensual.`,
        mathFormula: `ISR\\ Neto = ISR\\ Bruto - Retenci\\acute{o}n = $${isrBruto.toFixed(2)} - $${retencion.toFixed(2)} = $${isrNetoAPagar.toFixed(2)}`
      });
    }

    return {
      results: [
        { label: 'Tasa Aplicada', value: tasa, formatted: `${tasa.toFixed(2)} %` },
        { label: 'ISR Bruto Determinado', value: isrBruto, formatted: `$${isrBruto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de Personas Morales (1.25%)', value: retencion, formatted: `$${retencion.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'ISR Neto a Pagar Mensual', value: isrNetoAPagar, formatted: `$${isrNetoAPagar.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El Régimen Simplificado de Confianza (RESICO) es un esquema fiscal en México vigente desde 2022 que busca simplificar el pago de impuestos para personas físicas con ingresos de hasta 3.5 millones de pesos al año. Su principal ventaja es que las tasas de ISR se reducen drásticamente (del 1% al 2.5%), pero a cambio, no se permite deducir ningún gasto para el cálculo del ISR.',
    formula: 'ISR Bruto = Ingresos Totales Sin Deducciones * Tasa RESICO\n\nISR Neto a Pagar = ISR Bruto - Retención de Persona Moral (1.25%)',
    example: 'Si tienes ingresos mensuales de $30,000 pesos, tu tasa aplicable de RESICO es del 1.10%.\nISR Bruto = $30,000 * 1.10% = $330 pesos.\nSi de esos $30,000 facturaste $10,000 a una Persona Moral, te retuvieron:\nRetención = $10,000 * 1.25% = $125 pesos.\nISR Neto a Pagar en tu declaración mensual = $330 - $125 = $205 pesos.',
    legislation: 'Ley del Impuesto sobre la Renta (LISR), Título IV, Capítulo IV (Del Régimen Simplificado de Confianza para Personas Físicas), Artículos 113-E al 113-J.',
    faqs: [
      {
        question: '¿Puedo deducir gastos en RESICO?',
        answer: 'No. Para el cálculo del ISR en RESICO no se permite aplicar deducciones autorizadas de ningún tipo. Sin embargo, para efectos del IVA sí es útil mantener las deducciones, ya que puedes acreditar el IVA de tus gastos indispensables.'
      },
      {
        question: '¿Qué pasa si excedo los 3.5 millones de pesos al año?',
        answer: 'Si en cualquier momento del año tus ingresos acumulables superan los 3.5 millones de pesos, deberás abandonar el RESICO a partir del mes siguiente y tributar en el Régimen de Actividad Empresarial o Arrendamiento general.'
      }
    ],
    tips: [
      'Recuerda presentar tus pagos provisionales a más tardar el día 17 del mes siguiente al que corresponda el pago.',
      'Para permanecer en RESICO, debes mantener activado tu Buzón Tributario, contar con e.firma (firma electrónica) activa y presentar tus declaraciones anuales a tiempo.'
    ],
    errors: [
      'Creer que RESICO te exime del pago de IVA. El estímulo fiscal de tasas bajas aplica exclusivamente para el ISR; el IVA sigue cobrándose y pagándose a la tasa general del 16% o la que corresponda.',
      'Omitir la retención del 1.25% al facturar a personas morales. Si no la incluyes en la factura, el SAT te requerirá corregir el comprobante.'
    ]
  }
};
