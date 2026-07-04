import { CalculatorConfig } from '../../types/calculator';

// General Minimum Wage in Mexico 2024
const MIN_WAGE_2024 = 248.93;

function getVacationDays(years: number): number {
  if (years <= 1) return 12;
  if (years === 2) return 14;
  if (years === 3) return 16;
  if (years === 4) return 18;
  if (years === 5) return 20;
  if (years <= 10) return 22;
  if (years <= 15) return 24;
  if (years <= 20) return 26;
  if (years <= 25) return 28;
  return 30;
}

export const finiquitoCalculator: CalculatorConfig = {
  id: 'calculo-finiquito',
  title: 'Calculadora de Finiquito y Liquidación',
  shortDescription: 'Calcula lo que te corresponde recibir al terminar tu relación laboral, ya sea por renuncia voluntaria o por despido injustificado.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-finiquito-liquidacion',
  seo: {
    metaTitle: 'Calculadora de Finiquito y Liquidación LFT 2026',
    metaDescription: 'Calcula tu finiquito por renuncia o tu indemnización por despido injustificado (liquidación). Incluye prima de antigüedad y aguinaldo proporcional.',
    keywords: ['calculadora finiquito', 'liquidación por despido', 'indemnización constitucional lft', 'calcular finiquito renuncia', 'despido injustificado'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'sueldo_mensual',
      label: 'Sueldo Mensual Bruto ($)',
      type: 'number',
      defaultValue: 18000,
      placeholder: 'Sueldo bruto mensual ordinario',
      suffix: 'MXN'
    },
    {
      id: 'antiguedad_anos',
      label: 'Años completos laborados (Antigüedad)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'Ej: 2 años'
    },
    {
      id: 'dias_anio_actual',
      label: 'Días laborados en el año de la baja (Transcurridos del año)',
      type: 'number',
      defaultValue: 180,
      placeholder: 'Ej: 180 días (aproximado a medio año)'
    },
    {
      id: 'salarios_devengados',
      label: 'Días trabajados pendientes de pago en el mes ($)',
      type: 'number',
      defaultValue: 5,
      placeholder: 'Días laborados desde el último pago quincenal/semanal'
    },
    {
      id: 'motivo',
      label: 'Motivo de salida',
      type: 'select',
      defaultValue: 'renuncia',
      options: [
        { label: 'Renuncia Voluntaria (Finiquito únicamente)', value: 'renuncia' },
        { label: 'Despido Injustificado / Recorte (Finiquito + Liquidación)', value: 'despido' }
      ]
    }
  ],
  calculate: (inputs) => {
    const sueldoMensual = parseFloat(inputs.sueldo_mensual) || 0;
    const antiguedadAnos = parseFloat(inputs.antiguedad_anos) || 0;
    const diasAnioActual = Math.min(365, parseFloat(inputs.dias_anio_actual) || 0);
    const salariosDevengados = parseFloat(inputs.salarios_devengados) || 0;
    const motivo = inputs.motivo;

    const sueldoDiario = sueldoMensual / 30;

    // 1. FINIQUITO CALCULATION
    const pagoSalariosDevengados = sueldoDiario * salariosDevengados;

    // Proportional Aguinaldo (15 days per full year)
    const aguinaldoProporcional = ((sueldoDiario * 15) / 365) * diasAnioActual;

    // Proportional Vacations (Current year entitlement)
    const diasVacacionesEntitlement = getVacationDays(antiguedadAnos + 1);
    const vacacionesProporcionales = (diasVacacionesEntitlement / 365) * diasAnioActual;
    const pagoVacaciones = sueldoDiario * vacacionesProporcionales;

    // Proportional Prima Vacacional (25% minimum)
    const pagoPrimaVacacional = pagoVacaciones * 0.25;

    const subtotalFiniquito = pagoSalariosDevengados + aguinaldoProporcional + pagoVacaciones + pagoPrimaVacacional;

    // 2. LIQUIDACION CALCULATION
    let indemnizacion3Meses = 0;
    let indemnizacion20Dias = 0;
    let primaAntiguedad = 0;

    if (motivo === 'despido') {
      // 3 Months of salary
      indemnizacion3Meses = sueldoMensual * 3;

      // 20 Days of salary per year worked
      indemnizacion20Dias = sueldoDiario * 20 * antiguedadAnos;

      // Prima de antigüedad: 12 days per year, capped at 2x minimum wage
      const topeDiarioPrima = MIN_WAGE_2024 * 2;
      const cuotaDiariaPrima = Math.min(sueldoDiario, topeDiarioPrima);
      // Legally, prima applies for dismissal at any year, or resignation after 15 years
      primaAntiguedad = cuotaDiariaPrima * 12 * (antiguedadAnos + (diasAnioActual / 365));
    }

    const subtotalLiquidacion = indemnizacion3Meses + indemnizacion20Dias + primaAntiguedad;
    const totalRecibir = subtotalFiniquito + subtotalLiquidacion;

    const steps = [
      {
        description: `Se calcula el Salario Diario: Sueldo Mensual / 30.`,
        mathFormula: `Salario\\ Diario = \\frac{$${sueldoMensual.toFixed(2)}}{30} = $${sueldoDiario.toFixed(2)}`
      },
      {
        description: `Finiquito - Salarios Devengados por ${salariosDevengados} días pendientes de cobro en el mes.`,
        mathFormula: `Salarios\\ Devengados = $${sueldoDiario.toFixed(2)} \\times ${salariosDevengados} = $${pagoSalariosDevengados.toFixed(2)}`
      },
      {
        description: `Finiquito - Aguinaldo Proporcional por ${diasAnioActual} días del año transcurridos (sobre base de 15 días anuales).`,
        mathFormula: `Aguinaldo = \\frac{$${sueldoDiario.toFixed(2)} \\times 15}{365} \\times ${diasAnioActual} = $${aguinaldoProporcional.toFixed(2)}`
      },
      {
        description: `Finiquito - Vacaciones Proporcionales (Para el año de antigüedad correspondiente le tocan ${diasVacacionesEntitlement} días de ley).`,
        mathFormula: `Vacaciones = \\frac{${diasVacacionesEntitlement}\\ d\\acute{\\imath}as}{365} \\times ${diasAnioActual} \\times $${sueldoDiario.toFixed(2)} = $${pagoVacaciones.toFixed(2)}`
      },
      {
        description: `Finiquito - Prima Vacacional Proporcional aplicando el 25% mínimo legal sobre las vacaciones.`,
        mathFormula: `Prima\\ Vacacional = $${pagoVacaciones.toFixed(2)} \\times 25\\% = $${pagoPrimaVacacional.toFixed(2)}`
      }
    ];

    if (motivo === 'despido') {
      steps.push({
        description: `Liquidación - Indemnización Constitucional equivalente a 3 meses (90 días) de salario bruto.`,
        mathFormula: `Indemnizaci\\acute{o}n\\ 3\\ Meses = $${sueldoMensual.toFixed(2)} \\times 3 = $${indemnizacion3Meses.toFixed(2)}`
      });
      steps.push({
        description: `Liquidación - Indemnización adicional por despido equivalente a 20 días de sueldo por cada año completo trabajado (${antiguedadAnos} años).`,
        mathFormula: `20\\ D\\acute{\\imath}as\\ por\\ A\\tilde{n}o = $${sueldoDiario.toFixed(2)} \\times 20 \\times ${antiguedadAnos} = $${indemnizacion20Dias.toFixed(2)}`
      });
      steps.push({
        description: `Liquidación - Prima de Antigüedad equivalente a 12 días por año laborado (incluyendo partes proporcionales), con salario diario topado a 2 veces el salario mínimo general vigente ($${(MIN_WAGE_2024 * 2).toFixed(2)}).`,
        mathFormula: `Prima\\ de\\ Antig\\ddot{u}edad = $${primaAntiguedad.toFixed(2)}`
      });
    }

    return {
      results: [
        { label: 'Salarios Devengados Pendientes', value: pagoSalariosDevengados, formatted: `$${pagoSalariosDevengados.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Aguinaldo Proporcional', value: aguinaldoProporcional, formatted: `$${aguinaldoProporcional.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Vacaciones Proporcionales', value: pagoVacaciones, formatted: `$${pagoVacaciones.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Prima Vacacional Proporcional (25%)', value: pagoPrimaVacacional, formatted: `$${pagoPrimaVacacional.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Subtotal Finiquito (De Ley Obligatorio)', value: subtotalFiniquito, formatted: `$${subtotalFiniquito.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        ...(motivo === 'despido' ? [
          { label: 'Indemnización Constitucional (90 días)', value: indemnizacion3Meses, formatted: `$${indemnizacion3Meses.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
          { label: 'Indemnización 20 Días por Año', value: indemnizacion20Dias, formatted: `$${indemnizacion20Dias.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
          { label: 'Prima de Antigüedad (12 días/año topado)', value: primaAntiguedad, formatted: `$${primaAntiguedad.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
          { label: 'Subtotal Liquidación por Despido', value: subtotalLiquidacion, formatted: `$${subtotalLiquidacion.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` }
        ] : []),
        { label: 'Total Neto Bruto Sugerido a Recibir', value: totalRecibir, formatted: `$${totalRecibir.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'Al terminar la relación de trabajo en México, el empleado tiene derecho a cobrar su liquidación o finiquito. El finiquito incluye salarios pendientes, y proporcionales de aguinaldo, vacaciones y prima vacacional; aplica en cualquier baja laboral. La liquidación es una indemnización especial que se paga únicamente por despido injustificado, cierre de la empresa o reajuste de personal, sumando 3 meses de sueldo, 20 días por año y prima de antigüedad.',
    formula: 'Finiquito = Salarios Devengados + Aguinaldo Proporcional + Vacaciones Proporcionales + Prima Vacacional Proporcional\n\nLiquidación = Finiquito + 90 Días de Sueldo + 20 Días por Año + Prima de Antigüedad (12 días por año topado a 2 salarios mínimos)',
    example: 'Para un sueldo mensual bruto de $18,000 con 2 años completos de antigüedad, 180 días del año actual laborados, 5 días de sueldo devengados y despido injustificado:\nSueldo Diario = $600 pesos.\nFiniquito Bruto = $3,000 (Salarios) + $4,438.36 (Aguinaldo) + $3,945.21 (Vacaciones) + $986.30 (Prima) = $12,369.87 MXN.\nLiquidación Bruta = $54,000 (90 días) + $24,000 (20 días/año) + $14,891.80 (Prima de antigüedad con tope diario de $497.86) = $92,891.80 MXN.\nTotal a recibir = $105,261.67 MXN.',
    legislation: 'Ley Federal del Trabajo (LFT), Artículo 47 (Causas de rescisión sin responsabilidad), Artículo 48 (Derecho a indemnización de 3 meses), Artículo 50 (Reglas de indemnización de 20 días por año), Artículo 76 al 80 (Vacaciones), Artículo 87 (Aguinaldo), Artículo 162 (Prima de antigüedad).',
    faqs: [
      {
        question: '¿Qué es la prima de antigüedad y cuándo aplica?',
        answer: 'Es una compensación obligatoria de 12 días de salario por año. Si renuncias voluntariamente, solo tienes derecho a ella si cumpliste al menos 15 años de servicio en la empresa. Si eres despedido (sea justificado o injustificado), te corresponde recibirla por ley sin importar tus años laborados.'
      },
      {
        question: '¿El finiquito y la liquidación pagan impuestos?',
        answer: 'Sí. Las partes proporcionales de aguinaldo y prima vacacional tienen exenciones de ley (30 y 15 UMAS respectivamente). La indemnización de 3 meses, 20 días por año y prima de antigüedad están exentas de ISR hasta por un monto equivalente a 90 veces la UMA por cada año de servicio.'
      }
    ],
    tips: [
      'Si el patrón te pide firmar una hoja de renuncia en blanco o voluntaria al momento de despedirte, te está privando de tu indemnización por despido. Asesórate ante la PROFEDET antes de firmar.',
      'La prima de antigüedad se calcula con tu salario diario base, pero éste tiene un límite legal de dos veces el salario mínimo general vigente; no se calcula sobre sueldos elevados sin tope.'
    ],
    errors: [
      'Creer que por renunciar voluntariamente te corresponde recibir la liquidación de los 3 meses y 20 días por año. Esos conceptos aplican exclusivamente para despidos o rescisiones con responsabilidad del patrón.',
      'Ignorar que el reparto de utilidades (PTU) no cobrado del ejercicio anterior debe pagarse también si corresponde al periodo laborado, pero se cobra en las fechas de reparto, no necesariamente el día del despido.'
    ]
  }
};
