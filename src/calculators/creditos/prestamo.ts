import { CalculatorConfig } from '../../types/calculator';

export const prestamoCalculator: CalculatorConfig = {
  id: 'calculo-prestamo-personal',
  title: 'Calculadora de Préstamos Personales',
  shortDescription: 'Calcula tus pagos periódicos (mensuales, quincenales o semanales) y el total de intereses de un préstamo personal.',
  category: 'Préstamos',
  categorySlug: 'prestamos',
  slug: 'calculadora-prestamo-personal',
  seo: {
    metaTitle: 'Calculadora de Préstamos Personales 2026 - Tabla de Amortización',
    metaDescription: 'Simula tu préstamo personal o crédito de nómina en México. Calcula el pago periódico (semanal, quincenal, mensual) y los intereses totales a pagar.',
    keywords: ['calculadora prestamos', 'simulador de credito personal', 'amortizacion de prestamos', 'intereses de prestamos', 'pagos semanales prestamo'],
    schemaType: 'Calculator'
  },
  inputs: [
    {
      id: 'monto_prestamo',
      label: 'Monto del Préstamo ($)',
      type: 'number',
      defaultValue: 20000,
      placeholder: 'Ej: $20,000 pesos',
      suffix: 'MXN'
    },
    {
      id: 'tasa_anual',
      label: 'Tasa de Interés Anual Fija (%)',
      type: 'number',
      defaultValue: 28,
      placeholder: 'Ej: 28 %'
    },
    {
      id: 'plazo_meses',
      label: 'Plazo (Meses)',
      type: 'number',
      defaultValue: 12,
      placeholder: 'Ej: 12 meses'
    },
    {
      id: 'frecuencia_pago',
      label: 'Frecuencia de Pago',
      type: 'select',
      defaultValue: 'mensual',
      options: [
        { label: 'Semanal', value: 'semanal' },
        { label: 'Quincenal', value: 'quincenal' },
        { label: 'Mensual', value: 'mensual' }
      ]
    }
  ],
  calculate: (inputs, lang) => {
    const monto = parseFloat(inputs.monto_prestamo) || 0;
    const tasaAnual = parseFloat(inputs.tasa_anual) || 0;
    const meses = parseInt(inputs.plazo_meses) || 12;
    const frecuencia = inputs.frecuencia_pago;
    const isEn = lang === 'en';

    let pagosPorAno = 12;
    let totalPagos = meses;
    if (frecuencia === 'quincenal') {
      pagosPorAno = 24;
      totalPagos = meses * 2;
    } else if (frecuencia === 'semanal') {
      pagosPorAno = 52;
      totalPagos = Math.round(meses * 4.3333);
    }

    const tasaPeriodo = (tasaAnual / 100) / pagosPorAno;

    let pagoPeriodico = 0;
    if (monto > 0 && tasaPeriodo > 0) {
      pagoPeriodico = (monto * tasaPeriodo * Math.pow(1 + tasaPeriodo, totalPagos)) / (Math.pow(1 + tasaPeriodo, totalPagos) - 1);
    } else if (monto > 0) {
      pagoPeriodico = monto / totalPagos;
    }

    const totalPagado = pagoPeriodico * totalPagos;
    const totalInteres = totalPagado - monto;

    const steps = [
      {
        description: isEn
          ? `The total number of payments is determined according to the term in months (${meses}) and the chosen frequency (${frecuencia === 'quincenal' ? 'bi-weekly' : (frecuencia === 'semanal' ? 'weekly' : 'monthly')}).`
          : `Se determina el número total de pagos según el plazo en meses (${meses}) y la frecuencia elegida (${frecuencia}).`,
        mathFormula: `Total\\ de\\ Pagos = ${totalPagos}\\ pagos`
      },
      {
        description: isEn
          ? `The periodic interest rate is calculated by dividing the annual rate (${tasaAnual}%) by the number of periods in the year (${pagosPorAno}).`
          : `Se calcula la tasa de interés periódica dividiendo la tasa anual (${tasaAnual}%) entre el número de períodos del año (${pagosPorAno}).`,
        mathFormula: `Tasa\\ Per\\acute{o}dica = \\frac{${tasaAnual}\\%}{${pagosPorAno}} = ${(tasaPeriodo * 100).toFixed(4)}\\% = ${tasaPeriodo.toFixed(6)}`
      },
      {
        description: isEn
          ? `The French amortization formula is applied to calculate the fixed recurring payment.`
          : `Se aplica la fórmula de amortización francesa para calcular el pago recurrente fijo.`,
        mathFormula: `Pago = \\frac{Monto \\times r \\times (1 + r)^n}{(1 + r)^n - 1} = $${pagoPeriodico.toFixed(2)}`
      },
      {
        description: isEn
          ? `The total cost and accumulated interest are calculated by multiplying the recurring payment by the total number of payments.`
          : `Se calcula el costo total y el interés acumulado multiplicando el pago recurrente por el número total de pagos.`,
        mathFormula: `Total\\ Pagado = $${pagoPeriodico.toFixed(2)} \\times ${totalPagos} = $${totalPagado.toFixed(2)}\\\\Inter\\acute{e}s\\ Total = $${totalPagado.toFixed(2)} - $${monto.toFixed(2)} = $${totalInteres.toFixed(2)}`
      }
    ];

    return {
      results: [
        { 
          label: isEn ? 'Periodic Payment' : 'Pago Periódico', 
          value: pagoPeriodico, 
          formatted: `$${pagoPeriodico.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` 
        },
        { 
          label: isEn ? 'Requested Amount' : 'Monto Solicitado', 
          value: monto, 
          formatted: `$${monto.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` 
        },
        { 
          label: isEn ? 'Total Interest to Pay' : 'Intereses Totales a Pagar', 
          value: totalInteres, 
          formatted: `$${totalInteres.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN` 
        },
        { 
          label: isEn ? 'Final Paid Total' : 'Total Pagado Final', 
          value: totalPagado, 
          formatted: `$${totalPagado.toLocaleString(isEn ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`, 
          isMain: true 
        }
      ],
      steps
    };
  },
  content: {
    explanation: 'Un préstamo personal amortizable mediante el sistema francés mantiene pagos fijos durante todo el plazo, donde al inicio la mayor parte del pago cubre intereses y una menor parte abona a capital. A medida que avanza el plazo, la proporción se invierte (se paga más a capital y menos de interés). Es el esquema más utilizado por bancos y microfinancieras en México.',
    formula: 'Fórmula de Amortización Francesa:\nPMT = (P * r * (1 + r)^n) / ((1 + r)^n - 1)\n\nDonde:\nPMT = Pago periódico fijo\nP = Monto del préstamo principal\nr = Tasa de interés del período\nn = Número total de pagos',
    example: 'Si solicitas un préstamo de $20,000 pesos a un plazo de 12 meses con una tasa de interés del 28% anual con pagos mensuales:\nr = 0.28 / 12 = 0.023333 mensual\nn = 12 pagos mensuales\nEl pago mensual fijo será de $1,927.42 pesos.\nEl total pagado al final de los 12 meses será de $23,129.07 pesos, con un costo total de intereses de $3,129.07 pesos.',
    legislation: 'Ley de Transparencia y Ordenamiento de los Servicios Financieros, y lineamientos del Banco de México para el cálculo del Costo Anual Total (CAT) aplicable en contratos de adhesión de crédito.',
    faqs: [
      {
        question: '¿Qué es la amortización francesa?',
        answer: 'Es un sistema de amortización de préstamos donde las cuotas de pago (mensualidades, quincenas, etc.) son constantes durante todo el plazo del crédito, siempre y cuando la tasa de interés sea fija.'
      },
      {
        question: '¿Por qué la tasa quincenal o semanal hace que termine pagando más intereses?',
        answer: 'Al incrementar la frecuencia de capitalización, el interés se calcula más seguido. Sin embargo, la ventaja es que liquidas la deuda o abonas a capital de forma más recurrente, lo cual disminuye el capital base si se realizan pagos anticipados.'
      },
      {
        question: '¿Qué diferencia hay entre la tasa de interés y el CAT?',
        answer: 'La tasa de interés nominal solo incluye el costo del dinero prestado. El CAT (Costo Anual Total) incluye todo el costo del financiamiento: tasa de interés, comisiones por apertura, seguros obligatorios y cualquier otro cargo anualizado, expresado en porcentaje.'
      }
    ],
    tips: [
      'Si tienes posibilidad, realiza aportaciones a capital para disminuir el saldo insoluto y reducir el interés de las mensualidades futuras.',
      'Compara siempre el CAT entre diferentes instituciones antes de firmar un contrato, no solo te guíes por la mensualidad.',
      'Si el préstamo es de mayor monto y a largo plazo para adquirir vivienda, te sugerimos simularlo en la [Calculadora de Crédito Hipotecario](/calculadoras/hipotecas/calculadora-credito-hipotecario).'
    ],
    errors: [
      'Considerar que los pagos siempre serán iguales sin leer los cargos adicionales como comisiones de cobranza o seguros de vida obligatorios.',
      'Suponer que una tasa del 28% anual en pago semanal es equivalente a una tasa del 28% con pago mensual sin ajustar el número de períodos.'
    ]
  },
  translations: {
    en: {
      title: 'Personal Loan Calculator',
      shortDescription: 'Calculate your periodic payments (monthly, bi-weekly, or weekly) and the total interest of a personal loan.',
      category: 'Loans',
      seo: {
        metaTitle: 'Personal Loan Calculator 2026 - Amortization Table',
        metaDescription: 'Simulate your personal loan or payroll credit in Mexico. Calculate the periodic payment (weekly, bi-weekly, monthly) and the total interest to be paid.',
        keywords: ['loan calculator', 'personal credit simulator', 'loan amortization', 'loan interest', 'weekly loan payments']
      },
      inputs: [
        {
          id: 'monto_prestamo',
          label: 'Loan Amount ($)',
          placeholder: 'e.g. $20,000 pesos'
        },
        {
          id: 'tasa_anual',
          label: 'Fixed Annual Interest Rate (%)',
          placeholder: 'e.g. 28 %'
        },
        {
          id: 'plazo_meses',
          label: 'Term (Months)',
          placeholder: 'e.g. 12 months'
        },
        {
          id: 'frecuencia_pago',
          label: 'Payment Frequency',
          options: [
            { label: 'Weekly', value: 'semanal' },
            { label: 'Bi-weekly', value: 'quincenal' },
            { label: 'Monthly', value: 'mensual' }
          ]
        }
      ],
      content: {
        explanation: 'A personal loan amortized using the French system maintains fixed payments throughout the term, where at the beginning the largest part of the payment covers interest and a smaller part goes to principal. As the term progresses, the proportion is reversed (more is paid to principal and less to interest). It is the most widely used scheme by banks and microfinance institutions in Mexico.',
        formula: 'French Amortization Formula:\nPMT = (P * r * (1 + r)^n) / ((1 + r)^n - 1)\n\nWhere:\nPMT = Fixed periodic payment\nP = Principal loan amount\nr = Interest rate of the period\nn = Total number of payments',
        example: 'If you request a loan of $20,000 pesos for a term of 12 months with an interest rate of 28% per year with monthly payments:\nr = 0.28 / 12 = 0.023333 monthly\nn = 12 monthly payments\nThe fixed monthly payment will be $1,927.42 pesos.\nThe total paid at the end of the 12 months will be $23,129.07 pesos, with a total interest cost of $3,129.07 pesos.',
        legislation: 'Law of Transparency and Ordering of Financial Services, and Banco de México guidelines for the calculation of the Total Annual Cost (CAT) applicable in credit adhesion contracts.',
        faqs: [
          {
            question: 'What is French amortization?',
            answer: 'It is a loan amortization system where payment installments (monthly, bi-weekly, etc.) are constant throughout the credit term, as long as the interest rate is fixed.'
          },
          {
            question: 'Why does a bi-weekly or weekly rate end up making me pay more interest?',
            answer: 'By increasing the compounding frequency, interest is calculated more often. However, the advantage is that you settle the debt or make capital payments more recurrently, which reduces the base capital if advance payments are made.'
          },
          {
            question: 'What is the difference between the interest rate and the CAT?',
            answer: 'The nominal interest rate only includes the cost of the borrowed money. The CAT (Total Annual Cost) includes all financing costs: interest rate, opening fees, mandatory insurance, and any other annualized charges, expressed as a percentage.'
          }
        ],
        tips: [
          'If possible, make additional principal payments to reduce the outstanding balance and lower the interest of future monthly payments.',
          'Always compare the CAT between different institutions before signing a contract, do not just guide yourself by the monthly payment.',
          'If the loan is for a larger amount and long term to acquire a house, we suggest you simulate it in the [Mortgage Credit Calculator](/calculadoras/hipotecas/calculadora-credito-hipotecario).'
        ],
        errors: [
          'Assuming payments will always be equal without reading additional charges such as collection fees or mandatory life insurance.',
          'Assuming that an annual rate of 28% in weekly payment is equivalent to a rate of 28% with monthly payment without adjusting the number of periods.'
        ]
      }
    }
  }
};
