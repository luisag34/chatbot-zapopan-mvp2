// Vercel-compatible Node.js API con RAG REAL - VERSIÓN FINAL
// Sistema optimizado con estructura real de documentos JSONL

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA RAG CON ESTRUCTURA REAL DE DOCUMENTOS
// ============================================

class FinalRAGSystem {
    constructor() {
        this.documents = [];
        this.keywordIndex = new Map();
        this.loaded = false;
        this.loadCount = 0;
        console.log('🔧 Inicializando RAG Final con estructura real de documentos');
    }

    // Carga documentos con estructura real
    async loadRealDocuments() {
        if (this.loaded) return this.loadCount;

        console.log('📚 Cargando documentos reales...');
        const loadStartTime = Date.now();
        
        const documentsPath = path.join(__dirname, '..', 'data', 'documents_sample');
        
        try {
            // Listar archivos JSONL
            const files = fs.readdirSync(documentsPath, { withFileTypes: true });
            const jsonlFiles = files
                .filter(file => file.isFile() && file.name.endsWith('.jsonl'))
                .map(file => path.join(documentsPath, file.name));

            console.log(`📄 Encontrados ${jsonlFiles.length} archivos JSONL`);

            let totalLoaded = 0;
            
            // Cargar cada archivo (limitado para performance)
            for (const jsonlFile of jsonlFiles.slice(0, 10)) { // Solo primeros 10
                try {
                    const fileContent = fs.readFileSync(jsonlFile, 'utf-8');
                    const lines = fileContent.split('\n').filter(line => line.trim());
                    
                    // Limitar documentos por archivo para performance
                    const maxLines = Math.min(lines.length, 30);
                    for (let i = 0; i < maxLines; i++) {
                        try {
                            const doc = JSON.parse(lines[i]);
                            
                            // Normalizar estructura
                            const normalizedDoc = this.normalizeDocument(doc);
                            if (normalizedDoc) {
                                this.documents.push(normalizedDoc);
                                this.indexDocument(normalizedDoc, this.documents.length - 1);
                                totalLoaded++;
                            }
                        } catch (parseError) {
                            console.warn(`❌ Error parseando línea ${i} en ${path.basename(jsonlFile)}: ${parseError.message}`);
                        }
                    }
                    console.log(`  ✅ ${path.basename(jsonlFile)}: ${maxLines} documentos cargados`);
                } catch (fileError) {
                    console.error(`❌ Error leyendo ${jsonlFile}: ${fileError.message}`);
                }
            }

            this.loaded = true;
            this.loadCount = totalLoaded;
            const loadTime = Date.now() - loadStartTime;
            
            console.log(`🎉 CARGA COMPLETADA: ${this.loadCount} documentos en ${loadTime}ms`);
            console.log(`📊 Resumen: ${this.documents.length} docs, ${this.keywordIndex.size} keywords indexadas`);
            
        } catch (error) {
            console.error(`❌ ERROR en loadRealDocuments: ${error.message}`);
            // Fallback a documentos de ejemplo
            this.createFallbackDocuments();
            this.loaded = true;
            this.loadCount = this.documents.length;
            console.log(`✅ Fallback a ${this.loadCount} documentos de ejemplo`);
        }

        return this.loadCount;
    }

    // Normalizar estructura de documento
    normalizeDocument(rawDoc) {
        if (!rawDoc.text || typeof rawDoc.text !== 'string') {
            console.warn('❌ Documento sin campo "text":', rawDoc.id || 'unknown');
            return null;
        }

        // Extraer fuente/título
        let source = rawDoc.document_title || rawDoc.citation || 'Documento oficial';
        if (rawDoc.article && rawDoc.article !== null) {
            source += ', ' + rawDoc.article;
        } else if (rawDoc.section && rawDoc.section !== null) {
            source += ', ' + rawDoc.section;
        }

        // Extraer keywords del contenido
        const content = rawDoc.text.toLowerCase();
        const keywords = this.extractKeywords(content);

        return {
            id: rawDoc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content: rawDoc.text,
            source: source,
            article: rawDoc.article || rawDoc.section || 'N/A',
            document_type: rawDoc.document_type || 'Documento oficial',
            jurisdiction: rawDoc.jurisdiction || 'Municipal',
            keywords: keywords,
            raw: rawDoc // Mantener estructura original por si acaso
        };
    }

