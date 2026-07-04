import { CalculatorConfig } from '../../types/calculator';

export const aforeCalculator: CalculatorConfig = {
  id: 'calculo-afore',
  title: 'Calculadora de AFORE y Retiro',
  shortDescription: 'Simula el saldo proyectado en tu AFORE al jubilarte y calcula la pensión mensual estimada según tus aportaciones obligatorias y voluntarias.',
  category: 'Finanzas Personales',
  categorySlug: 'finanzas-personales',
  slug: 'calculadora-afore-retiro',
  seo: {
    metaTitle: 'Calculadora de AFORE y Retiro 2026 - Proyecta tu Pensión',
    metaDescription: 'Simula el fondo de tu AFORE para la jubilación en México. Proyecta tu pensión mensual estimada sumando aportaciones obligatorias y voluntarias.',
    keywords: ['calculadora afore', 'proyeccion de retiro', 'pension estimada mexico', 'aportaciones voluntarias afore', 'jubilacion consar'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'saldo_actual',
      label: 'Saldo Actual en tu AFORE ($)',
      type: 'number',
      defaultValue: 50000,
      placeholder: 'Consulta el saldo en tu estado de cuenta',
      suffix: 'MXN'
    },
    {
      id: 'edad_actual',
      label: 'Edad Actual (Años)',
      type: 'number',
      defaultValue: 30,
      placeholder: 'Ej: 30'
    },
    {
      id: 'edad_retiro',
      label: 'Edad de Retiro / Jubilación (Años)',
      type: 'number',
      defaultValue: 65,
      placeholder: 'Suele ser 60 o 65 años'
    },
    {
      id: 'salario_mensual',
      label: 'Salario Mensual Bruto Actual ($)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Sueldo base para aportación obligatoria',
      suffix: 'MXN'
    },
    {
      id: 'aportacion_voluntaria',
      label: 'Aportación Voluntaria Mensual ($)',
      type: 'number',
      defaultValue: 500,
      placeholder: 'Monto extra que deseas ahorrar',
      suffix: 'MXN'
    },
    {
      id: 'rendimiento_anual',
      label: 'Rendimiento Anual Estimado del AFORE (%)',
      type: 'number',
      defaultValue: 5.5,
      placeholder: 'Promedio histórico real es entre 4% y 6%'
    }
  ],
  calculate: (inputs, lang) => {
    const saldoActual = parseFloat(inputs.saldo_actual) || 0;
    const edadActual = parseInt(inputs.edad_actual) || 30;
    const edadRetiro = parseInt(inputs.edad_retiro) || 65;
    const salario = parseFloat(inputs.salario_mensual) || 0;
    const voluntaria = parseFloat(inputs.aportacion_voluntaria) || 0;
    const rendimiento = parseFloat(inputs.rendimiento_anual) || 5.5;
    const isEn = lang === 'en';

    const anosAhorro = Math.max(0, edadRetiro - edadActual);
    const mesesAhorro = anosAhorro * 12;

    // Aportación obligatoria promedio en México es del 6.5% del salario base
    const obligatoriaMensual = salario * 0.065;
    const totalAhorroMensual = obligatoriaMensual + voluntaria;

    const rMensual = (rendimiento / 100) / 12;

    let saldoProyectado = saldoActual;
    if (mesesAhorro > 0) {
      if (rMensual > 0) {
        const factorInteres = Math.pow(1 + rMensual, mesesAhorro);
        saldoProyectado = (saldoActual * factorInteres) + (totalAhorroMensual * ((factorInteres - 1) / rMensual));
      } else {
        saldoProyectado = saldoActual + (totalAhorroMensual * mesesAhorro);
      }
    }

    // Proyección de pensión mensual considerando esperanza de vida de 20 años post-jubilación (240 meses)
    const pensionEstimada = saldoProyectado / 240;

    const steps = [
      {
        description: isEn
          ? `The total saving period is determined in years and months until retirement at ${edadRetiro} years.`
          : `Se determina el período total de ahorro en años y meses hasta la jubilación a los ${edadRetiro} años.`,
        mathFormula: `A\\tilde{n}os\\ de\\ Ahorro = ${edadRetiro} - ${edadActual} = ${anosAhorro}\\ a\\tilde{n}os\\ (${mesesAhorro}\\ meses)`
      },
      {
        description: isEn
          ? `The monthly mandatory contribution from the employee and employer is calculated (estimated at 6.5% of the base salary) plus the monthly voluntary savings.`
          : `Se calcula la aportación obligatoria mensual del trabajador y el patrón (estimada en 6.5% del sueldo ordinario) más el ahorro voluntario mensual.`,
        mathFormula: `Aportaci\\acute{o}n\\ Mensual = (Sueldo \\times 6.5\\%) + Voluntaria = ($${salario.toFixed(2)} \\times 0.065) + $${voluntaria.toFixed(2)} = $${totalAhorroMensual.toFixed(2)}`
      },
      {
        description: isEn
          ? `The monthly compound interest formula is applied to project the final balance to future value.`
          : `Se aplica la fórmula de interés compuesto mensual para proyectar el saldo final a valor futuro.`,
        mathFormula: `Saldo\\ Proyectado = Saldo\\ Inicial \\times (1 + r)^n + Ahorro\\ Mensual \\times \\frac{(1 + r)^n - 1}{r} = $${saldoProyectado.toFixed(2)}`
      },
      {
        description: isEn
          ? `The monthly pension amount is estimated assuming a programmed withdrawal over a 20-year life expectancy (240 months).`
          : `Se estima el monto mensual de pensión asumiendo un retiro programado a lo largo de 20 años de esperanza de vida (240 meses).`,
        mathFormula: `Pensi\\acute{o}n\\ Mensual = \\frac{Saldo\\ Proyectado}{240} = $${pensionEstimada.toFixed(2)}`
      }
    ];

    return {
      results: [
        { 
          label: isEn ? 'Total Monthly Contribution' : 'Aportación Mensual Total', 
          value: totalAhorroMensual, 
          formatted: `$${totalAhorroMensual.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` 
        },
        { 
          label: isEn ? 'Years to Retirement' : 'Años para el Retiro', 
          value: anosAhorro, 
          formatted: isEn ? `${anosAhorro} years` : `${anosAhorro} años` 
        },
        { 
          label: isEn ? 'Estimated AFORE Balance at Retirement' : 'Saldo Estimado en AFORE al Jubilarte', 
          value: saldoProyectado, 
          formatted: `$${saldoProyectado.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` 
        },
        { 
          label: isEn ? 'Estimated Monthly Pension' : 'Pensión Mensual Estimada', 
          value: pensionEstimada, 
          formatted: `$${pensionEstimada.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, 
          isMain: true 
        }
      ],
      steps
    };
  },
  content: {
    explanation: 'El sistema de AFORE en México funciona a través de cuentas individuales administradas por Sociedades de Inversión Especializadas en Fondos para el Retiro (SIEFORES). Las aportaciones bimestrales obligatorias provienen del patrón, del trabajador y del gobierno. Realizar aportaciones voluntarias recurrentes incrementa sustancialmente el saldo final y la pensión debido al efecto del interés compuesto a largo plazo.',
    formula: 'Fórmula de Valor Futuro de Ahorro Recurrente:\nFV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]\n\nDonde:\nFV = Saldo proyectado final\nPV = Saldo inicial actual\nPMT = Aportación mensual acumulada\nr = Tasa de rendimiento real mensual (Tasa Anual / 12)\nn = Número de meses de ahorro (Años a jubilarse * 12)',
    example: 'Si tienes 30 años, un saldo de $50,000 pesos en tu AFORE, aportas obligatoriamente por tu sueldo de $15,000 pesos ($975 pesos) y decides ahorrar voluntariamente $500 pesos extras al mes ($1,475 pesos mensuales totales) con un rendimiento promedio neto del 5.5% anual:\nAl cumplir 65 años (35 años de ahorro), el saldo estimado en tu AFORE será de $2,187,015 pesos mexicanos, lo que equivaldría a una pensión mensual estimada de $9,112 pesos mexicanos.',
    legislation: 'Ley de los Sistemas de Ahorro para el Retiro (LSAR) y Ley del Seguro Social (LSS), relativas a los regímenes de jubilación (Ley 73 y Ley 97) y las reformas a las aportaciones patronales de 2023-2030.',
    faqs: [
      {
        question: '¿Qué es la Ley 73 y la Ley 97 del IMSS?',
        answer: 'La Ley 73 aplica a quienes cotizaron antes del 1 de julio de 1997; su pensión se calcula por el promedio salarial de los últimos 5 años. La Ley 97 aplica a quienes empezaron a cotizar después de esa fecha; su pensión depende exclusivamente del saldo acumulado en su cuenta individual AFORE.'
      },
      {
        question: '¿Las aportaciones voluntarias son deducibles de impuestos?',
        answer: 'Sí, las aportaciones voluntarias a tu cuenta de AFORE son deducibles de impuestos en tu declaración anual, con un límite del 10% de tus ingresos anuales acumulables o hasta 5 UMA anualizadas.'
      },
      {
        question: '¿Qué son las SIEFORES Generacionales?',
        answer: 'Son los fondos donde se invierten tus recursos de acuerdo a tu año de nacimiento. A menor edad, el fondo invierte en activos con mayor rendimiento y riesgo; a mayor edad, la inversión se vuelve más conservadora para proteger tu dinero del retiro.'
      }
    ],
    tips: [
      'Configura la domiciliación de aportaciones voluntarias desde la app Afore Móvil. Automatizar tu ahorro mensual de $200 o $500 pesos incrementa tu pensión futura enormemente gracias al interés compuesto. Puedes proyectar escenarios generales con la [Calculadora de Interés Compuesto](/calculadoras/interes-compuesto/calculadora-interes-compuesto).',
      'Revisa tu estado de cuenta tres veces al año para vigilar el rendimiento neto y las comisiones cobradas por tu Administradora.'
    ],
    errors: [
      'Creer que el sueldo que registraste ante el IMSS no afecta a tu pensión. Cotizar con el salario mínimo reduce drásticamente las aportaciones de tu patrón al AFORE.',
      'Retirar dinero por desempleo o matrimonio sin reponer las semanas de cotización perdidas, lo cual aplaza tu edad de retiro.'
    ]
  },
  translations: {
    en: {
      title: 'AFORE & Retirement Calculator',
      shortDescription: 'Simulate the projected balance in your AFORE upon retirement and calculate the estimated monthly pension based on your mandatory and voluntary contributions.',
      category: 'Personal Finance',
      seo: {
        metaTitle: 'AFORE & Retirement Calculator 2026 - Project Your Pension',
        metaDescription: 'Simulate your AFORE fund for retirement in Mexico. Project your estimated monthly pension by combining mandatory and voluntary contributions.',
        keywords: ['afore calculator', 'retirement projection', 'estimated pension mexico', 'voluntary contributions afore', 'consar retirement']
      },
      inputs: [
        {
          id: 'saldo_actual',
          label: 'Current Balance in your AFORE ($)',
          placeholder: 'Check the balance on your account statement'
        },
        {
          id: 'edad_actual',
          label: 'Current Age (Years)',
          placeholder: 'e.g. 30'
        },
        {
          id: 'edad_retiro',
          label: 'Retirement / Pension Age (Years)',
          placeholder: 'Usually 60 or 65 years'
        },
        {
          id: 'salario_mensual',
          label: 'Current Gross Monthly Salary ($)',
          placeholder: 'Base salary for mandatory contribution'
        },
        {
          id: 'aportacion_voluntaria',
          label: 'Voluntary Monthly Contribution ($)',
          placeholder: 'Extra amount you want to save'
        },
        {
          id: 'rendimiento_anual',
          label: 'Estimated AFORE Annual Return (%)',
          placeholder: 'Real historical average is between 4% and 6%'
        }
      ],
      content: {
        explanation: 'The AFORE system in Mexico works through individual accounts managed by Retirement Fund Administrators (AFORE). The mandatory bi-monthly contributions come from the employer, the employee, and the government. Making recurring voluntary contributions substantially increases the final balance and pension due to the effect of long-term compound interest.',
        formula: 'Future Value Formula for Recurring Savings:\nFV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]\n\nWhere:\nFV = Final projected balance\nPV = Current initial balance\nPMT = Accumulated monthly contribution\nr = Monthly real return rate (Annual Rate / 12)\nn = Number of savings months (Years to retirement * 12)',
        example: 'If you are 30 years old, have a balance of $50,000 pesos in your AFORE, contribute obligatorily for your salary of $15,000 pesos ($975 pesos), and decide to voluntarily save $500 pesos extra per month ($1,475 pesos total monthly) with an average net yield of 5.5% per year:\nAt age 65 (35 years of savings), the estimated balance in your AFORE will be $2,187,015 Mexican pesos, which would equal an estimated monthly pension of $9,112 Mexican pesos.',
        legislation: 'Retirement Savings Systems Law (LSAR) and Social Security Law (LSS), relating to retirement regimes (73 Law and 97 Law) and reforms to employer contributions of 2023-2030.',
        faqs: [
          {
            question: 'What is IMSS Law 73 and Law 97?',
            answer: 'Law 73 applies to those who contributed before July 1, 1997; their pension is calculated by the average salary of the last 5 years. Law 97 applies to those who started contributing after that date; their pension depends exclusively on the balance accumulated in their individual AFORE account.'
          },
          {
            question: 'Are voluntary contributions tax-deductible?',
            answer: 'Yes, voluntary contributions to your AFORE account are tax-deductible in your annual tax return, with a limit of 10% of your accumulated annual income or up to 5 annualized UMAs.'
          },
          {
            question: 'What are Generational SIEFORES?',
            answer: 'They are the funds where your resources are invested according to your birth year. At a younger age, the fund invests in assets with higher yield and risk; at an older age, the investment becomes more conservative to protect your money for retirement.'
          }
        ],
        tips: [
          'Set up automatic voluntary contributions from the Afore Móvil app. Automating your monthly savings of $200 or $500 pesos increases your future pension enormously thanks to compound interest. You can project general scenarios with the [Compound Interest Calculator](/calculadoras/interes-compuesto/calculadora-interes-compuesto).',
          'Review your account statement three times a year to monitor net returns and commissions charged by your Administrator.'
        ],
        errors: [
          'Believing that the salary you registered with the IMSS does not affect your pension. Contributing with the minimum wage drastically reduces your employer\'s contributions to the AFORE.',
          'Withdrawing money for unemployment or marriage without replacing the lost contribution weeks, which postpones your retirement age.'
        ]
      }
    }
  }
};
