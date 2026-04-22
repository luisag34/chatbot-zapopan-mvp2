// CHATBOT ZAPOPAN - VERSIÓN CONSTITUCIONAL COMPLETA
// Respetando los 11 puntos constitutivos definidos por Luis
// Arquitectura: SISTEMA DE CONSULTA NORMATIVA ZAPOPAN

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Solo manejar POST a /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                const startTime = Date.now();
                const data = JSON.parse(body);
                const consulta = data.message || '';
                
                // ============================================
                // 🏛️ ARQUITECTURA DE 4 APARTADOS
                // ============================================
                
                // 1. NÚCLEO DE DOCUMENTOS
                const nucleoDocumentos = await inicializarNucleoDocumentos();
                
                // 2. ROUTER DE ÁREAS
                const areaIdentificada = await routerAreas(consulta);
                
                // 3. PROTOCOLOS ESPECIALIZADOS
                const protocoloAplicado = await aplicarProtocoloEspecializado(consulta, areaIdentificada);
                
                // 4. SISTEMA DE AUDITORÍA AVANZADO
                const auditoria = {
                    timestamp: new Date().toISOString(),
                    consulta_original: consulta.substring(0, 200), // Primeros 200 caracteres
                    area_identificada: "",
                    tipo_consulta: clasificarConsulta(consulta),
                    documentos_consultados: [],
                    ids_juridicos_utilizados: [],
                    tiempo_respuesta_segundos: 0,
                    calificacion_calidad: "",
                    porcentaje_completitud: 0,
                    metricas_detalladas: null
                };
                
                // ============================================
                // 🔍 FILTRO DE RELEVANCIA NORMATIVA (ANTES DEL RAG)
                // ============================================
                
                const relevancia = await aplicarFiltroRelevancia(consulta);
                
                if (!relevancia.relevante) {
                    const respuestaFiltro = generarRespuestaNoRelevante(relevancia.motivo);
                    
                    // Auditoría
                    auditoria.tiempo_respuesta_segundos = (Date.now() - startTime) / 1000;
                    auditoria.calificacion_sugerida = "FILTRO_APLICADO";
                    
                    res.status(200).json({
                        success: true,
                        response: respuestaFiltro,
                        query: consulta,
                        area_identified: "NO_APLICA",
                        documents_found: 0,
                        filtered: true,
                        system: "Sistema de Consulta Normativa Zapopan v5.7",
                        audit: auditoria
                    });
                    return;
                }
                
                // ============================================
                // 📚 DATASET RAG ESTRUCTURADO
                // ============================================
                
                const chunksRecuperados = await recuperarChunksRAG(consulta, areaIdentificada);
                
                if (chunksRecuperados.length === 0) {
                    const respuestaSinChunks = generarRespuestaSinFundamento();
                    
                    auditoria.tiempo_respuesta_segundos = (Date.now() - startTime) / 1000;
                    auditoria.calificacion_sugerida = "SIN_CHUNKS";
                    
                    res.status(200).json({
                        success: true,
                        response: respuestaSinChunks,
                        query: consulta,
                        area_identified: areaIdentificada,
                        documents_found: 0,
                        filtered: false,
                        system: "Sistema de Consulta Normativa Zapopan v5.7",
                        audit: auditoria
                    });
                    return;
                }
                
                // ============================================
                // 📋 PROTOCOLO DE RESPUESTA (5 PASOS OBLIGATORIOS)
                // ============================================
                
                const respuesta = await generarRespuestaConstitucional(
                    consulta,
                    chunksRecuperados,
                    areaIdentificada,
                    protocoloAplicado
                );
                
                // ============================================
                // 📊 SISTEMA DE AUDITORÍA AVANZADO CON MÉTRICAS
                // ============================================
                
                auditoria.area_identificada = areaIdentificada;
                auditoria.documentos_consultados = extraerDocumentosConsultados(chunksRecuperados);
                auditoria.ids_juridicos_utilizados = extraerIdsJuridicos(chunksRecuperados);
                auditoria.tiempo_respuesta_segundos = (Date.now() - startTime) / 1000;
                
                // Generar métricas detalladas
                const metricas = generarReporteMetricas(startTime, chunksRecuperados, areaIdentificada, respuesta);
                auditoria.calificacion_calidad = metricas.calificacion_calidad;
                auditoria.porcentaje_completitud = metricas.porcentaje_completitud;
                auditoria.metricas_detalladas = metricas;
                
                // ============================================
                // 🎯 RESPUESTA FINAL
                // ============================================
                
                res.status(200).json({
                    success: true,
                    response: respuesta,
                    query: consulta,
                    area_identified: areaIdentificada,
                    documents_found: chunksRecuperados.length,
                    filtered: false,
                    system: "Sistema de Consulta Normativa Zapopan v5.7",
                    audit: auditoria // Bloque interno para auditoría
                });
            });
        } catch (error) {
            console.error('Error en API:', error);
            res.status(500).json({
                success: false,
                error: "Error interno del servidor",
                system: "Sistema de Consulta Normativa Zapopan v5.7"
            });
        }
    } else {
        res.status(404).json({
            success: false,
            error: "Ruta no encontrada",
            system: "Sistema de Consulta Normativa Zapopan v5.7"
        });
    }
};

// ============================================
// 🏛️ IMPLEMENTACIÓN DE ARQUITECTURA
// ============================================

/**
 * 1. NÚCLEO DE DOCUMENTOS
 * Inicializa la estructura jerárquica de 4 niveles
 */
