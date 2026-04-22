// CHATBOT ZAPOPAN v6.2 - ARQUITECTURA EXACTA
// Sistema de Consulta Normativa Zapopan con arquitectura respetada al 100%
// Implementación estricta según lineamientos del 22 abril 2026

const fs = require('fs');
const path = require('path');

// ============================================
// 🏗️  SISTEMA RAG - ARQUITECTURA EXACTA
// ============================================

class SistemaRAGExacto {
    constructor() {
        this.initialized = false;
        this.dataset = this.cargarDatasetEstructurado();
    }
    
    cargarDatasetEstructurado() {
        // DATASET RAG ESTRUCTURADO según arquitectura
        // Unidades jurídicas con metadatos normativos completos
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
            "ANUNCIOS": [
                {
                    texto_normativo: "La instalación de anuncios, carteles o letreros en la vía pública o fachadas de inmuebles requiere autorización municipal previa, la cual se otorga previo pago de derechos y cumplimiento de especificaciones técnicas.",
                    document_title: "Reglamento de Anuncios y Publicidad Exterior",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "8",
                    fraccion: "II",
                    citation_short: "Reglamento Anuncios, Art. 8, Fracc. II",
                    citation_full: "Reglamento de Anuncios y Publicidad Exterior del Municipio de Zapopan, Artículo 8, Fracción II",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_anuncios|v2023|art_8|frac_II|c001",
                    tags: ["anuncio", "publicidad", "cartel", "autorización", "previo"],
                    relevance_score: 0.88
                }
            ],
            "TIANGUIS": [
                {
                    texto_normativo: "Los tianguis y mercados sobre ruedas requieren permiso municipal para su instalación, el cual se otorga previa verificación del lugar, días y horarios autorizados.",
                    document_title: "Reglamento para Tianguis y Mercados sobre Ruedas",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "12",
                    fraccion: "I",
                    citation_short: "Reglamento Tianguis, Art. 12, Fracc. I",
                    citation_full: "Reglamento para Tianguis y Mercados sobre Ruedas del Municipio de Zapopan, Artículo 12, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_tianguis|v2023|art_12|frac_I|c001",
                    tags: ["tianguis", "mercado", "permiso", "autorización"],
                    relevance_score: 0.85
                }
            ],
            "RUIDO": [
                {
                    texto_normativo: "Se prohíbe generar ruidos o vibraciones que excedan los límites máximos permisibles establecidos en la normativa municipal, especialmente durante el horario nocturno (22:00 a 07:00 horas).",
                    document_title: "Reglamento de Protección al Ambiente contra la Contaminación por Ruido",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "15",
                    fraccion: "I",
                    citation_short: "Reglamento Ruido, Art. 15, Fracc. I",
                    citation_full: "Reglamento de Protección al Ambiente contra la Contaminación por Ruido del Municipio de Zapopan, Artículo 15, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_ruido|v2023|art_15|frac_I|c001",
                    tags: ["ruido", "molestia", "vibración", "horario nocturno", "prohibido"],
                    relevance_score: 0.88
                }
            ],
            "ANIMALES": [
                {
                    texto_normativo: "Los propietarios de animales domésticos deben mantenerlos bajo control y evitar que causen molestias a los vecinos, daños a la propiedad o riesgos a la seguridad pública.",
                    document_title: "Reglamento para la Tenencia Responsable de Animales Domésticos",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "8",
                    fraccion: "II",
                    citation_short: "Reglamento Animales, Art. 8, Fracc. II",
                    citation_full: "Reglamento para la Tenencia Responsable de Animales Domésticos del Municipio de Zapopan, Artículo 8, Fracción II",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_animales|v2023|art_8|frac_II|c001",
                    tags: ["animal", "mascota", "control", "molestia", "vecino"],
                    relevance_score: 0.83
                }
            ],
            "USO_SUELO": [
                {
                    texto_normativo: "Todo cambio de uso de suelo requiere autorización municipal previa, la cual se otorga previo estudio de compatibilidad urbanística y cumplimiento de los requisitos establecidos en el Plan de Desarrollo Urbano.",
                    document_title: "Reglamento de Desarrollo Urbano y Construcción",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "56",
                    fraccion: "I",
                    citation_short: "Reglamento Desarrollo Urbano, Art. 56, Fracc. I",
                    citation_full: "Reglamento de Desarrollo Urbano y Construcción del Municipio de Zapopan, Artículo 56, Fracción I",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_desarrollo_urbano|v2023|art_56|frac_I|c001",
                    tags: ["uso de suelo", "urbanización", "autorización", "plan desarrollo", "compatibilidad"],
                    relevance_score: 0.86
                }
            ],
            "VIA_PUBLICA": [
                {
                    texto_normativo: "Se prohíbe la ocupación de la vía pública sin autorización municipal para cualquier actividad, incluyendo la instalación de mobiliario, anuncios, puestos o cualquier obstáculo que impida el libre tránsito.",
                    document_title: "Reglamento de Vía Pública y Espacios Abiertos",
                    document_type: "Reglamento Municipal",
                    jurisdiction_level: "Municipal",
                    article: "12",
                    fraccion: "III",
                    citation_short: "Reglamento Vía Pública, Art. 12, Fracc. III",
                    citation_full: "Reglamento de Vía Pública y Espacios Abiertos del Municipio de Zapopan, Artículo 12, Fracción III",
                    id_juridico: "mx|jal|jal|mun|zapopan|reglamento_via_publica|v2023|art_12|frac_III|c001",
                    tags: ["vía pública", "espacio público", "ocupación", "autorización", "prohibido"],
                    relevance_score: 0.84
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
                }
            ]
        };
    }
    
    async busquedaSemantica(consulta, area = null, limite = 5) {
        console.log(`🔍 Búsqueda semántica: "${consulta.substring(0, 50)}..." en área: ${area || 'GENERAL'}`);
        
        const datasetArea = this.dataset[area] || this.dataset["GENERAL"];
        const todosChunks = Object.values(this.dataset).flat();
        const consultaLower = consulta.toLowerCase();
        const chunksPuntuados = [];
        
        for (const chunk of todosChunks) {
            let puntuacion = chunk.relevance_score || 0.5;
            
            // Bonus por área coincidente
            if (area && chunk.tags) {
                const coincideArea = chunk.tags.some(tag => 
                    area.toLowerCase().includes(tag.toLowerCase()) || 
                    tag.toLowerCase().includes(area.toLowerCase())
                );
                if (coincideArea) puntuacion += 0.2;
            }
            
            // Bonus por palabras clave en texto normativo
            const palabrasClave = this.extraerPalabrasClave(consultaLower);
            const coincidencias = palabrasClave.filter(palabra =>
                chunk.texto_normativo.toLowerCase().includes(palabra) ||
                (chunk.tags && chunk.tags.some(tag => tag.toLowerCase().includes(palabra)))
            );
            
            puntuacion += coincidencias.length * 0.1;
            chunksPuntuados.push({ ...chunk, puntuacion_busqueda: puntuacion });
        }
        
        // Ordenar por puntuación y limitar
        const mejoresChunks = chunksPuntuados
            .sort((a, b) => b.puntuacion_busqueda - a.puntuacion_busqueda)
            .slice(0, limite);
        
        console.log(`✅ ${mejoresChunks.length} chunks recuperados (mejor puntuación: ${mejoresChunks[0]?.puntuacion_busqueda?.toFixed(3)})`);
        return mejoresChunks;
    }
    
    extraerPalabrasClave(consulta) {
        const palabrasClave = [
            // Construcción
            "permiso", "construcción", "construir", "barda", "muro", "edificio", "obra",
            "ampliación", "demolición", "altura", "metros",
            
            // Comercio
            "licencia", "comercio", "negocio", "giro", "establecimiento", "actividad económica",
            
            // Ambiental
            "residuos", "basura", "contaminación", "medio ambiente", "desechos",
            
            // Varios
            "anuncio", "publicidad", "cartel", "tianguis", "mercado", "ambulante",
            "ruido", "molestia", "animal", "mascota", "uso de suelo", "vía pública"
        ];
        
        return palabrasClave.filter(palabra => consulta.includes(palabra));
    }
    
    async inicializar() {
        this.initialized = true;
        console.log('✅ Sistema RAG exacto inicializado');
        return true;
    }
}

