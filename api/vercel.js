// CHATBOT ZAPOPAN v6.0 FINAL COMPLETO
// Excelencia Operativa - Sistema híbrido Vercel-compatible
// Todas las funciones en un solo archivo para evitar problemas de módulos

const fs = require('fs');
const path = require('path');

// ============================================
// 🏗️  SISTEMA RAG HÍBRIDO
// ============================================

class HybridRAGSystem {
    constructor() {
        this.initialized = false;
        this.dataset = this.loadHybridDataset();
    }
    
    loadHybridDataset() {
        return {
            "CONSTRUCCIÓN": [
                {
                    texto_normativo: "Toda construcción, modificación, ampliación, demolición o reconstrucción de inmuebles requiere permiso municipal previo expedido por la Dirección de Inspección y Vigilancia.",
                    document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "34",
                    fraccion: "I",
                    citation_short: "Reglamento de Construcción, Art. 34, Fracc. I",
                    citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 34, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_34|frac_I|c001",
                    tags: ["permiso", "construcción", "obligatorio", "previo"],
                    relevance_score: 0.95
                },
                {
                    texto_normativo: "Las bardas, muros o cercas perimetrales que excedan 1.80 metros de altura requieren permiso de construcción y deben cumplir con las normas de seguridad estructural establecidas en este reglamento.",
                    document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "87",
                    fraccion: "III",
                    citation_short: "Reglamento de Construcción, Art. 87, Fracc. III",
                    citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 87, Fracción III",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_87|frac_III|c001",
                    tags: ["barda", "muro", "cerca", "altura", "1.80m", "permiso"],
                    relevance_score: 0.92
                }
            ],
            "AMBIENTAL": [
                {
                    texto_normativo: "Se prohíbe depositar, verter o abandonar residuos sólidos en la vía pública, áreas verdes, barrancas o cualquier espacio no autorizado.",
                    document_title: "Reglamento de Prevención y Gestión Integral de Residuos",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "42",
                    fraccion: "I",
                    citation_short: "Reglamento Residuos, Art. 42, Fracc. I",
                    citation_full: "Reglamento de Prevención y Gestión Integral de Residuos, Artículo 42, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_residuos|v2023|art_42|frac_I|c001",
                    tags: ["residuos", "basura", "contaminación", "prohibido"],
                    relevance_score: 0.90
                }
            ],
            "COMERCIO": [
                {
                    texto_normativo: "Todo establecimiento mercantil, industrial o de servicios requiere licencia municipal para su funcionamiento, expedida previa verificación de cumplimiento normativo.",
                    document_title: "Reglamento para el Comercio la Industria y la Prestación de Servicios",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "15",
                    fraccion: "I",
                    citation_short: "Reglamento Comercio, Art. 15, Fracc. I",
                    citation_full: "Reglamento para el Comercio la Industria y la Prestación de Servicios, Artículo 15, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_comercio|v2023|art_15|frac_I|c001",
                    tags: ["licencia", "comercio", "establecimiento", "permiso"],
                    relevance_score: 0.93
                }
            ],
            "GENERAL": [
                {
                    texto_normativo: "La Dirección de Inspección y Vigilancia del Ayuntamiento de Zapopan es la autoridad competente para la verificación del cumplimiento de la normativa municipal en materia de construcción, comercio, medio ambiente y ordenamiento urbano.",
                    document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
                    document_type: "Manual Organizacional",
                    jurisdiction_level: "Municipal",
                    article: "1",
                    numeral: "1",
                    citation_short: "Manual Inspección, Art. 1, Num. 1",
                    citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 1, Numeral 1",
                    id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_1|num_1|c001",
                    tags: ["competencia", "inspección", "autoridad", "municipal"],
                    relevance_score: 0.85
                },
                {
                    texto_normativo: "Para cualquier trámite, permiso o autorización municipal, el interesado debe presentar solicitud por escrito en el formato oficial, acompañada de la documentación requerida según el tipo de procedimiento.",
                    document_title: "Manual de Procedimientos Administrativos",
                    document_type: "Manual Administrativo",
                    jurisdiction_level: "Municipal",
                    article: "3",
                    numeral: "2",
                    citation_short: "Manual Procedimientos, Art. 3, Num. 2",
                    citation_full: "Manual de Procedimientos Administrativos del Ayuntamiento de Zapopan, Artículo 3, Numeral 2",
                    id_juridico: "mx|jal|jal|mun|zapopan|manual_procedimientos|v2023|art_3|num_2|c001",
                    tags: ["trámite", "permiso", "solicitud", "documentación", "procedimiento"],
                    relevance_score: 0.80
                },
                {
                    texto_normativo: "Los plazos para la resolución de trámites municipales varían según la complejidad del asunto, desde 5 días hábiles para trámites simples hasta 30 días hábiles para procedimientos que requieren verificación in situ.",
                    document_title: "Manual de Procedimientos Administrativos",
                    document_type: "Manual Administrativo",
                    jurisdiction_level: "Municipal",
                    article: "7",
                    numeral: "4",
                    citation_short: "Manual Procedimientos, Art. 7, Num. 4",
                    citation_full: "Manual de Procedimientos Administrativos del Ayuntamiento de Zapopan, Artículo 7, Numeral 4",
                    id_juridico: "mx|jal|jal|mun|zapopan|manual_procedimientos|v2023|art_7|num_4|c001",
                    tags: ["plazo", "resolución", "trámite", "días hábiles", "verificación"],
                    relevance_score: 0.78
                },
                {
                    texto_normativo: "El incumplimiento de las disposiciones normativas municipales puede derivar en sanciones administrativas que incluyen multas, suspensiones de actividades e incluso la clausura temporal o definitiva del establecimiento.",
                    document_title: "Ley de Ingresos del Municipio de Zapopan",
                    document_type: "Ley Municipal",
                    jurisdiction_level: "Municipal",
                    article: "45",
                    fraccion: "III",
                    citation_short: "Ley Ingresos, Art. 45, Fracc. III",
                    citation_full: "Ley de Ingresos del Municipio de Zapopan para el Ejercicio Fiscal 2024, Artículo 45, Fracción III",
                    id_juridico: "mx|jal|jal|mun|zapopan|ley_ingresos|v2024|art_45|frac_III|c001",
                    tags: ["sanción", "multa", "incumplimiento", "clausura", "suspensión"],
                    relevance_score: 0.82
                },
                {
                    texto_normativo: "Los ciudadanos pueden presentar quejas, denuncias o sugerencias ante la Dirección de Inspección y Vigilancia de manera presencial, telefónica o a través del portal electrónico del Ayuntamiento de Zapopan.",
                    document_title: "Reglamento de Participación Ciudadana",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "22",
                    fraccion: "I",
                    citation_short: "Reglamento Participación, Art. 22, Fracc. I",
                    citation_full: "Reglamento de Participación Ciudadana del Municipio de Zapopan, Artículo 22, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_participacion|v2023|art_22|frac_I|c001",
                    tags: ["queja", "denuncia", "sugerencia", "participación", "ciudadana"],
                    relevance_score: 0.75
                }
            ]
        };
    }
    
