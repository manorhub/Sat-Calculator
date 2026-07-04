import { CalculatorConfig } from '../../types/calculator';

export const ivaCalculator: CalculatorConfig = {
  id: 'calculo-iva',
  title: 'Calculadora de IVA México',
  shortDescription: 'Calcula el IVA (16% u 8%) para agregar o desglosar de un monto total.',
  category: 'Impuestos Federales',
  categorySlug: 'sat',
  slug: 'calculadora-iva',
  seo: {
    metaTitle: 'Calculadora de IVA SAT 2026 - Agregar y Desglosar IVA Gratis',
    metaDescription: 'Calcula el IVA en México de forma rápida. Herramienta para agregar el 16% o el 8% de IVA fronterizo o extraer el IVA de un monto total neto.',
    keywords: ['calculadora iva', 'calcular iva mexico', 'desglosar iva sat', 'iva 16 por ciento', 'iva fronterizo 8 por ciento'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto',
      label: 'Monto ($)',
      type: 'number',
      defaultValue: 1000,
      placeholder: 'Ingresa la cantidad en pesos',
      suffix: 'MXN'
    },
    {
      id: 'tipo_accion',
      label: '¿Qué deseas hacer?',
      type: 'select',
      defaultValue: 'agregar',
      options: [
        { label: 'Agregar IVA (Calcular sobre subtotal)', value: 'agregar' },
        { label: 'Desglosar IVA (Extraer de un total con IVA incluido)', value: 'desglosar' }
      ]
    },
    {
      id: 'tasa',
      label: 'Tasa de IVA',
      type: 'select',
      defaultValue: 16,
      options: [
        { label: 'General (16%)', value: 16 },
        { label: 'Fronteriza (8%)', value: 8 },
        { label: 'Tasa Cero (0%)', value: 0 }
      ]
    }
  ],
  calculate: (inputs, lang) => {
    const monto = parseFloat(inputs.monto) || 0;
    const tipoAccion = inputs.tipo_accion;
    const tasa = parseFloat(inputs.tasa) / 100;
    const isEn = lang === 'en';

    let subtotal = 0;
    let iva = 0;
    let total = 0;
    const steps = [];

    if (tipoAccion === 'agregar') {
      subtotal = monto;
      iva = subtotal * tasa;
      total = subtotal + iva;

      steps.push({
        description: isEn
          ? `The entered amount is taken as the base Subtotal.`
          : `Se toma el monto ingresado como el Subtotal base.`,
        mathFormula: `Subtotal = $${subtotal.toFixed(2)}`
      });
      steps.push({
        description: isEn
          ? `IVA is calculated by multiplying the Subtotal by the tax rate (${(tasa * 100).toFixed(0)}%).`
          : `Se calcula el IVA multiplicando el Subtotal por la tasa de IVA (${(tasa * 100).toFixed(0)}%).`,
        mathFormula: `IVA = $${subtotal.toFixed(2)} \\times ${tasa.toFixed(2)} = $${iva.toFixed(2)}`
      });
      steps.push({
        description: isEn
          ? `Subtotal and IVA are added to obtain the grand Total.`
          : `Se suma el Subtotal y el IVA para obtener el Total general.`,
        mathFormula: `Total = Subtotal + IVA = $${subtotal.toFixed(2)} + $${iva.toFixed(2)} = $${total.toFixed(2)}`
      });
    } else {
      total = monto;
      subtotal = total / (1 + tasa);
      iva = total - subtotal;

      steps.push({
        description: isEn
          ? `The entered amount is taken as the grand Total (IVA included).`
          : `Se toma el monto ingresado como el Total general (IVA incluido).`,
        mathFormula: `Total = $${total.toFixed(2)}`
      });
      steps.push({
        description: isEn
          ? `Subtotal is extracted by dividing the Total by 1 plus the VAT rate (1 + ${tasa.toFixed(2)}).`
          : `Se extrae el Subtotal dividiendo el Total entre 1 más la tasa de IVA (1 + ${tasa.toFixed(2)}).`,
        mathFormula: `Subtotal = \\frac{Total}{1 + Tasa} = \\frac{$${total.toFixed(2)}}{${(1 + tasa).toFixed(2)}} = $${subtotal.toFixed(2)}`
      });
      steps.push({
        description: isEn
          ? `IVA is calculated by subtracting the Subtotal from the Total.`
          : `Se calcula el IVA restando el Subtotal del Total.`,
        mathFormula: `IVA = Total - Subtotal = $${total.toFixed(2)} - $${subtotal.toFixed(2)} = $${iva.toFixed(2)}`
      });
    }

    return {
      results: [
        { label: isEn ? 'Base Subtotal' : 'Subtotal Base', value: subtotal, formatted: `$${subtotal.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: isEn ? 'Calculated IVA' : 'IVA Calculado', value: iva, formatted: `$${iva.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: isEn ? 'Net Total' : 'Total Neto', value: total, formatted: `$${total.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El Impuesto al Valor Agregado (IVA) es un impuesto indirecto sobre el consumo en México. Se aplica a la entrega de bienes, la prestación de servicios, el arrendamiento de bienes y la importación. La tasa general es del 16%, con una tasa reducida del 8% aplicable en la Región Fronteriza Norte y Sur bajo ciertos estímulos fiscales, y tasa del 0% para exportaciones y alimentos básicos.',
    formula: 'Para Agregar IVA: \nTotal = Subtotal * (1 + Tasa)\n\nPara Desglosar IVA: \nSubtotal = Total / (1 + Tasa)\nIVA = Total - Subtotal',
    example: 'Si tienes un servicio que cuesta $1,000 pesos netos y quieres agregar el 16% de IVA, el cálculo es:\nIVA = $1,000 * 0.16 = $160 pesos.\nTotal a cobrar = $1,160 pesos.',
    legislation: 'Ley del Impuesto al Valor Agregado (LIVA), Artículo 1 (Tasa General), Artículo 2-A (Tasa 0%), y Decretos de Estímulos Fiscales de las Fronteras Norte y Sur.',
    faqs: [
      {
        question: '¿Qué es el desglose de IVA?',
        answer: 'Es el proceso matemático y contable de separar el impuesto del monto total pagado, para conocer el subtotal neto del bien o servicio comprado.'
      },
      {
        question: '¿Quiénes aplican la tasa del 8%?',
        answer: 'Las personas físicas y morales que realicen actividades de enajenación de bienes, prestación de servicios independientes o concesión del uso o goce temporal de bienes en los municipios autorizados de la franja fronteriza norte o sur, y que cuenten con la autorización del SAT.'
      }
    ],
    tips: [
      'Al emitir una factura, asegúrate de detallar el subtotal y el IVA por separado, ya que es una obligación de acuerdo al Artículo 29-A del Código Fiscal de la Federación (CFF).',
      'Si eres persona física que presta servicios profesionales a una persona moral, recuerda que además del IVA se te retendrán 2/3 partes del mismo (10.6667%) y el 10% de ISR. Puedes simular esta conversión en la [Calculadora de Conversión de Impuestos (Gross-up)](/calculadoras/sat/calculadora-conversion-impuestos).'
    ],
    errors: [
      'Multiplicar el total directamente por 0.16 para extraer el IVA. Esto es un error muy común. La forma correcta de extraer el IVA de un precio total es dividirlo entre 1.16.',
      'Aplicar la tasa del 8% de manera generalizada sin contar con el registro de padrón de beneficiarios del estímulo fronterizo ante el SAT.'
    ]
  },
  translations: {
    en: {
      title: 'IVA (VAT) Calculator',
      shortDescription: 'Add or extract the Value Added Tax (IVA) at the general 16%, 8% border, or 0% rate.',
      category: 'SAT Taxes',
      inputs: [
        {
          id: 'monto',
          label: 'Amount ($)',
          placeholder: 'Enter amount in pesos'
        },
        {
          id: 'tipo_accion',
          label: 'What do you want to do?',
          options: [
            { label: 'Add IVA (Calculate on top of subtotal)', value: 'agregar' },
            { label: 'Extract IVA (Separate from a total with IVA included)', value: 'desglosar' }
          ]
        },
        {
          id: 'tasa',
          label: 'IVA (VAT) Rate',
          options: [
            { label: 'General (16%)', value: 16 },
            { label: 'Border (8%)', value: 8 },
            { label: 'Zero Rate (0%)', value: 0 }
          ]
        }
      ],
      content: {
        explanation: 'The Value Added Tax (IVA) is an indirect tax on consumption in Mexico. It applies to the delivery of goods, provision of services, leasing of goods, and importation. The general rate is 16%, with a reduced rate of 8% applicable in the North and South Border Regions under certain tax incentives, and a 0% rate for exports and basic foods.',
        formula: 'To Add IVA: \nTotal = Subtotal * (1 + Rate)\n\nTo Extract IVA: \nSubtotal = Total / (1 + Rate)\nIVA = Total - Subtotal',
        example: 'If you have a service that costs $1,000 pesos net and you want to add 16% IVA, the calculation is:\nIVA = $1,000 * 0.16 = $160 pesos.\nTotal to charge = $1,160 pesos.',
        legislation: 'Value Added Tax Law (LIVA), Article 1 (General Rate), Article 2-A (0% Rate), and Northern and Southern Border Tax Incentive Decrees.',
        faqs: [
          {
            question: 'What is the IVA breakdown?',
            answer: 'It is the mathematical and accounting process of separating the tax from the total amount paid, to know the net subtotal of the asset or service purchased.'
          },
          {
            question: 'How does the border rate (8%) work?',
            answer: 'It is a regional tax incentive that reduces the effective VAT rate from 16% to 8% to stimulate commerce in municipalities bordering the US (North) and Guatemala/Belize (South).'
          }
        ],
        tips: [
          'When issuing an invoice, make sure to detail the subtotal and IVA separately, as it is a requirement according to Article 29-A of the Mexican Federal Tax Code (CFF).',
          'If you are an individual rendering professional services to a corporation (persona moral), remember that in addition to IVA, 2/3 of the tax (10.6667%) and 10% of ISR will be withheld. You can simulate this in the [Gross-up Withholding Calculator](/calculadoras/sat/calculadora-conversion-impuestos).'
        ],
        errors: [
          'Multiplying the total directly by 0.16 to extract IVA. This is a very common mistake. The correct way to extract IVA from a total price is to divide it by 1.16.',
          'Assuming that any purchase in the border area automatically has 8% IVA. The seller must be registered in the SAT Border Incentive Registry to apply this rate.'
        ]
      }
    }
  }
};
