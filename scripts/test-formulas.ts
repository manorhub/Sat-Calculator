import { calculators } from '../src/calculators';

console.log('🧪 Iniciando Pruebas Unitarias de Fórmulas Fiscales...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ PASÓ: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FALLÓ: ${message}`);
    failedTests++;
  }
}

// 1. Test IVA Calculator
const ivaCalc = calculators.find(c => c.id === 'calculo-iva');
if (ivaCalc) {
  const res1 = ivaCalc.calculate({ monto: 1000, tipo_accion: 'agregar', tasa: 16 });
  const subtotal = res1.results.find(r => r.label === 'Subtotal Base')?.value;
  const iva = res1.results.find(r => r.label === 'IVA Calculado')?.value;
  const total = res1.results.find(r => r.label === 'Total Neto')?.value;

  assert(subtotal === 1000, 'IVA: Subtotal base correcto');
  assert(iva === 160, 'IVA: IVA 16% calculado correcto');
  assert(total === 1160, 'IVA: Total sumado correcto');
} else {
  console.error('No se encontró la calculadora de IVA.');
  failedTests++;
}

// 2. Test RESICO Calculator
const resicoCalc = calculators.find(c => c.id === 'calculo-resico-pf');
if (resicoCalc) {
  const res1 = resicoCalc.calculate({ ingresos: 20000, factura_persona_moral: false, ingresos_persona_moral: 0 });
  const rate = res1.results.find(r => r.label === 'Tasa Aplicada')?.value;
  const isrBruto = res1.results.find(r => r.label === 'ISR Bruto Determinado')?.value;

  assert(rate === 1, 'RESICO: Tasa para $20,000 es 1%');
  assert(isrBruto === 200, 'RESICO: ISR Bruto para $20,000 es $200');
} else {
  console.error('No se encontró la calculadora de RESICO.');
  failedTests++;
}

// 3. Test RESICO vs Actividad Comparador
const resicoVsActCalc = calculators.find(c => c.id === 'calculo-resico-vs-actividad');
if (resicoVsActCalc) {
  const res = resicoVsActCalc.calculate({ ingresos_mensuales: 35000, gastos_deducibles: 15000 });
  const isrResico = res.results.find(r => r.label === 'ISR a Pagar en RESICO')?.value;
  const recommend = res.results.find(r => r.label === 'Régimen Recomendado (Menos Impuesto)')?.value;

  assert(Math.round(isrResico || 0) === 385, 'Comparador: ISR RESICO correcto para $35k ($385)');
  assert(recommend === 1, 'Comparador: Recomienda RESICO correctamente para ingresos con gastos de 15k');
} else {
  console.error('No se encontró el comparador de RESICO.');
  failedTests++;
}

// 4. Test Aguinaldo Calculator
const aguinaldoCalc = calculators.find(c => c.id === 'calculo-aguinaldo');
if (aguinaldoCalc) {
  const res1 = aguinaldoCalc.calculate({ sueldo_mensual: 30000, dias_aguinaldo: 15, dias_trabajados: 365 });
  const bruto = res1.results.find(r => r.label === 'Aguinaldo Bruto Proporcional')?.value;
  assert(Math.round(bruto || 0) === 15000, 'Aguinaldo: Monto bruto completo correcto');
} else {
  console.error('No se encontró la calculadora de Aguinaldo.');
  failedTests++;
}

// 5. Test PTU Calculator
const ptuCalc = calculators.find(c => c.id === 'calculo-ptu');
if (ptuCalc) {
  const res = ptuCalc.calculate({
    monto_utilidad_total: 500000,
    total_dias_empresa: 3650,
    total_salarios_empresa: 1200000,
    dias_trabajados_usuario: 365,
    salario_anual_usuario: 180000,
    sueldo_mensual_usuario: 15000
  });
  const ptuNeta = res.results.find(r => r.label === 'PTU Neta Estimada a Pagar')?.value;
  assert(ptuNeta === 45000, 'PTU: Cálculo con tope de 3 meses de ley correcto ($45,000)');
} else {
  console.error('No se encontró la calculadora de PTU.');
  failedTests++;
}