// ============================================
// 📊  SISTEMA DE AUDITORÍA
// ============================================

class SistemaAuditoria {
    constructor() {
        this.metricas = {
            totalConsultas: 0,
            consultasExitosas: 0,
            consultasFallidas: 0,
            tiempoPromedioRespuesta: 0,
            consultasPorArea: {},
            distribucionCalidad: {},
            horaInicio: Date.now()
        };
    }
    
    registrarConsulta(datosAuditoria, datosRespuesta) {
        this.metricas.totalConsultas++;
        
        if (datosRespuesta.success) {
            this.metricas.consultasExitosas++;
        } else {
            this.metricas.consultasFallidas++;
        }
        
        const area = datosAuditoria.area_identificada || 'GENERAL';
        this.metricas.consultasPorArea[area] = (this.metricas.consultasPorArea[area] || 0) + 1;
        
        const calidad = datosAuditoria.calificacion_calidad || 'DESCONOCIDA';
        this.metricas.distribucionCalidad[calidad] = (this.metricas.distribucionCalidad[calidad] || 0) + 1;
        
        const tiempoRespuesta = datosAuditoria.tiempo_respuesta_segundos || 0;
        const totalActual = this.metricas.tiempoPromedioRespuesta * (this.metricas.totalConsultas - 1);
        this.metricas.tiempoPromedioRespuesta = (totalActual + tiempoRespuesta) / this.metricas.totalConsultas;
    }
    
