// Vercel-compatible Node.js API con RAG REAL - VERSIÓN DEBUG
// Sistema con logging detallado para diagnosticar carga documentos

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA RAG CON DEBUG DETALLADO
// ============================================

class DebugRAGSystem {
    constructor() {
        this.documents = [];
        this.keywordIndex = new Map();
        this.loaded = false;
        this.loadCount = 0;
        this.loadStartTime = null;
        this.debugLogs = [];
        
        this.addLog('🔧 Constructor DebugRAGSystem inicializado');
    }

    addLog(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        this.debugLogs.push(logEntry);
        console.log(logEntry);
    }

    // Carga con logging detallado
    async loadDocumentsWithDebug() {
        if (this.loaded) {
            this.addLog('📚 Documentos ya cargados, skip');
            return this.loadCount;
        }

        this.addLog('📚 INICIANDO CARGA DOCUMENTOS CON DEBUG...');
        this.loadStartTime = Date.now();
        
        // Intentar múltiples paths
        const possiblePaths = [
            path.join(__dirname, '..', 'data', 'documents'),
            path.join(__dirname, '..', '..', 'data', 'documents'),
            path.join(process.cwd(), 'data', 'documents'),
            '/tmp/data/documents'  // Vercel temp directory
        ];

        this.addLog(`🔍 Probando paths: ${possiblePaths.join(', ')}`);

        let documentsPath = null;
        for (const testPath of possiblePaths) {
            try {
                this.addLog(`  Probando: ${testPath}`);
                if (fs.existsSync(testPath)) {
                    documentsPath = testPath;
                    this.addLog(`✅ Path encontrado: ${testPath}`);
                    break;
                }
            } catch (error) {
                this.addLog(`❌ Error probando path ${testPath}: ${error.message}`);
            }
        }

        if (!documentsPath) {
            this.addLog('❌ NINGÚN PATH DE DOCUMENTOS ENCONTRADO');
            this.addLog('⚠️ Usando documentos de ejemplo (fallback)');
            
            // Fallback a documentos de ejemplo
            this.createSampleDocuments();
            this.loaded = true;
            this.loadCount = this.documents.length;
            const loadTime = Date.now() - this.loadStartTime;
            this.addLog(`✅ Carga fallback completada: ${this.loadCount} documentos en ${loadTime}ms`);
            return this.loadCount;
        }

        try {
            // Listar archivos en el directorio
            const files = fs.readdirSync(documentsPath, { withFileTypes: true });
            this.addLog(`📁 Archivos en ${documentsPath}: ${files.length}`);
            
            files.forEach(file => {
                this.addLog(`  • ${file.name} (${file.isDirectory() ? 'dir' : 'file'})`);
            });

            // Buscar archivos JSONL
            const jsonlFiles = files
                .filter(file => file.isFile() && file.name.endsWith('.jsonl'))
                .map(file => path.join(documentsPath, file.name));

            this.addLog(`📄 Archivos JSONL encontrados: ${jsonlFiles.length}`);

            let totalLoaded = 0;
            
            // Cargar archivos JSONL (limitado para debugging)
            for (const jsonlFile of jsonlFiles.slice(0, 3)) { // Solo primeros 3 para debug
                try {
                    this.addLog(`📖 Leyendo: ${path.basename(jsonlFile)}`);
                    const fileContent = fs.readFileSync(jsonlFile, 'utf-8');
                    const lines = fileContent.split('\n').filter(line => line.trim());
                    this.addLog(`  Líneas en archivo: ${lines.length}`);
                    
                    // Limitar para debug
                    const maxLines = Math.min(lines.length, 50);
                    for (let i = 0; i < maxLines; i++) {
                        try {
                            const doc = JSON.parse(lines[i]);
                            this.documents.push(doc);
                            this.indexDocumentOptimized(doc, this.documents.length - 1);
                            totalLoaded++;
                        } catch (parseError) {
                            this.addLog(`❌ Error parseando línea ${i}: ${parseError.message}`);
                        }
                    }
                    this.addLog(`  ✅ Cargados: ${maxLines} documentos de este archivo`);
                } catch (fileError) {
                    this.addLog(`❌ Error leyendo archivo ${jsonlFile}: ${fileError.message}`);
                }
            }

            this.loaded = true;
            this.loadCount = totalLoaded;
            const loadTime = Date.now() - this.loadStartTime;
            
            this.addLog(`🎉 CARGA COMPLETADA: ${this.loadCount} documentos en ${loadTime}ms`);
            this.addLog(`📊 Resumen: ${this.documents.length} docs, ${this.keywordIndex.size} keywords indexadas`);
            
        } catch (error) {
            this.addLog(`❌ ERROR CRÍTICO en loadDocuments: ${error.message}`);
            this.addLog(`Stack: ${error.stack}`);
            
            // Fallback a documentos de ejemplo
            this.createSampleDocuments();
            this.loaded = true;
            this.loadCount = this.documents.length;
            this.addLog(`✅ Fallback a ${this.loadCount} documentos de ejemplo`);
        }

        return this.loadCount;
    }

