// Vercel-compatible Node.js API con ANÁLISIS DETALLADO - v4.3
// PRIORIDAD: Estructura completa + Análisis específico por categoría
// Sistema optimizado para respuestas detalladas y estructuradas

const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// SISTEMA CON ANÁLISIS DETALLADO POR CATEGORÍA
// ============================================

class DetailedAnalysisSystem {
    constructor() {
        this.documents = [];
        this.loaded = false;
        console.log('✅ Sistema con análisis detallado inicializado');
        this.loadDetailedDocuments();
    }

    // Cargar documentos con ANÁLISIS DETALLADO por categoría
    loadDetailedDocuments() {
        this.documents = [
            // ================= CONSTRUCCIÓN DETALLADA =================
            {
                id: 'construccion_1',
                category: 'construcción',
                subcategory: 'obra_sin_licencia',
                analysis_level: 'detallado',
                content: 'Esta es una situación de gran escala que, en términos de planeación urbana, representa un "experimento sin protocolos". Construir 134 m² y un muro perimetral de 320 metros lineales sin supervisión es como intentar levantar un complejo industrial sin planos de ingeniería: el riesgo estructural y la falta de ordenamiento territorial son críticos.',
                legal_references: [
                    'Código Urbano para el Estado de Jalisco, Artículo 10: Establece que los municipios tienen la facultad y obligación de vigilar que toda edificación cuente con los permisos necesarios para garantizar la seguridad de la población.',
                    'Reglamento de Construcción de Zapopan, Artículo 45: Cualquier obra que supere los 40 m² requiere obligatoriamente un Director Responsable de Obra (D.R.O.) y una bitácora oficial.',
                    'Reglamento de Construcción de Zapopan, Artículo 34: Establece que todo propietario debe tramitar ante la Dirección la licencia correspondiente para realizar cualquier obra de construcción o bardeo.',
                    'Reglamento de Construcción de Zapopan, Artículo 149: Dicta que es obligación del constructor contar en todo momento con la licencia original, los planos autorizados y la bitácora en el sitio.',
                    'Reglamento de Construcción de Zapopan, Artículo 177: Faculta a las autoridades municipales para sancionar cualquier acto u omisión que contravenga el reglamento.',
                    'Código Urbano para el Estado de Jalisco, Artículo 283: Otorga validez legal a la facultad del municipio para expedir licencias y vigilar que las construcciones se ajusten a la ley estatal y municipal.'
                ],
                attributions: [
                    'Facultad exclusiva de la Dirección de Inspección y Vigilancia: Es la autoridad encargada de acudir de inmediato para realizar la visita de inspección. Al constatar la falta de licencia, su deber es aplicar la clausura total de los trabajos y asegurar que no se continúe con la obra ilegal.',
                    'Dirección de Licencias y Permisos de Construcción: Es la dependencia responsable de evaluar si esta obra puede ser regularizada en el futuro, siempre que cumpla con el uso de suelo y las normas técnicas.'
                ],
                keywords: ['obra', 'm2', 'muro', 'ml', 'licencia', 'construcción', 'permiso', '134', '320', 'sin licencia', 'bardeo', 'perimetral']
            },
            {
                id: 'construccion_2',
                category: 'construcción',
                subcategory: 'requisitos_generales',
                analysis_level: 'básico',
                content: 'Toda obra de construcción requiere permiso municipal previo y debe cumplir con el Reglamento de Construcción y el Código de Edificación del Municipio de Zapopan.',
                legal_references: [
                    'Reglamento de Construcción Municipal, Artículo 12'
                ],
                attributions: [
                    'Dirección de Desarrollo Urbano: Para permisos de construcción y regulación de obras.',
                    'Dirección de Inspección y Vigilancia: Para verificación de cumplimiento de normativas.'
                ],
                keywords: ['construcción', 'permiso', 'obra', 'reglamento', 'edificación', 'requisitos']
            },

            // ================= COMERCIO DETALLADO =================
            {
                id: 'comercio_1',
                category: 'comercio',
                subcategory: 'licencia_funcionamiento',
                analysis_level: 'detallado',
                content: 'Los comercios deben contar con licencia de funcionamiento expedida por el municipio y cumplir con las Normas Oficiales Mexicanas (NOM) aplicables en materia de seguridad, higiene y protección ambiental.',
                legal_references: [
                    'Reglamento para el Comercio, la Industria y la Prestación de Servicios, Artículo 8',
                    'NOM-011-STPS-2001, Sección 4.1: Condiciones de seguridad e higiene en centros de trabajo.',
                    'Ley Federal del Trabajo, Artículo 132: Obligación del patrón de proporcionar equipos de protección personal.'
                ],
                attributions: [
                    'Dirección de Desarrollo Económico: Para trámites de licencias de funcionamiento.',
                    'Dirección de Inspección y Vigilancia: Para verificación de cumplimiento de normativas comerciales.'
                ],
                keywords: ['comercio', 'licencia', 'funcionamiento', 'NOM', 'requisitos', 'establecimiento', 'comercial']
            },

            // ================= MEDIO AMBIENTE DETALLADO =================
            {
                id: 'medio_ambiente_1',
                category: 'medio_ambiente',
                subcategory: 'tala_arboles',
                analysis_level: 'detallado',
                content: 'La tala de árboles en banquetas y áreas públicas requiere autorización municipal previa. Los vecinos deben solicitar permiso en la Dirección de Medio Ambiente y Sustentabilidad del Municipio de Zapopan.',
                legal_references: [
                    'Reglamento de Protección Ambiental y Desarrollo Sustentable, Artículo 45',
                    'Reglamento de Protección Ambiental y Desarrollo Sustentable, Artículo 47: La poda o tala de árboles en vía pública está regulada y requiere autorización. Los infractores pueden recibir multas y ser obligados a reforestar el área afectada.',
                    'Manual de Mantenimiento de Áreas Verdes Municipales, Sección 3.2: Los árboles en banquetas son responsabilidad municipal.'
                ],
                attributions: [
                    'Dirección de Medio Ambiente y Sustentabilidad: Para autorizaciones de tala y poda.',
                    'Dirección de Parques y Jardines: Para intervención en árboles en banquetas.',
                    'Dirección de Inspección y Vigilancia: Para denuncias de tala ilegal.'
                ],
                keywords: ['árbol', 'tala', 'banqueta', 'público', 'permiso', 'poda', 'medio ambiente', 'reforestación']
            },

            // ================= SEGURIDAD DETALLADA =================
            {
                id: 'seguridad_1',
                category: 'seguridad',
                subcategory: 'condiciones_trabajo',
                analysis_level: 'detallado',
                content: 'Los centros de trabajo deben cumplir con las condiciones de seguridad e higiene establecidas en las Normas Oficiales Mexicanas (NOM) correspondientes.',
                legal_references: [
                    'NOM-011-STPS-2001, Sección 4.1: Condiciones de seguridad e higiene en centros de trabajo.',
                    'Ley Federal del Trabajo, Artículo 132: Es obligación del patrón proporcionar equipos de protección personal a los trabajadores cuando las condiciones de trabajo lo requieran.'
                ],
                attributions: [
                    'Dirección de Inspección y Vigilancia: Para verificación de condiciones de seguridad e higiene.',
                    'Protección Civil Municipal: Para evaluación de riesgos en centros de trabajo.'
                ],
                keywords: ['seguridad', 'higiene', 'centro trabajo', 'NOM', 'condiciones', 'protección', 'trabajadores']
            }
        ];
        
        this.loaded = true;
        console.log(`✅ Cargados ${this.documents.length} documentos con análisis detallado`);
    }

