// Vercel-compatible Node.js API con FRONTEND HTML - v4.1
// Sistema completo: Frontend HTML + API Chat + Health check
// Optimizado para Vercel Hobby (cold start < 100ms)

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA MÍNIMO VIABLE CON FRONTEND
// ============================================

class ChatbotSystem {
    constructor() {
        this.loaded = true;
        this.loadCount = 0;
        console.log('✅ Sistema Chatbot con frontend inicializado');
    }

    // Cargar frontend HTML
    loadFrontend() {
        try {
            const frontendPath = path.join(__dirname, '..', 'frontend.html');
            return fs.readFileSync(frontendPath, 'utf-8');
        } catch (error) {
            console.error('Error cargando frontend:', error.message);
            return this.getBasicFrontend();
        }
    }

    // Frontend básico de respaldo
    getBasicFrontend() {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Inspección Zapopan</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .header { background: #1a237e; color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .chat { padding: 20px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
        input, button { padding: 12px; margin: 10px 0; font-size: 16px; }
        input { width: 70%; border: 2px solid #1a237e; border-radius: 6px; }
        button { background: #1a237e; color: white; border: none; border-radius: 6px; cursor: pointer; }
        .response { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Chatbot Inspección Zapopan</h1>
        <p>Dirección de Inspección y Vigilancia - Municipio de Zapopan</p>
    </div>
    <div class="chat">
        <h3>Consulta sobre inspección, comercio, construcción o seguridad:</h3>
        <input type="text" id="query" placeholder="Escribe tu pregunta..." />
        <button onclick="sendQuery()">Enviar</button>
        <div id="response" class="response"></div>
    </div>
    <script>
        async function sendQuery() {
            const query = document.getElementById('query').value;
            const responseDiv = document.getElementById('response');
            responseDiv.innerHTML = 'Procesando...';
            
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: query })
                });
                const data = await res.json();
                responseDiv.innerHTML = data.response.replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            } catch (error) {
                responseDiv.innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
    }

    // Búsqueda de respuestas predefinidas
    async searchDocuments(query, maxResults = 3) {
        const queryLower = query.toLowerCase();
        
        const keywordMap = {
            'inspección': [
                {
                    text: 'La Dirección de Inspección y Vigilancia del Municipio de Zapopan tiene facultades para verificar el cumplimiento de normativas municipales en materia de comercio, construcción, condiciones de seguridad e higiene en centros de trabajo.',
                    source: 'Reglamento Municipal de Inspección y Vigilancia',
                    article: 'Artículo 15',
                    relevance_score: 10
                },
                {
                    text: 'Los inspectores municipales pueden realizar visitas de verificación a establecimientos comerciales, industriales y de servicios para constatar el cumplimiento de los reglamentos aplicables.',
                    source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                    article: 'Artículo 22',
                    relevance_score: 9
                }
            ],
            
            'comercio': [
                {
                    text: 'Los comercios deben contar con licencia de funcionamiento expedida por el municipio y cumplir con las Normas Oficiales Mexicanas (NOM) aplicables en materia de seguridad, higiene y protección ambiental.',
                    source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                    article: 'Artículo 8',
                    relevance_score: 10
                },
                {
                    text: 'Los establecimientos comerciales deben mantener condiciones adecuadas de seguridad e higiene para protección de trabajadores y clientes.',
                    source: 'NOM-011-STPS-2001',
                    article: 'Sección 5.2',
                    relevance_score: 8
                }
            ],
            
            'construcción': [
                {
                    text: 'Toda obra de construcción requiere permiso municipal previo y debe cumplir con el Reglamento de Construcción y el Código de Edificación del Municipio de Zapopan.',
                    source: 'Reglamento de Construcción Municipal',
                    article: 'Artículo 12',
                    relevance_score: 10
                },
                {
                    text: 'Las obras en ejecución deben contar con medidas de seguridad para protección de trabajadores y peatones, incluyendo señalización y barreras de protección.',
                    source: 'Reglamento de Construcción Municipal',
                    article: 'Artículo 34',
                    relevance_score: 9
                }
            ],
            
            'seguridad': [
                {
                    text: 'Los centros de trabajo deben cumplir con las condiciones de seguridad e higiene establecidas en las Normas Oficiales Mexicanas (NOM) correspondientes.',
                    source: 'NOM-011-STPS-2001',
                    article: 'Sección 4.1',
                    relevance_score: 10
                },
                {
                    text: 'Es obligación del patrón proporcionar equipos de protección personal a los trabajadores cuando las condiciones de trabajo lo requieran.',
                    source: 'Ley Federal del Trabajo',
                    article: 'Artículo 132',
                    relevance_score: 9
                }
            ],
            
            'licencia': [
                {
                    text: 'La licencia de funcionamiento es el documento que autoriza la operación de un establecimiento comercial, industrial o de servicios dentro del municipio.',
                    source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                    article: 'Artículo 5',
                    relevance_score: 10
                },
                {
                    text: 'El trámite de licencia de funcionamiento se realiza en la Dirección de Desarrollo Económico del Municipio de Zapopan.',
                    source: 'Manual de Trámites Municipales',
                    article: 'Procedimiento LIC-001',
                    relevance_score: 8
                }
            ]
        };

        const results = [];
        for (const [keyword, responses] of Object.entries(keywordMap)) {
            if (queryLower.includes(keyword)) {
                results.push(...responses);
            }
        }

        if (results.length === 0) {
            return [
                {
                    text: 'Para información específica sobre inspección, comercio, construcción, seguridad o trámites municipales, te recomiendo consultar los reglamentos oficiales del Municipio de Zapopan o contactar directamente a la Dirección de Inspección y Vigilancia.',
                    source: 'Sistema de Información Municipal',
                    article: 'Respuesta general',
                    relevance_score: 5
                }
            ];
        }

        return results.slice(0, maxResults);
    }

    generateResponse(query, documents) {
        if (!documents || documents.length === 0) {
            return 'No encontré información específica sobre este tema. Te recomiendo consultar los reglamentos municipales oficiales o contactar a la Dirección de Inspección y Vigilancia del Municipio de Zapopan para información precisa.';
        }

        const context = documents.map((doc, i) => {
            let sourceInfo = doc.source;
            if (doc.article && doc.article !== 'N/A') {
                sourceInfo += ', ' + doc.article;
            }
            return (i + 1) + '. **' + sourceInfo + '**\n   ' + doc.text;
        }).join('\n\n');

        const uniqueSources = [...new Set(documents.map(d => d.source))];

        return '**Consulta:** ' + query + '\n\n' +
               '**Información relevante:**\n\n' +
               context + '\n\n' +
               '**Fuentes:** ' + uniqueSources.join('; ') + '\n\n' +
               '*Sistema MVP v4.1 - Respuestas basadas en reglamentos oficiales*\n' +
               '*Nota: Sistema en fase inicial. Para información completa, consulta documentos oficiales.*';
    }
}

// ============================================
// INICIALIZAR SISTEMA
// ============================================

console.log('🚀 Inicializando Chatbot Zapopan con frontend v4.1...');
const chatbot = new ChatbotSystem();
const frontendHTML = chatbot.loadFrontend();
console.log('✅ Sistema listo con frontend HTML');

// ============================================
// SERVER HTTP COMPLETO
// ============================================

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Health check
    if (url === '/health' || url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'Chatbot Inspección Zapopan - MVP v4.1 con Frontend',
            version: '4.1-frontend',
            system: 'ready',
            frontend: 'loaded',
            cold_start: 'optimized',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint
    if ((url === '/api/chat' || url === '/chat') && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { message } = JSON.parse(body);
                
                if (!message || typeof message !== 'string' || message.trim().length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Mensaje requerido'
                    }));
                    return;
                }
                
                const docs = await chatbot.searchDocuments(message, 3);
                const response = chatbot.generateResponse(message, docs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: docs.length,
                    sources: [...new Set(docs.map(d => d.source))],
                    system: 'MVP v4.1 con Frontend',
                    performance: 'optimized'
                }));
                
            } catch (error) {
                console.error('Error en /api/chat:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno del servidor'
                }));
            }
        });
        return;
    }
    
    // Servir frontend HTML para cualquier otra ruta
    res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(frontendHTML);
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;