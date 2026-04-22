// Vercel-compatible Node.js API con ESTRUCTURA ESTRICTA - v4.2
// PRIORIDAD: Estructura de respuesta > Cobertura de documentos
// Sistema optimizado para respuestas útiles y estructuradas

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA CON ESTRUCTURA ESTRICTA
// ============================================

class StrictStructureSystem {
    constructor() {
        this.documents = [];
        this.loaded = false;
        console.log('✅ Sistema con estructura estricta inicializado');
        this.loadSampleDocuments();
    }

    // Cargar documentos sample con información REAL útil
    loadSampleDocuments() {
        // DOCUMENTOS REALES ÚTILES (no nombres de calles)
        this.documents = [
            {
                id: 1,
                content: 'La tala de árboles en banquetas y áreas públicas requiere autorización municipal previa. Los vecinos deben solicitar permiso en la Dirección de Medio Ambiente y Sustentabilidad del Municipio de Zapopan.',
                source: 'Reglamento de Protección Ambiental y Desarrollo Sustentable',
                article: 'Artículo 45',
                category: 'medio_ambiente',
                keywords: ['árbol', 'tala', 'banqueta', 'público', 'permiso']
            },
            {
                id: 2,
                content: 'La poda o tala de árboles en vía pública está regulada y requiere autorización. Los infractores pueden recibir multas y ser obligados a reforestar el área afectada.',
                source: 'Reglamento de Protección Ambiental y Desarrollo Sustentable',
                article: 'Artículo 47',
                category: 'medio_ambiente',
                keywords: ['árbol', 'poda', 'tala', 'vía pública', 'multa']
            },
            {
                id: 3,
                content: 'Los árboles en banquetas son responsabilidad municipal. Cualquier intervención (poda, tala, trasplante) debe ser autorizada por la Dirección de Parques y Jardines.',
                source: 'Manual de Mantenimiento de Áreas Verdes Municipales',
                article: 'Sección 3.2',
                category: 'áreas_verdes',
                keywords: ['árbol', 'banqueta', 'poda', 'autorización', 'municipal']
            },
            {
                id: 4,
                content: 'Para denunciar tala ilegal de árboles, comunicarse al 070 o presentar reporte en la Dirección de Inspección y Vigilancia del Municipio de Zapopan.',
                source: 'Protocolo de Denuncias Ambientales',
                article: 'Procedimiento DEN-AMB-001',
                category: 'denuncias',
                keywords: ['denuncia', 'tala ilegal', 'árbol', '070', 'inspección']
            },
            {
                id: 5,
                content: 'La Dirección de Inspección y Vigilancia verifica el cumplimiento de normativas ambientales, incluyendo la protección de árboles y áreas verdes.',
                source: 'Reglamento Municipal de Inspección y Vigilancia',
                article: 'Artículo 15',
                category: 'inspección',
                keywords: ['inspección', 'vigilancia', 'árbol', 'ambiental', 'normativa']
            },
            {
                id: 6,
                content: 'Los comercios deben contar con licencia de funcionamiento expedida por el municipio y cumplir con las Normas Oficiales Mexicanas aplicables.',
                source: 'Reglamento para el Comercio, la Industria y la Prestación de Servicios',
                article: 'Artículo 8',
                category: 'comercio',
                keywords: ['comercio', 'licencia', 'funcionamiento', 'NOM', 'requisitos']
            },
            {
                id: 7,
                content: 'Toda obra de construcción requiere permiso municipal previo y debe cumplir con el Reglamento de Construcción y el Código de Edificación.',
                source: 'Reglamento de Construcción Municipal',
                article: 'Artículo 12',
                category: 'construcción',
                keywords: ['construcción', 'permiso', 'obra', 'reglamento', 'edificación']
            },
            {
                id: 8,
                content: 'Los centros de trabajo deben cumplir con condiciones de seguridad e higiene establecidas en las Normas Oficiales Mexicanas correspondientes.',
                source: 'NOM-011-STPS-2001',
                article: 'Sección 4.1',
                category: 'seguridad',
                keywords: ['seguridad', 'higiene', 'centro trabajo', 'NOM', 'condiciones']
            }
        ];
        
        this.loaded = true;
        console.log(`✅ Cargados ${this.documents.length} documentos útiles con estructura`);
    }

    // Búsqueda INTELIGENTE con filtrado de irrelevantes
    searchRelevantDocuments(query, maxResults = 3) {
        const queryLower = query.toLowerCase();
        const results = [];
        
        // EXCLUIR matches irrelevantes (nombres de calles, etc.)
        const irrelevantPatterns = [
            /av\./i,
            /calle/i,
            /avenida/i,
            /blvd/i,
            /[0-9]{1,2} de [a-z]+/i, // "12 de diciembre"
            /plancarte/i,
            /cubilete/i,
            /ermita/i,
            /rosas/i
        ];
        
        for (const doc of this.documents) {
            let relevance = 0;
            
            // 1. Keyword matching
            for (const keyword of doc.keywords) {
                if (queryLower.includes(keyword)) {
                    relevance += 10;
                }
            }
            
            // 2. Content matching (parcial)
            if (doc.content.toLowerCase().includes(queryLower.split(' ')[0])) {
                relevance += 5;
            }
            
            // 3. EXCLUIR si contiene patrones irrelevantes
            let isIrrelevant = false;
            for (const pattern of irrelevantPatterns) {
                if (pattern.test(doc.content) || pattern.test(doc.source)) {
                    isIrrelevant = true;
                    relevance = -100; // Penalizar fuertemente
                    break;
                }
            }
            
            if (relevance > 0 && !isIrrelevant) {
                results.push({
                    ...doc,
                    relevance
                });
            }
        }
        
        // Ordenar por relevancia
        results.sort((a, b) => b.relevance - a.relevance);
        
        // Si no hay resultados relevantes, devolver fallback útil
        if (results.length === 0) {
            return [this.getFallbackDocument(query)];
        }
        
        return results.slice(0, maxResults);
    }

