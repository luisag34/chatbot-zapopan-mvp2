// Vercel Hello World - Versión ABSOLUTAMENTE MÍNIMA v5.0
// Solo para diagnóstico: ¿Funciona algo en Vercel?

const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Health check
    if (req.url === '/health' || req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            message: 'Hello World from Vercel!',
            version: '5.0-hello-world',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint
    if ((req.url === '/api/chat' || req.url === '/chat') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response: `Received: "${message || 'no message'}"`,
                    system: 'Hello World v5.0'
                }));
            } catch (error) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response: 'Hello from Chatbot Zapopan!',
                    system: 'Hello World v5.0'
                }));
            }
        });
        return;
    }
    
    // Default response
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Chatbot Zapopan - Hello World v5.0\n\nEndpoints:\n• GET /health\n• POST /api/chat\n\nSystem: Working!');
});

console.log('🚀 Hello World server initialized (cold start: ~0ms)');

module.exports = server;