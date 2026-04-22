// CHATBOT ZAPOPAN v5.6 SIMPLIFICADO - VERCEL COMPATIBLE
const http = require('http');
const fs = require('fs');
const path = require('path');

class SistemaConsultaNormativa {
    constructor() {
        console.log('🏗️ Inicializando Sistema de Consulta Normativa Zapopan v5.6...');
        
        // Jerarquía normativa básica
        this.jerarquiaNormativa = {
            nivel1: ['Código Urbano para el Estado de Jalisco'],
            nivel2: ['Reglamento de Construcción', 'Reglamento para el Comercio, la Industria y la Prestación de Servicios'],
            nivel3: ['Código Ambiental para el Municipio de Zapopan'],
            nivel4: ['directorio ZPN, IA inspección']
        };
        
        // Dataset RAG básico
        this.datasetRAG = [
            {
                id_juridico: 'mx|jal|jal|mun|zapopan|codigo_urbano|v2023|art_10|c001',
                document_title: 'Código Urbano para el Estado de Jalisco',
                document_type: 'código_estatal',
                article: 'Artículo 10',
                citation_short: 'Código Urbano, Art. 10',
                citation_full: 'Código Urbano para el Estado de Jalisco, Artículo 10',
                texto_normativo: 'Los municipios tienen la facultad y obligación de vigilar que toda edificación cuente con los permisos necesarios para garantizar la seguridad de la población.',
                tiene_facultad_inspeccion: true
            },
            {
                id_juridico: 'mx|jal|jal|mun|zapopan|reglamento_construccion|v2023|art_34|c001',
                document_title: 'Reglamento de Construcción',
                document_type: 'reglamento_municipal',
                article: 'Artículo 34',
                citation_short: 'Reglamento Construcción, Art. 34',
                citation_full: 'Reglamento de Construcción, Artículo 34',
                texto_normativo: 'La Dirección de Inspección y Vigilancia tiene facultad para verificar el cumplimiento de las normas de construcción y aplicar sanciones.',
                tiene_facultad_inspeccion: true
            }
        ];
        
        console.log(`✅ Sistema inicializado con ${this.datasetRAG.length} documentos`);
    }
    
    // FILTRO DE RELEVANCIA SIMPLIFICADO
    filtrarConsulta(consulta) {
        const consultaLower = consulta.toLowerCase();
        
        // Palabras clave básicas
        const palabrasClave = [
            'construcción', 'obra', 'barda', 'muro', 'edificación',
            'comercio', 'venta', 'negocio', 'licencia',
            'medio ambiente', 'tala', 'árbol', 'basura',
            'ruido', 'molestia', 'vía pública', 'banqueta'
        ];
        
        const tieneRelevancia = palabrasClave.some(palabra => consultaLower.includes(palabra));
        
        if (!tieneRelevancia) {
            return {
                relevante: false,
                motivo: 'Consulta no corresponde a materia regulada disponible.'
            };
        }
        
        return { relevante: true };
    }
    
    // GENERAR RESPUESTA SIMPLIFICADA
    generarRespuesta(consulta) {
        let respuesta = '';
        
        // 1. ANÁLISIS DE SITUACIÓN
        respuesta += `**ANÁLISIS DE SITUACIÓN**\n\n`;
        respuesta += `La consulta "${consulta}" involucra normativa municipal de Zapopan.\n\n`;
        
        // 2. CLASIFICACIÓN DE ATRIBUCIONES
        respuesta += `**CLASIFICACIÓN DE ATRIBUCIONES**\n\n`;
        respuesta += `Esta situación corresponde a **facultad compartida** entre:\n\n`;
        respuesta += `1. **Dirección de Inspección y Vigilancia**: Verificación en campo y aplicación de sanciones.\n`;
        respuesta += `2. **Dirección de Licencias y Permisos de Construcción**: Validación técnica y autorizaciones.\n\n`;
        
        // 3. SUSTENTO LEGAL
        respuesta += `**SUSTENTO LEGAL**\n\n`;
        respuesta += `**Fundamento de Inspección y Vigilancia:**\n`;
        respuesta += `1. Código Urbano, Art. 10: Los municipios tienen facultad de vigilancia.\n`;
        respuesta += `2. Reglamento de Construcción, Art. 34: Faculta a Inspección para verificar obras.\n\n`;
        
        // 4. CONTACTOS
        respuesta += `**DEPENDENCIAS CON ATRIBUCIONES Y CONTACTO**\n\n`;
        respuesta += `**Dirección de Inspección y Vigilancia Zapopan:**\n`;
        respuesta += `• Teléfono: 3338182200\n`;
        respuesta += `• Extensiones: 3312, 3313, 3315, 3322, 3324, 3331, 3330, 3342\n`;
        respuesta += `• Horario: Lunes a Viernes 08:00 - 15:00\n\n`;
        
        respuesta += `**Dirección de Licencias y Permisos de Construcción Zapopan:**\n`;
        respuesta += `• Teléfono: 3338182200\n`;
        respuesta += `• Extensión: 3007\n`;
        respuesta += `• Horario: Lunes a Viernes 09:00 - 14:00\n`;
        
        return respuesta;
    }
    
    // PROCESAR CONSULTA COMPLETA
    procesarConsulta(consulta) {
        console.log(`📝 Procesando consulta: "${consulta}"`);
        
        const inicio = Date.now();
        
        // 1. Filtrar
        const filtro = this.filtrarConsulta(consulta);
        if (!filtro.relevante) {
            return {
                success: false,
                response: `**Consulta no procesada:** ${filtro.motivo}`
            };
        }
        
        // 2. Generar respuesta
        const respuesta = this.generarRespuesta(consulta);
        
        // 3. Calcular tiempo
        const tiempo = (Date.now() - inicio) / 1000;
        
        return {
            success: true,
            response: respuesta,
            query: consulta,
            area_identified: "ÁREA CONSTRUCCIÓN / COMERCIO",
            documents_found: this.datasetRAG.length,
            filtered: false,
            tiempo_respuesta: tiempo
        };
    }
}

// ============================================
// SERVER HTTP PARA VERCEL
// ============================================

const sistema = new SistemaConsultaNormativa();

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Ruta API
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const resultado = sistema.procesarConsulta(data.message || '');
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(resultado));
            } catch (error) {
                console.error('❌ Error procesando consulta:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Error interno del servidor',
                    system: 'Sistema de Consulta Normativa Zapopan v5.6'
                }));
            }
        });
    } else {
        // Servir frontend
        const frontendPath = path.join(__dirname, '..', 'frontend.html');
        try {
            const frontendHTML = fs.readFileSync(frontendPath, 'utf-8');
            res.writeHead(200, { 
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.end(frontendHTML);
        } catch (error) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Chatbot Zapopan v5.6</h1><p>Sistema de Consulta Normativa operativo.</p>');
        }
    }
});

// Export para Vercel
module.exports = server;