    async semanticSearch(query, area = null, limit = 5) {
        console.log(`🔍 Búsqueda: "${query.substring(0, 50)}..."`);
        
        const areaDataset = this.dataset[area] || this.dataset["GENERAL"];
        const allChunks = Object.values(this.dataset).flat();
        const queryLower = query.toLowerCase();
        const scoredChunks = [];
        
        for (const chunk of allChunks) {
            let score = chunk.relevance_score || 0.5;
            
            // Bonus por área
            if (area && chunk.tags) {
                const areaMatch = chunk.tags.some(tag => 
                    area.toLowerCase().includes(tag.toLowerCase()) || 
                    tag.toLowerCase().includes(area.toLowerCase())
                );
                if (areaMatch) score += 0.2;
            }
            
            // Bonus por palabras clave
            const keywords = this.extractKeywords(queryLower);
            const keywordMatches = keywords.filter(keyword =>
                chunk.texto_normativo.toLowerCase().includes(keyword) ||
                (chunk.tags && chunk.tags.some(tag => tag.toLowerCase().includes(keyword)))
            );
            
            score += keywordMatches.length * 0.1;
            scoredChunks.push({ ...chunk, search_score: score });
        }
        
        return scoredChunks
            .sort((a, b) => b.search_score - a.search_score)
            .slice(0, limit);
    }
    
