// Vercel-compatible Node.js API con RAG REAL - VERSIÓN OPTIMIZADA
// Sistema optimizado para Vercel Hobby plan (1GB RAM, 10s timeout)
// CommonJS para máxima compatibilidad Vercel

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA RAG OPTIMIZADO PARA VERCEL
// ============================================

class OptimizedRAGSystem {
    constructor() {
        this.documents = [];
        this.keywordIndex = new Map();
        this.loaded = false;
        this.loadCount = 0;
        this.loadStartTime = null;
    }

    // Carga optimizada: solo cargar cuando sea necesario
    async loadDocumentsLazy() {
        if (this.loaded) return this.loadCount;

        console.log('📚 Cargando documentos RAG (modo lazy)...');
        this.loadStartTime = Date.now();
        
        const documentsPath = path.join(__dirname, '..', 'data', 'documents');
        
        try {
            // OPTIMIZACIÓN: Cargar solo archivos combinados primero
            const combinedFiles = this.findCombinedJSONLFiles(documentsPath);
            console.log('Encontrados ' + combinedFiles.length + ' archivos combinados');

            let totalLoaded = 0;
            
            // Cargar solo archivos combinados (más eficiente)
            for (const jsonlFile of combinedFiles.slice(0, 4)) { // Limitar a 4 archivos
                try {
                    const fileContent = fs.readFileSync(jsonlFile, 'utf-8');
                    const lines = fileContent.split('\n').filter(line => line.trim());
                    
                    // OPTIMIZACIÓN: Limitar registros por archivo
                    const maxLines = 1000;
                    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
                        try {
                            const doc = JSON.parse(lines[i]);
                            this.documents.push(doc);
                            this.indexDocumentOptimized(doc, this.documents.length - 1);
                            totalLoaded++;
                        } catch (parseError) {
                            // Ignorar errores de parsing
                        }
                    }
                } catch (fileError) {
                    console.log('Error leyendo ' + path.basename(jsonlFile));
                }
            }

            this.loaded = true;
            this.loadCount = totalLoaded;
            const loadTime = Date.now() - this.loadStartTime;
            
            console.log('✅ Cargados ' + totalLoaded + ' documentos (optimizado)');
            console.log('🔍 Índice con ' + this.keywordIndex.size + ' palabras clave');
            console.log('⏱️  Tiempo carga: ' + loadTime + 'ms');
            
            return totalLoaded;
            
        } catch (error) {
            console.error('❌ Error cargando documentos: ' + error.message);
            return 0;
        }
    }

    // Encontrar solo archivos combinados (más eficientes)
    findCombinedJSONLFiles(dirPath) {
        const files = [];
        const combinedPatterns = [
            '_combinado.jsonl',
            '_dataset_rag_combinado.jsonl',
            '_chunks_ia_combinados.jsonl'
        ];
        
        function traverse(currentPath) {
            try {
                const items = fs.readdirSync(currentPath, { withFileTypes: true });
                
                for (const item of items) {
                    const fullPath = path.join(currentPath, item.name);
                    
                    if (item.isDirectory()) {
                        traverse(fullPath);
                    } else if (item.isFile() && item.name.endsWith('.jsonl')) {
                        // Solo incluir archivos combinados
                        if (combinedPatterns.some(pattern => item.name.includes(pattern))) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Ignorar errores de acceso
            }
        }
        
        traverse(dirPath);
        return files;
    }

    // Indexación optimizada
    indexDocumentOptimized(doc, docIndex) {
        const text = doc.text || doc.content || '';
        if (!text) return;

        // OPTIMIZACIÓN: Indexar solo palabras clave importantes
        const words = text.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 4) // Solo palabras >4 letras
            .slice(0, 10); // Solo primeras 10 palabras

        for (const word of words) {
            if (!this.keywordIndex.has(word)) {
                this.keywordIndex.set(word, []);
            }
            // OPTIMIZACIÓN: Limitar índices por palabra
            if (this.keywordIndex.get(word).length < 100) {
                this.keywordIndex.get(word).push(docIndex);
            }
        }
    }

    // Búsqueda optimizada
    async searchDocuments(query, maxResults = 3) {
        if (!this.loaded) {
            await this.loadDocumentsLazy();
        }

        if (this.documents.length === 0) {
            return this.getFallbackDocuments();
        }

        const queryWords = query.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const docScores = new Map();

        // Búsqueda optimizada
        for (const word of queryWords) {
            if (this.keywordIndex.has(word)) {
                const docIndices = this.keywordIndex.get(word);
                // OPTIMIZACIÓN: Limitar procesamiento
                for (let i = 0; i < Math.min(docIndices.length, 50); i++) {
                    const docIndex = docIndices[i];
                    const currentScore = docScores.get(docIndex) || 0;
                    docScores.set(docIndex, currentScore + 1);
                }
            }
        }

        // Ordenar y limitar resultados
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
            },
            {
                text: 'Los comercios deben cumplir con las Normas Oficiales Mexicanas (NOM) aplicables y los reglamentos municipales en materia de seguridad, higiene, construcción y protección ambiental.',
                source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                article: 'Artículo 8',
                relevance_score: 8
            }
        ];
    }

    getGeneralDocuments(maxResults) {
        if (this.documents.length === 0) return this.getFallbackDocuments();
        
        const results = [];
        // Tomar primeros documentos disponibles
        for (let i = 0; i < Math.min(maxResults, this.documents.length); i++) {
            const doc = this.documents[i];
            results.push({
                text: doc.text || doc.content || '',
                source: doc.document_title || doc.source_filename || 'Documento oficial',
                article: doc.article || 'N/A',
                relevance_score: 5 - i
            });
        }
        return results;
    }

    generateResponse(query, documents) {
        if (!documents || documents.length === 0) {
            return 'No encontré información específica sobre este tema en los documentos oficiales. Te recomiendo consultar directamente los reglamentos municipales o contactar a la Dirección de Inspección y Vigilancia del Municipio de Zapopan.';
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
               '**Información relevante encontrada:**\n\n' +
               context + '\n\n' +
               '**Fuentes consultadas:** ' + uniqueSources.join('; ') + '\n\n' +
               '*Sistema RAG Optimizado v3.0*';
    }
}