// 6. Test 50/30/20 Budget Calculator
const budgetCalc = calculators.find(c => c.id === 'calculo-regla-50-30-20');
if (budgetCalc) {
  const res = budgetCalc.calculate({
    ingreso_neto_mensual: 20000,
    gastos_necesidades: 8000,
    gastos_deseos: 6000
  });
  const idealAhorro = res.results.find(r => r.label === 'Presupuesto Ahorro Ideal (20%)')?.value;
  const realAhorro = res.results.find(r => r.label === 'Tu Capacidad de Ahorro Real Restante')?.value;

  assert(idealAhorro === 4000, 'Presupuesto: Ahorro ideal del 20% correcto ($4,000)');
  assert(realAhorro === 6000, 'Presupuesto: Ahorro real obtenido correcto ($6,000)');
} else {
  console.error('No se encontró la calculadora de presupuesto 50/30/20.');
  failedTests++;
}

// 7. Test ISR Persona Moral
const isrPmCalc = calculators.find(c => c.id === 'calculo-isr-pm');
if (isrPmCalc) {
  const res = isrPmCalc.calculate({ ingresos_periodo: 200000, coeficiente: 0.15, pagos_previos: 5000, retenciones_banco: 0 });
  const isrNeto = res.results.find(r => r.label === 'ISR Neto Provisional a Pagar')?.value;
  assert(isrNeto === 4000, 'ISR PM: Pago neto mensual provisional correcto ($4,000)');
} else {
  console.error('No se encontró la calculadora de ISR Persona Moral.');
  failedTests++;
}

// 8. Test UMA Calculator
const umaCalc = calculators.find(c => c.id === 'calculo-uma');
if (umaCalc) {
  const res = umaCalc.calculate({ unidades_uma: 10, ano_uma: 2024, frecuencia_uma: 'diario' });
  const pesos = res.results.find(r => r.label === 'Pesos Mexicanos Equivalentes')?.value;
  assert(Math.round((pesos || 0) * 100) / 100 === 1085.70, 'UMA: Conversión de 10 UMAS diarias 2024 correcta ($1085.70)');
} else {
  console.error('No se encontró la calculadora de UMA.');
  failedTests++;
}

// 9. Test Punto de Equilibrio
const peCalc = calculators.find(c => c.id === 'calculo-punto-equilibrio');
if (peCalc) {
  const res = peCalc.calculate({ costos_fijos: 10000, precio_unidad: 100, costo_variable_unidad: 50 });
  const units = res.results.find(r => r.label === 'Unidades Físicas a Vender en el Mes')?.value;
  assert(units === 200, 'Punto de Equilibrio: 200 unidades calculadas correctas');
} else {
  console.error('No se encontró la calculadora de Punto de Equilibrio.');
  failedTests++;
}

// 10. Test Préstamo Personal
const prestamoCalc = calculators.find(c => c.id === 'calculo-prestamo-personal');
if (prestamoCalc) {
  const res = prestamoCalc.calculate({ monto_prestamo: 20000, tasa_anual: 28, plazo_meses: 12, frecuencia_pago: 'mensual' });
  const pago = res.results.find(r => r.label === 'Pago Periódico')?.value;
  const totalPagado = res.results.find(r => r.label === 'Total Pagado Final')?.value;
  assert(Math.round(pago || 0) === 1930, 'Préstamo: Pago mensual correcto (~$1930)');
  assert(Math.round(totalPagado || 0) === 23161, 'Préstamo: Total pagado correcto (~$23161)');
} else {
  console.error('No se encontró la calculadora de Préstamos Personales.');
  failedTests++;
}

// 11. Test Tipo de Cambio
const tipoCambioCalc = calculators.find(c => c.id === 'calculo-tipo-de-cambio');
if (tipoCambioCalc) {
  const res = tipoCambioCalc.calculate({ monto: 100, direccion: 'usd_to_mxn', tipo_cambio: 18.50 });
  const total = res.results.find(r => r.label === 'Resultado Neto en MXN')?.value;
  assert(total === 1850, 'Tipo de Cambio: 100 USD convertidos a MXN a 18.50 son $1850');
} else {
  console.error('No se encontró la calculadora de Tipo de Cambio.');
  failedTests++;
}

// 12. Test Depreciación Activos
const depreciacionCalc = calculators.find(c => c.id === 'calculo-depreciacion-activos');
if (depreciacionCalc) {
  const res = depreciacionCalc.calculate({ moi: 25000, tipo_activo: 'computadoras', meses_uso: 12 });
  const depAnual = res.results.find(r => r.label === 'Depreciación Anual Completa')?.value;
  const depProporcional = res.results.find(r => r.label === 'Depreciación Proporcional del Ejercicio')?.value;
  assert(depAnual === 7500, 'Depreciación: Anual del 30% para $25,000 es $7,500');
  assert(depProporcional === 7500, 'Depreciación: Proporcional por 12 meses es $7,500');
} else {
  console.error('No se encontró la calculadora de Depreciación de Activos.');
  failedTests++;
}

