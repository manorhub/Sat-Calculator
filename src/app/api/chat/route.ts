import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
Eres el Asistente Fiscal IA de Calculadora SAT. Eres un experto en impuestos de México (SAT), la Ley del Impuesto sobre la Renta (LISR), Ley del IVA, Ley Federal del Trabajo (LFT) y finanzas personales/empresariales.
Tu objetivo es responder de manera clara, pedagógica, profesional y fácil de entender para personas sin conocimientos contables.
Siempre que sea posible:
1. Explica el concepto de forma simple.
2. Cita brevemente el fundamento legal (ej: Art. 96 de la LISR, Art. 87 de la LFT).
3. Ofrece consejos prácticos y alerta sobre errores comunes.
Evita dar asesoría legal vinculante directa, añade siempre un recordatorio amigable de consultar con un contador titulado para decisiones críticas.
`;

export async function POST(request: Request) {
  try {
    const { message, history, context } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // High-quality local simulation fallback if no API key is provided
      let responseText = `Hola. Soy tu Asistente Fiscal IA en modo demostración local. Para darte respuestas personalizadas avanzadas con inteligencia en tiempo real, puedes configurar la variable de entorno \`GEMINI_API_KEY\`. 
      
Sin embargo, reconozco tu duda y aquí tienes información de valor sobre tu consulta:`;

      const query = message.toLowerCase();

      if (query.includes('resico')) {
        responseText += `
        
**Sobre el Régimen Simplificado de Confianza (RESICO):**
*   **¿Qué es?** Es un régimen para personas físicas con ingresos menores a 3.5 millones de pesos al año. Su beneficio clave son las tasas mínimas de ISR (del 1% al 2.5%).
*   **La trampa:** En RESICO no puedes deducir ningún gasto para el cálculo del ISR. Todo se calcula sobre tus ingresos brutos facturados.
*   **Retención:** Si facturas a una Persona Moral (empresa), te deben retener el 1.25% de ISR por ley (Art. 113-J de la LISR).
*   *Consejo:* Revisa si te conviene comparando tus gastos deducibles contra la tasa directa de RESICO.`;
      } else if (query.includes('iva') || query.includes('impuesto al valor')) {
        responseText += `
        
**Sobre el Impuesto al Valor Agregado (IVA):**
*   **Tasa General:** La tasa en México es del 16%. En la zona fronteriza norte y sur existe un estímulo que permite facturar al 8% bajo ciertas reglas de padrón del SAT.
*   **Desglose:** Para extraer el IVA de un monto total cobrado, debes dividir el total entre 1.16 (no multiplicarlo por 0.16).
*   **Tasa 0%:** Aplica a medicinas de patente, alimentos no preparados, exportación de servicios y libros. Está regulado por el Artículo 2-A de la Ley del IVA.`;
      } else if (query.includes('deduc') || query.includes('gasto')) {
        responseText += `
        
**Sobre las Deducciones en México:**
*   **Deducciones Autorizadas (Mensuales/Provisionales):** Gastos estrictamente indispensables para tu actividad comercial (renta, internet, insumos). No aplican si estás en RESICO.
*   **Deducciones Personales (Anuales):** Gastos de salud (médicos, dentistas, psicólogos), colegiaturas de hijos (con topes por nivel), intereses reales de hipotecas e Infonavit, y aportaciones al retiro (Afore/PPR).
*   **Límite de Personales:** Topadas al menor entre el 15% de tus ingresos anuales totales o 5 UMAS anuales (aprox $198,000 MXN).`;
      } else if (query.includes('aguinaldo')) {
        responseText += `
        
**Sobre el Aguinaldo (Art. 87 de la LFT):**
*   **Fecha Límite:** Debe pagarse antes del 20 de diciembre de cada año.
*   **Monto Mínimo:** Corresponden al menos 15 días de salario diario ordinario si trabajaste el año completo. Si laboraste menos, se paga la proporción exacta.
*   **Impuestos:** El aguinaldo cuenta con una exención de ISR por ley de hasta 30 UMAS (aproximadamente $3,257 MXN). Solo el excedente genera retención de ISR.`;
      } else if (query.includes('vacacio') || query.includes('prima')) {
        responseText += `
        
**Sobre las Vacaciones Dignas en México:**
*   **Días de Ley:** Desde 2023, el primer año de servicio otorga 12 días laborables de vacaciones pagadas, aumentando 2 días por año hasta llegar a 20.
*   **Prima Vacacional:** Es el 25% (mínimo de ley) sobre el salario de tus días de vacaciones. Está exenta de ISR hasta por 15 UMAS ($1,628 MXN).`;
      } else {
        responseText += `
        
*   **Cálculos del SAT:** Si tienes dudas de cómo calcular el ISR, IVA, Nómina o finiquito, usa nuestras calculadoras interactivas en la página principal para ver el desglose paso a paso.
*   **Declaraciones:** Recuerda que las declaraciones provisionales mensuales de personas físicas se presentan a más tardar el día 17 del mes siguiente.
        
*Nota: Esta respuesta fue generada por el simulador del asistente. Por favor, consulta a un contador para tu caso específico.*`;
      }

      return NextResponse.json({ text: responseText });
    }

    // Call the real Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${SYSTEM_INSTRUCTION}
                  
Contexto de la calculadora actual activa: ${context || 'Ninguna (Home Page)'}

Historial de conversación previa:
${history.map((h: any) => `${h.role === 'user' ? 'Usuario' : 'Asistente'}: ${h.text}`).join('\n')}

Pregunta del usuario actual:
${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    if (!data.candidates) {
      console.error('Gemini API Error details:', JSON.stringify(data));
    }
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude procesar la respuesta en este momento.';

    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    console.error('Error in API Chat route:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el mensaje.' },
      { status: 500 }
    );
  }
}