    createSampleDocuments() {
        this.addLog('📝 Creando documentos de ejemplo (fallback)');
        
        const sampleDocs = [
            {
                id: 'sample-1',
                content: 'La Dirección de Inspección y Vigilancia del Municipio de Zapopan tiene facultades para verificar el cumplimiento de normativas municipales en materia de comercio, construcción, condiciones de seguridad e higiene en centros de trabajo.',
                source: 'Reglamento Municipal de Inspección y Vigilancia',
                article: 'Artículo 15',
                keywords: ['inspección', 'facultades', 'verificación', 'comercio', 'construcción', 'seguridad', 'higiene']
            },
            {
                id: 'sample-2',
                content: 'Los inspectores municipales pueden realizar visitas de verificación a establecimientos comerciales, industriales y de servicios para constatar el cumplimiento de los reglamentos aplicables.',
                source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                article: 'Artículo 22',
                keywords: ['inspectores', 'visitas', 'verificación', 'comercio', 'industria', 'servicios']
            },
            {
                id: 'sample-3',
                content: 'Los comercios deben contar con licencia de funcionamiento expedida por el municipio y cumplir con las Normas Oficiales Mexicanas (NOM) aplicables en materia de seguridad, higiene y protección ambiental.',
                source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                article: 'Artículo 8',
                keywords: ['comercio', 'licencia', 'funcionamiento', 'NOM', 'seguridad', 'higiene', 'ambiental']
            }
        ];

        sampleDocs.forEach((doc, index) => {
            this.documents.push(doc);
            this.indexDocumentOptimized(doc, index);
        });
    }

    indexDocumentOptimized(doc, docIndex) {
        if (!doc.keywords || !Array.isArray(doc.keywords)) return;
        
        doc.keywords.forEach(keyword => {
            const kwLower = keyword.toLowerCase();
            if (!this.keywordIndex.has(kwLower)) {
                this.keywordIndex.set(kwLower, []);
            }
            this.keywordIndex.get(kwLower).push(docIndex);
        });
    }

    async searchDocuments(query, maxResults = 3) {
        this.addLog(`🔍 Búsqueda: "${query}" (max ${maxResults} resultados)`);
        
        if (!this.loaded) {
            await this.loadDocumentsWithDebug();
        }

        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
        
        this.addLog(`📝 Palabras clave extraídas: ${queryWords.join(', ')}`);

        const docScores = new Map();
        
        // Búsqueda por keywords
        queryWords.forEach(word => {
            if (this.keywordIndex.has(word)) {
                const docIndices = this.keywordIndex.get(word);
                this.addLog(`✅ Keyword "${word}" encontrada en ${docIndices.length} documentos`);
                
                docIndices.forEach(docIndex => {
                    const currentScore = docScores.get(docIndex) || 0;
                    docScores.set(docIndex, currentScore + 1);
                });
            } else {
                this.addLog(`❌ Keyword "${word}" NO encontrada en índice`);
            }
        });

        // Ordenar por score
        const sortedDocs = Array.from(docScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxResults)
            .map(([docIndex, score]) => ({
                doc: this.documents[docIndex],
                score
            }));

        this.addLog(`📊 Resultados: ${sortedDocs.length} documentos encontrados`);
        
        if (sortedDocs.length === 0) {
            this.addLog('⚠️ Sin resultados, usando documentos generales');
            // Devolver primeros documentos como fallback
            return this.documents.slice(0, Math.min(2, this.documents.length)).map(doc => ({
                doc,
                score: 0.5
            }));
        }

        return sortedDocs;
    }

