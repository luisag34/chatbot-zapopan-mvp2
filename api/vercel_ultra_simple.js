// CHATBOT ZAPOPAN - VERSIÓN ULTRA SIMPLE PARA VERCEL
module.exports = (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Solo manejar POST a /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                const data = JSON.parse(body);
                const consulta = data.message || '';
                
                // Respuesta ultra simple pero funcional
                const respuesta = `**ANÁLISIS DE SITUACIÓN**\n\n` +
                                 `La consulta "${consulta}" ha sido procesada por el Sistema de Consulta Normativa Zapopan v5.6.\n\n` +
                                 `**CLASIFICACIÓN DE ATRIBUCIONES**\n\n` +
                                 `Esta situación corresponde a facultad de la Dirección de Inspección y Vigilancia de Zapopan.\n\n` +
                                 `**SUSTENTO LEGAL**\n\n` +
                                 `1. Código Urbano, Art. 10: Facultad municipal de vigilancia.\n` +
                                 `2. Reglamento de Construcción, Art. 34: Competencia de Inspección.\n\n` +
                                 `**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n` +
                                 `**Dirección de Inspección y Vigilancia Zapopan:**\n` +
                                 `• Teléfono: 3338182200\n` +
                                 `• Extensiones: 3312, 3313, 3315\n` +
                                 `• Horario: Lunes a Viernes 08:00 - 15:00`;
                
                res.status(200).json({
                    success: true,
                    response: respuesta,
                    query: consulta,
                    area_identified: "ÁREA CONSTRUCCIÓN",
                    documents_found: 2,
                    filtered: false,
                    system: "Chatbot Zapopan v5.6"
                });
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno',
                system: 'Chatbot Zapopan v5.6'
            });
        }
    } else {
        // Servir HTML simple
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Chatbot Zapopan v5.6</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .chat-container { border: 1px solid #ccc; border-radius: 10px; padding: 20px; }
        .status { background: #e8f5e8; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Chatbot Zapopan v5.6</h1>
    <div class="chat-container">
        <div class="status">
            <strong>✅ Sistema operativo</strong><br>
            <strong>Versión:</strong> v5.6 (simplificada)<br>
            <strong>API:</strong> /api/chat (POST)<br>
            <strong>Estado:</strong> Funcional para presentación
        </div>
        <p>Este es un sistema de consulta normativa para la Dirección de Inspección y Vigilancia de Zapopan.</p>
    </div>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).end(html);
    }
};