// 13. Test AFORE
const aforeCalc = calculators.find(c => c.id === 'calculo-afore');
if (aforeCalc) {
  const res = aforeCalc.calculate({ saldo_actual: 50000, edad_actual: 30, edad_retiro: 65, salario_mensual: 15000, aportacion_voluntaria: 500, rendimiento_anual: 5.5 });
  const saldo = res.results.find(r => r.label === 'Saldo Estimado en AFORE al Jubilarte')?.value;
  const pension = res.results.find(r => r.label === 'Pensión Mensual Estimada')?.value;
  assert(Math.round(saldo || 0) === 2215865, 'AFORE: Saldo al jubilarte correcto (~$2.21M)');
  assert(Math.round(pension || 0) === 9233, 'AFORE: Pensión mensual estimada correcta (~$9,233)');
} else {
  console.error('No se encontró la calculadora de AFORE.');
  failedTests++;
}

// 14. Test Horas Extra
const horasExtraCalc = calculators.find(c => c.id === 'calculo-horas-extra');
if (horasExtraCalc) {
  const res = horasExtraCalc.calculate({ sueldo_mensual: 15000, horas_extra: 10, domingos_trabajados: 1 });
  const total = res.results.find(r => r.label === 'Total Extra Bruto a Pagar')?.value;
  const dobles = res.results.find(r => r.label === 'Pago Horas Extras Dobles')?.value;
  const triples = res.results.find(r => r.label === 'Pago Horas Extras Triples')?.value;
  const prima = res.results.find(r => r.label === 'Pago Prima Dominical')?.value;
  assert(total === 1437.5, 'Horas Extra: Pago extra bruto correcto ($1,437.50)');
  assert(dobles === 1125, 'Horas Extra: Pago extras dobles correcto ($1,125)');
  assert(triples === 187.5, 'Horas Extra: Pago extras triples correcto ($187.50)');
  assert(prima === 125, 'Horas Extra: Pago prima dominical correcto ($125)');
} else {
  console.error('No se encontró la calculadora de Horas Extra.');
  failedTests++;
}

// 15. Test Conversión Impuestos (Gross-up)
const conversionImpCalc = calculators.find(c => c.id === 'calculo-conversion-impuestos');
if (conversionImpCalc) {
  const res = conversionImpCalc.calculate({ neto_deseado: 10000, tipo_actividad: 'honorarios', cliente_moral: true });
  const bruto = res.results.find(r => r.label === 'Subtotal Base (Bruto)')?.value;
  const neto = res.results.find(r => r.label === 'Total Neto Recibido')?.value;
  assert(Math.round(bruto || 0) === 10490, 'Gross-up: Subtotal bruto correcto (~$10,490)');
  assert(Math.round(neto || 0) === 10000, 'Gross-up: Neto recibido correcto ($10,000)');
} else {
  console.error('No se encontró la calculadora de Conversión de Impuestos.');
  failedTests++;
}

// 16. Test Recargos y Actualizaciones
const recargosCalc = calculators.find(c => c.id === 'calculo-recargos-sat');
if (recargosCalc) {
  const res = recargosCalc.calculate({ monto_impuesto: 5000, meses_retraso: 3, estimar_actualizacion: true });
  const total = res.results.find(r => r.label === 'Monto Total Extemporáneo a Pagar')?.value;
  const actualizacion = res.results.find(r => r.label === 'Importe de Actualización (Inflación)')?.value;
  const recargos = res.results.find(r => r.label === 'Recargos Moratorios del Período')?.value;
  assert(Math.round(total || 0) === 5275, 'Recargos: Monto total extemporáneo a pagar correcto (~$5,275)');
  assert(actualizacion === 52.5, 'Recargos: Actualización por inflación correcta ($52.50)');
  assert(Math.round(recargos || 0) === 223, 'Recargos: Recargos moratorios correctos (~$223)');
} else {
  console.error('No se encontró la calculadora de Recargos y Actualizaciones.');
  failedTests++;
}

console.log(`\n========================================`);
console.log(`RESULTADOS DE LAS PRUEBAS UNITARIAS:`);
console.log(`PASARON: ${passedTests} de ${passedTests + failedTests}`);
if (failedTests > 0) {
  console.error(`💥 SE DETECTARON ${failedTests} ERRORES.`);
  process.exit(1);
} else {
  console.log(`🎉 ¡TODAS LAS PRUEBAS PASARON CORRECTAMENTE!`);
  process.exit(0);
}