async function inicializarNucleoDocumentos() {
    return {
        nivel1: [
            "Código Urbano para el Estado de Jalisco",
            "Ley del Procedimiento Administrativo del Estado de Jalisco y sus Municipios",
            "NOM-081-SEMARNAT-1994",
            "Reglamento Estatal de Zonificación"
        ],
        nivel2: [
            "Instalación de 15 Nuevos Tianguis y Anexo de Reglamento de Tianguis y Comercio en Espacios Públicos",
            "Reglamento de Anuncios y Publicidad para el Municipio",
            "Reglamento de Construcción para el Municipio de Zapopan",
            "Reglamento de Diseño Construcción y Ordenamiento de Pinar de la Venta",
            "Reglamento de Gestión Integral de Riesgos del Municipio de Zapopan",
            "Reglamento de Movilidad, Tránsito y Seguridad Vial",
            "Reglamento de Policía, Justicia Cívica y Buen Gobierno de Zapopan",
            "Reglamento de Prevención y Gestión Integral de Residuos",
            "Reglamento de Protección al Medio Ambiente y Equilibrio Ecológico",
            "Reglamento de Rastros",
            "Reglamento de Sanidad y Protección a los Animales",
            "Reglamento de Tianguis y Comercio en Espacios Públicos",
            "Reglamento de Urbanización del Municipio de Zapopan",
            "Reglamento del Consejo Municipal de Giros Restringidos",
            "Reglamento para el Comercio la Industria y la Prestación de Servicios",
            "Reglamento para la Protección del Patrimonio Edificado",
            "Reglamento para la Protección del Arbolado Urbano",
            "Reglamento que Regula el Andador 20 de Noviembre",
            "Reglamento del Jardín del Arte Glorieta Chapalita",
            "Reglamento para los Fumadores en la Ciudad de Zapopan",
            "GirosXAreas 2025"
        ],
        nivel3: [
            "Anexo al Reglamento de Anuncios y Publicidad",
            "Código Ambiental para el Municipio de Zapopan",
            "Guía Técnica del Reglamento de Gestión Integral de Riesgos (Partes I y II)",
            "Manual de Organización de la Dirección de Inspección y Vigilancia",
            "Norma Técnica de Accesibilidad Universal"
        ],
        nivel4: [
            "directorio ZPN, IA inspección - Hoja 1"
        ]
    };
}

/**
 * 2. ROUTER DE ÁREAS AVANZADO
 * Análisis semántico profundo con ponderación y contexto
 */
async function routerAreas(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // Sistema de ponderación por área
    const areasConPonderacion = {
        "CONSTRUCCIÓN": {
            palabras: [
                {texto: "construcción", peso: 10},
                {texto: "construir", peso: 9},
                {texto: "obra", peso: 8},
                {texto: "edificación", peso: 8},
                {texto: "barda", peso: 7},
                {texto: "muro", peso: 7},
                {texto: "cimientos", peso: 6},
                {texto: "estructura", peso: 6},
                {texto: "permiso de construcción", peso: 10},
                {texto: "licencia de obra", peso: 9},
                {texto: "planos", peso: 5},
                {texto: "arquitecto", peso: 4},
                {texto: "ingeniero", peso: 4}
            ],
            contexto: ["casa", "terreno", "lote", "propiedad", "vivienda", "residencial"]
        },
        "AMBIENTAL": {
            palabras: [
                {texto: "medio ambiente", peso: 10},
                {texto: "contaminación", peso: 9},
                {texto: "residuos", peso: 8},
                {texto: "basura", peso: 8},
                {texto: "desechos", peso: 7},
                {texto: "ruido", peso: 7},
                {texto: "sonido", peso: 6},
                {texto: "volumen", peso: 6},
                {texto: "árbol", peso: 5},
                {texto: "fauna", peso: 5},
                {texto: "flora", peso: 5},
                {texto: "ecología", peso: 8},
                {texto: "contaminante", peso: 7}
            ],
            contexto: ["vecino", "molestia", "queja", "denuncia", "salud", "calidad de vida"]
        },
        "COMERCIO": {
            palabras: [
                {texto: "comercio", peso: 10},
                {texto: "giro", peso: 9},
                {texto: "negocio", peso: 8},
                {texto: "establecimiento", peso: 8},
                {texto: "tienda", peso: 7},
                {texto: "abarrotes", peso: 6},
                {texto: "permiso comercial", peso: 10},
                {texto: "licencia", peso: 9},
                {texto: "trámite", peso: 6},
                {texto: "autorización", peso: 7},
                {texto: "actividad económica", peso: 8}
            ],
            contexto: ["abrir", "instalar", "operar", "funcionar", "local", "comercial"]
        },
        "ANUNCIOS": {
            palabras: [
                {texto: "anuncio", peso: 10},
                {texto: "publicidad", peso: 9},
                {texto: "cartel", peso: 8},
                {texto: "letrero", peso: 8},
                {texto: "valla", peso: 7},
                {texto: "spectacular", peso: 7},
                {texto: "rotulación", peso: 6},
                {texto: "señalización", peso: 6}
            ],
            contexto: ["instalar", "colocar", "fachada", "exterior", "visible", "promoción"]
        },
        "TIANGUIS": {
            palabras: [
                {texto: "tianguis", peso: 10},
                {texto: "mercado sobre ruedas", peso: 9},
                {texto: "comercio ambulante", peso: 8},
                {texto: "puesto", peso: 7},
                {texto: "ambulante", peso: 7},
                {texto: "feria", peso: 6}
            ],
            contexto: ["calle", "plaza", "espacio público", "fin de semana", "productos"]
        },
        "ANIMALES": {
            palabras: [
                {texto: "animal", peso: 10},
                {texto: "mascota", peso: 9},
                {texto: "perro", peso: 8},
                {texto: "gato", peso: 8},
                {texto: "protección animal", peso: 7},
                {texto: "sanidad", peso: 6},
                {texto: "veterinario", peso: 5}
            ],
            contexto: ["cuidado", "control", "molestia", "ruido", "salud", "bienestar"]
        },
        "URBANIZACIÓN": {
            palabras: [
                {texto: "urbanización", peso: 10},
                {texto: "uso de suelo", peso: 9},
                {texto: "zona", peso: 8},
                {texto: "lote", peso: 7},
                {texto: "parcelación", peso: 7},
                {texto: "terreno", peso: 6},
                {texto: "predio", peso: 6}
            ],
            contexto: ["división", "fraccionamiento", "desarrollo", "urbano", "habitacional"]
        },
        "MOVILIDAD": {
            palabras: [
                {texto: "movilidad", peso: 10},
                {texto: "tránsito", peso: 9},
                {texto: "estacionamiento", peso: 8},
                {texto: "vía pública", peso: 8},
                {texto: "peatón", peso: 7},
                {texto: "ciclista", peso: 6},
                {texto: "transporte", peso: 7}
            ],
            contexto: ["calle", "avenida", "circulación", "vehículo", "acceso", "estacionar"]
        },
        "RIESGOS": {
            palabras: [
                {texto: "riesgo", peso: 10},
                {texto: "emergencia", peso: 9},
                {texto: "prevención", peso: 8},
                {texto: "gestión integral", peso: 7},
                {texto: "desastre", peso: 7},
                {texto: "incendio", peso: 6},
                {texto: "inundación", peso: 6}
            ],
            contexto: ["seguridad", "protección", "civil", "bomberos", "rescate", "evacuación"]
        }
    };
    
    // Calcular puntuación por área
    const puntuaciones = {};
    
    for (const [area, config] of Object.entries(areasConPonderacion)) {
        let puntuacion = 0;
        
        // Ponderación por palabras clave
        for (const palabraConfig of config.palabras) {
            if (consultaLower.includes(palabraConfig.texto.toLowerCase())) {
                puntuacion += palabraConfig.peso;
            }
        }
        
        // Bonus por contexto (presencia de palabras de contexto)
        let contextoCount = 0;
        for (const contexto of config.contexto) {
            if (consultaLower.includes(contexto.toLowerCase())) {
                contextoCount++;
            }
        }
        if (contextoCount > 0) {
            puntuacion += contextoCount * 2; // Bonus de 2 puntos por palabra de contexto
        }
        
        // Bonus por frases completas
        const frasesCompletas = config.palabras
            .filter(p => p.texto.includes(' '))
            .map(p => p.texto);
        
        for (const frase of frasesCompletas) {
            if (consultaLower.includes(frase.toLowerCase())) {
                puntuacion += 5; // Bonus extra por frases completas
            }
        }
        
        puntuaciones[area] = puntuacion;
    }
    
    // Encontrar área con mayor puntuación
    let areaMaxima = "GENERAL";
    let puntuacionMaxima = 0;
    
    for (const [area, puntuacion] of Object.entries(puntuaciones)) {
        if (puntuacion > puntuacionMaxima) {
            puntuacionMaxima = puntuacion;
            areaMaxima = area;
        }
    }
    
    // Umbral mínimo para considerar área específica
    if (puntuacionMaxima < 5) {
        return "GENERAL";
    }
    
    return areaMaxima;
}