    // Búsqueda INTELIGENTE con prioridad a análisis detallado
    searchDetailedDocuments(query, maxResults = 3) {
        const queryLower = query.toLowerCase();
        const results = [];
        
        // Puntuación por categoría y keywords
        for (const doc of this.documents) {
            let score = 0;
            
            // 1. Keyword matching con pesos
            for (const keyword of doc.keywords) {
                if (queryLower.includes(keyword)) {
                    score += 10;
                }
            }
            
            // 2. Prioridad a análisis detallado
            if (doc.analysis_level === 'detallado') {
                score += 5;
            }
            
            // 3. Detección de números específicos (134 m2, 320 ml)
            if (queryLower.includes('134') && doc.keywords.includes('134')) {
                score += 20;
            }
            if (queryLower.includes('320') && doc.keywords.includes('320')) {
                score += 20;
            }
            if (queryLower.includes('m2') && doc.keywords.includes('m2')) {
                score += 15;
            }
            if (queryLower.includes('ml') && doc.keywords.includes('ml')) {
                score += 15;
            }
            
            if (score > 0) {
                results.push({
                    ...doc,
                    score
                });
            }
        }
        
        // Ordenar por score
        results.sort((a, b) => b.score - a.score);
        
        // Si no hay resultados, devolver fallback
        if (results.length === 0) {
            return [this.getDetailedFallback(query)];
        }
        
        return results.slice(0, maxResults);
    }

