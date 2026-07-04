import { CalculatorConfig } from '../../types/calculator';

// Monthly ISR Brackets for salary calculations
const MONTHLY_ISR_BRACKETS = [
  { limitInferior: 0.01, cuotaFija: 0.00, tasa: 1.92 },
  { limitInferior: 746.05, cuotaFija: 14.32, tasa: 6.40 },
  { limitInferior: 6332.06, cuotaFija: 371.83, tasa: 10.88 },
  { limitInferior: 11128.02, cuotaFija: 893.55, tasa: 16.00 },
  { limitInferior: 12935.83, cuotaFija: 1182.81, tasa: 17.92 },
  { limitInferior: 15487.72, cuotaFija: 1640.18, tasa: 21.36 },
  { limitInferior: 31236.50, cuotaFija: 5004.12, tasa: 23.52 },
  { limitInferior: 49235.83, cuotaFija: 9236.89, tasa: 30.00 },
  { limitInferior: 93993.91, cuotaFija: 22664.36, tasa: 32.00 },
  { limitInferior: 125325.21, cuotaFija: 32690.40, tasa: 34.00 },
  { limitInferior: 375975.62, cuotaFija: 117911.48, tasa: 35.00 }
];

const UMA_2024 = 108.57;

// Function to calculate vacation days based on years of service (LFT México)
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

// Function to calculate Net Salary given Gross Salary
function calculateNetFromGross(gross: number, years: number = 1) {
  // 1. Calculate Integration Factor
  const vacationDays = getVacationDays(years);
  const aguinaldoDays = 15;
  const primaVacacional = 0.25;
  const integrationFactor = 1 + (aguinaldoDays / 365) + ((vacationDays * primaVacacional) / 365);

  const dailySalary = gross / 30;
  const sbc = dailySalary * integrationFactor;

  // 2. IMSS Worker Deductions (Monthly approximation)
  // Ramas obreras:
  // - Excedente de 3 UMA: 0.4% sobre (SBC - 3 * UMA)
  // - Prestaciones en dinero: 0.25% sobre SBC
  // - Gastos médicos pensionados: 0.375% sobre SBC
  // - Invalidez y Vida: 0.625% sobre SBC
  // - Cesantía y Vejez: 1.125% sobre SBC
  const excedenteBase = Math.max(0, sbc - (3 * UMA_2024));
  const imssDaily = (sbc * (0.0025 + 0.00375 + 0.00625 + 0.01125)) + (excedenteBase * 0.004);
  const imssDeduction = imssDaily * 30.4;

  // 3. ISR Deduction
  let bracket = MONTHLY_ISR_BRACKETS[0];
  for (let i = 0; i < MONTHLY_ISR_BRACKETS.length; i++) {
    if (gross >= MONTHLY_ISR_BRACKETS[i].limitInferior) {
      bracket = MONTHLY_ISR_BRACKETS[i];
    } else {
      break;
    }
  }
  const excedente = gross - bracket.limitInferior;
  const isrCausado = bracket.cuotaFija + (excedente * (bracket.tasa / 100));

  const totalDeductions = isrCausado + imssDeduction;
  const net = Math.max(0, gross - totalDeductions);

  return {
    net,
    isr: isrCausado,
    imss: imssDeduction,
    sbc,
    factor: integrationFactor,
    deductions: totalDeductions
  };
}