// ============================================
// INICIALIZAR SISTEMA RAG OPTIMIZADO
// ============================================

console.log('🏗️  Inicializando sistema RAG optimizado...');
const ragSystem = new OptimizedRAGSystem();

// OPTIMIZACIÓN: No cargar documentos al inicio (lazy loading)
// Esto reduce cold start time en Vercel
console.log('✅ Sistema RAG listo (carga lazy)');

// ============================================
// SERVER HTTP OPTIMIZADO
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
    
    // Health check optimizado (sin cargar documentos)
    if (url === '/health' || url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'Chatbot Inspección Zapopan - RAG Optimizado',
            version: '3.0-optimized',
            documents_loaded: ragSystem.loadCount,
            system: 'ready',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint con timeout controlado
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
                
                // OPTIMIZACIÓN: Timeout controlado para Vercel
                const searchPromise = ragSystem.searchDocuments(message, 3);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout de búsqueda')), 8000);
                });
                
                const docs = await Promise.race([searchPromise, timeoutPromise]);
                const response = ragSystem.generateResponse(message, docs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: docs.length,
                    sources: [...new Set(docs.map(d => d.source))],
                    system: 'RAG Optimizado v3.0'
                }));
                
            } catch (error) {
                console.error('Error en /api/chat: ' + error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno del servidor',
                    system: 'RAG Optimizado v3.0'
                }));
            }
        });
        return;
    }
    
    // Simple response for other routes
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Chatbot Inspección Zapopan - RAG Optimizado v3.0\n\nEndpoints:\n• POST /api/chat\n• GET /health\n\nSistema optimizado para Vercel Hobby');
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;