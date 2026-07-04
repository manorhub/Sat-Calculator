import { CalculatorConfig } from '../../types/calculator';

export const compoundInterestCalculator: CalculatorConfig = {
  id: 'calculo-interes-compuesto',
  title: 'Calculadora de Interés Compuesto',
  shortDescription: 'Visualiza el crecimiento de tus ahorros e inversiones a largo plazo aplicando interés compuesto y aportaciones mensuales.',
  category: 'Interés Compuesto',
  categorySlug: 'interes-compuesto',
  slug: 'calculadora-interes-compuesto',
  seo: {
    metaTitle: 'Calculadora de Interés Compuesto 2026 - Ahorro e Inversión',
    metaDescription: 'Simula el crecimiento de tu capital financiero. Calcula las ganancias reinvirtiendo rendimientos con aportaciones periódicas mensuales.',
    keywords: ['calculadora interes compuesto', 'interes compuesto ahorro', 'crecimiento de capital', 'planificacion retiro', 'simulador de inversion'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'capital_inicial',
      label: 'Depósito Inicial ($)',
      type: 'number',
      defaultValue: 10000,
      placeholder: 'Capital de arranque',
      suffix: 'MXN'
    },
    {
      id: 'aportacion_mensual',
      label: 'Aportación Mensual Adicional ($)',
      type: 'number',
      defaultValue: 1000,
      placeholder: 'Cantidad a ahorrar cada mes',
      suffix: 'MXN'
    },
    {
      id: 'tasa_anual',
      label: 'Tasa de Interés Anual Estimada (%)',
      type: 'number',
      defaultValue: 10.00,
      placeholder: 'Ej: 10.00 %'
    },
    {
      id: 'anos',
      label: 'Plazo (Años)',
      type: 'number',
      defaultValue: 10,
      placeholder: 'Años de ahorro'
    }
  ],
  calculate: (inputs) => {
    const capitalInicial = parseFloat(inputs.capital_inicial) || 0;
    const aportacionMensual = parseFloat(inputs.aportacion_mensual) || 0;
    const tasaAnual = parseFloat(inputs.tasa_anual) || 0;
    const years = parseInt(inputs.anos) || 10;

    const monthlyRate = tasaAnual / 12 / 100;
    const totalMonths = years * 12;

    let balance = capitalInicial;
    let totalInvertido = capitalInicial;
    let totalIntereses = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interesGanado = balance * monthlyRate;
      balance += interesGanado + aportacionMensual;
      totalInvertido += aportacionMensual;
      totalIntereses += interesGanado;
    }

    const steps = [
      {
        description: `Se inicia con un capital base de $${capitalInicial.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
      },
      {
        description: `Cada mes, el capital acumulado genera intereses a una tasa mensual del ${(monthlyRate * 100).toFixed(4)}% y se le suma una aportación periódica de $${aportacionMensual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
      },
      {
        description: `Al cabo de ${totalMonths} meses (${years} años), el capital total aportado por el ahorrador suma $${totalInvertido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
      },
      {
        description: `Los intereses generados y reinvertidos de forma compuesta sumaron un total de $${totalIntereses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
        mathFormula: `Total\\ Acumulado = Capital\\ Invertido + Intereses = $${totalInvertido.toFixed(2)} + $${totalIntereses.toFixed(2)} = $${balance.toFixed(2)}`
      }
    ];

    return {
      results: [
        { label: 'Capital Total Aportado', value: totalInvertido, formatted: `$${totalInvertido.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Total de Intereses Generados', value: totalIntereses, formatted: `$${totalIntereses.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` },
        { label: 'Tasa Mensual Equivalente', value: monthlyRate * 100, formatted: `${(monthlyRate * 100).toFixed(4)} %` },
        { label: 'Saldo Total Acumulado', value: balance, formatted: `$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, isMain: true }
      ],
      steps
    };
  },
  content: {
    explanation: 'El interés compuesto representa la acumulación de rendimientos generados sobre un capital inicial, donde las ganancias o intereses generados se suman periódicamente al saldo principal. Esto significa que en el siguiente periodo, los nuevos intereses se calculan sobre la suma total anterior (los intereses a su vez ganan intereses). Albert Einstein lo catalogó como la "octava maravilla del mundo".',
    formula: 'A = P * (1 + r/n)^(n*t) + PMT * [ ((1 + r/n)^(n*t) - 1) / (r/n) ]\nDonde:\nA = Saldo final acumulado\nP = Capital inicial\nr = Tasa anual\nn = Frecuencia de capitalización (mensual = 12)\nt = Años\nPMT = Depósito recurrente mensual',
    example: 'Inicias con $10,000 pesos, aportas $1,000 pesos al mes al 10.00% anual durante 10 años:\nTu capital invertido directo es de $130,000 pesos.\nGracias al interés compuesto, generas $74,845 pesos adicionales en puros intereses.\nEl saldo total acumulado disponible al final de los 10 años es de $204,845 pesos.',
    legislation: 'Código de Comercio en México (que valida la legalidad de la reinversión y capitalización de intereses en el sector bursátil y comercial).',
    faqs: [
      {
        question: '¿Cuál es la diferencia con el interés simple?',
        answer: 'En el interés simple, las ganancias se retiran al final de cada periodo y el capital inicial se mantiene fijo; el interés recibido es siempre el mismo. En el interés compuesto, las ganancias se quedan adentro de la cuenta para incrementar la base sobre la que se calcula el nuevo interés.'
      },
      {
        question: '¿Qué instrumentos en México dan interés compuesto?',
        answer: 'Las cuentas bancarias con pagarés renovables con interés capitalizable, los fondos de inversión automatizados, el Afore (aportaciones voluntarias) y los Certificados de la Tesorería (CETES) si activas la reinversión automática al vencimiento.'
      }
    ],
    tips: [
      'Empieza a ahorrar lo antes posible. El factor más importante en el interés compuesto no es la cantidad de dinero, sino el TIEMPO de maduración.',
      'Mantén constancia en tus aportaciones adicionales; incluso montos pequeños mensuales multiplican significativamente el valor final de tu portafolio debido al efecto bola de nieve.'
    ],
    errors: [
      'Retirar las ganancias para gastarlas. Si retiras los intereses ganados en cada mes, detienes el efecto compuesto y tu dinero crecerá únicamente de forma lineal (simple).',
      'No considerar el impacto de la inflación. Para conocer el crecimiento real de tus ahorros, debes restar la tasa de inflación a la tasa de interés nominal obtenida.'
    ]
  }
};