export const salaryCalculator: CalculatorConfig = {
  id: 'calculo-salario',
  title: 'Calculadora de Salario Neto y Bruto',
  shortDescription: 'Calcula tu sueldo neto libre a partir del salario bruto, o realiza el cálculo inverso para saber cuánto pedir de sueldo bruto.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-salario-neto-bruto',
  seo: {
    metaTitle: 'Calculadora de Salario Neto a Bruto 2026 - México',
    metaDescription: 'Calcula tu salario neto quitando impuestos del SAT (ISR) y cuotas del IMSS, o calcula el sueldo bruto necesario para recibir el neto deseado.',
    keywords: ['calculadora salario neto', 'salario bruto a neto', 'calculo inverso sueldo', 'descuentos de nomina imss', 'calcular isr sueldo'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto',
      label: 'Monto de Salario ($)',
      type: 'number',
      defaultValue: 20000,
      placeholder: 'Ingresa la cantidad en pesos',
      suffix: 'MXN'
    },
    {
      id: 'tipo_calculo',
      label: 'Tipo de Cálculo',
      type: 'select',
      defaultValue: 'bruto_a_neto',
      options: [
        { label: 'Salario Bruto a Neto (Calcular descuentos)', value: 'bruto_a_neto' },
        { label: 'Salario Neto a Bruto (Cálculo Inverso)', value: 'neto_a_bruto' }
      ]
    },
    {
      id: 'antiguedad',
      label: 'Años de Antigüedad (Para factor de integración IMSS)',
      type: 'select',
      defaultValue: 1,
      options: Array.from({ length: 15 }, (_, i) => ({ label: `${i + 1} año${i > 0 ? 's' : ''}`, value: i + 1 }))
    }
  ],
  calculate: (inputs) => {
    const monto = parseFloat(inputs.monto) || 0;
    const tipoCalculo = inputs.tipo_calculo;
    const years = parseInt(inputs.antiguedad) || 1;

    let bruto = 0;
    let neto = 0;
    let isr = 0;
    let imss = 0;
    let sbc = 0;
    let factor = 0;
    const steps = [];

    if (tipoCalculo === 'bruto_a_neto') {
      bruto = monto;
      const res = calculateNetFromGross(bruto, years);
      neto = res.net;
      isr = res.isr;
      imss = res.imss;
      sbc = res.sbc;
      factor = res.factor;

      steps.push({
        description: `Se calcula el Salario Base de Cotización (SBC) multiplicando el salario diario bruto por el factor de integración correspondiente al año ${years} de antigüedad (${factor.toFixed(4)}).`,
        mathFormula: `SBC = \\frac{Sueldo\\ Bruto}{30} \\times Factor = \\frac{$${bruto.toFixed(2)}}{30} \\times ${factor.toFixed(4)} = $${sbc.toFixed(2)}`
      });
      steps.push({
        description: `Se calcula la retención de IMSS obrera aplicando las tasas de cotización sobre el SBC y el excedente de 3 UMAS.`,
        mathFormula: `Deducci\\acute{o}n\\ IMSS = $${imss.toFixed(2)}`
      });
      steps.push({
        description: `Se calcula el impuesto de ISR sobre el sueldo bruto aplicando las tablas mensuales del SAT.`,
        mathFormula: `Deducci\\acute{o}n\\ ISR = $${isr.toFixed(2)}`
      });
      steps.push({
        description: `Se resta el ISR y el IMSS del Salario Bruto para obtener el Salario Neto libre.`,
        mathFormula: `Salario\\ Neto = Sueldo\\ Bruto - ISR - IMSS = $${bruto.toFixed(2)} - $${isr.toFixed(2)} - $${imss.toFixed(2)} = $${neto.toFixed(2)}`
      });
    } else {
      neto = monto;
      
      // Perform Binary Search for reverse calculation
      let lower = neto;
      let upper = neto * 2.5;
      let iterations = 0;

      while (upper - lower > 0.01 && iterations < 50) {
        const mid = (lower + upper) / 2;
        const testRes = calculateNetFromGross(mid, years);
        if (testRes.net > neto) {
          upper = mid;
        } else {
          lower = mid;
        }
        iterations++;
      }

      bruto = (lower + upper) / 2;
      const res = calculateNetFromGross(bruto, years);
      isr = res.isr;
      imss = res.imss;
      sbc = res.sbc;
      factor = res.factor;

      steps.push({
        description: `Mediante cálculo inverso numérico, se determina que el salario bruto requerido para asegurar un salario neto libre de $${neto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} es de $${bruto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
      });
      steps.push({
        description: `Comprobación: Al salario bruto de $${bruto.toFixed(2)} le corresponden las siguientes retenciones:`,
        mathFormula: `ISR = $${isr.toFixed(2)},\\ IMSS = $${imss.toFixed(2)}`
      });
      steps.push({
        description: `Resta de comprobación:`,
        mathFormula: `Sueldo\\ Neto = $${bruto.toFixed(2)} - $${isr.toFixed(2)} - $${imss.toFixed(2)} = $${res.net.toFixed(2)}`
      });
    }

    return {
      results: [
        { label: 'Salario Mensual Bruto (Antes de Impuestos)', value: bruto, formatted: `$${bruto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de ISR (Mensual)', value: isr, formatted: `$${isr.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Retención de IMSS Obrera', value: imss, formatted: `$${imss.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total Deducciones de Nómina', value: isr + imss, formatted: `$${(isr + imss).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Salario Base de Cotización (SBC)', value: sbc, formatted: `$${sbc.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Salario Mensual Neto (Libre de Impuestos)', value: neto, formatted: `$${neto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El salario en México se divide en bruto (la remuneración total acordada antes de deducciones) y neto (la cantidad de efectivo depositada al empleado tras retenciones legales). Los dos descuentos obligatorios para cualquier trabajador subordinado en nómina son el Impuesto sobre la Renta (ISR) y las cuotas de seguridad social al Instituto Mexicano del Seguro Social (IMSS).',
    formula: 'Sueldo Neto = Sueldo Bruto - ISR - IMSS\n\nSueldo Bruto (Inverso) = Resuelto mediante método numérico de aproximación.',
    example: 'Para un sueldo mensual bruto de $20,000 MXN:\nEl ISR correspondiente es de $2,604.00 MXN.\nLa cuota del IMSS obrera es de $482.00 MXN.\nSueldo neto resultante = $20,000 - $2,604.00 - $482.00 = $16,914.00 MXN.',
    legislation: 'Ley Federal del Trabajo (LFT), Artículos 82 al 89 (Salario); Ley de Impuesto sobre la Renta (LISR), Artículo 96; y Ley del Seguro Social (LSS), Artículos 106 y 107.',
    faqs: [
      {
        question: '¿Qué es el Salario Base de Cotización (SBC)?',
        answer: 'Es el salario con el que tu patrón te registra ante el IMSS. Se integra por tu salario diario más las prestaciones mínimas de ley (aguinaldo y vacaciones multiplicados por la prima vacacional) y otras prestaciones adicionales acordadas.'
      },
      {
        question: '¿Por qué mi sueldo neto es menor que el bruto?',
        answer: 'Porque tu patrón tiene la obligación legal de retener la cuota de ISR correspondiente a tu nivel de ingresos y tu aportación a la seguridad social (IMSS), y transferir esos fondos directamente a la tesorería del gobierno.'
      }
    ],
    tips: [
      'Al negociar tu sueldo con un nuevo empleador, asegúrate siempre de dejar en claro si el monto acordado es NETO (libre) o BRUTO (antes de impuestos).',
      'Revisa tus recibos de nómina digitales (CFDI) para constatar que las cantidades retenidas de ISR e IMSS coinciden con los cálculos de ley.'
    ],
    errors: [
      'Suponer que la cuota obrera del IMSS es de un porcentaje fijo simple. Esta depende de la UMA vigente y del salario diario integrado (SBC).',
      'Confundir las deducciones de nómina con créditos de vivienda (Infonavit) o pensiones alimenticias, que son descuentos adicionales individuales.'
    ]
  }
};
