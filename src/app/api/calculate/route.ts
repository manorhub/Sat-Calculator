import { NextResponse } from 'next/server';
import { calculators } from '../../../calculators';

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const body = await request.json();
    const { calculatorId, inputs } = body;

    if (!calculatorId || !inputs) {
      return NextResponse.json(
        { error: 'Parámetros requeridos faltantes: "calculatorId" e "inputs" son mandatorios.' },
        { status: 400 }
      );
    }

    const calculator = calculators.find((c) => c.id === calculatorId);

    if (!calculator) {
      return NextResponse.json(
        { error: `Calculadora con id "${calculatorId}" no encontrada.` },
        { status: 404 }
      );
    }

    // Call the calculator engine logic
    const calculationResult = calculator.calculate(inputs);

    const isSandbox = !apiKey;

    return NextResponse.json({
      status: 'success',
      mode: isSandbox ? 'sandbox_free_tier' : 'production_commercial',
      calculator: {
        id: calculator.id,
        title: calculator.title,
        category: calculator.category,
      },
      inputs,
      results: calculationResult.results.map(r => ({
        label: r.label,
        value: r.value,
        formatted: r.formatted,
        isMain: r.isMain || false
      })),
      steps: calculationResult.steps,
      message: isSandbox 
        ? 'Aviso: Estás utilizando la API en plan gratuito. Adquiere un x-api-key en el portal de desarrolladores para uso en producción.'
        : 'Llamada de API validada y acreditada comercialmente.'
    });
  } catch (error: any) {
    console.error('Error in API calculate handler:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el cálculo en el servidor.' },
      { status: 500 }
    );
  }
}