    obtenerDatosDashboard() {
        const tiempoActivo = (Date.now() - this.metricas.horaInicio) / 1000;
        
        return {
            metricasEnVivo: this.metricas,
            estadoSistema: {
                estado: 'saludable',
                tiempo_activo: `${Math.floor(tiempoActivo / 60)}m ${Math.floor(tiempoActivo % 60)}s`,
                version: 'v6.2-exacta',
                timestamp: new Date().toISOString()
            }
        };
    }
    
    obtenerEstadoSalud() {
        return {
            estado: 'operacional',
            version: 'v6.2-exacta',
            tiempo_activo: process.uptime(),
            metricas: {
                totalConsultas: this.metricas.totalConsultas,
                tiempoPromedioRespuesta: this.metricas.tiempoPromedioRespuesta.toFixed(3) + 's',
                tasaExito: this.metricas.totalConsultas > 0 ? 
                    ((this.metricas.consultasExitosas / this.metricas.totalConsultas) * 100).toFixed(2) + '%' : '0%'
            }
        };
    }
}

// ============================================
// 🔧  FUNCIONES AUXILIARES - ARQUITECTURA EXACTA
// ============================================

async function routerAreasExacto(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // ROUTER DE ÁREAS según arquitectura SISTEMA DE CONSULTA NORMATIVA ZAPOPAN
    if (consultaLower.includes("construcción") || consultaLower.includes("construir") || 
        consultaLower.includes("barda") || consultaLower.includes("muro") || 
        consultaLower.includes("edificio") || consultaLower.includes("obra")) {
        return "CONSTRUCCIÓN";
    }
    if (consultaLower.includes("medio ambiente") || consultaLower.includes("contaminación") || 
        consultaLower.includes("residuos") || consultaLower.includes("basura")) {
        return "AMBIENTAL";
    }
    if (consultaLower.includes("comercio") || consultaLower.includes("licencia") || 
        consultaLower.includes("negocio") || consultaLower.includes("giro")) {
        return "COMERCIO";
    }
    if (consultaLower.includes("anuncio") || consultaLower.includes("publicidad") || 
        consultaLower.includes("cartel") || consultaLower.includes("letrero")) {
        return "ANUNCIOS";
    }
    if (consultaLower.includes("tianguis") || consultaLower.includes("mercado") || 
        consultaLower.includes("ambulante") || consultaLower.includes("puesto")) {
        return "TIANGUIS";
    }
    if (consultaLower.includes("ruido") || consultaLower.includes("molestia") || 
        consultaLower.includes("sonido")) {
        return "RUIDO";
    }
    if (consultaLower.includes("animal") || consultaLower.includes("mascota") || 
        consultaLower.includes("perro") || consultaLower.includes("gato")) {
        return "ANIMALES";
    }
    if (consultaLower.includes("uso de suelo") || consultaLower.includes("urbanización")) {
        return "USO_SUELO";
    }
    if (consultaLower.includes("vía pública") || consultaLower.includes("espacio público")) {
        return "VIA_PUBLICA";
    }
    
    return "GENERAL";
}

