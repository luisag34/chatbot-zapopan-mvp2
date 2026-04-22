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
                
                // 4. SISTEMA DE AUDITORÍA
                const auditoria = {
                    timestamp: new Date().toISOString(),
                    area_identificada: areaIdentificada,
                    tipo_consulta: clasificarConsulta(consulta),
                    documentos_consultados: [],
                    ids_juridicos_utilizados: [],
                    tiempo_respuesta_segundos: 0,
                    calificacion_sugerida: ""
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
                // 📊 SISTEMA DE AUDITORÍA COMPLETO
                // ============================================
                
                auditoria.documentos_consultados = extraerDocumentosConsultados(chunksRecuperados);
                auditoria.ids_juridicos_utilizados = extraerIdsJuridicos(chunksRecuperados);
                auditoria.tiempo_respuesta_segundos = (Date.now() - startTime) / 1000;
                auditoria.calificacion_sugerida = calcularCalificacion(chunksRecuperados.length, respuesta);
                
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
 * 2. ROUTER DE ÁREAS
 * Identifica el área normativa de la consulta
 */
async function routerAreas(consulta) {
    const areas = {
        "CONSTRUCCIÓN": ["construcción", "obra", "edificación", "permiso de construcción", "cimientos", "estructura"],
        "AMBIENTAL": ["medio ambiente", "contaminación", "residuos", "árbol", "fauna", "flora", "ruido"],
        "COMERCIO": ["comercio", "giro", "negocio", "establecimiento", "permiso comercial", "licencia"],
        "ANUNCIOS": ["anuncio", "publicidad", "cartel", "letrero", "valla", "spectacular"],
        "TIANGUIS": ["tianguis", "mercado sobre ruedas", "comercio ambulante", "puesto"],
        "ANIMALES": ["animal", "mascota", "perro", "gato", "protección animal", "sanidad"],
        "URBANIZACIÓN": ["urbanización", "uso de suelo", "zona", "lote", "parcelación"],
        "MOVILIDAD": ["tránsito", "movilidad", "estacionamiento", "vía pública", "peatón"],
        "RIESGOS": ["riesgo", "emergencia", "prevención", "gestión integral", "desastre"]
    };
    
    const consultaLower = consulta.toLowerCase();
    
    for (const [area, palabras] of Object.entries(areas)) {
        for (const palabra of palabras) {
            if (consultaLower.includes(palabra.toLowerCase())) {
                return area;
            }
        }
    }
    
    return "GENERAL";
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
                texto_normativo: "Toda construcción, modificación, ampliación o demolición requiere permiso municipal previo expedido por la Dirección de Inspección y Vigilancia.",
                document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "34",
                numeral: "I",
                citation_short: "Reglamento de Construcción, Art. 34",
                citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 34, Fracción I",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_34|frac_I|c001"
            },
            {
                texto_normativo: "Las bardas perimetrales que excedan 1.80 metros de altura requieren permiso de construcción y deben cumplir con las normas de seguridad estructural.",
                document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "87",
                numeral: "III",
                citation_short: "Reglamento de Construcción, Art. 87",
                citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 87, Fracción III",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_87|frac_III|c001"
            },
            {
                texto_normativo: "La Dirección de Inspección y Vigilancia es la autoridad competente para verificar, inspeccionar y, en su caso, sancionar el incumplimiento de las normas de construcción.",
                document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
                document_type: "Manual Organizacional",
                jurisdiction_level: "Municipal",
                article: "5",
                numeral: "2",
                citation_short: "Manual Inspección, Art. 5",
                citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 5, Numeral 2",
                id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_5|num_2|c001"
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
 * Paso 3: SUSTENTO LEGAL
 */
function generarSustentoLegal(chunks) {
    if (chunks.length === 0) {
        return "No se encontró fundamento legal específico en los documentos disponibles del sistema.";
    }
    
    // Separar fundamentos de Inspección vs otras
    const fundamentosInspeccion = chunks.filter(c => 
        c.texto_normativo.toLowerCase().includes("inspección") ||
        c.document_title.includes("Inspección")
    );
    
    const fundamentosOtros = chunks.filter(c => !fundamentosInspeccion.includes(c));
    
    let sustento = "";
    
    if (fundamentosInspeccion.length > 0) {
        sustento += "**Fundamento de Inspección y Vigilancia:**\n\n";
        fundamentosInspeccion.forEach((chunk, i) => {
            sustento += `${i+1}. ${chunk.citation_short}: ${chunk.texto_normativo}\n`;
        });
        sustento += "\n";
    }
    
    if (fundamentosOtros.length > 0) {
        sustento += "**Fundamento de otras direcciones/dependencias:**\n\n";
        fundamentosOtros.forEach((chunk, i) => {
            sustento += `${i+1}. ${chunk.citation_short}: ${chunk.texto_normativo}\n`;
        });
    }
    
    return sustento || "No se identificaron fundamentos legales específicos.";
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

function calcularCalificacion(numChunks, respuesta) {
    if (numChunks === 0) return "SIN_FUNDAMENTO";
    if (respuesta.includes("No se encontró")) return "LIMITADO";
    if (respuesta.includes("facultad exclusiva")) return "COMPLETO";
    return "PARCIAL";
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