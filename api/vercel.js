// VERSIÓN DIAGNÓSTICO - Chatbot Zapopan v6.0
// Para identificar el error 500 en Vercel

module.exports = async (req, res) => {
    console.log('🔍 DIAGNÓSTICO: Entrando a función principal');
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar preflight
    if (req.method === 'OPTIONS') {
        console.log('🔍 DIAGNÓSTICO: OPTIONS preflight');
        res.status(200).end();
        return;
    }
    
    // Endpoint de diagnóstico
    if (req.method === 'GET' && req.url === '/api/diagnostic') {
        console.log('🔍 DIAGNÓSTICO: GET /api/diagnostic');
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            system: 'Chatbot Zapopan v6.0 - Diagnóstico',
            status: 'operational',
            node_version: process.version,
            memory_usage: process.memoryUsage(),
            endpoints: ['/api/chat', '/api/health', '/api/metrics', '/api/search']
        });
        return;
    }
    
    // Endpoint de salud simplificado
    if (req.method === 'GET' && req.url === '/api/health') {
        console.log('🔍 DIAGNÓSTICO: GET /api/health');
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            status: 'healthy',
            version: 'v6.0-diagnostic'
        });
        return;
    }
    
    // Endpoint principal simplificado
    if (req.method === 'POST' && req.url === '/api/chat') {
        console.log('🔍 DIAGNÓSTICO: POST /api/chat');
        
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                console.log('🔍 DIAGNÓSTICO: Body recibido:', body.substring(0, 100));
                
                try {
                    const data = JSON.parse(body);
                    const consulta = data.message || '';
                    
                    console.log('🔍 DIAGNÓSTICO: Consulta procesada:', consulta.substring(0, 50));
                    
                    // Respuesta simplificada
                    const respuesta = `**DIAGNÓSTICO v6.0**\n\nConsulta recibida: "${consulta}"\n\nSistema operativo.`;
                    
                    res.status(200).json({
                        success: true,
                        response: respuesta,
                        query: consulta,
                        system: 'Chatbot Zapopan v6.0 - Diagnóstico',
                        diagnostic: {
                            timestamp: new Date().toISOString(),
                            body_length: body.length,
                            parsed_successfully: true
                        }
                    });
                    
                } catch (parseError) {
                    console.error('❌ DIAGNÓSTICO: Error parseando JSON:', parseError.message);
                    res.status(400).json({
                        success: false,
                        error: 'Error parseando JSON',
                        diagnostic: {
                            error: parseError.message,
                            body_preview: body.substring(0, 200)
                        }
                    });
                }
            });
            
        } catch (error) {
            console.error('❌ DIAGNÓSTICO: Error general:', error.message);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                diagnostic: {
                    error: error.message,
                    stack: error.stack?.split('\n').slice(0, 3)
                }
            });
        }
        return;
    }
    
    // Ruta no encontrada
    console.log('🔍 DIAGNÓSTICO: Ruta no encontrada:', req.url);
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        requested_url: req.url,
        available_endpoints: ['/api/chat', '/api/health', '/api/diagnostic']
    });
};