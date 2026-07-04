import { CalculatorConfig } from '../../types/calculator';

export const rule503020Calculator: CalculatorConfig = {
  id: 'calculo-regla-50-30-20',
  title: 'Calculadora de Presupuesto 50/30/20',
  shortDescription: 'Organiza tus ingresos mensuales y divide tu presupuesto neto de acuerdo a la regla 50/30/20: necesidades, deseos y ahorro.',
  category: 'Finanzas Personales',
  categorySlug: 'finanzas-personales',
  slug: 'calculadora-presupuesto-regla-50-30-20',
  seo: {
    metaTitle: 'Calculadora de Regla de Presupuesto 50/30/20 - Finanzas México',
    metaDescription: 'Simula el presupuesto ideal de tus finanzas. Divide tus ingresos netos mensuales en 50% necesidades, 30% deseos y 20% ahorro e inversión.',
    keywords: ['calculadora 50 30 20', 'regla de presupuesto 50 30 20', 'finanzas personales mexico', 'presupuesto mensual ahorro', 'como organizar mis gastos'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'ingreso_neto_mensual',
      label: 'Ingreso Mensual Neto Disponible ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Tus ingresos netos tras pagar impuestos',
      suffix: 'MXN'
    },
    {
      id: 'gastos_necesidades',
      label: 'Tus gastos actuales en Necesidades ($)',
      type: 'number',
      defaultValue: 8000,
      placeholder: 'Renta, comida, servicios indispensables',
      suffix: 'MXN'
    },
    {
      id: 'gastos_deseos',
      label: 'Tus gastos actuales en Deseos ($)',
      type: 'number',
      defaultValue: 5000,
      placeholder: 'Entretenimiento, restaurantes, compras, viajes',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const ingreso = parseFloat(inputs.ingreso_neto_mensual) || 0;
    const actualNecesidades = parseFloat(inputs.gastos_necesidades) || 0;
    const actualDeseos = parseFloat(inputs.gastos_deseos) || 0;

    // 1. Calculate target budget allocations
    const targetNecesidades = ingreso * 0.50;
    const targetDeseos = ingreso * 0.30;
    const targetAhorro = ingreso * 0.20;

    // 2. Calculate actual savings as the remaining cash flow
    const actualAhorro = Math.max(0, ingreso - actualNecesidades - actualDeseos);

    // 3. Calculate variances (Actual vs Target)
    const diffNecesidades = actualNecesidades - targetNecesidades;
    const diffDeseos = actualDeseos - targetDeseos;
    const diffAhorro = targetAhorro - actualAhorro;

    let recomendacion = '¡Excelente presupuesto! Estás logrando guardar al menos el 20% recomendado para tu futuro financiero.';
    if (diffAhorro > 0) {
      recomendacion = `Estás ahorrando $${diffAhorro.toLocaleString('es-MX', { maximumFractionDigits: 2 })} pesos MENOS de tu objetivo del 20%. `;
      if (diffNecesidades > 0 && diffDeseos > 0) {
        recomendacion += 'Intenta recortar gastos tanto en tus necesidades (buscando alternativas más económicas) como en tus deseos (suscripciones o salidas de ocio).';
      } else if (diffDeseos > 0) {
        recomendacion += 'Tu mayor área de oportunidad está en los Deseos. Revisa tus gastos hormiga, salidas a comer o compras impulsivas para liberar flujo hacia el ahorro.';
      } else if (diffNecesidades > 0) {
        recomendacion += 'Tus gastos indispensables de Necesidades absorben más del 50% de tus ingresos. Evalúa opciones de ahorro en vivienda, servicios contratados o transporte.';
      }
    }

    const steps = [
      {
        description: `Se divide el Ingreso Neto mensual ($${ingreso.toFixed(2)}) de acuerdo al porcentaje ideal de la Regla 50/30/20.`,
        mathFormula: `Necesidades\\ (50\\%) = $${ingreso.toFixed(2)} \\times 0.50 = $${targetNecesidades.toFixed(2)}\\\\Deseos\\ (30\\%) = $${ingreso.toFixed(2)} \\times 0.30 = $${targetDeseos.toFixed(2)}\\\\Ahorro\\ (20\\%) = $${ingreso.toFixed(2)} \\times 0.20 = $${targetAhorro.toFixed(2)}`
      },
      {
        description: `Se determina el ahorro real restando tus gastos actuales del ingreso disponible.`,
        mathFormula: `Ahorro\\ Real = Ingreso - Necesidades - Deseos = $${ingreso.toFixed(2)} - $${actualNecesidades.toFixed(2)} - $${actualDeseos.toFixed(2)} = $${actualAhorro.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Presupuesto Necesidades Ideal (50%)', value: targetNecesidades, formatted: `$${targetNecesidades.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Presupuesto Deseos Ideal (30%)', value: targetDeseos, formatted: `$${targetDeseos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Presupuesto Ahorro Ideal (20%)', value: targetAhorro, formatted: `$${targetAhorro.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Tus Gastos en Necesidades Actuales', value: actualNecesidades, formatted: `$${actualNecesidades.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'Tus Gastos en Deseos Actuales', value: actualDeseos, formatted: `$${actualDeseos.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'Tu Capacidad de Ahorro Real Restante', value: actualAhorro, formatted: `$${actualAhorro.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Diagnóstico Financiero', value: diffAhorro > 0 ? 0 : 1, formatted: recomendacion, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'La regla presupuestaria 50/30/20 es un método de administración financiera personal simple y eficaz formulado por la académica estadounidense Elizabeth Warren. Consiste en dividir tus ingresos mensuales netos (después de impuestos) en tres categorías principales: Necesidades (50%), Deseos (30%) y Ahorro o Pago de Deudas (20%). Al apegarte a este marco, aseguras cubrir tu sustento diario, disfrutar tus ingresos y construir un fondo de retiro de manera balanceada.',
    formula: 'Necesidades (Fijas) = Ingresos Netos * 0.50\n\nDeseos (Variables) = Ingresos Netos * 0.30\n\nAhorro / Deuda Extra = Ingresos Netos * 0.20',
    example: 'Percibes un sueldo mensual neto de $15,000 pesos. Si aplicas la regla ideal:\nNecesidades = $7,500 pesos mensuales (renta, servicios, comida indispensable).\nDeseos = $4,500 pesos mensuales (salidas, cines, ropa, restaurantes).\nAhorro = $3,000 pesos mensuales (inversiones en CETES, fondo de emergencia).\nSi actualmente gastas $8,000 en necesidades y $5,000 en deseos, tu capacidad de ahorro se reduce a $2,000 pesos mensuales (un déficit de $1,000 sobre tu meta ideal).',
    legislation: 'Teoría financiera internacional de finanzas de consumo y principios de planeación de retiro.',
    faqs: [
      {
        question: '¿Qué se clasifica exactamente bajo Necesidades?',
        answer: 'Todos los gastos indispensables sin los cuales no podrías subsistir u operar: pago de renta o hipoteca, luz, agua, gas, despensa básica de alimentos, transporte básico para el trabajo, seguros médicos contratados y pagos mínimos de tarjetas de crédito o deudas.'
      },
      {
        question: '¿Qué se clasifica bajo Ahorro?',
        answer: 'Dinero reservado para el fondo de emergencias de 3 a 6 meses, aportaciones voluntarias a tu Afore o Plan Personal de Retiro (PPR), compras de CETES o fondos indexados, o aportaciones adicionales extraordinarias para liquidar deudas de tarjetas de forma acelerada.'
      }
    ],
    tips: [
      'Si tu ingreso neto fluctúa mes con mes (como freelancers o vendedores por comisión), calcula tus porcentajes basándote en tu ingreso promedio del último semestre para no distorsionar tu presupuesto.',
      'Automatiza el ahorro. Transfiere el 20% a tu cuenta de inversión de CETES el mismo día que recibes tu sueldo; de esta forma, te "pagas a ti mismo primero" y evitas la tentación de gastarlo.'
    ],
    errors: [
      'Clasificar deseos como necesidades. El plan de televisión de paga o la membresía del gimnasio premium no son indispensables de supervivencia. Sé honesto contigo mismo al catalogar tus egresos.',
      'Ignorar las deudas existentes. El 20% no es solo para ahorrar en cuentas que pagan rendimientos; si tienes deudas con altas tasas de interés (como tarjetas bancarias), abonar a capital de esas deudas cuenta en este rubro y debe ser tu prioridad absoluta antes de invertir.'
    ]
  }
};