async function aplicarFiltroRelevanciaExacto(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // ============================================
    // FILTRO DE RELEVANCIA NORMATIVA (ANTES DEL RAG)
    // Según arquitectura exacta del 22 abril 2026
    // ============================================
    
    // 1. VERIFICAR SI ES EN ZAPOPAN (REQUERIDO)
    const enZapopan = consultaLower.includes("zapopan") || 
                     consultaLower.includes("municipio") || 
                     consultaLower.includes("ayuntamiento");
    
    if (!enZapopan) {
        return {
            relevante: false,
            motivo: 'El sistema está especializado en el municipio de Zapopan, Jalisco.'
        };
    }
    
    // 2. IDENTIFICAR SI DESCRIBE POSIBLE FALTA ADMINISTRATIVA O ACTIVIDAD REGULADA
    const categoriasReguladas = [
        // Posibles faltas administrativas
        "permiso", "licencia", "autorización", "aprobación",
        "construcción", "obra", "edificación", "barda", "muro",
        "comercio", "negocio", "giro", "establecimiento",
        "medio ambiente", "contaminación", "residuos", "basura",
        "ruido", "molestia", "sonido",
        "animal", "mascota",
        "anuncio", "publicidad", "cartel",
        "tianguis", "mercado", "ambulante",
        "uso de suelo", "urbanización",
        "vía pública", "espacio público",
        
        // Faltas administrativas específicas
        "infracción", "violación", "incumplimiento", "sanción", "multa",
        "clausura", "suspensión", "denuncia", "queja"
    ];
    
    const esMateriaRegulada = categoriasReguladas.some(categoria => 
        consultaLower.includes(categoria)
    );
    
    if (!esMateriaRegulada) {
        return {
            relevante: false,
            motivo: 'La consulta no corresponde a una materia regulada por la normativa disponible en el sistema.'
        };
    }
    
    // 3. PALABRAS CLAVE NORMATIVAS ESPECÍFICAS
    const palabrasClaveNormativas = [
        "comercio", "construcción", "uso de suelo", "anuncios", "residuos",
        "ruido", "medio ambiente", "animales", "tianguis", "licencias",
        "vía pública", "urbanización", "actividades económicas"
    ];
    
    const tienePalabrasClave = palabrasClaveNormativas.some(palabra => 
        consultaLower.includes(palabra)
    );
    
    if (!tienePalabrasClave) {
        return {
            relevante: false,
            motivo: 'La consulta no contiene palabras clave normativas relacionadas con las materias reguladas.'
        };
    }
    
    // 4. SOLAMENTE SI PASA TODOS LOS FILTROS
    return {
        relevante: true,
        motivo: 'Consulta relevante para análisis normativo dentro del ámbito de competencia de la Dirección de Inspección y Vigilancia de Zapopan.'
    };
}

function generarRespuestaNoRelevante(motivo) {
    return `**ANÁLISIS DE SITUACIÓN**\n\nEl sistema ha aplicado el filtro de relevancia normativa.\n\n**CLASIFICACIÓN DE ATRIBUCIONES**\n\nNo aplica.\n\n**SUSTENTO LEGAL**\n\nNo aplica.\n\n**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\nNo aplica.\n\n**FUENTES**\n\nNo se consultaron fuentes.\n\n---\n**Motivo:** ${motivo}`;
}

function generarRespuestaSinFundamento() {
    return `**ANÁLISIS DE SITUACIÓN**\n\nNo se encontró fundamento en los documentos normativos disponibles en el sistema para analizar esta situación.\n\n**CLASIFICACIÓN DE ATRIBUCIONES**\n\nNo se puede determinar la competencia sin fundamento normativo.\n\n**SUSTENTO LEGAL**\n\nNo se identificaron normas aplicables.\n\n**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\nSin fundamento normativo, no se pueden identificar dependencias competentes.\n\n**FUENTES**\n\nNo se utilizaron fuentes.`;
}