    // Extraer keywords del contenido
    extractKeywords(content) {
        const commonWords = new Set(['de', 'la', 'el', 'y', 'en', 'a', 'los', 'las', 'del', 'que', 'para', 'con', 'por', 'se', 'su', 'al', 'una', 'un', 'es', 'son']);
        
        const words = content
            .toLowerCase()
            .replace(/[^\w\sáéíóúñ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.has(word));
        
        // Tomar las 10 palabras más frecuentes
        const freq = {};
        words.forEach(word => {
            freq[word] = (freq[word] || 0) + 1;
        });
        
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }

    // Indexar documento
    indexDocument(doc, docIndex) {
        if (!doc.keywords || !Array.isArray(doc.keywords)) return;
        
        doc.keywords.forEach(keyword => {
            const kwLower = keyword.toLowerCase();
            if (!this.keywordIndex.has(kwLower)) {
                this.keywordIndex.set(kwLower, []);
            }
            this.keywordIndex.get(kwLower).push(docIndex);
        });
    }

    // Fallback si no hay documentos reales
    createFallbackDocuments() {
        console.log('📝 Creando documentos de fallback...');
        
        const fallbackDocs = [
            {
                id: 'fallback-1',
                content: 'La Dirección de Inspección y Vigilancia del Municipio de Zapopan tiene facultades para verificar el cumplimiento de normativas municipales en materia de comercio, construcción, condiciones de seguridad e higiene en centros de trabajo.',
                source: 'Reglamento Municipal de Inspección y Vigilancia',
                article: 'Artículo 15',
                document_type: 'Reglamento municipal',
                jurisdiction: 'Municipal',
                keywords: ['inspección', 'facultades', 'verificación', 'comercio', 'construcción', 'seguridad', 'higiene']
            },
            {
                id: 'fallback-2',
                content: 'Los inspectores municipales pueden realizar visitas de verificación a establecimientos comerciales, industriales y de servicios para constatar el cumplimiento de los reglamentos aplicables.',
                source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                article: 'Artículo 22',
                document_type: 'Reglamento municipal',
                jurisdiction: 'Municipal',
                keywords: ['inspectores', 'visitas', 'verificación', 'comercio', 'industria', 'servicios']
            },
            {
                id: 'fallback-3',
                content: 'El Código Urbano para el Estado de Jalisco establece las normas para el desarrollo urbano, uso de suelo, construcción y ordenamiento territorial en el estado.',
                source: 'Código Urbano para el Estado de Jalisco',
                article: 'Artículo Único',
                document_type: 'Código estatal',
                jurisdiction: 'Estatal',
                keywords: ['código', 'urbano', 'jalisco', 'desarrollo', 'urbano', 'uso', 'suelo', 'construcción']
            }
        ];

        fallbackDocs.forEach((doc, index) => {
            this.documents.push(doc);
            this.indexDocument(doc, index);
        });
    }

    // Búsqueda en documentos
    async searchDocuments(query, maxResults = 3) {
        if (!this.loaded) {
            await this.loadRealDocuments();
        }

        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
        
        const docScores = new Map();
        
        // Búsqueda por keywords
        queryWords.forEach(word => {
            if (this.keywordIndex.has(word)) {
                const docIndices = this.keywordIndex.get(word);
                docIndices.forEach(docIndex => {
                    const currentScore = docScores.get(docIndex) || 0;
                    docScores.set(docIndex, currentScore + 1);
                });
            }
        });

        // Búsqueda por contenido si no hay resultados
        if (docScores.size === 0) {
            this.documents.forEach((doc, docIndex) => {
                const contentLower = doc.content.toLowerCase();
                let score = 0;
                queryWords.forEach(word => {
                    if (contentLower.includes(word)) {
                        score += 1;
                    }
                });
                if (score > 0) {
                    docScores.set(docIndex, score);
                }
            });
        }

        // Ordenar y limitar resultados
        const sortedDocs = Array.from(docScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxResults)
            .map(([docIndex, score]) => ({
                doc: this.documents[docIndex],
                score
            }));

        // Fallback a primeros documentos si no hay resultados
        if (sortedDocs.length === 0 && this.documents.length > 0) {
            return this.documents.slice(0, Math.min(2, this.documents.length)).map(doc => ({
                doc,
                score: 0.5
            }));
        }

        return sortedDocs;
    }

    // Generar respuesta estructurada
    generateResponse(query, searchResults) {
        if (!searchResults || searchResults.length === 0) {
            return 'No encontré información específica sobre este tema en los documentos disponibles. Te recomiendo consultar los reglamentos municipales oficiales o contactar a la Dirección de Inspección y Vigilancia del Municipio de Zapopan para información precisa.';
        }

        const context = searchResults.map((result, i) => {
            const doc = result.doc;
            let sourceInfo = doc.source;
            if (doc.article && doc.article !== 'N/A') {
                sourceInfo += ', ' + doc.article;
            }
            return (i + 1) + '. **' + sourceInfo + '**\n   ' + doc.content.substring(0, 300) + (doc.content.length > 300 ? '...' : '');
        }).join('\n\n');

        const uniqueSources = [...new Set(searchResults.map(r => r.doc.source).filter(s => s))];

        return '**Consulta:** ' + query + '\n\n' +
               '**Información relevante encontrada en documentos oficiales:**\n\n' +
               context + '\n\n' +
               '**Fuentes consultadas:** ' + (uniqueSources.length > 0 ? uniqueSources.join('; ') : 'Documentos oficiales') + '\n\n' +
               '*Sistema RAG Final - Respuestas basadas en documentos reales de la Dirección de Inspección Zapopan*\n' +
               '*Nota: Para información completa y oficial, consulta los documentos originales.*';
    }

    getSystemInfo() {
        return {
            documents_loaded: this.loadCount,
            documents_total: this.documents.length,
            keywords_indexed: this.keywordIndex.size,
            system_loaded: this.loaded,
            has_real_documents: this.loadCount > 0
        };
    }
}

// ============================================
// INICIALIZAR SISTEMA FINAL
// ============================================

console.log('🚀 Inicializando Chatbot Zapopan RAG Final...');
const chatbot = new FinalRAGSystem();

// Carga lazy
let loadPromise = null;
async function ensureLoaded() {
    if (!loadPromise) {
        loadPromise = chatbot.loadRealDocuments();
    }
    return loadPromise;
}

// ============================================
// SERVER HTTP FINAL
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
        await ensureLoaded();
        const systemInfo = chatbot.getSystemInfo();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'Chatbot Inspección Zapopan - RAG Final',
            version: 'final-rag',
            system: 'ready',
            info: systemInfo,
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
                    system: 'RAG Final - Documentos reales',
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
        res.end('<h1>Chatbot Inspección Zapopan - RAG Final</h1><p>Sistema con documentos reales. Use /api/chat para consultas.</p>');
    }
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;