    extractKeywords(query) {
        const keywords = [
            // Construcción
            "permiso", "construcción", "construir", "barda", "muro", "casa", "edificio", "obra",
            "remodelación", "ampliación", "demolición", "altura", "metros", "terreno", "lote",
            "fachada", "estructura", "cimientos", "columna", "viga", "loseta",
            
            // Comercio
            "licencia", "comercio", "negocio", "giro", "establecimiento", "local", "tienda",
            "restaurante", "oficina", "servicio", "actividad", "comercial", "venta", "compra",
            "producto", "mercancía", "inventario", "empleado", "cliente",
            
            // Ambiental
            "residuos", "basura", "contaminación", "medio ambiente", "ecología", "desechos",
            "reciclaje", "contaminar", "tiradero", "vertedero", "emisiones", "olores",
            "sustancias", "químicos", "tóxicos", "peligrosos",
            
            // General/trámites
            "trámite", "procedimiento", "requisito", "documento", "formato", "oficio",
            "solicitud", "autorización", "aprobación", "verificación", "revisión",
            "dictamen", "resolución", "oficial", "certificado", "constancia",
            
            // Inspección
            "inspección", "vigilancia", "sanción", "multa", "infracción", "violación",
            "incumplimiento", "verificación", "supervisión", "control", "auditoría",
            "monitoreo", "seguimiento", "evaluación",
            
            // Urbanización
            "urbanización", "uso de suelo", "zona", "sector", "colonia", "fraccionamiento",
            "predio", "propiedad", "inmueble", "territorio", "espacio", "área",
            
            // Varios
            "anuncio", "publicidad", "cartel", "tianguis", "mercado", "ambulante",
            "ruido", "molestia", "vecino", "animal", "mascota", "perro", "gato",
            "agua", "drenaje", "electricidad", "gas", "telefonía", "internet",
            "seguridad", "protección", "emergencia", "accidente", "riesgo"
        ];
        
        return keywords.filter(keyword => query.includes(keyword));
    }
    
    async initialize() {
        this.initialized = true;
        return true;
    }
}

// ============================================
// 📊  SISTEMA DE MÉTRICAS
// ============================================

class HybridMetricsSystem {
    constructor() {
        this.metrics = {
            totalQueries: 0,
            successfulQueries: 0,
            failedQueries: 0,
            avgResponseTime: 0,
            queriesByArea: {},
            qualityDistribution: {},
            startTime: Date.now()
        };
    }
    
    logQuery(auditData, responseData) {
        this.metrics.totalQueries++;
        
        if (responseData.success) {
            this.metrics.successfulQueries++;
        } else {
            this.metrics.failedQueries++;
        }
        
        const area = auditData.area_identificada || 'GENERAL';
        this.metrics.queriesByArea[area] = (this.metrics.queriesByArea[area] || 0) + 1;
        
        const quality = auditData.calificacion_calidad || 'UNKNOWN';
        this.metrics.qualityDistribution[quality] = (this.metrics.qualityDistribution[quality] || 0) + 1;
        
        const responseTime = auditData.tiempo_respuesta_segundos || 0;
        const currentTotal = this.metrics.avgResponseTime * (this.metrics.totalQueries - 1);
        this.metrics.avgResponseTime = (currentTotal + responseTime) / this.metrics.totalQueries;
    }
    
    getDashboardData() {
        const uptime = (Date.now() - this.metrics.startTime) / 1000;
        
        return {
            liveMetrics: this.metrics,
            systemStatus: {
                status: 'healthy',
                uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
                version: 'v6.0',
                timestamp: new Date().toISOString()
            }
        };
    }
    
    getHealthStatus() {
        return {
            status: 'operational',
            version: 'v6.0',
            uptime: process.uptime(),
            metrics: {
                totalQueries: this.metrics.totalQueries,
                avgResponseTime: this.metrics.avgResponseTime.toFixed(3) + 's',
                successRate: this.metrics.totalQueries > 0 ? 
                    ((this.metrics.successfulQueries / this.metrics.totalQueries) * 100).toFixed(2) + '%' : '0%'
            }
        };
    }
}