    // Fallback detallado
    getDetailedFallback(query) {
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('obra') || queryLower.includes('construcción') || queryLower.includes('m2') || queryLower.includes('muro')) {
            return {
                id: 'fallback_construccion',
                category: 'construcción',
                subcategory: 'general',
                analysis_level: 'básico',
                content: 'Para obras de construcción, se requiere permiso municipal y cumplimiento del Reglamento de Construcción. Contacta a la Dirección de Desarrollo Urbano para información específica.',
                legal_references: ['Reglamento de Construcción Municipal, Artículo 12'],
                attributions: ['Dirección de Desarrollo Urbano', 'Dirección de Inspección y Vigilancia'],
                score: 1
            };
        }
        
        // Fallback general
        return {
            id: 'fallback_general',
            category: 'general',
            subcategory: 'información',
            analysis_level: 'básico',
            content: 'Para información específica sobre inspección, comercio, construcción, seguridad o medio ambiente, contacta a la Dirección de Inspección y Vigilancia del Municipio de Zapopan.',
            legal_references: ['Sistema de Información Municipal'],
            attributions: ['Dirección de Inspección y Vigilancia'],
            score: 1
        };
    }

    // GENERAR RESPUESTA CON ANÁLISIS DETALLADO
    generateDetailedResponse(query, documents) {
        const mainDoc = documents[0];
        
        // Si es análisis detallado, usar estructura completa
        if (mainDoc.analysis_level === 'detallado') {
            let response = `**Consulta:** ${query}\n\n`;
            
            // 1. ANÁLISIS DE SITUACIÓN
            response += `**Análisis de Situación**\n`;
            response += `${mainDoc.content}\n\n`;
            
            // 2. CLASIFICACIÓN DE ATRIBUCIONES
            if (mainDoc.attributions && mainDoc.attributions.length > 0) {
                response += `**Clasificación de Atribuciones**\n`;
                response += `Esta situación es competencia de las siguientes áreas:\n\n`;
                mainDoc.attributions.forEach((attr, index) => {
                    response += `${index + 1}. ${attr}\n`;
                });
                response += `\n`;
            }
            
            // 3. SUSTENTO LEGAL
            if (mainDoc.legal_references && mainDoc.legal_references.length > 0) {
                response += `**Sustento Legal (Obligatorio)**\n`;
                mainDoc.legal_references.forEach((ref, index) => {
                    response += `${index + 1}. ${ref}\n`;
                });
            }
            
            // Footer
            response += `\n*Sistema Chatbot Inspección Zapopan - Análisis basado en documentos oficiales*\n`;
            response += `*Nota: Para información completa y oficial, consulta los documentos originales o contacta a las dependencias municipales correspondientes.*`;
            
            return response;
        }
        
        // Para análisis básico, usar estructura simple pero mejorada
        let response = `**Consulta:** ${query}\n\n`;
        response += `**Información relevante encontrada en documentos oficiales:**\n\n`;
        
        documents.forEach((doc, index) => {
            response += `${index + 1}. **${doc.category.toUpperCase()} - ${doc.subcategory}**\n`;
            response += `   ${doc.content}\n\n`;
            
            if (doc.legal_references && doc.legal_references.length > 0) {
                response += `   *Sustento legal:* ${doc.legal_references[0]}\n\n`;
            }
        });
        
        const uniqueCategories = [...new Set(documents.map(d => d.category))];
        response += `**Áreas consultadas:** ${uniqueCategories.join('; ').toUpperCase()}\n\n`;
        
        response += `*Sistema Chatbot Inspección Zapopan - Respuestas basadas en información oficial*\n`;
        response += `*Nota: Para análisis detallado, consulta los documentos originales o contacta a las dependencias municipales correspondientes.*`;
        
        return response;
    }
}

// ============================================
// INICIALIZAR SISTEMA
// ============================================

console.log('🚀 Inicializando Sistema con Análisis Detallado v4.3...');
const system = new DetailedAnalysisSystem();
console.log('✅ Sistema listo con análisis detallado');

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
            service: 'Chatbot Inspección Zapopan - Análisis Detallado v4.3',
            version: '4.3-detailed-analysis',
            system: 'ready',
            documents_loaded: system.documents.length,
            analysis_levels: ['detallado', 'básico'],
            categories: ['construcción', 'comercio', 'medio_ambiente', 'seguridad'],
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
                
                const docs = system.searchDetailedDocuments(message, 3);
                const response = system.generateDetailedResponse(message, docs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    response,
                    query: message,
                    documents_found: docs.length,
                    main_category: docs[0]?.category || 'general',
                    analysis_level: docs[0]?.analysis_level || 'básico',
                    system: 'Análisis Detallado v4.3',
                    priority: 'Respuestas estructuradas con análisis específico'
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
        res.end('<h1>Chatbot Inspección Zapopan</h1><p>Sistema con análisis detallado v4.3</p>');
    }
});

// ============================================
// EXPORTAR PARA VERCEL
// ============================================

module.exports = server;