import { CalculatorConfig } from '../../types/calculator';

export const breakEvenCalculator: CalculatorConfig = {
  id: 'calculo-punto-equilibrio',
  title: 'Calculadora de Punto de Equilibrio',
  shortDescription: 'Calcula cuántas unidades o cuánto dinero necesitas vender en tu negocio para cubrir todos tus costos fijos y variables sin pérdidas.',
  category: 'Negocios',
  categorySlug: 'negocios',
  slug: 'calculadora-punto-equilibrio',
  seo: {
    metaTitle: 'Calculadora de Punto de Equilibrio 2026 - Emprendimiento México',
    metaDescription: 'Determina las ventas mínimas necesarias para cubrir los costos de tu empresa. Calcula unidades a vender y valor monetario del break-even.',
    keywords: ['calculadora punto de equilibrio', 'costos fijos y variables', 'margen de contribucion', 'finanzas emprendimiento', 'break even negocios'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'costos_fijos',
      label: 'Costos Fijos Totales Mensuales ($)',
      type: 'number',
      defaultValue: 20000,
      placeholder: 'Ej: Renta, nóminas fijas, servicios, administración',
      suffix: 'MXN'
    },
    {
      id: 'precio_unidad',
      label: 'Precio de Venta por Unidad ($)',
      type: 'number',
      defaultValue: 150,
      placeholder: 'Precio que cobras al cliente por cada artículo o servicio',
      suffix: 'MXN'
    },
    {
      id: 'costo_variable_unidad',
      label: 'Costo Variable por Unidad ($)',
      type: 'number',
      defaultValue: 70,
      placeholder: 'Materia prima, empaque, comisión de pago por cada unidad vendida',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const fijos = parseFloat(inputs.costos_fijos) || 0;
    const precio = parseFloat(inputs.precio_unidad) || 0;
    const variable = parseFloat(inputs.costo_variable_unidad) || 0;

    const margenUnitario = precio - variable;
    const margenPorcentaje = precio > 0 ? (margenUnitario / precio) : 0;

    let unidadesEquilibrio = 0;
    let dineroEquilibrio = 0;

    if (margenUnitario > 0) {
      unidadesEquilibrio = fijos / margenUnitario;
      dineroEquilibrio = unidadesEquilibrio * precio;
    }

    const steps = [
      {
        description: `Se calcula el Margen de Contribución Unitario restando el costo variable unitario del precio de venta.`,
        mathFormula: `Margen\\ Unitario = Precio - Costo\\ Variable = $${precio.toFixed(2)} - $${variable.toFixed(2)} = $${margenUnitario.toFixed(2)}`
      },
      {
        description: `Se calcula la razón del margen de contribución (margen en porcentaje respecto al precio).`,
        mathFormula: `Raz\\acute{o}n\\ de\\ Margen = \\frac{Margen\\ Unitario}{Precio} = \\frac{$${margenUnitario.toFixed(2)}}{$${precio.toFixed(2)}} = ${(margenPorcentaje * 100).toFixed(2)}\\%`
      },
      {
        description: `Se dividen los Costos Fijos Totales entre el Margen Unitario para saber cuántas unidades físicas debes vender en el mes para quedar en ceros.`,
        mathFormula: `Unidades\\ de\\ Equilibrio = \\frac{Costos\\ Fijos}{Margen\\ Unitario} = \\frac{$${fijos.toFixed(2)}}{$${margenUnitario.toFixed(2)}} = ${unidadesEquilibrio.toFixed(1)}\\ unidades`
      },
      {
        description: `Se multiplica el número de unidades por el precio de venta para obtener el volumen de ventas monetarias requerido.`,
        mathFormula: `Ventas\\ de\\ Equilibrio = Unidades \\times Precio = ${unidadesEquilibrio.toFixed(2)} \\times $${precio.toFixed(2)} = $${dineroEquilibrio.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Margen de Contribución por Unidad', value: margenUnitario, formatted: `$${margenUnitario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Margen de Contribución (%)', value: margenPorcentaje * 100, formatted: `${(margenPorcentaje * 100).toFixed(2)} %` },
        { label: 'Unidades Físicas a Vender en el Mes', value: unidadesEquilibrio, formatted: `${Math.ceil(unidadesEquilibrio)} unidades` },
        { label: 'Ventas Requeridas para Punto de Equilibrio', value: dineroEquilibrio, formatted: `$${dineroEquilibrio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El punto de equilibrio (break-even point) es el volumen de ventas en el que los ingresos totales de una empresa igualan exactamente a sus costos totales (fijos y variables). En este nivel de operación, el negocio no tiene pérdidas pero tampoco reporta utilidades. Conocer este dato es crucial para definir metas de ventas semanales/mensuales y establecer correctamente el precio de los productos.',
    formula: 'Unidades de Equilibrio = Costos Fijos Totales / ( Precio de Venta - Costo Variable )\n\nVentas de Equilibrio = Unidades de Equilibrio * Precio de Venta',
    example: 'Tienes costos fijos mensuales de $20,000 pesos. Vendes pasteles a $150 pesos cada uno, y su costo variable de insumos/empaque es de $70 pesos por pastel:\nMargen Unitario = $150 - $70 = $80 pesos por pastel.\nUnidades de Equilibrio = $20,000 / $80 = 250 pasteles en el mes.\nVentas totales requeridas = 250 * $150 = $37,500 pesos mensuales.',
    legislation: 'Normas de Información Financiera (NIF) en México sobre contabilidad administrativa y de costos.',
    faqs: [
      {
        question: '¿Qué diferencia hay entre Costos Fijos y Costos Variables?',
        answer: 'Los costos fijos se pagan independientemente de si vendes o no (renta, nóminas fijas, seguros). Los costos variables aumentan o disminuyen de manera directamente proporcional al nivel de producción y ventas (materias primas, envíos, comisiones de pasarela de pago).'
      },
      {
        question: '¿Qué pasa si mi costo variable es mayor que mi precio de venta?',
        answer: 'Tu negocio tendrá un margen negativo. Esto significa que por cada unidad vendida incurres en pérdidas adicionales directas; bajo este escenario, es imposible alcanzar el punto de equilibrio y debes replantear de inmediato tu precio o reducir costos de insumos.'
      }
    ],
    tips: [
      'Monitorea periódicamente tu punto de equilibrio, ya que la inflación en proveedores puede aumentar tus costos variables y empujar hacia arriba tu meta de ventas.',
      'Utiliza la calculadora para simular escenarios: ¿cómo baja tu meta de unidades si aumentas el precio de venta un 10%?'
    ],
    errors: [
      'Clasificar erróneamente los gastos. Confundir un costo que varía mes con mes (como el recibo de electricidad comercial) con un costo variable unitario. El costo variable unitario es exclusivamente el que va atado físicamente a la fabricación o entrega de cada venta.',
      'Suponer que alcanzar el punto de equilibrio es el éxito total del negocio. Recuerda que quedar en equilibrio significa ganar $0.00 pesos netos. La meta comercial siempre debe ser superior al break-even.'
    ]
  }
};