// ============================================
// 🔧  FUNCIONES AUXILIARES COMPLETAS
// ============================================

async function routerAreas(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // Router mejorado con más palabras clave y sinónimos
    if (consultaLower.includes("construcción") || consultaLower.includes("construir") || consultaLower.includes("barda") || consultaLower.includes("muro") || consultaLower.includes("casa") || consultaLower.includes("edificio") || consultaLower.includes("obra") || consultaLower.includes("permiso construcción")) {
        return "CONSTRUCCIÓN";
    }
    if (consultaLower.includes("medio ambiente") || consultaLower.includes("contaminación") || consultaLower.includes("residuos") || consultaLower.includes("basura") || consultaLower.includes("ecología") || consultaLower.includes("desechos") || consultaLower.includes("reciclaje")) {
        return "AMBIENTAL";
    }
    if (consultaLower.includes("comercio") || consultaLower.includes("licencia") || consultaLower.includes("negocio") || consultaLower.includes("giro") || consultaLower.includes("establecimiento") || consultaLower.includes("local") || consultaLower.includes("tienda") || consultaLower.includes("permiso comercio")) {
        return "COMERCIO";
    }
    if (consultaLower.includes("anuncio") || consultaLower.includes("publicidad") || consultaLower.includes("cartel") || consultaLower.includes("letrero") || consultaLower.includes("valla") || consultaLower.includes("spectacular")) {
        return "ANUNCIOS";
    }
    if (consultaLower.includes("tianguis") || consultaLower.includes("mercado") || consultaLower.includes("ambulante") || consultaLower.includes("puesto") || consultaLower.includes("vendedor")) {
        return "TIANGUIS";
    }
    
    // Si no coincide con áreas específicas, pero tiene palabras de consulta general
    if (consultaLower.includes("permiso") || consultaLower.includes("requisito") || consultaLower.includes("trámite") || consultaLower.includes("procedimiento") || consultaLower.includes("norma") || consultaLower.includes("reglamento") || consultaLower.includes("ley")) {
        return "GENERAL";
    }
    
    return "GENERAL";
}

async function aplicarFiltroRelevancia(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // Lista expandida de palabras relevantes (50+ términos)
    const palabrasRelevantes = [
        // Construcción
        "permiso", "construcción", "construir", "barda", "muro", "casa", "edificio", "obra",
        "remodelación", "ampliación", "demolición", "altura", "metros", "terreno", "lote",
        
        // Comercio
        "licencia", "comercio", "negocio", "giro", "establecimiento", "local", "tienda",
        "restaurante", "oficina", "servicio", "actividad", "comercial",
        
        // Ambiental
        "residuos", "basura", "contaminación", "medio ambiente", "ecología", "desechos",
        "reciclaje", "contaminar", "tiradero", "vertedero",
        
        // General
        "trámite", "procedimiento", "requisito", "documento", "formato", "oficio",
        "solicitud", "autorización", "aprobación", "verificación",
        
        // Inspección y vigilancia
        "inspección", "vigilancia", "sanción", "multa", "infracción", "violación",
        "incumplimiento", "verificación", "supervisión", "control",
        
        // Urbanización
        "urbanización", "uso de suelo", "zona", "sector", "colonia", "fraccionamiento",
        
        // Varios
        "anuncio", "publicidad", "cartel", "tianguis", "mercado", "ambulante",
        "ruido", "molestia", "vecino", "animal", "mascota"
    ];
    
    // Verificar si la consulta contiene al menos UNA palabra relevante
    const tieneRelevancia = palabrasRelevantes.some(palabra => consultaLower.includes(palabra));
    
    // RELAJAR: No requerir "Zapopan" explícitamente (asumir contexto municipal)
    // const enZapopan = consultaLower.includes("zapopan") || consultaLower.includes("municipio") || consultaLower.includes("ayuntamiento");
    const enZapopan = true; // Asumir que todas las consultas son para Zapopan
    
    if (!tieneRelevancia) {
        return {
            relevante: false,
            motivo: 'La consulta no corresponde a una materia regulada por la normativa disponible en el sistema.'
        };
    }
    
    // if (!enZapopan) {
    //     return {
    //         relevante: false,
    //         motivo: 'El sistema está especializado en el municipio de Zapopan, Jalisco.'
    //     };
    // }
    
    return {
        relevante: true,
        motivo: 'Consulta relevante para análisis normativo.'
    };
}