async function generarRespuestaConstitucionalExacta(consulta, chunks, area) {
    // ============================================
    // PROTOCOLO DE 5 PASOS - ARQUITECTURA EXACTA
    // ============================================
    
    // 1. ANÁLISIS DE SITUACIÓN
    const documentos = [...new Set(chunks.map(c => c.document_title))];
    const analisis = `La consulta "${consulta}" corresponde al área de ${area}. ` +
        (documentos.length > 0 ? `Se identificaron ${documentos.length} documentos normativos relevantes.` : '');
    
    // 2. CLASIFICACIÓN DE ATRIBUCIONES
    const tieneInspeccion = chunks.some(c => c.texto_normativo.toLowerCase().includes("inspección"));
    const atribuciones = tieneInspeccion ?
        `Esta situación corresponde a **facultad exclusiva de la Dirección de Inspección y Vigilancia de Zapopan**.` :
        `**Facultad de otra dependencia de gobierno.**`;
    
    // 3. SUSTENTO LEGAL (Convención de citas A)
    let sustento = "**Fundamento normativo:**\n\n";
    chunks.slice(0, 3).forEach((chunk, i) => {
        sustento += `${i+1}. ${chunk.citation_short}: ${chunk.texto_normativo}\n`;
    });
    
    // 4. DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO
    const dependencias = `**Dirección de Inspección y Vigilancia Zapopan:**\n` +
        `• Teléfono: 3338182200\n` +
        `• Extensiones: 3312, 3313, 3315\n` +
        `• Horario: Lunes a Viernes 08:00 - 15:00`;
    
    // 5. FUENTES (Convención de citas A)
    const fuentes = chunks.map(c => c.citation_short).join('\n');
    
    return `**1. ANÁLISIS DE SITUACIÓN**\n\n${analisis}\n\n` +
           `**2. CLASIFICACIÓN DE ATRIBUCIONES**\n\n${atribuciones}\n\n` +
           `**3. SUSTENTO LEGAL**\n\n${sustento}\n\n` +
           `**4. DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n${dependencias}\n\n` +
           `**5. FUENTES**\n\n${fuentes}`;
}

function clasificarConsultaExacta(consulta) {
    const consultaLower = consulta.toLowerCase();
    if (consultaLower.includes("construcción")) return "CONSULTA_CONSTRUCCION";
    if (consultaLower.includes("medio ambiente")) return "CONSULTA_AMBIENTAL";
    if (consultaLower.includes("comercio")) return "CONSULTA_COMERCIO";
    if (consultaLower.includes("anuncio")) return "CONSULTA_ANUNCIOS";
    if (consultaLower.includes("tianguis")) return "CONSULTA_TIANGUIS";
    if (consultaLower.includes("ruido")) return "CONSULTA_RUIDO";
    if (consultaLower.includes("animal")) return "CONSULTA_ANIMALES";
    if (consultaLower.includes("uso de suelo")) return "CONSULTA_USO_SUELO";
    if (consultaLower.includes("vía pública")) return "CONSULTA_VIA_PUBLICA";
    return "CONSULTA_GENERAL";
}

function calcularCalificacionExacta(numChunks, respuesta, area, chunks) {
    if (numChunks === 0) return "INSUFICIENTE";
    if (numChunks >= 3 && area !== "GENERAL") return "EXCELENTE";
    if (numChunks >= 2) return "BUENO";
    return "REGULAR";
}

function calcularPorcentajeCompletitudExacta(chunks, area) {
    if (chunks.length === 0) return 0;
    let completitud = 0;
    if (chunks.length >= 3) completitud += 40;
    if (chunks.some(c => c.texto_normativo.toLowerCase().includes("inspección"))) completitud += 30;
    if (area !== "GENERAL") completitud += 30;
    return Math.min(completitud, 100);
}

// ============================================
// 🚀  SISTEMA PRINCIPAL - ARQUITECTURA EXACTA
// ============================================

// Inicializar sistemas
const sistemaRAG = new SistemaRAGExacto();
const sistemaAuditoria = new SistemaAuditoria();