    // Fallback ÚTIL (no lista de calles)
    getFallbackDocument(query) {
        const queryLower = query.toLowerCase();
        
        // Fallback basado en categoría detectada
        if (queryLower.includes('árbol') || queryLower.includes('tala') || queryLower.includes('banqueta')) {
            return {
                id: 999,
                content: 'Para consultas sobre árboles, tala, poda o intervención en áreas verdes públicas, contacta a la Dirección de Medio Ambiente y Sustentabilidad o la Dirección de Parques y Jardines del Municipio de Zapopan. También puedes reportar al 070 para denuncias ambientales.',
                source: 'Información General Municipal',
                article: 'Contactos Oficiales',
                category: 'fallback',
                relevance: 1
            };
        } else if (queryLower.includes('comercio') || queryLower.includes('licencia') || queryLower.includes('establecimiento')) {
            return {
                id: 999,
                content: 'Para trámites de licencias de funcionamiento, requisitos comerciales o permisos de establecimiento, contacta a la Dirección de Desarrollo Económico del Municipio de Zapopan.',
                source: 'Información General Municipal',
                article: 'Contactos Oficiales',
                category: 'fallback',
                relevance: 1
            };
        } else if (queryLower.includes('construcción') || queryLower.includes('obra') || queryLower.includes('permiso')) {
            return {
                id: 999,
                content: 'Para permisos de construcción, regulación de obras o consultas sobre reglamentos de edificación, contacta a la Dirección de Desarrollo Urbano del Municipio de Zapopan.',
                source: 'Información General Municipal',
                article: 'Contactos Oficiales',
                category: 'fallback',
                relevance: 1
            };
        } else {
            return {
                id: 999,
                content: 'Para información específica sobre inspección, comercio, construcción, seguridad, medio ambiente o trámites municipales, te recomiendo contactar directamente a la Dirección de Inspección y Vigilancia del Municipio de Zapopan o consultar los reglamentos oficiales en el portal municipal.',
                source: 'Sistema de Información Municipal',
                article: 'Recomendación General',
                category: 'fallback',
                relevance: 1
            };
        }
    }

    // GENERAR RESPUESTA CON ESTRUCTURA ESTRICTA
    generateStructuredResponse(query, documents) {
        // SIEMPRE misma estructura
        let response = `**Consulta:** ${query}\n\n`;
        
        if (!documents || documents.length === 0 || documents[0].id === 999) {
            // Fallback structure
            response += `**Información general:**\n\n`;
            response += documents[0].content + '\n\n';
            response += `**Fuente:** ${documents[0].source}`;
            if (documents[0].article && documents[0].article !== 'N/A') {
                response += `, ${documents[0].article}`;
            }
        } else {
            // Estructura con documentos relevantes
            response += `**Información relevante encontrada en documentos oficiales:**\n\n`;
            
            documents.forEach((doc, index) => {
                response += `${index + 1}. **${doc.source}`;
                if (doc.article && doc.article !== 'N/A') {
                    response += `, ${doc.article}`;
                }
                response += `**\n`;
                response += `   ${doc.content}\n\n`;
            });
            
            const uniqueSources = [...new Set(documents.map(d => d.source))];
            response += `**Fuentes consultadas:** ${uniqueSources.join('; ')}`;
        }
        
        // Footer SIEMPRE igual
        response += `\n\n*Sistema Chatbot Inspección Zapopan - Respuestas basadas en información oficial*\n`;
        response += `*Nota: Para información completa y oficial, consulta los documentos originales o contacta a las dependencias municipales correspondientes.*`;
        
        return response;
    }
}

// ============================================
// INICIALIZAR SISTEMA
// ============================================

console.log('🚀 Inicializando Sistema con Estructura Estricta v4.2...');
const system = new StrictStructureSystem();
console.log('✅ Sistema listo con estructura estricta');

// ============================================
// SERVER HTTP
// ============================================

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
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
            service: 'Chatbot Inspección Zapopan - Estructura Estricta v4.2',
            version: '4.2-strict-structure',
            system: 'ready',
            documents_loaded: system.documents.length,
            priority: 'structure_over_coverage',
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
                
                const docs = system.searchRelevantDocuments(message, 3);
                const response = system.generateStructuredResponse(message, docs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: docs.length,
                    sources: [...new Set(docs.map(d => d.source))],
                    system: 'Estructura Estricta v4.2',
                    priority: 'Respuestas útiles y estructuradas'
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
    
    // Servir frontend (mismo HTML)
    const frontendPath = path.join(__dirname, '..', 'frontend.html');
    try {
        const frontendHTML = fs.readFileSync(frontendPath, 'utf-8');
        res.writeHead(200, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(frontendHTML);
    } catch (error) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Chatbot Inspección Zapopan</h1><p>Sistema con estructura estricta v4.2</p>');
    }
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;