function generarRespuestaNoRelevante(motivo) {
    return `**ANÁLISIS DE SITUACIÓN**\n\nEl sistema ha aplicado el filtro de relevancia normativa.\n\n**CLASIFICACIÓN DE ATRIBUCIONES**\n\nNo aplica.\n\n**SUSTENTO LEGAL**\n\nNo aplica.\n\n**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\nNo aplica.\n\n**FUENTES**\n\nNo se consultaron fuentes.\n\n---\n**Motivo:** ${motivo}`;
}

function generarRespuestaSinFundamento() {
    return `**ANÁLISIS DE SITUACIÓN**\n\nNo se encontró fundamento en los documentos normativos disponibles en el sistema para analizar esta situación.\n\n**CLASIFICACIÓN DE ATRIBUCIONES**\n\nNo se puede determinar la competencia sin fundamento normativo.\n\n**SUSTENTO LEGAL**\n\nNo se identificaron normas aplicables.\n\n**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\nSin fundamento normativo, no se pueden identificar dependencias competentes.\n\n**FUENTES**\n\nNo se utilizaron fuentes.`;
}

async function generarRespuestaConstitucional(consulta, chunks, area) {
    // Paso 1: ANÁLISIS DE SITUACIÓN
    const documentos = [...new Set(chunks.map(c => c.document_title))];
    const analisis = `La consulta "${consulta}" corresponde al área de ${area}. ` +
        (documentos.length > 0 ? `Se identificaron ${documentos.length} documentos normativos relevantes.` : '');
    
    // Paso 2: CLASIFICACIÓN DE ATRIBUCIONES
    const tieneInspeccion = chunks.some(c => c.texto_normativo.toLowerCase().includes("inspección"));
    const atribuciones = tieneInspeccion ?
        `Esta situación corresponde a **facultad exclusiva de la Dirección de Inspección y Vigilancia de Zapopan**.` :
        `**Facultad de otra dependencia de gobierno.**`;
    
    // Paso 3: SUSTENTO LEGAL
    let sustento = "**Fundamento normativo:**\n\n";
    chunks.slice(0, 3).forEach((chunk, i) => {
        sustento += `${i+1}. ${chunk.citation_short}: ${chunk.texto_normativo}\n`;
    });
    
    // Paso 4: DEPENDENCIAS
    const dependencias = `**Dirección de Inspección y Vigilancia Zapopan:**\n` +
        `• Teléfono: 3338182200\n` +
        `• Extensiones: 3312, 3313, 3315\n` +
        `• Horario: Lunes a Viernes 08:00 - 15:00`;
    
    // Paso 5: FUENTES
    const fuentes = chunks.map(c => c.citation_short).join('\n');
    
    return `**1. ANÁLISIS DE SITUACIÓN**\n\n${analisis}\n\n` +
           `**2. CLASIFICACIÓN DE ATRIBUCIONES**\n\n${atribuciones}\n\n` +
           `**3. SUSTENTO LEGAL**\n\n${sustento}\n\n` +
           `**4. DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n${dependencias}\n\n` +
           `**5. FUENTES**\n\n${fuentes}`;
}

function clasificarConsulta(consulta) {
    const consultaLower = consulta.toLowerCase();
    if (consultaLower.includes("construcción")) return "CONSULTA_CONSTRUCCION";
    if (consultaLower.includes("medio ambiente")) return "CONSULTA_AMBIENTAL";
    if (consultaLower.includes("comercio")) return "CONSULTA_COMERCIO";
    return "CONSULTA_GENERAL";
}

function calcularCalificacion(numChunks, respuesta, area, chunks) {
    if (numChunks === 0) return "INSUFICIENTE";
    if (numChunks >= 3 && area !== "GENERAL") return "EXCELENTE";
    if (numChunks >= 2) return "BUENO";
    return "REGULAR";
}

function calcularPorcentajeCompletitud(chunks, area) {
    if (chunks.length === 0) return 0;
    let completitud = 0;
    if (chunks.length >= 3) completitud += 40;
    if (chunks.some(c => c.texto_normativo.toLowerCase().includes("inspección"))) completitud += 30;
    if (area !== "GENERAL") completitud += 30;
    return Math.min(completitud, 100);
}

