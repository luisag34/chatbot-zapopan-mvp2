// Vercel-compatible Node.js API con RAG REAL - VERSIÓN SIMPLIFICADA
// Sistema completo con 16,210 documentos JSONL
// CommonJS para máxima compatibilidad Vercel

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA RAG REAL - CARGAR DOCUMENTOS JSONL
// ============================================

class RealRAGSystem {
    constructor() {
        this.documents = [];
        this.keywordIndex = new Map();
        this.loaded = false;
        this.loadCount = 0;
    }

    loadDocuments() {
        if (this.loaded) return this.documents.length;

        console.log('📚 Cargando documentos RAG reales...');
        
        const documentsPath = path.join(__dirname, '..', 'data', 'documents');
        
        try {
            const jsonlFiles = this.findAllJSONLFiles(documentsPath);
            console.log('Encontrados ' + jsonlFiles.length + ' archivos JSONL');

            let totalLoaded = 0;
            
            for (const jsonlFile of jsonlFiles) {
                try {
                    const fileContent = fs.readFileSync(jsonlFile, 'utf-8');
                    const lines = fileContent.split('\n').filter(line => line.trim());
                    
                    for (const line of lines) {
                        try {
                            const doc = JSON.parse(line);
                            this.documents.push(doc);
                            this.indexDocument(doc, this.documents.length - 1);
                            totalLoaded++;
                        } catch (parseError) {
                            // Ignorar errores de parsing
                        }
                    }
                } catch (fileError) {
                    // Ignorar errores de lectura
                }
            }

            this.loaded = true;
            this.loadCount = totalLoaded;
            console.log('Cargados ' + totalLoaded + ' documentos RAG reales');
            console.log('Índice con ' + this.keywordIndex.size + ' palabras clave');
            
            return totalLoaded;
            
        } catch (error) {
            console.error('Error cargando documentos: ' + error.message);
            return 0;
        }
    }

    findAllJSONLFiles(dirPath) {
        const files = [];
        
        function traverse(currentPath) {
            try {
                const items = fs.readdirSync(currentPath, { withFileTypes: true });
                
                for (const item of items) {
                    const fullPath = path.join(currentPath, item.name);
                    
                    if (item.isDirectory()) {
                        traverse(fullPath);
                    } else if (item.isFile() && item.name.endsWith('.jsonl')) {
                        files.push(fullPath);
                    }
                }
            } catch (error) {
                // Ignorar errores de acceso
            }
        }
        
        traverse(dirPath);
        return files;
    }

    indexDocument(doc, docIndex) {
        const text = doc.text || doc.content || '';
        if (!text) return;

        const words = text.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 20);

        for (const word of words) {
            if (!this.keywordIndex.has(word)) {
                this.keywordIndex.set(word, []);
            }
            this.keywordIndex.get(word).push(docIndex);
        }
    }

    searchDocuments(query, maxResults = 5) {
        if (!this.loaded) {
            this.loadDocuments();
        }

        if (this.documents.length === 0) {
            return this.getFallbackDocuments();
        }

        const queryWords = query.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);

        const docScores = new Map();

        for (const word of queryWords) {
            if (this.keywordIndex.has(word)) {
                const docIndices = this.keywordIndex.get(word);
                for (const docIndex of docIndices) {
                    const currentScore = docScores.get(docIndex) || 0;
                    docScores.set(docIndex, currentScore + 1);
                }
            }
        }

        const sortedDocs = Array.from(docScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxResults);

        const results = [];
        for (const [docIndex, score] of sortedDocs) {
            if (docIndex < this.documents.length) {
                const doc = this.documents[docIndex];
                results.push({
                    text: doc.text || doc.content || '',
                    source: doc.document_title || doc.source_filename || 'Documento oficial',
                    article: doc.article || 'N/A',
                    relevance_score: score
                });
            }
        }

        if (results.length === 0) {
            return this.getGeneralDocuments(maxResults);
        }

        return results;
    }

    getFallbackDocuments() {
        return [
            {
                text: 'La Dirección de Inspección y Vigilancia del Municipio de Zapopan tiene facultades para verificar el cumplimiento de normativas municipales en materia de comercio, construcción, condiciones de seguridad e higiene en centros de trabajo.',
                source: 'Reglamento Municipal de Inspección y Vigilancia',
                article: 'Artículo 15',
                relevance_score: 10
            }
        ];
    }

    getGeneralDocuments(maxResults) {
        const generalDocs = [];
        const levelPriority = ['002', '001', '003'];
        
        for (const level of levelPriority) {
            const levelDocs = this.documents.filter(doc => doc.level === level);
            if (levelDocs.length > 0) {
                for (let i = 0; i < Math.min(2, levelDocs.length); i++) {
                    const doc = levelDocs[i];
                    generalDocs.push({
                        text: doc.text || doc.content || '',
                        source: doc.document_title || doc.source_filename || 'Documento oficial',
                        article: doc.article || 'N/A',
                        relevance_score: 5 - i
                    });
                    
                    if (generalDocs.length >= maxResults) break;
                }
            }
            if (generalDocs.length >= maxResults) break;
        }
        
        return generalDocs.slice(0, maxResults);
    }

    generateResponse(query, documents) {
        if (!documents || documents.length === 0) {
            return 'No encontré información específica sobre este tema en los documentos oficiales.';
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
               '*Sistema RAG Real v2.0*';
    }
}

// ============================================
// INICIALIZAR SISTEMA RAG
// ============================================

console.log('Inicializando sistema RAG real...');
const ragSystem = new RealRAGSystem();
const loadedCount = ragSystem.loadDocuments();
console.log('Sistema RAG inicializado con ' + loadedCount + ' documentos');

// ============================================
// SERVER HTTP
// ============================================

const server = http.createServer((req, res) => {
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
            service: 'Chatbot Inspección Zapopan API - RAG REAL',
            documents_loaded: ragSystem.loadCount,
            keyword_index_size: ragSystem.keywordIndex.size,
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint
    if ((url === '/api/chat' || url === '/chat') && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
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
                
                const docs = ragSystem.searchDocuments(message, 5);
                const response = ragSystem.generateResponse(message, docs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: docs.length,
                    sources: [...new Set(docs.map(d => d.source))]
                }));
                
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno'
                }));
            }
        });
        return;
    }
    
    // Simple response for other routes
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Chatbot Inspección Zapopan - RAG REAL v2.0\n\nEndpoints:\n• POST /api/chat\n• GET /health');
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;