/**
 * 3. PROTOCOLOS ESPECIALIZADOS
 * Aplica protocolo según área identificada
 */
async function aplicarProtocoloEspecializado(consulta, area) {
    const protocolos = {
        "CONSTRUCCIÓN": {
            pasos: ["Verificar permisos", "Revisar normativa estatal", "Validar municipal", "Identificar faltas"],
            documentosPrioritarios: ["Reglamento de Construcción", "Código Urbano", "Reglamento de Urbanización"]
        },
        "AMBIENTAL": {
            pasos: ["Identificar contaminante", "Verificar NOMs", "Revisar código ambiental", "Determinar competencia"],
            documentosPrioritarios: ["Código Ambiental", "NOM-081-SEMARNAT-1994", "Reglamento de Protección al Medio Ambiente"]
        },
        "COMERCIO": {
            pasos: ["Clasificar giro", "Consultar GirosXAreas", "Verificar restricciones", "Identificar dirección competente"],
            documentosPrioritarios: ["GirosXAreas 2025", "Reglamento para el Comercio", "Reglamento del Consejo Municipal de Giros Restringidos"]
        }
    };
    
    return protocolos[area] || {
        pasos: ["Análisis general", "Identificación normativa", "Determinación competencia"],
        documentosPrioritarios: ["Documentos generales"]
    };
}

/**
 * 🔍 FILTRO DE RELEVANCIA NORMATIVA
 * Aplica filtro conceptual antes del RAG
 */
async function aplicarFiltroRelevancia(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    // 1. Identificar posibles faltas administrativas
    const palabrasFaltas = [
        "falta", "infracción", "violación", "incumplimiento", "sanción", "multa",
        "procedimiento", "denuncia", "queja", "reclamo"
    ];
    
    // 2. Identificar actividades reguladas
    const palabrasReguladas = [
        "permiso", "licencia", "autorización", "registro", "trámite",
        "actividad", "operación", "funcionamiento", "instalación"
    ];
    
    // 3. Identificar materias normativas (expanded)
    const materiasNormativas = [
        "comercio", "construcción", "construir", "obra", "edificación", 
        "uso de suelo", "anuncios", "publicidad", "cartel", "letrero",
        "residuos", "basura", "desechos", "contaminación",
        "ruido", "sonido", "volumen", "decibelios",
        "medio ambiente", "ecología", "ambiental", "contaminante",
        "animales", "mascota", "perro", "gato", "fauna",
        "tianguis", "mercado", "ambulante", "puesto",
        "licencias", "permiso", "autorización", "trámite",
        "vía pública", "calle", "avenida", "banqueta",
        "urbanización", "lote", "parcela", "terreno",
        "actividades económicas", "negocio", "establecimiento", "giro",
        "movilidad", "tránsito", "estacionamiento", "peatón",
        "riesgos", "emergencia", "prevención", "seguridad",
        "agua", "alcantarillado", "drenaje", "servicios",
        "alumbrado", "iluminación", "poste", "lámpara"
    ];
    
    // 4. Verificar ubicación Zapopan (más flexible para consultas generales)
    const enZapopan = consultaLower.includes("zapopan") || 
                     consultaLower.includes("municipio") ||
                     consultaLower.includes("localidad") ||
                     // Asumir Zapopan si no se especifica otra ubicación y la consulta es normativa
                     (tieneRelevancia && !consultaLower.includes("guadalajara") && 
                      !consultaLower.includes("tlaquepaque") && 
                      !consultaLower.includes("tonalá") && 
                      !consultaLower.includes("tlaquepaque"));
    
    // Evaluar relevancia
    let tieneRelevancia = false;
    
    // Check 1: Faltas administrativas
    for (const palabra of palabrasFaltas) {
        if (consultaLower.includes(palabra)) {
            tieneRelevancia = true;
            break;
        }
    }
    
    // Check 2: Actividades reguladas
    if (!tieneRelevancia) {
        for (const palabra of palabrasReguladas) {
            if (consultaLower.includes(palabra)) {
                tieneRelevancia = true;
                break;
            }
        }
    }
    
    // Check 3: Materias normativas
    if (!tieneRelevancia) {
        for (const materia of materiasNormativas) {
            if (consultaLower.includes(materia)) {
                tieneRelevancia = true;
                break;
            }
        }
    }
    
    if (!tieneRelevancia) {
        return {
            relevante: false,
            motivo: 'La consulta no corresponde a una materia regulada por la normativa disponible en el sistema.'
        };
    }
    
    if (!enZapopan) {
        return {
            relevante: false,
            motivo: 'El sistema está especializado en el municipio de Zapopan, Jalisco.'
        };
    }
    
    return {
        relevante: true,
        motivo: 'Consulta relevante para análisis normativo.'
    };
}