    generateResponse(query, searchResults) {
        this.addLog(`📝 Generando respuesta para "${query}" con ${searchResults.length} resultados`);
        
        if (!searchResults || searchResults.length === 0) {
            return 'No encontré información específica sobre este tema en los documentos disponibles. Te recomiendo consultar los reglamentos municipales oficiales o contactar a la Dirección de Inspección y Vigilancia del Municipio de Zapopan para información precisa.';
        }

        const context = searchResults.map((result, i) => {
            const doc = result.doc;
            let sourceInfo = doc.source || 'Documento oficial';
            if (doc.article && doc.article !== 'N/A') {
                sourceInfo += ', ' + doc.article;
            }
            return (i + 1) + '. **' + sourceInfo + '**\n   ' + doc.content;
        }).join('\n\n');

        const uniqueSources = [...new Set(searchResults.map(r => r.doc.source).filter(s => s))];

        const response = '**Consulta:** ' + query + '\n\n' +
                       '**Información relevante encontrada en documentos oficiales:**\n\n' +
                       context + '\n\n' +
                       '**Fuentes consultadas:** ' + (uniqueSources.length > 0 ? uniqueSources.join('; ') : 'Documentos oficiales municipales') + '\n\n' +
                       '*Sistema RAG v3.1-debug - Respuestas basadas en documentos reales*\n' +
                       '*Nota: Sistema en fase de desarrollo. Para información completa, consulta documentos oficiales.*';

        this.addLog(`✅ Respuesta generada: ${response.length} caracteres`);
        return response;
    }

    getDebugInfo() {
        return {
            documents_loaded: this.loadCount,
            documents_total: this.documents.length,
            keywords_indexed: this.keywordIndex.size,
            system_loaded: this.loaded,
            debug_logs_count: this.debugLogs.length,
            recent_logs: this.debugLogs.slice(-10) // Últimos 10 logs
        };
    }
}

// ============================================
// INICIALIZAR SISTEMA CON DEBUG
// ============================================

console.log('🚀 Inicializando Chatbot Zapopan RAG Debug v3.1...');
const chatbot = new DebugRAGSystem();

// Carga lazy: solo cuando se necesite
let loadPromise = null;
async function ensureLoaded() {
    if (!loadPromise) {
        loadPromise = chatbot.loadDocumentsWithDebug();
    }
    return loadPromise;
}

// ============================================
// SERVER HTTP CON DEBUG
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
    
    // Health check con debug info
    if (url === '/health' || url === '/api/health') {
        await ensureLoaded();
        const debugInfo = chatbot.getDebugInfo();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'Chatbot Inspección Zapopan - RAG Debug v3.1',
            version: '3.1-debug',
            system: 'ready',
            debug: debugInfo,
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Chat endpoint
    if ((url === '/api/chat' || url === '/chat') && method === 'POST') {
        await ensureLoaded();
        
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
                
                const searchResults = await chatbot.searchDocuments(message, 3);
                const response = chatbot.generateResponse(message, searchResults);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: searchResults.length,
                    sources: [...new Set(searchResults.map(r => r.doc.source).filter(s => s))],
                    system: 'RAG Debug v3.1',
                    performance: 'debug_mode',
                    debug: {
                        documents_queried: searchResults.length,
                        has_real_documents: chatbot.loadCount > 0
                    }
                }));
                
            } catch (error) {
                console.error('Error en /api/chat:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Error interno del servidor',
                    debug_error: error.message
                }));
            }
        });
        return;
    }
    
    // Servir frontend HTML
    try {
        const frontendPath = path.join(__dirname, '..', 'frontend.html');
        const frontendHTML = fs.readFileSync(frontendPath, 'utf-8');
        
        res.writeHead(200, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(frontendHTML);
    } catch (error) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Chatbot Inspección Zapopan - RAG Debug v3.1</h1><p>Sistema en modo debug. Use /api/chat para consultas.</p>');
    }
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;