// Inicializar
sistemaRAG.inicializar();

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
    
    // Endpoint: Salud del sistema
    if (req.method === 'GET' && req.url === '/api/health') {
        const salud = sistemaAuditoria.obtenerEstadoSalud();
        res.status(200).json({
            success: true,
            ...salud,
            system: 'Chatbot Zapopan v6.2 - Arquitectura Exacta',
            arquitectura: 'SISTEMA DE CONSULTA NORMATIVA ZAPOPAN'
        });
        return;
    }
    
    // Endpoint: Métricas del sistema
    if (req.method === 'GET' && req.url === '/api/metrics') {
        const dashboard = sistemaAuditoria.obtenerDatosDashboard();
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            system: 'Chatbot Zapopan v6.2 - Arquitectura Exacta',
            data: dashboard
        });
        return;
    }
    
    // Endpoint principal: /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        const horaInicio = Date.now();
        
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const consulta = data.message || '';
                    
                    // ============================================
                    // ARQUITECTURA DE 4 APARTADOS EXACTA
                    // ============================================
                    
                    // 1. ROUTER DE ÁREAS
                    const areaIdentificada = await routerAreasExacto(consulta);
                    
                    // 2. FILTRO DE RELEVANCIA NORMATIVA (ANTES DEL RAG)
                    const relevancia = await aplicarFiltroRelevanciaExacto(consulta);
                    
                    if (!relevancia.relevante) {
                        const respuesta = generarRespuestaNoRelevante(relevancia.motivo);
                        
                        const auditoria = {
                            timestamp: new Date().toISOString(),
                            consulta_original: consulta.substring(0, 200),
                            area_identificada: "NO_APLICA",
                            tipo_consulta: "FILTRADA",
                            tiempo_respuesta_segundos: (Date.now() - horaInicio) / 1000,
                            calificacion_calidad: "FILTRO_APLICADO"
                        };
                        
                        const responseData = {
                            success: true,
                            response: respuesta,
                            query: consulta,
                            area_identified: "NO_APLICA",
                            documents_found: 0,
                            filtered: true,
                            system: "Chatbot Zapopan v6.2 - Arquitectura Exacta",
                            audit: auditoria
                        };
                        
                        sistemaAuditoria.registrarConsulta(auditoria, responseData);
                        res.status(200).json(responseData);
                        return;
                    }
                    
                    // 3. SISTEMA RAG (Núcleo de Documentos)
                    const chunksRecuperados = await sistemaRAG.busquedaSemantica(consulta, areaIdentificada, 5);
                    
                    if (chunksRecuperados.length === 0) {
                        const respuesta = generarRespuestaSinFundamento();
                        
                        const auditoria = {
                            timestamp: new Date().toISOString(),
                            consulta_original: consulta.substring(0, 200),
                            area_identificada: areaIdentificada,
                            tipo_consulta: "SIN_CHUNKS",
                            tiempo_respuesta_segundos: (Date.now() - horaInicio) / 1000,
                            calificacion_calidad: "INSUFICIENTE"
                        };
                        
                        const responseData = {
                            success: true,
                            response: respuesta,
                            query: consulta,
                            area_identified: areaIdentificada,
                            documents_found: 0,
                            filtered: false,
                            system: "Chatbot Zapopan v6.2 - Arquitectura Exacta",
                            audit: auditoria
                        };
                        
                        sistemaAuditoria.registrarConsulta(auditoria, responseData);
                        res.status(200).json(responseData);
                        return;
                    }
                    
                    // 4. PROTOCOLOS ESPECIALIZADOS (Generar respuesta constitucional)
                    const respuesta = await generarRespuestaConstitucionalExacta(
                        consulta,
                        chunksRecuperados,
                        areaIdentificada
                    );
                    
                    // ============================================
                    // SISTEMA DE AUDITORÍA
                    // ============================================
                    
                    const auditoria = {
                        timestamp: new Date().toISOString(),
                        consulta_original: consulta.substring(0, 200),
                        area_identificada: areaIdentificada,
                        tipo_consulta: clasificarConsultaExacta(consulta),
                        documentos_consultados: [...new Set(chunksRecuperados.map(c => c.document_title))],
                        ids_juridicos_utilizados: chunksRecuperados.map(c => c.id_juridico),
                        tiempo_respuesta_segundos: (Date.now() - horaInicio) / 1000,
                        calificacion_calidad: calcularCalificacionExacta(chunksRecuperados.length, respuesta, areaIdentificada, chunksRecuperados),
                        porcentaje_completitud: calcularPorcentajeCompletitudExacta(chunksRecuperados, areaIdentificada)
                    };
                    
                    const responseData = {
                        success: true,
                        response: respuesta,
                        query: consulta,
                        area_identified: areaIdentificada,
                        documents_found: chunksRecuperados.length,
                        filtered: false,
                        system: "Chatbot Zapopan v6.2 - Arquitectura Exacta",
                        audit: auditoria
                    };
                    
                    // Registrar en sistema de auditoría
                    sistemaAuditoria.registrarConsulta(auditoria, responseData);
                    
                    // ============================================
                    // RESPUESTA FINAL
                    // ============================================
                    
                    res.status(200).json(responseData);
                    
                } catch (parseError) {
                    console.error('Error parseando JSON:', parseError);
                    res.status(400).json({
                        success: false,
                        error: 'Error parseando JSON',
                        message: parseError.message
                    });
                }
            });
            
        } catch (error) {
            console.error('Error en /api/chat:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                system: 'Chatbot Zapopan v6.2 - Arquitectura Exacta',
                message: error.message
            });
        }
        return;
    }
    
    // Ruta no encontrada
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        requested_url: req.url,
        available_endpoints: ['/api/chat', '/api/health', '/api/metrics']
    });
};