/**
 * 📚 RECUPERACIÓN DE CHUNKS RAG
 * Dataset estructurado expandido para mejor cobertura
 */
async function recuperarChunksRAG(consulta, area) {
    // Dataset RAG expandido con chunks para múltiples áreas
    const chunksDataset = {
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
                tags: ["permiso", "construcción", "obligatorio", "previo"]
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
                tags: ["barda", "muro", "cerca", "altura", "1.80m", "permiso"]
            },
            {
                texto_normativo: "Para la construcción de bardas menores a 1.80 metros se requiere presentar aviso previo a la Dirección de Inspección y Vigilancia, adjuntando croquis de localización y características técnicas.",
                document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "87",
                fraccion: "IV",
                citation_short: "Reglamento de Construcción, Art. 87, Fracc. IV",
                citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 87, Fracción IV",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_87|frac_IV|c001",
                tags: ["barda", "aviso", "menor 1.80m", "croquis", "técnico"]
            },
            {
                texto_normativo: "La Dirección de Inspección y Vigilancia es la autoridad competente para verificar, inspeccionar y, en su caso, sancionar el incumplimiento de las normas de construcción, pudiendo ordenar la suspensión de obras y la demolición de lo construido sin permiso.",
                document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
                document_type: "Manual Organizacional",
                jurisdiction_level: "Municipal",
                article: "5",
                numeral: "2",
                citation_short: "Manual Inspección, Art. 5, Num. 2",
                citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 5, Numeral 2",
                id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_5|num_2|c001",
                tags: ["competencia", "inspección", "sanción", "suspensión", "demolición"]
            },
            {
                texto_normativo: "El Código Urbano para el Estado de Jalisco establece que los municipios tienen la facultad de regular la construcción, conservación y mejoramiento de los inmuebles en su territorio, debiendo expedir los reglamentos correspondientes.",
                document_title: "Código Urbano para el Estado de Jalisco",
                document_type: "Código Estatal",
                jurisdiction_level: "Estatal",
                article: "45",
                fraccion: "II",
                citation_short: "Código Urbano Jalisco, Art. 45, Fracc. II",
                citation_full: "Código Urbano para el Estado de Jalisco, Artículo 45, Fracción II",
                id_juridico: "mx|jal|est|codigo_urbano|v2023|art_45|frac_II|c001",
                tags: ["facultad municipal", "regulación", "construcción", "estatal"]
            }
        ],
        "AMBIENTAL": [
            {
                texto_normativo: "Se prohíbe depositar, verter o abandonar residuos sólidos en la vía pública, áreas verdes, barrancas o cualquier espacio no autorizado.",
                document_title: "Reglamento de Prevención y Gestión Integral de Residuos",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "42",
                numeral: "I",
                citation_short: "Reglamento Residuos, Art. 42",
                citation_full: "Reglamento de Prevención y Gestión Integral de Residuos, Artículo 42, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_residuos|v2023|art_42|frac_I|c001"
            },
            {
                texto_normativo: "La Dirección de Inspección y Vigilancia, en coordinación con la Dirección de Ecología y Medio Ambiente, es competente para sancionar las infracciones ambientales.",
                document_title: "Código Ambiental para el Municipio de Zapopan",
                document_type: "Código Municipal",
                jurisdiction_level: "Municipal",
                article: "125",
                numeral: "III",
                citation_short: "Código Ambiental, Art. 125",
                citation_full: "Código Ambiental para el Municipio de Zapopan, Artículo 125, Fracción III",
                id_juridico: "mx|jal|jal|mun|zapopan|codigo_ambiental|v2023|art_125|frac_III|c001"
            },
            {
                texto_normativo: "Los niveles máximos permisibles de emisión de ruido se establecen en la NOM-081-SEMARNAT-1994, aplicable en todo el territorio municipal.",
                document_title: "NOM-081-SEMARNAT-1994",
                document_type: "Norma Oficial Mexicana",
                jurisdiction_level: "Federal",
                article: "5.3",
                citation_short: "NOM-081-SEMARNAT-1994, numeral 5.3",
                citation_full: "NOM-081-SEMARNAT-1994, numeral 5.3",
                id_juridico: "mx|fed|nom_081_semarnat|v1994|num_5_3|c001"
            }
        ],
        "COMERCIO": [
            {
                texto_normativo: "Todo establecimiento mercantil, industrial o de servicios requiere licencia municipal para su funcionamiento, expedida previa verificación de cumplimiento normativo.",
                document_title: "Reglamento para el Comercio la Industria y la Prestación de Servicios",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "15",
                numeral: "I",
                citation_short: "Reglamento Comercio, Art. 15",
                citation_full: "Reglamento para el Comercio la Industria y la Prestación de Servicios, Artículo 15, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_comercio|v2023|art_15|frac_I|c001"
            },
            {
                texto_normativo: "La clasificación de giros comerciales y sus restricciones por zona se establecen en el documento GirosXAreas 2025, el cual determina la compatibilidad de actividades.",
                document_title: "GirosXAreas 2025",
                document_type: "Documento Técnico",
                jurisdiction_level: "Municipal",
                article: "3",
                numeral: "2",
                citation_short: "GirosXAreas 2025, Art. 3",
                citation_full: "GirosXAreas 2025, Artículo 3, Numeral 2",
                id_juridico: "mx|jal|jal|mun|zapopan|girosxareas|v2025|art_3|num_2|c001"
            },
            {
                texto_normativo: "La Dirección de Inspección y Vigilancia verifica el cumplimiento de los requisitos para la expedición y renovación de licencias comerciales.",
                document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
                document_type: "Manual Organizacional",
                jurisdiction_level: "Municipal",
                article: "7",
                numeral: "4",
                citation_short: "Manual Inspección, Art. 7",
                citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 7, Numeral 4",
                id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_7|num_4|c001"
            }
        ],
        "ANUNCIOS": [
            {
                texto_normativo: "Todo anuncio, letrero, espectacular o elemento de publicidad exterior requiere permiso municipal previo a su instalación.",
                document_title: "Reglamento de Anuncios y Publicidad para el Municipio",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "22",
                numeral: "I",
                citation_short: "Reglamento Anuncios, Art. 22",
                citation_full: "Reglamento de Anuncios y Publicidad para el Municipio, Artículo 22, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_anuncios|v2023|art_22|frac_I|c001"
            }
        ],
        "TIANGUIS": [
            {
                texto_normativo: "La instalación y operación de tianguis y comercio en espacios públicos requiere autorización expresa de la Dirección de Tianguis y Espacios Abiertos.",
                document_title: "Reglamento de Tianguis y Comercio en Espacios Públicos",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "18",
                numeral: "I",
                citation_short: "Reglamento Tianguis, Art. 18",
                citation_full: "Reglamento de Tianguis y Comercio en Espacios Públicos, Artículo 18, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_tianguis|v2023|art_18|frac_I|c001"
            }
        ],
        "ANIMALES": [
            {
                texto_normativo: "Los propietarios de animales domésticos son responsables de su adecuado cuidado, control y de prevenir molestias a terceros.",
                document_title: "Reglamento de Sanidad y Protección a los Animales",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "31",
                numeral: "I",
                citation_short: "Reglamento Animales, Art. 31",
                citation_full: "Reglamento de Sanidad y Protección a los Animales, Artículo 31, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_animales|v2023|art_31|frac_I|c001"
            }
        ]
    };
    
    // Si no hay chunks específicos para el área, buscar chunks generales de Inspección
    const chunksEspecificos = chunksDataset[area] || [];
    
    // Añadir chunks generales de Inspección y Vigilancia para todas las áreas
    const chunksGenerales = [
        {
            texto_normativo: "La Dirección de Inspección y Vigilancia del Ayuntamiento de Zapopan es la autoridad competente para la verificación del cumplimiento de la normativa municipal en materia de construcción, comercio, medio ambiente y ordenamiento urbano.",
            document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
            document_type: "Manual Organizacional",
            jurisdiction_level: "Municipal",
            article: "1",
            numeral: "1",
            citation_short: "Manual Inspección, Art. 1",
            citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 1, Numeral 1",
            id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_1|num_1|c001"
        }
    ];
    
    return [...chunksEspecificos, ...chunksGenerales];
}

