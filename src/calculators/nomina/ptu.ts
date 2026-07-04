import { CalculatorConfig } from '../../types/calculator';

export const ptuCalculator: CalculatorConfig = {
  id: 'calculo-ptu',
  title: 'Calculadora de PTU (Reparto de Utilidades)',
  shortDescription: 'Calcula tu Participación en las Utilidades de la Empresa (PTU) proporcional a tus días trabajados y salarios devengados en el año.',
  category: 'Nómina y LFT',
  categorySlug: 'nomina',
  slug: 'calculadora-ptu-reparto-utilidades',
  seo: {
    metaTitle: 'Calculadora de PTU 2026 - Reparto de Utilidades LFT',
    metaDescription: 'Calcula cuánto te corresponde de PTU (Reparto de Utilidades) en México. Simulación proporcional por días, salarios e ISR exento (15 UMAS).',
    keywords: ['calculadora ptu', 'reparto de utilidades lft', 'tope de ptu 3 meses', 'como se calcula la ptu', 'utilidades sat mexico'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto_utilidad_total',
      label: 'Monto total a repartir por la empresa ($)',
      type: 'number',
      defaultValue: 500000,
      placeholder: '10% de la utilidad fiscal de la empresa',
      suffix: 'MXN'
    },
    {
      id: 'total_dias_empresa',
      label: 'Suma de días trabajados por todos los empleados',
      type: 'number',
      defaultValue: 3650,
      placeholder: 'Suma de días de toda la plantilla en el año'
    },
    {
      id: 'total_salarios_empresa',
      label: 'Suma de salarios anuales de todos los empleados ($)',
      type: 'number',
      defaultValue: 1200000,
      placeholder: 'Suma de salarios devengados por la plantilla'
    },
    {
      id: 'dias_trabajados_usuario',
      label: 'Tus días trabajados en el año de utilidad',
      type: 'number',
      defaultValue: 365,
      placeholder: 'Tus días laborados (máx 365)'
    },
    {
      id: 'salario_anual_usuario',
      label: 'Tu salario acumulado en ese año ($)',
      type: 'number',
      defaultValue: 180000,
      placeholder: 'Tu sueldo bruto anual acumulado',
      suffix: 'MXN'
    },
    {
      id: 'sueldo_mensual_usuario',
      label: 'Tu sueldo mensual actual ($) (para tope LFT)',
      type: 'number',
      defaultValue: 15000,
      placeholder: 'Sueldo mensual actual',
      suffix: 'MXN'
    }
  ],
  calculate: (inputs) => {
    const ptuTotal = parseFloat(inputs.monto_utilidad_total) || 0;
    const diasEmpresa = parseFloat(inputs.total_dias_empresa) || 1;
    const salariosEmpresa = parseFloat(inputs.total_salarios_empresa) || 1;
    const diasUsuario = Math.min(365, parseFloat(inputs.dias_trabajados_usuario) || 0);
    const salarioAnualUsuario = parseFloat(inputs.salario_anual_usuario) || 0;
    const sueldoMensual = parseFloat(inputs.sueldo_mensual_usuario) || 0;

    // 1. PTU is divided into two halves
    const bolsaDias = ptuTotal / 2;
    const bolsaSalarios = ptuTotal / 2;

    // 2. Portion based on days worked
    const ptuPorDias = (bolsaDias / diasEmpresa) * diasUsuario;

    // 3. Portion based on wages earned
    const ptuPorSalarios = (bolsaSalarios / salariosEmpresa) * salarioAnualUsuario;

    const ptuBrutaCalculada = ptuPorDias + ptuPorSalarios;

    // 4. LFT Cap: Max of 3 months salary or the average of the last 3 years PTU.
    // For general simulation, we calculate the 3 months cap.
    const tope3Meses = sueldoMensual * 3;
    const ptuFinalConTope = Math.min(ptuBrutaCalculada, tope3Meses);
    const excedenteRecortado = Math.max(0, ptuBrutaCalculada - tope3Meses);

    // 5. Tax Exemption: 15 UMAS (UMA 2024 = 108.57)
    const exentoPtu = 15 * 108.57;
    const ptuGravable = Math.max(0, ptuFinalConTope - exentoPtu);

    const steps = [
      {
        description: `La bolsa de utilidades ($${ptuTotal.toFixed(2)}) se divide en dos partes iguales del 50%. Una se reparte por días trabajados y la otra por salarios devengados.`,
        mathFormula: `Bolsa\\ D\\acute{\\imath}as = Bolsa\\ Salarios = \\frac{$${ptuTotal.toFixed(2)}}{2} = $${bolsaDias.toFixed(2)}`
      },
      {
        description: `Se calcula tu porción de utilidades por Días Trabajados.`,
        mathFormula: `PTU\\ D\\acute{\\imath}as = \\left( \\frac{$${bolsaDias.toFixed(2)}}{${diasEmpresa}} \\right) \\times ${diasUsuario} = $${ptuPorDias.toFixed(2)}`
      },
      {
        description: `Se calcula tu porción de utilidades por Salarios Devengados.`,
        mathFormula: `PTU\\ Salarios = \\left( \\frac{$${bolsaSalarios.toFixed(2)}}{$${salariosEmpresa.toFixed(2)}} \\right) \\times $${salarioAnualUsuario.toFixed(2)} = $${ptuPorSalarios.toFixed(2)}`
      },
      {
        description: `Se suman ambas partes para obtener la PTU Bruta Inicial.`,
        mathFormula: `PTU\\ Bruta = $${ptuPorDias.toFixed(2)} + $${ptuPorSalarios.toFixed(2)} = $${ptuBrutaCalculada.toFixed(2)}`
      },
      {
        description: `Se aplica el tope del Artículo 127 de la LFT (máximo de 3 meses de salario ordinario: $${tope3Meses.toFixed(2)}).`,
        mathFormula: `PTU\\ Final = M\\acute{\\imath}n(PTU\\ Bruta,\\ 3\\ meses\\ sueldo) = M\\acute{\\imath}n($${ptuBrutaCalculada.toFixed(2)}, $${tope3Meses.toFixed(2)}) = $${ptuFinalConTope.toFixed(2)}`
      },
      {
        description: `Se descuenta la exención fiscal del SAT equivalente a 15 UMAS ($${exentoPtu.toFixed(2)}). Solo la diferencia genera pago de ISR.`,
        mathFormula: `Base\\ Gravable = $${ptuFinalConTope.toFixed(2)} - $${exentoPtu.toFixed(2)} = $${ptuGravable.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'PTU por Días Trabajados', value: ptuPorDias, formatted: `$${ptuPorDias.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'PTU por Salario Devengado', value: ptuPorSalarios, formatted: `$${ptuPorSalarios.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'PTU Bruto Sin Tope', value: ptuBrutaCalculada, formatted: `$${ptuBrutaCalculada.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Tope LFT (3 Meses de Sueldo)', value: tope3Meses, formatted: `$${tope3Meses.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Monto Exento de ISR (15 UMAS)', value: exentoPtu, formatted: `$${exentoPtu.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` },
        { label: 'Monto Gravable para Retención de ISR', value: ptuGravable, formatted: `$${ptuGravable.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'PTU Neta Estimada a Pagar', value: ptuFinalConTope, formatted: `$${ptuFinalConTope.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'La Participación de los Trabajadores en las Utilidades (PTU) es un derecho constitucional en México en el que los trabajadores reciben una parte de las ganancias fiscales netas generadas por su patrón durante el año fiscal anterior. La Ley Federal del Trabajo dicta que se debe repartir el 10% de la utilidad fiscal de la empresa, dividiéndose a la mitad para premiar equitativamente los días trabajados y la otra mitad el salario bruto devengado.',
    formula: 'Mitad 1 (Días) = ( 50% Bolsa / Días de todos ) * Días del trabajador\n\nMitad 2 (Salario) = ( 50% Bolsa / Salarios de todos ) * Salario del trabajador\n\nTope LFT = Máximo entre 3 meses de salario o promedio de utilidades de los últimos 3 años.',
    example: 'Una empresa reparte $500,000. La suma de días es 3,650 y salarios es $1,200,000. Tú laboraste 365 días y ganaste $180,000, con sueldo mensual de $15,000:\nBolsa Días = $250,000. Tu porción = ($250,000 / 3650) * 365 = $25,000 pesos.\nBolsa Salarios = $250,000. Tu porción = ($250,000 / $1.2M) * $180k = $37,500 pesos.\nPTU Bruto = $25,000 + $37,500 = $62,500 pesos.\nTope LFT (3 meses de sueldo) = $15,000 * 3 = $45,000 pesos.\nPTU Final a recibir = Mínimo($62,500, $45,000) = $45,000 pesos.\nExención SAT = 15 UMAS ($1,628.55). Gravable para ISR = $43,371.45 pesos.',
    legislation: 'Ley Federal del Trabajo (LFT), Artículos 117 al 131 (Reparto de utilidades y topes aplicables), y Ley del ISR Artículo 93 Fracción XIV (Exención fiscal de 15 UMAS).',
    faqs: [
      {
        question: '¿Cuándo se debe pagar el reparto de utilidades?',
        answer: 'Para empresas morales (personas jurídicas), la fecha límite de pago es a más tardar el 30 de mayo. Para personas físicas con actividad empresarial (patrones individuales), el pago debe entregarse a más tardar el 30 de junio.'
      },
      {
        question: '¿Qué empleados no tienen derecho al cobro de utilidades?',
        answer: 'Directores generales, administradores, gerentes generales, socios o accionistas, trabajadores domésticos, y trabajadores eventuales que hayan laborado menos de 60 días en el año correspondiente.'
      }
    ],
    tips: [
      'Si saliste de la empresa durante el año pero acumulaste más de 60 días trabajados, tienes derecho proporcional al cobro de utilidades. Acércate a Recursos Humanos en el mes de mayo para cobrar tu parte.',
      'El tope de 3 meses de salario fue introducido en la reforma laboral de subcontratación (outsourcing) para evitar distorsiones exorbitantes en sectores como la minería o finanzas, garantizando un reparto equitativo.'
    ],
    errors: [
      'Creer que si la empresa reporta pérdida fiscal de todos modos deben pagarte utilidades. Si la declaración anual de la empresa no muestra base gravable o utilidad neta positiva, no hay utilidad legal a repartir.',
      'Calcular el tope de 3 meses utilizando el salario neto. Legalmente, el tope se calcula utilizando la cuota diaria del salario mensual bruto de cotización.'
    ]
  }
};
