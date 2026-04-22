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
    
    // 3. Identificar materias normativas
    const materiasNormativas = [
        "comercio", "construcción", "uso de suelo", "anuncios", "residuos",
        "ruido", "medio ambiente", "animales", "tianguis", "licencias",
        "vía pública", "urbanización", "actividades económicas"
    ];
    
    // 4. Verificar ubicación Zapopan
    const enZapopan = consultaLower.includes("zapopan") || 
                     consultaLower.includes("municipio") ||
                     consultaLower.includes("localidad");
    
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
 * Simula recuperación de dataset estructurado
 */
async function recuperarChunksRAG(consulta, area) {
    // En una implementación real, aquí se conectaría a la base vectorial
    // Por ahora, simulamos chunks basados en el área
    
    const chunksSimulados = {
        "CONSTRUCCIÓN": [
            {
                texto_normativo: "Toda construcción requiere permiso municipal previo.",
                document_title: "Reglamento de Construcción para el Municipio de Zapopan",
                document_type: "Reglamento Municipal",
                jurisdiction_level: "Municipal",
                article: "34",
                citation_short: "Reglamento de Construcción, Art. 34",
                citation_full: "Reglamento de Construcción para el Municipio de Zapopan, Artículo 34",
                id_juridico: "mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_34|c001"
            },
            {
                texto_normativo: "La Dirección de Inspección y Vigilancia es competente para verificar el cumplimiento de las normas de construcción.",
                document_title: "Manual de Organización de la Dirección de Inspección y Vigilancia",
                document_type: "Manual Organizacional",
                jurisdiction_level: "Municipal",
                article: "5",
                citation_short: "Manual Inspección, Art. 5",
                citation_full: "Manual de Organización de la Dirección de Inspección y Vigilancia, Artículo 5",
                id_juridico: "mx|jal|jal|mun|zapopan|manual_inspeccion|v2023|art_5|c001"
            }
        ],
        "AMBIENTAL": [
            {
                texto_normativo: "Se prohíbe la emisión de ruido que exceda los límites establecidos en la NOM-081.",
                document_title: "NOM-081-SEMARNAT-1994",
                document_type: "Norma Oficial Mexicana",
                jurisdiction_level: "Federal",
                article: "5.3",
                citation_short: "NOM-081-SEMARNAT-1994, numeral 5.3",
                citation_full: "NOM-081-SEMARNAT-1994, numeral 5.3",
                id_juridico: "mx|fed|nom_081_semarnat|v1994|num_5_3|c001"
            }
        ]
    };
    
    return chunksSimulados[area] || [];
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
    // Simulación de carga de directorio
    return [
        {
            nombre: "Dirección de Inspección y Vigilancia",
            area: "CONSTRUCCIÓN,AMBIENTAL,COMERCIO",
            telefono: "3338182200",
            extension: "3312, 3313, 3315",
            horario: "Lunes a Viernes 08:00 - 15:00",
            correo: "inspeccion@zapopan.gob.mx",
            direccion: "Av. Hidalgo 150, Centro, Zapopan"
        },
        {
            nombre: "Dirección de Medio Ambiente",
            area: "AMBIENTAL",
            telefono: "3338182300",
            extension: "3320",
            horario: "Lunes a Viernes 09:00 - 14:00",
            correo: "medioambiente@zapopan.gob.mx",
            direccion: "Av. Patria 1201, Zapopan"
        }
    ];
}