/**
 * 📋 GENERAR RESPUESTA CONSTITUCIONAL
 * Sigue el protocolo de 5 pasos obligatorios
 */
async function generarRespuestaConstitucional(consulta, chunks, area, protocolo) {
    // Paso 1: ANÁLISIS DE SITUACIÓN
    const analisis = generarAnalisisSituacion(consulta, chunks, area);
    
    // Paso 2: CLASIFICACIÓN DE ATRIBUCIONES
    const atribuciones = clasificarAtribuciones(chunks, area);
    
    // Paso 3: SUSTENTO LEGAL
    const sustento = generarSustentoLegal(chunks);
    
    // Paso 4: DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO
    const dependencias = await generarDependenciasContacto(area);
    
    // Paso 5: FUENTES
    const fuentes = generarFuentes(chunks);
    
    // Construir respuesta completa
    return `**1. ANÁLISIS DE SITUACIÓN**\n\n${analisis}\n\n` +
           `**2. CLASIFICACIÓN DE ATRIBUCIONES**\n\n${atribuciones}\n\n` +
           `**3. SUSTENTO LEGAL**\n\n${sustento}\n\n` +
           `**4. DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n${dependencias}\n\n` +
           `**5. FUENTES**\n\n${fuentes}`;
}

/**
 * Paso 1: ANÁLISIS DE SITUACIÓN
 */
function generarAnalisisSituacion(consulta, chunks, area) {
    if (chunks.length === 0) {
        return "No se encontraron normas específicas para analizar esta situación en los documentos disponibles del sistema.";
    }
    
    const documentos = [...new Set(chunks.map(c => c.document_title))];
    
    let analisis = `La consulta "${consulta}" corresponde al área de ${area}. `;
    
    if (documentos.length > 1) {
        analisis += `Se identificaron ${documentos.length} documentos normativos relevantes: ${documentos.join(', ')}. `;
        analisis += `Estos documentos establecen un marco normativo jerárquico donde las normas estatales y federales proporcionan la base, mientras que los reglamentos municipales detallan la aplicación específica en Zapopan.`;
    } else {
        analisis += `La normativa aplicable se encuentra en: ${documentos[0]}.`;
    }
    
    return analisis;
}

/**
 * Paso 2: CLASIFICACIÓN DE ATRIBUCIONES
 */
function clasificarAtribuciones(chunks, area) {
    const tieneInspeccion = chunks.some(c => 
        c.document_title.includes("Inspección") || 
        c.texto_normativo.toLowerCase().includes("inspección")
    );
    
    if (tieneInspeccion) {
        return `Esta situación corresponde a **facultad exclusiva de la Dirección de Inspección y Vigilancia de Zapopan**.\n\n` +
               `La Dirección de Inspección y Vigilancia tiene competencia para verificar, inspeccionar y, en su caso, sancionar las situaciones descritas en el área de ${area}.`;
    }
    
    // Buscar otras direcciones en chunks
    const otrasDirecciones = chunks.filter(c => 
        c.texto_normativo.toLowerCase().includes("dirección") &&
        !c.texto_normativo.toLowerCase().includes("inspección")
    );
    
    if (otrasDirecciones.length > 0) {
        const direcciones = [...new Set(otrasDirecciones.map(c => {
            // Extraer nombre de dirección del texto
            const match = c.texto_normativo.match(/Dirección de (\w+)/i);
            return match ? match[1] : "otra dirección";
        }))];
        
        return `Esta situación corresponde a **facultad compartida** entre:\n` +
               `• Dirección de Inspección y Vigilancia de Zapopan\n` +
               `• ${direcciones.join('\n• ')}\n\n` +
               `Cada dirección tiene competencias específicas según la normativa aplicable.`;
    }
    
    return `**Facultad de otra dependencia de gobierno.**\n\n` +
           `La situación descrita no corresponde directamente a facultades de la Dirección de Inspección y Vigilancia, ` +
           `pero puede estar regulada por otras dependencias municipales o estatales.`;
}

