// Vercel-compatible Node.js API con RAG REAL - VERSIÓN ULTRA-OPTIMIZADA v3.1
// Sistema ultra-optimizado para Vercel Hobby plan (cold start < 2s, memory < 20MB)
// CommonJS para máxima compatibilidad Vercel

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA RAG ULTRA-OPTIMIZADO PARA VERCEL
// ============================================

class UltraOptimizedRAGSystem {
    constructor() {
        this.documents = [];
        this.keywordIndex = new Map();
        this.loaded = false;
        this.loadCount = 0;
    }

    // Carga ULTRA optimizada: solo 1 archivo, máximo 500 documentos
    async loadDocumentsUltra() {
        if (this.loaded) return this.loadCount;

        console.log('📚 Cargando documentos RAG (modo ultra-optimizado)...');
        const startTime = Date.now();
        
        try {
            // OPTIMIZACIÓN EXTREMA: Solo 1 archivo combinado
            const documentsPath = path.join(__dirname, '..', 'data', 'documents');
            const combinedFile = this.findMostRelevantJSONLFile(documentsPath);
            
            if (!combinedFile) {
                console.log('⚠️  No se encontraron archivos combinados, usando fallback');
                this.loaded = true;
                return 0;
            }

            console.log('Usando archivo: ' + path.basename(combinedFile));
            
            let totalLoaded = 0;
            const fileContent = fs.readFileSync(combinedFile, 'utf-8');
            const lines = fileContent.split('\n').filter(line => line.trim());
            
            // OPTIMIZACIÓN EXTREMA: Solo 500 documentos máximo
            const maxDocuments = 500;
            for (let i = 0; i < Math.min(lines.length, maxDocuments); i++) {
                try {
                    const doc = JSON.parse(lines[i]);
                    this.documents.push(doc);
                    this.indexDocumentUltra(doc, this.documents.length - 1);
                    totalLoaded++;
                } catch (parseError) {
                    // Ignorar errores de parsing
                }
            }

            this.loaded = true;
            this.loadCount = totalLoaded;
            const loadTime = Date.now() - startTime;
            
            console.log('✅ Cargados ' + totalLoaded + ' documentos (ultra-optimizado)');
            console.log('🔍 Índice con ' + this.keywordIndex.size + ' palabras clave');
            console.log('⏱️  Tiempo carga: ' + loadTime + 'ms (< 2s objetivo)');
            
            return totalLoaded;
            
        } catch (error) {
            console.error('❌ Error cargando documentos: ' + error.message);
            this.loaded = true; // Marcar como cargado para evitar reintentos
            return 0;
        }
    }

    // Encontrar el archivo combinado más relevante (002 tiene reglamentos municipales)
    findMostRelevantJSONLFile(dirPath) {
        const priorityPatterns = [
            '002_reglamentos_municipales', // Prioridad 1: reglamentos municipales
            '002_chunks_ia_combinados.jsonl',
            '002_dataset_rag_combinado.jsonl',
            '_combinado.jsonl'
        ];
        
        let foundFile = null;
        
        function traverse(currentPath) {
            try {
                const items = fs.readdirSync(currentPath, { withFileTypes: true });
                
                for (const item of items) {
                    const fullPath = path.join(currentPath, item.name);
                    
                    if (item.isDirectory()) {
                        traverse(fullPath);
                    } else if (item.isFile() && item.name.endsWith('.jsonl')) {
                        // Buscar por patrones de prioridad
                        for (const pattern of priorityPatterns) {
                            if (item.name.includes(pattern)) {
                                foundFile = fullPath;
                                return; // Encontrar solo el primero
                            }
                        }
                    }
                }
            } catch (error) {
                // Ignorar errores de acceso
            }
        }
        
        traverse(dirPath);
        return foundFile;
    }

    // Indexación ultra optimizada
    indexDocumentUltra(doc, docIndex) {
        const text = doc.text || doc.content || '';
        if (!text) return;

        // OPTIMIZACIÓN EXTREMA: Solo 5 palabras clave importantes
        const words = text.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 5) // Solo palabras >5 letras
            .slice(0, 5); // Solo primeras 5 palabras

        for (const word of words) {
            if (!this.keywordIndex.has(word)) {
                this.keywordIndex.set(word, []);
            }
            // OPTIMIZACIÓN EXTREMA: Máximo 50 documentos por palabra
            if (this.keywordIndex.get(word).length < 50) {
                this.keywordIndex.get(word).push(docIndex);
            }
        }
    }

    // Búsqueda ultra optimizada con timeout de 5s
    async searchDocuments(query, maxResults = 3) {
        if (!this.loaded) {
            await this.loadDocumentsUltra();
        }

        if (this.documents.length === 0) {
            return this.getFallbackDocuments();
        }

        const queryWords = query.toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3);

        const docScores = new Map();

        // Búsqueda ultra optimizada
        for (const word of queryWords) {
            if (this.keywordIndex.has(word)) {
                const docIndices = this.keywordIndex.get(word);
                // OPTIMIZACIÓN EXTREMA: Solo primeros 20 documentos
                for (let i = 0; i < Math.min(docIndices.length, 20); i++) {
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
               '*Sistema RAG Ultra-Optimizado v3.1*';
    }
}

// ============================================
// INICIALIZAR SISTEMA RAG ULTRA-OPTIMIZADO
// ============================================

console.log('🏗️  Inicializando sistema RAG ultra-optimizado v3.1...');
const ragSystem = new UltraOptimizedRAGSystem();

// OPTIMIZACIÓN EXTREMA: No cargar nada al inicio
console.log('✅ Sistema RAG ultra-optimizado listo (carga ultra-lazy)');

// ============================================
// SERVER HTTP ULTRA-OPTIMIZADO
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
    
    // Health check ultra optimizado (sin cargar documentos)
    if (url === '/health' || url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'Chatbot Inspección Zapopan - RAG Ultra-Optimizado',
            version: '3.1-ultra-optimized',
            documents_loaded: ragSystem.loadCount,
            system: 'ready',
            cold_start_optimized: true,
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint con timeout ultra controlado (5s)
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
                
                // OPTIMIZACIÓN EXTREMA: Timeout de solo 5 segundos
                const searchPromise = ragSystem.searchDocuments(message, 3);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout de búsqueda (5s)')), 5000);
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
                    system: 'RAG Ultra-Optimizado v3.1',
                    performance: 'cold_start_optimized'
                }));
                
            } catch (error) {
                console.error('Error en /api/chat: ' + error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno del servidor',
                    system: 'RAG Ultra-Optimizado v3.1',
                    note: 'Sistema optimizado para cold start < 2s'
                }));
            }
        });
        return;
    }
    
    // Simple response for other routes
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Chatbot Inspección Zapopan - RAG Ultra-Optimizado v3.1\n\nEndpoints:\n• POST /api/chat\n• GET /health\n\nSistema ultra-optimizado para Vercel Hobby (cold start < 2s)');
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;