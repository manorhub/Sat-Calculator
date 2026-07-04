import { CalculatorConfig } from '../../types/calculator';

export const recargosCalculator: CalculatorConfig = {
  id: 'calculo-recargos-sat',
  title: 'Calculadora de Recargos y Actualizaciones',
  shortDescription: 'Calcula el recargo por mora y el ajuste inflacionario (actualización) que debes pagar al SAT por impuestos presentados fuera de tiempo.',
  category: 'Impuestos Federales',
  categorySlug: 'sat',
  slug: 'calculadora-recargos-actualizacion',
  seo: {
    metaTitle: 'Calculadora de Recargos y Actualizaciones SAT 2026',
    metaDescription: 'Calcula el costo total de pagar tus impuestos extemporáneos ante el SAT. Obtén la actualización por inflación (CFF Art. 17-A) y la tasa moratoria del 1.47% mensual.',
    keywords: ['recargos y actualizaciones sat', 'calculadora fiscal extemporanea', 'tasa de recargos sat 2026', 'actualizacion por inflacion cff', 'pagar impuestos tarde mexico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto_impuesto',
      label: 'Monto Original del Impuesto Omitido ($)',
      type: 'number',
      defaultValue: 5000,
      placeholder: 'Ej: $5,000 pesos de IVA o ISR',
      suffix: 'MXN'
    },
    {
      id: 'meses_retraso',
      label: 'Meses de Retraso',
      type: 'number',
      defaultValue: 3,
      placeholder: 'Número de meses transcurridos de retraso'
    },
    {
      id: 'estimar_actualizacion',
      label: '¿Incluir estimación de actualización (inflación)?',
      type: 'boolean',
      defaultValue: true
    }
  ],
  calculate: (inputs) => {
    const monto = parseFloat(inputs.monto_impuesto) || 0;
    const meses = Math.max(0, parseInt(inputs.meses_retraso) || 0);
    const incluirActualizacion = inputs.estimar_actualizacion;

    // Tasa oficial de recargos moratorios por prórroga en México: 1.47% mensual (Art. 21 CFF)
    const tasaMensualRecargos = 0.0147;
    const tasaRecargosAcumulada = meses * tasaMensualRecargos;

    // Estimación de inflación mensual promedio (aprox. 4.2% anualizado -> 0.35% mensual)
    const tasaMensualInflacion = 0.0035;
    
    let factorActualizacion = 1;
    if (incluirActualizacion && meses > 0) {
      factorActualizacion = 1 + (meses * tasaMensualInflacion);
    }

    const montoActualizado = monto * factorActualizacion;
    const montoActualizacionExtra = montoActualizado - monto;

    // Los recargos se calculan sobre el monto del impuesto ya actualizado por inflación (Art. 21 CFF)
    const montoRecargos = montoActualizado * tasaRecargosAcumulada;
    
    const totalPagar = montoActualizado + montoRecargos;

    const steps = [
      {
        description: `Se determina la tasa acumulada de recargos multiplicando los meses de retraso (${meses}) por la tasa mensual oficial del SAT (${(tasaMensualRecargos * 100).toFixed(2)}%).`,
        mathFormula: `Tasa\\ Recargos\\ Acumulada = ${meses} \\times 1.47\\% = ${(tasaRecargosAcumulada * 100).toFixed(2)}\\%`
      },
      {
        description: `Se calcula el ajuste por actualización (inflación) multiplicando el impuesto original por la inflación acumulada (estimada en ${(tasaMensualInflacion * 100).toFixed(2)}% mensual).`,
        mathFormula: `Factor\\ Actualizaci\\acute{o}n = 1 + (${meses} \\times 0.0035) = ${factorActualizacion.toFixed(4)}\\\\Impuesto\\ Actualizado = $${monto.toFixed(2)} \\times ${factorActualizacion.toFixed(4)} = $${montoActualizado.toFixed(2)}`
      },
      {
        description: `Se calculan los recargos moratorios aplicando la tasa acumulada sobre el impuesto previamente actualizado por inflación.`,
        mathFormula: `Recargos = Impuesto\\ Actualizado \\times Tasa\\ Recargos = $${montoActualizado.toFixed(2)} \\times ${tasaRecargosAcumulada.toFixed(4)} = $${montoRecargos.toFixed(2)}`
      },
      {
        description: `Se suma el impuesto actualizado más los recargos correspondientes para obtener el adeudo total a pagar al SAT.`,
        mathFormula: `Total\\ a\\ Pagar = Impuesto\\ Actualizado + Recargos = $${montoActualizado.toFixed(2)} + $${montoRecargos.toFixed(2)} = $${totalPagar.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Impuesto Histórico Base', value: monto, formatted: `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Importe de Actualización (Inflación)', value: montoActualizacionExtra, formatted: `$${montoActualizacionExtra.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Impuesto Actualizado Base', value: montoActualizado, formatted: `$${montoActualizado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Recargos Moratorios del Período', value: montoRecargos, formatted: `$${montoRecargos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Total Extemporáneo a Pagar', value: totalPagar, formatted: `$${totalPagar.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'Cuando una contribución federal en México no se paga en la fecha límite establecida, el monto omitido debe actualizarse por inflación para reflejar su valor real al momento del pago (Actualización), y sobre este monto actualizado se cobran intereses moratorios mensuales como indemnización al fisco federal (Recargos). Ambos cobros se fundamentan en el Código Fiscal de la Federación.',
    formula: 'Fórmula de Adeudo Extemporáneo SAT:\nImpuesto Actualizado = Impuesto Histórico * Factor de Actualización\nRecargos = Impuesto Actualizado * (Meses de Retraso * Tasa de Recargos Mensual)\nTotal a Pagar = Impuesto Actualizado + Recargos',
    example: 'Si debías pagar $5,000 pesos de IVA y lo pagas con 3 meses de retraso:\n1. Factor de actualización estimado = 1 + (3 * 0.0035) = 1.0105\n2. Impuesto actualizado = $5,000 * 1.0105 = $5,052.50 pesos (Actualización extra = $52.50 pesos)\n3. Tasa de recargos acumulada = 3 * 1.47% = 4.41%\n4. Recargos moratorios = $5,052.50 * 0.0441 = $222.82 pesos\n5. Total a pagar al SAT = $5,052.50 + $222.82 = $5,275.32 pesos.',
    legislation: 'Artículos 17-A (reglas de actualización de contribuciones por inflación e INPC) y 21 (reglas para el cálculo y cobro de los recargos moratorios) del Código Fiscal de la Federación (CFF).',
    faqs: [
      {
        question: '¿Qué tasa de recargos cobra el SAT?',
        answer: 'La tasa mensual oficial de recargos moratorios por mora es del 1.47% por cada mes de retraso o fracción de mes, establecida en la Ley de Ingresos de la Federación.'
      },
      {
        question: '¿Cómo se calcula formalmente el factor de actualización?',
        answer: 'Se divide el INPC (Índice Nacional de Precios al Consumidor) del mes anterior a aquel en que se efectúe el pago, entre el INPC del mes anterior a aquel en que debió realizarse el pago del impuesto.'
      },
      {
        question: '¿Hay un límite de tiempo para que el SAT me cobre recargos?',
        answer: 'Las facultades del SAT para cobrar contribuciones omitidas, con sus respectivos recargos y actualizaciones, caducan en un plazo general de 5 años contados a partir del día siguiente a aquel en que se presentó o debió presentarse la declaración.'
      }
    ],
    tips: [
      'Presenta tus declaraciones de forma extemporánea pero voluntaria antes de que el SAT te envíe un requerimiento formal de pago; de lo contrario, además de recargos y actualización, deberás pagar una multa sustancial por requerimiento.',
      'Si tienes saldos a favor con el SAT, tú también tienes derecho a solicitar la devolución actualizada por inflación.'
    ],
    errors: [
      'Calcular los recargos sobre el impuesto histórico directamente. Recuerda que la ley exige calcular los recargos sobre el impuesto actualizado por inflación.',
      'Creer que si transcurrió una sola semana de retraso no cuenta como mes completo. El Art. 21 de CFF indica que se cobran recargos por cada mes o fracción de mes transcurrida.'
    ]
  }
};
