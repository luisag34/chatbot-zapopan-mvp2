// VERSIÓN MÍNIMA FUNCIONAL PARA DIAGNÓSTICO
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`📨 Request: ${req.method} ${req.url}`);
    
    // Solo responder a /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log(`📝 Consulta recibida: "${data.message}"`);
                
                // Respuesta mínima funcional
                const response = {
                    success: true,
                    response: `**ANÁLISIS DE SITUACIÓN**\n\nLa consulta "${data.message}" ha sido procesada por el sistema v5.6.\n\n**CLASIFICACIÓN DE ATRIBUCIONES**\n\nEsta situación corresponde a facultad compartida entre Dirección de Inspección y Vigilancia y otras dependencias según normativa.\n\n**SUSTENTO LEGAL**\n\n1. Código Urbano, Art. 10: Los municipios tienen facultad de vigilancia.\n2. Reglamento de Construcción, Art. 34: Faculta a autoridades municipales para verificar obras.\n\n**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n**Dirección de Inspección y Vigilancia Zapopan:**\n• Teléfono: 3338182200\n• Extensiones: 3312, 3313, 3315, 3322, 3324, 3331, 3330, 3342\n• Horario: Lunes a Viernes 08:00 - 15:00\n\n**Dirección de Licencias y Permisos de Construcción Zapopan:**\n• Teléfono: 3338182200\n• Extensión: 3007\n• Horario: Lunes a Viernes 09:00 - 14:00`,
                    query: data.message,
                    area_identified: "ÁREA CONSTRUCCIÓN",
                    documents_found: 2,
                    filtered: false
                };
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                });
                res.end(JSON.stringify(response));
            } catch (error) {
                console.error('❌ Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno del servidor',
                    system: 'Sistema de Consulta Normativa Zapopan v5.6'
                }));
            }
        });
    } else if (req.method === 'OPTIONS') {
        // CORS preflight
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
    } else {
        // Servir frontend simple
        const frontendHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Chatbot Zapopan - Test Minimal</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .chat-container { border: 1px solid #ccc; border-radius: 10px; padding: 20px; }
        .response { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Chatbot Zapopan - Test Minimal v5.6</h1>
    <div class="chat-container">
        <p>Sistema funcional para diagnóstico.</p>
        <div class="response">
            <strong>Estado:</strong> Sistema operativo<br>
            <strong>Versión:</strong> v5.6<br>
            <strong>URL API:</strong> /api/chat
        </div>
    </div>
</body>
</html>`;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(frontendHTML);
    }
});

// Export para Vercel
module.exports = server;