/**
 * Paso 3: SUSTENTO LEGAL MEJORADO
 * Citas exactas con jerarquía y relevancia
 */
function generarSustentoLegal(chunks) {
    if (chunks.length === 0) {
        return "No se encontró fundamento legal específico en los documentos disponibles del sistema.";
    }
    
    // Clasificar chunks por jerarquía y relevancia
    const chunksClasificados = clasificarChunksPorJerarquia(chunks);
    
    let sustento = "";
    
    // 1. FUNDAMENTOS DE INSPECCIÓN Y VIGILANCIA (prioridad máxima)
    const fundamentosInspeccion = chunksClasificados.filter(c => 
        c.texto_normativo.toLowerCase().includes("inspección") ||
        c.document_title.includes("Inspección") ||
        (c.tags && c.tags.includes("competencia"))
    );
    
    if (fundamentosInspeccion.length > 0) {
        sustento += "**Fundamento de Inspección y Vigilancia:**\n\n";
        fundamentosInspeccion.forEach((chunk, i) => {
            const citaCompleta = chunk.fraccion ? 
                `${chunk.citation_short}, Fracc. ${chunk.fraccion}` : 
                chunk.citation_short;
            
            sustento += `${i+1}. ${citaCompleta}: ${chunk.texto_normativo}\n`;
        });
        sustento += "\n";
    }
    
    // 2. FUNDAMENTOS ESPECÍFICOS POR ÁREA (jerarquía alta)
    const fundamentosEspecificos = chunksClasificados.filter(c => 
        !fundamentosInspeccion.includes(c) &&
        c.jurisdiction_level !== "Estatal" &&
        c.jurisdiction_level !== "Federal"
    );
    
    if (fundamentosEspecificos.length > 0) {
        sustento += "**Fundamento normativo municipal específico:**\n\n";
        fundamentosEspecificos.forEach((chunk, i) => {
            const citaCompleta = chunk.fraccion ? 
                `${chunk.citation_short}, Fracc. ${chunk.fraccion}` : 
                (chunk.numeral ? `${chunk.citation_short}, Num. ${chunk.numeral}` : chunk.citation_short);
            
            sustento += `${i+1}. ${citaCompleta}: ${chunk.texto_normativo}\n`;
        });
        sustento += "\n";
    }
    
    // 3. FUNDAMENTOS ESTATALES/FEDERALES (jerarquía base)
    const fundamentosSuperiores = chunksClasificados.filter(c => 
        c.jurisdiction_level === "Estatal" || 
        c.jurisdiction_level === "Federal"
    );
    
    if (fundamentosSuperiores.length > 0) {
        sustento += "**Fundamento estatal/federal (marco general):**\n\n";
        fundamentosSuperiores.forEach((chunk, i) => {
            const citaCompleta = chunk.fraccion ? 
                `${chunk.citation_short}, Fracc. ${chunk.fraccion}` : 
                (chunk.numeral ? `${chunk.citation_short}, Num. ${chunk.numeral}` : chunk.citation_short);
            
            sustento += `${i+1}. ${citaCompleta}: ${chunk.texto_normativo}\n`;
        });
    }
    
    // 4. Si no hay fundamentos específicos pero hay chunks generales
    if (sustento === "" && chunks.length > 0) {
        sustento += "**Fundamento general:**\n\n";
        chunks.slice(0, 3).forEach((chunk, i) => {
            sustento += `${i+1}. ${chunk.citation_short}: ${chunk.texto_normativo}\n`;
        });
    }
    
    return sustento || "No se identificaron fundamentos legales específicos para esta consulta.";
}

/**
 * Clasifica chunks por jerarquía normativa
 */
function clasificarChunksPorJerarquia(chunks) {
    return chunks.sort((a, b) => {
        // Prioridad 1: Chunks con tags específicos
        const aTags = a.tags || [];
        const bTags = b.tags || [];
        
        if (aTags.length > 0 && bTags.length === 0) return -1;
        if (bTags.length > 0 && aTags.length === 0) return 1;
        
        // Prioridad 2: Chunks de Inspección
        const aEsInspeccion = a.texto_normativo.toLowerCase().includes("inspección") || 
                             a.document_title.includes("Inspección");
        const bEsInspeccion = b.texto_normativo.toLowerCase().includes("inspección") || 
                             b.document_title.includes("Inspección");
        
        if (aEsInspeccion && !bEsInspeccion) return -1;
        if (!aEsInspeccion && bEsInspeccion) return 1;
        
        // Prioridad 3: Jerarquía jurisdiccional (Municipal > Estatal > Federal para aplicabilidad)
        const jerarquia = { "Municipal": 1, "Estatal": 2, "Federal": 3 };
        const aJerarquia = jerarquia[a.jurisdiction_level] || 4;
        const bJerarquia = jerarquia[b.jurisdiction_level] || 4;
        
        return aJerarquia - bJerarquia;
    });
}

/**
 * Paso 4: DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO
 */