// ============================================
// 🚀  SISTEMA PRINCIPAL
// ============================================

// Inicializar sistemas
const ragSystem = new HybridRAGSystem();
const metricsSystem = new HybridMetricsSystem();

// Inicializar
ragSystem.initialize();

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Endpoint: Salud
    if (req.method === 'GET' && req.url === '/api/health') {
        const health = metricsSystem.getHealthStatus();
        res.status(200).json({
            success: true,
            ...health,
            system: 'Chatbot Zapopan v6.0 - Excelencia Operativa'
        });
        return;
    }
    
    // Endpoint: Métricas
    if (req.method === 'GET' && req.url === '/api/metrics') {
        const dashboard = metricsSystem.getDashboardData();
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            system: 'Chatbot Zapopan v6.0',
            data: dashboard
        });
        return;
    }
    
    // Endpoint principal: /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        const startTime = Date.now();
        
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const consulta = data.message || '';
                    
                    // 1. Router de áreas
                    const areaIdentificada = await routerAreas(consulta);
                    
                    // 2. Filtro de relevancia
                    const relevancia = await aplicarFiltroRelevancia(consulta);
                    
                    if (!relevancia.relevante) {
                        const respuesta = generarRespuestaNoRelevante(relevancia.motivo);
                        const auditoria = {
                            timestamp: new Date().toISOString(),
                            area_identificada: "NO_APLICA",
                            tiempo_respuesta_segundos: (Date.now() - startTime) / 1000,
                            calificacion_calidad: "FILTRO_APLICADO"
                        };
                        
                        const responseData = {
                            success: true,
                            response: respuesta,
                            query: consulta,
                            system: "Chatbot Zapopan v6.0",
                            audit: auditoria
                        };
                        
                        metricsSystem.logQuery(auditoria, responseData);
                        res.status(200).json(responseData);
                        return;
                    }
                    
                    // 3. Búsqueda RAG
                    const chunksRecuperados = await ragSystem.semanticSearch(consulta, areaIdentificada, 5);
                    
                    if (chunksRecuperados.length === 0) {
                        const respuesta = generarRespuestaSinFundamento();
                        const auditoria = {
                            timestamp: new Date().toISOString(),
                            area_identificada: areaIdentificada,
                            tiempo_respuesta_segundos: (Date.now() - startTime) / 1000,
                            calificacion_calidad: "INSUFICIENTE"
                        };
                        
                        const responseData = {
                            success: true,
                            response: respuesta,
                            query: consulta,
                            system: "Chatbot Zapopan v6.0",
                            audit: auditoria
                        };
                        
                        metricsSystem.logQuery(auditoria, responseData);
                        res.status(200).json(responseData);
                        return;
                    }
                    
                    // 4. Generar respuesta
                    const respuesta = await generarRespuestaConstitucional(consulta, chunksRecuperados, areaIdentificada);
                    
                    // 5. Auditoría
                    const auditoria = {
                        timestamp: new Date().toISOString(),
                        area_identificada: areaIdentificada,
                        tipo_consulta: clasificarConsulta(consulta),
                        tiempo_respuesta_segundos: (Date.now() - startTime) / 1000,
                        calificacion_calidad: calcularCalificacion(chunksRecuperados.length, respuesta, areaIdentificada, chunksRecuperados),
                        porcentaje_completitud: calcularPorcentajeCompletitud(chunksRecuperados, areaIdentificada)
                    };
                    
                    const responseData = {
                        success: true,
                        response: respuesta,
                        query: consulta,
                        area_identified: areaIdentificada,
                        documents_found: chunksRecuperados.length,
                        system: "Chatbot Zapopan v6.0 - Excelencia Operativa",
                        audit: auditoria
                    };
                    
                    metricsSystem.logQuery(auditoria, responseData);
                    res.status(200).json(responseData);
                    
                } catch (parseError) {
                    res.status(400).json({
                        success: false,
                        error: 'Error parseando JSON'
                    });
                }
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                system: 'Chatbot Zapopan v6.0'
            });
        }
        return;
    }
    
    // Ruta no encontrada
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
};