import { CalculatorConfig } from '../../types/calculator';

export const conversionImpuestosCalculator: CalculatorConfig = {
  id: 'calculo-conversion-impuestos',
  title: 'Calculadora de Conversión de Impuestos (Gross-up)',
  shortDescription: 'Calcula el Subtotal bruto y los impuestos correspondientes que debes facturar para recibir una cantidad neta exacta.',
  category: 'Impuestos Federales',
  categorySlug: 'sat',
  slug: 'calculadora-conversion-impuestos',
  seo: {
    metaTitle: 'Calculadora de Gross-up y Conversión de Impuestos SAT 2026',
    metaDescription: 'Calcula el monto bruto de facturación requerido para obtener un saldo neto deseado después de la retención de IVA e ISR en México.',
    keywords: ['calculadora gross up', 'conversion de impuestos sat', 'calcular bruto de honorarios', 'retencion de isr e iva mexico', 'monto neto a facturar'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'neto_deseado',
      label: 'Monto Neto que deseas recibir ($)',
      type: 'number',
      defaultValue: 10000,
      placeholder: 'Ingresa la cantidad líquida deseada',
      suffix: 'MXN'
    },
    {
      id: 'tipo_actividad',
      label: 'Régimen y Actividad',
      type: 'select',
      defaultValue: 'honorarios',
      options: [
        { label: 'Servicios Profesionales / Honorarios (10% ISR / 10.6667% IVA)', value: 'honorarios' },
        { label: 'Arrendamiento de Inmuebles (10% ISR / 10.6667% IVA)', value: 'arrendamiento' },
        { label: 'RESICO Simplificado (1.25% ISR / 10.6667% IVA)', value: 'resico' }
      ]
    },
    {
      id: 'cliente_moral',
      label: '¿Tu cliente es una Persona Moral?',
      type: 'boolean',
      defaultValue: true
    }
  ],
  calculate: (inputs) => {
    const neto = parseFloat(inputs.neto_deseado) || 0;
    const tipoActividad = inputs.tipo_actividad;
    const esClienteMoral = inputs.cliente_moral;

    const tasaIva = 0.16;
    let tasaRetIsr = 0;
    let tasaRetIva = 0;

    if (esClienteMoral) {
      tasaRetIva = 0.106667; // 2/3 partes de la tasa del 16% de IVA

      if (tipoActividad === 'honorarios') {
        tasaRetIsr = 0.10; // 10% de ISR
      } else if (tipoActividad === 'arrendamiento') {
        tasaRetIsr = 0.10; // 10% de ISR
      } else if (tipoActividad === 'resico') {
        tasaRetIsr = 0.0125; // 1.25% de ISR para RESICO PF facturando a PM
      }
    }

    // Fórmula Gross-up:
    // Neto = Bruto + (Bruto * TasaIva) - (Bruto * TasaRetIsr) - (Bruto * TasaRetIva)
    // Neto = Bruto * (1 + TasaIva - TasaRetIsr - TasaRetIva)
    // Bruto = Neto / (1 + TasaIva - TasaRetIsr - TasaRetIva)
    const divisor = 1 + tasaIva - tasaRetIsr - tasaRetIva;
    const subtotalBruto = neto > 0 ? neto / divisor : 0;

    const ivaTrasladado = subtotalBruto * tasaIva;
    const retIsr = subtotalBruto * tasaRetIsr;
    const retIva = subtotalBruto * tasaRetIva;

    const totalFactura = subtotalBruto + ivaTrasladado - retIsr - retIva;

    const steps = [
      {
        description: `Se determinan las tasas impositivas y de retención aplicables para la transacción.`,
        mathFormula: `IVA = 16\\%\\\\Retenci\\acute{o}n\\ ISR = ${(tasaRetIsr * 100).toFixed(2)}\\%\\\\Retenci\\acute{o}n\\ IVA = ${(tasaRetIva * 100).toFixed(4)}\\%`
      },
      {
        description: `Se aplica la fórmula de gross-up fiscal para extraer el Subtotal bruto requerido a partir del neto.`,
        mathFormula: `Subtotal = \\frac{Neto}{1 + Tasa_{IVA} - Ret_{ISR} - Ret_{IVA}} = \\frac{$${neto.toFixed(2)}}{${divisor.toFixed(6)}} = $${subtotalBruto.toFixed(2)}`
      },
      {
        description: `Se calculan los importes correspondientes de IVA trasladado y las retenciones requeridas multiplicando el Subtotal por cada tasa.`,
        mathFormula: `IVA\\ (${(tasaIva * 100).toFixed(0)}\\%) = $${ivaTrasladado.toFixed(2)}\\\\Ret.\\ ISR = $${retIsr.toFixed(2)}\\\\Ret.\\ IVA = $${retIva.toFixed(2)}`
      },
      {
        description: `Se verifica la suma para obtener el pago neto definitivo.`,
        mathFormula: `Neto = Subtotal + IVA - Ret.\\ ISR - Ret.\\ IVA = $${totalFactura.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Subtotal Base (Bruto)', value: subtotalBruto, formatted: `$${subtotalBruto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'IVA Trasladado (16%)', value: ivaTrasladado, formatted: `$${ivaTrasladado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de ISR', value: retIsr, formatted: `$${retIsr.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de IVA (2/3)', value: retIva, formatted: `$${retIva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total Neto Recibido', value: totalFactura, formatted: `$${totalFactura.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El proceso de "Gross-up" consiste en calcular hacia atrás el monto base (Subtotal bruto) de un recibo o factura a partir del valor neto o líquido que el prestador del servicio desea cobrar en realidad. En México, cuando una persona física presta servicios a una persona moral, esta última está obligada a retener por ley una proporción de ISR e IVA, disminuyendo el flujo neto que el trabajador independiente recibe.',
    formula: 'Fórmula de Conversión Inversa (Gross-up):\nSubtotal = Neto / (1 + Tasa_IVA - Retención_ISR - Retención_IVA)\n\nDonde:\nNeto = Cantidad final deseada\nTasa_IVA = Tasa aplicable (0.16)\nRetención_ISR = Tasa de retención de ISR (0.10 o 0.0125)\nRetención_IVA = Tasa de retención de IVA (0.106667)',
    example: 'Si eres diseñador independiente, trabajas para una empresa (Persona Moral) y quieres cobrar una cantidad libre de $10,000 pesos netos por concepto de honorarios:\nSubtotal a facturar = 10,000 / 0.953333 = $10,489.51 pesos brutos.\nEn tu factura desglosarás:\nSubtotal: $10,489.51\n+ IVA (16%): $1,678.32\n- Retención de ISR (10%): $1,048.95\n- Retención de IVA (10.67%): $1,118.88\nNeto a pagar por la empresa = $10,000.00 pesos.',
    legislation: 'Ley del Impuesto sobre la Renta (LISR), Artículo 106 (Retención del 10% a servicios profesionales) y Artículo 113-J (Retención del 1.25% en RESICO); y Ley del Impuesto al Valor Agregado (LIVA), Artículo 1-A (Retención de 2/3 partes de IVA trasladado).',
    faqs: [
      {
        question: '¿Por qué no hay retenciones si le facturo a otra Persona Física?',
        answer: 'La legislación mexicana únicamente establece la obligación de retener impuestos cuando la operación comercial se efectúa entre un emisor Persona Física y un receptor Persona Moral. Si el cliente es Persona Física, se factura de forma general sin retenciones.'
      },
      {
        question: '¿Qué retención de ISR aplica para RESICO?',
        answer: 'De acuerdo con el Artículo 113-J de la Ley del ISR, cuando las personas físicas inscritas en el RESICO prestan servicios profesionales o arrendamiento a personas morales, estas últimas retendrán el 1.25% sobre el subtotal sin IVA.'
      },
      {
        question: '¿La retención de IVA siempre es de las 2/3 partes?',
        answer: 'Para servicios profesionales y arrendamiento la retención reglamentaria es del 10.6667% (2/3 partes del 16%). Sin embargo, para fletes terrestres la retención de IVA es del 4%, de acuerdo al Reglamento de la Ley del IVA.'
      }
    ],
    tips: [
      'Al enviar presupuestos a personas morales, aclara siempre si el precio es bruto o neto para evitar malentendidos contables al momento del pago.',
      'Usa las calculadoras de conversión para emitir pre-facturas y validar que el total del CFDI coincida con tus contratos.'
    ],
    errors: [
      'Sumar simplemente el 10% y el 10.67% al monto neto deseado para obtener el bruto. Esto dará una cantidad incorrecta debido a la traslación e impacto cruzado del IVA en la base gravable.',
      'Omitir las retenciones al emitir un CFDI para una persona moral. Esto puede provocar que el SAT rechace tu factura o te exija declarar impuestos adicionales.'
    ]
  }
};