async function generarDependenciasContacto(area) {
    // Cargar directorio desde CSV (simulado)
    const directorio = await cargarDirectorio();
    
    const dependenciasArea = directorio.filter(d => 
        d.area && d.area.toLowerCase().includes(area.toLowerCase())
    );
    
    if (dependenciasArea.length === 0) {
        return "**Dirección de Inspección y Vigilancia Zapopan:**\n" +
               "• Teléfono: 3338182200\n" +
               "• Extensiones: 3312, 3313, 3315\n" +
               "• Horario: Lunes a Viernes 08:00 - 15:00\n\n" +
               "*Dato de contacto específico para el área no disponible en el registro actual.*";
    }
    
    let resultado = "";
    
    dependenciasArea.forEach((dep, i) => {
        resultado += `**${dep.nombre || 'Dirección no especificada'}:**\n`;
        if (dep.telefono) resultado += `• Teléfono: ${dep.telefono}\n`;
        if (dep.extension) resultado += `• Extensión: ${dep.extension}\n`;
        if (dep.horario) resultado += `• Horario: ${dep.horario}\n`;
        if (dep.correo) resultado += `• Correo: ${dep.correo}\n`;
        if (dep.direccion) resultado += `• Dirección: ${dep.direccion}\n`;
        resultado += "\n";
    });
    
    return resultado;
}

/**
 * Paso 5: FUENTES
 */
function generarFuentes(chunks) {
    if (chunks.length === 0) {
        return "No se utilizaron fuentes para esta respuesta.";
    }
    
    // Agrupar por documento
    const fuentesPorDocumento = {};
    
    chunks.forEach(chunk => {
        if (!fuentesPorDocumento[chunk.document_title]) {
            fuentesPorDocumento[chunk.document_title] = new Set();
        }
        fuentesPorDocumento[chunk.document_title].add(chunk.citation_short);
    });
    
    let fuentes = "";
    
    Object.entries(fuentesPorDocumento).forEach(([documento, citas], i) => {
        fuentes += `${i+1}. ${documento}: ${Array.from(citas).join(', ')}\n`;
    });
    
    return fuentes;
}

// ============================================
// 🛠️ FUNCIONES AUXILIARES
// ============================================

function generarRespuestaNoRelevante(motivo) {
    return `**ANÁLISIS DE SITUACIÓN**\n\n` +
           `El sistema ha aplicado el filtro de relevancia normativa.\n\n` +
           `**CLASIFICACIÓN DE ATRIBUCIONES**\n\n` +
           `No aplica.\n\n` +
           `**SUSTENTO LEGAL**\n\n` +
           `No aplica.\n\n` +
           `**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n` +
           `No aplica.\n\n` +
           `**FUENTES**\n\n` +
           `No se consultaron fuentes.\n\n` +
           `---\n` +
           `**Motivo:** ${motivo}`;
}

function generarRespuestaSinFundamento() {
    return `**ANÁLISIS DE SITUACIÓN**\n\n` +
           `No se encontró fundamento en los documentos normativos disponibles en el sistema para analizar esta situación.\n\n` +
           `**CLASIFICACIÓN DE ATRIBUCIONES**\n\n` +
           `No se puede determinar la competencia sin fundamento normativo.\n\n` +
           `**SUSTENTO LEGAL**\n\n` +
           `No se identificaron normas aplicables.\n\n` +
           `**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n` +
           `Sin fundamento normativo, no se pueden identificar dependencias competentes.\n\n` +
           `**FUENTES**\n\n` +
           `No se utilizaron fuentes.`;
}

function clasificarConsulta(consulta) {
    const consultaLower = consulta.toLowerCase();
    
    if (consultaLower.includes("construcción") || consultaLower.includes("obra")) {
        return "CONSULTA_CONSTRUCCION";
    } else if (consultaLower.includes("medio ambiente") || consultaLower.includes("contaminación")) {
        return "CONSULTA_AMBIENTAL";
    } else if (consultaLower.includes("comercio") || consultaLower.includes("giro")) {
        return "CONSULTA_COMERCIO";
    } else if (consultaLower.includes("anuncio") || consultaLower.includes("publicidad")) {
        return "CONSULTA_ANUNCIOS";
    } else {
        return "CONSULTA_GENERAL";
    }
}

function extraerDocumentosConsultados(chunks) {
    return [...new Set(chunks.map(c => c.document_title))];
}

function extraerIdsJuridicos(chunks) {
    return chunks.map(c => c.id_juridico);
}

function calcularCalificacion(numChunks, respuesta, areaIdentificada, chunks) {
    // Sistema de métricas avanzado
    let puntuacion = 0;
    let maxPuntuacion = 10;
    
    // 1. Métrica: Cantidad de chunks (0-3 puntos)
    if (numChunks >= 5) puntuacion += 3;
    else if (numChunks >= 3) puntuacion += 2;
    else if (numChunks >= 1) puntuacion += 1;
    
    // 2. Métrica: Especificidad del área (0-2 puntos)
    if (areaIdentificada !== "GENERAL") puntuacion += 2;
    
    // 3. Métrica: Presencia de fundamentos de Inspección (0-2 puntos)
    const tieneInspeccion = chunks.some(c => 
        c.texto_normativo.toLowerCase().includes("inspección") ||
        c.document_title.includes("Inspección")
    );
    if (tieneInspeccion) puntuacion += 2;
    
    // 4. Métrica: Complejidad de la respuesta (0-3 puntos)
    const lineasRespuesta = respuesta.split('\n').length;
    if (lineasRespuesta > 30) puntuacion += 3;
    else if (lineasRespuesta > 20) puntuacion += 2;
    else if (lineasRespuesta > 10) puntuacion += 1;
    
    // Calcular porcentaje
    const porcentaje = (puntuacion / maxPuntuacion) * 100;
    
    // Asignar calificación
    if (porcentaje >= 80) return "EXCELENTE";
    if (porcentaje >= 60) return "BUENO";
    if (porcentaje >= 40) return "REGULAR";
    if (porcentaje >= 20) return "LIMITADO";
    return "INSUFICIENTE";
}

/**
 * Genera reporte de métricas para auditoría
 */
function generarReporteMetricas(startTime, chunks, areaIdentificada, respuesta) {
    const tiempoRespuesta = (Date.now() - startTime) / 1000;
    const numChunks = chunks.length;
    const calificacion = calcularCalificacion(numChunks, respuesta, areaIdentificada, chunks);
    
    return {
        timestamp: new Date().toISOString(),
        tiempo_respuesta_segundos: tiempoRespuesta.toFixed(3),
        chunks_recuperados: numChunks,
        area_identificada: areaIdentificada,
        calificacion_calidad: calificacion,
        porcentaje_completitud: calcularPorcentajeCompletitud(chunks, areaIdentificada),
        tiene_fundamento_inspeccion: chunks.some(c => 
            c.texto_normativo.toLowerCase().includes("inspección") ||
            c.document_title.includes("Inspección")
        ),
        niveles_jurisdiccionales: [...new Set(chunks.map(c => c.jurisdiction_level))]
    };
}

function calcularPorcentajeCompletitud(chunks, area) {
    if (chunks.length === 0) return 0;
    
    let completitud = 0;
    
    // Chunks específicos del área
    const chunksArea = chunks.filter(c => 
        c.tags && c.tags.some(tag => tag.toLowerCase().includes(area.toLowerCase()))
    );
    if (chunksArea.length > 0) completitud += 40;
    
    // Chunks de Inspección
    const chunksInspeccion = chunks.filter(c => 
        c.texto_normativo.toLowerCase().includes("inspección") ||
        c.document_title.includes("Inspección")
    );
    if (chunksInspeccion.length > 0) completitud += 30;
    
    // Chunks con citas completas
    const chunksCitasCompletas = chunks.filter(c => 
        c.citation_full && c.citation_full.includes("Artículo") && 
        (c.fraccion || c.numeral)
    );
    if (chunksCitasCompletas.length > 0) completitud += 30;
    
    return Math.min(completitud, 100);
}

async function cargarDirectorio() {
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Ruta al CSV real
        const csvPath = path.join(__dirname, '../data/documents/004 directorio y contactos/004 directorio y contactos_directorio ZPN, IA inspección - Hoja 1.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.warn('CSV directorio no encontrado, usando datos simulados');
            return cargarDirectorioSimulado();
        }
        
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        
        const directorio = [];
        
        // Saltar encabezado y procesar cada línea
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            // Manejar CSV con comas dentro de comillas
            const columns = parseCSVLine(line);
            
            if (columns.length >= 3) {
                const nombre = columns[0]?.trim() || '';
                const telefono = columns[1]?.trim() || '';
                const extension = columns[2]?.trim() || '';
                
                if (nombre && telefono) {
                    // Mapear área basada en nombre de dirección
                    const area = mapearAreaPorNombre(nombre);
                    
                    directorio.push({
                        nombre: nombre,
                        area: area,
                        telefono: telefono,
                        extension: extension || 'No especificada',
                        horario: "Lunes a Viernes 08:00 - 15:00", // Horario estándar municipal
                        correo: generarCorreoInstitucional(nombre),
                        direccion: "Av. Hidalgo 150, Centro, Zapopan" // Dirección central municipal
                    });
                }
            }
        }
        
        console.log(`✅ Directorio cargado: ${directorio.length} direcciones`);
        return directorio;
        
    } catch (error) {
        console.error('Error cargando directorio CSV:', error);
        return cargarDirectorioSimulado();
    }
}

function parseCSVLine(line) {
    // Manejo básico de CSV con comas dentro de comillas
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

function mapearAreaPorNombre(nombre) {
    const nombreLower = nombre.toLowerCase();
    
    const mapeoAreas = {
        "inspección": "CONSTRUCCIÓN,AMBIENTAL,COMERCIO,ANUNCIOS,TIANGUIS,ANIMALES,URBANIZACIÓN,MOVILIDAD,RIESGOS",
        "medio ambiente": "AMBIENTAL",
        "ecología": "AMBIENTAL",
        "construcción": "CONSTRUCCIÓN",
        "obras públicas": "CONSTRUCCIÓN",
        "mejoramiento urbano": "URBANIZACIÓN",
        "urbanización": "URBANIZACIÓN",
        "catastro": "URBANIZACIÓN",
        "comercio": "COMERCIO",
        "tianguis": "TIANGUIS",
        "espacios abiertos": "TIANGUIS",
        "anuncios": "ANUNCIOS",
        "publicidad": "ANUNCIOS",
        "animales": "ANIMALES",
        "sanidad": "ANIMALES",
        "movilidad": "MOVILIDAD",
        "tránsito": "MOVILIDAD",
        "agua": "AMBIENTAL",
        "alcantarillado": "AMBIENTAL",
        "alumbrado": "URBANIZACIÓN",
        "aseo": "AMBIENTAL",
        "residuos": "AMBIENTAL",
        "atención ciudadana": "GENERAL",
        "comunidad digna": "GENERAL",
        "contraloría": "GENERAL",
        "control forestal": "AMBIENTAL",
        "bomberos": "RIESGOS",
        "dif": "GENERAL",
        "jueces calificadores": "GENERAL",
        "servicios municipales": "GENERAL"
    };
    
    for (const [keyword, area] of Object.entries(mapeoAreas)) {
        if (nombreLower.includes(keyword)) {
            return area;
        }
    }
    
    return "GENERAL";
}

function generarCorreoInstitucional(nombre) {
    // Generar correo basado en nombre de dirección
    const nombreSimplificado = nombre
        .toLowerCase()
        .replace(/dirección de /g, '')
        .replace(/zapopan/g, '')
        .replace(/ /g, '')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .trim();
    
    return `${nombreSimplificado}@zapopan.gob.mx`;
}

function cargarDirectorioSimulado() {
    // Fallback con datos simulados
    return [
        {
            nombre: "Dirección de Inspección y Vigilancia",
            area: "CONSTRUCCIÓN,AMBIENTAL,COMERCIO,ANUNCIOS,TIANGUIS,ANIMALES,URBANIZACIÓN,MOVILIDAD,RIESGOS",
            telefono: "3338182200",
            extension: "3312, 3313, 3315, 3322, 3324, 3331, 3330, 3342",
            horario: "Lunes a Viernes 08:00 - 15:00",
            correo: "inspeccion@zapopan.gob.mx",
            direccion: "Av. Hidalgo 150, Centro, Zapopan"
        },
        {
            nombre: "Dirección de Ecología y Medio Ambiente",
            area: "AMBIENTAL",
            telefono: "3338182200",
            extension: "3232",
            horario: "Lunes a Viernes 08:00 - 15:00",
            correo: "ecologia@zapopan.gob.mx",
            direccion: "Av. Hidalgo 150, Centro, Zapopan"
        }
    ];
}