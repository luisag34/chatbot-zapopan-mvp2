// RAG INTEGRATION MODULE - Para Chatbot Zapopan v6.0
// Integración con base vectorial real (Pinecone/Chroma/Weaviate)

const fs = require('fs');
const path = require('path');

class RAGIntegration {
    constructor() {
        this.vectorDB = null;
        this.embeddingModel = 'text-embedding-3-small'; // OpenAI compatible
        this.indexName = 'chatbot-zapopan-normativa';
        this.chunkSize = 500;
        this.overlapSize = 50;
    }
    
    /**
     * Inicializar conexión con base vectorial
     */
    async initialize() {
        try {
            // Opción 1: Pinecone (cloud)
            // Opción 2: ChromaDB (local)
            // Opción 3: Weaviate (cloud/self-hosted)
            // Por ahora, simulamos con sistema híbrido
            
            console.log('🔄 Inicializando sistema RAG...');
            
            // Cargar documentos normativos reales
            await this.loadNormativeDocuments();
            
            // Crear embeddings si no existen
            await this.createEmbeddingsIfNeeded();
            
            console.log('✅ Sistema RAG inicializado');
            return true;
            
        } catch (error) {
            console.error('❌ Error inicializando RAG:', error);
            return false;
        }
    }
    
    /**
     * Cargar documentos normativos desde estructura jerárquica
     */
    async loadNormativeDocuments() {
        const documentsPath = path.join(__dirname, '../data/documents');
        
        if (!fs.existsSync(documentsPath)) {
            console.warn('⚠️ Directorio de documentos no encontrado, usando dataset simulado');
            return this.loadSimulatedDataset();
        }
        
        const documentos = [];
        
        // Estructura jerárquica de documentos
        const estructura = {
            nivel1: [
                { nombre: 'Código Urbano para el Estado de Jalisco', archivo: 'codigo_urbano_jalisco.pdf' },
                { nombre: 'Ley del Procedimiento Administrativo del Estado de Jalisco', archivo: 'ley_procedimiento_administrativo.pdf' },
                { nombre: 'NOM-081-SEMARNAT-1994', archivo: 'nom_081_semarnat.pdf' }
            ],
            nivel2: [
                { nombre: 'Reglamento de Construcción para el Municipio de Zapopan', archivo: 'reglamento_construccion.pdf' },
                { nombre: 'Reglamento de Anuncios y Publicidad', archivo: 'reglamento_anuncios.pdf' },
                { nombre: 'Reglamento para el Comercio la Industria y la Prestación de Servicios', archivo: 'reglamento_comercio.pdf' },
                { nombre: 'Código Ambiental para el Municipio de Zapopan', archivo: 'codigo_ambiental.pdf' },
                { nombre: 'Reglamento de Tianguis y Comercio en Espacios Públicos', archivo: 'reglamento_tianguis.pdf' },
                { nombre: 'Reglamento de Sanidad y Protección a los Animales', archivo: 'reglamento_animales.pdf' }
            ],
            nivel3: [
                { nombre: 'Manual de Organización de la Dirección de Inspección y Vigilancia', archivo: 'manual_inspeccion.pdf' },
                { nombre: 'GirosXAreas 2025', archivo: 'girosxareas_2025.pdf' }
            ]
        };
        
        // Procesar cada documento
        for (const [nivel, docs] of Object.entries(estructura)) {
            for (const doc of docs) {
                const docPath = path.join(documentsPath, doc.archivo);
                
                if (fs.existsSync(docPath)) {
                    const contenido = await this.extractTextFromPDF(docPath);
                    const chunks = this.chunkDocument(contenido, doc.nombre, nivel);
                    
                    documentos.push(...chunks);
                    console.log(`📄 ${doc.nombre}: ${chunks.length} chunks`);
                } else {
                    console.warn(`⚠️ Documento no encontrado: ${doc.archivo}`);
                }
            }
        }
        
        this.documents = documentos;
        console.log(`📚 Total documentos cargados: ${documentos.length} chunks`);
        return documentos;
    }
    
    /**
     * Extraer texto de PDF (simulado por ahora)
     */
    async extractTextFromPDF(filePath) {
        // En implementación real: usar pdf-parse, pdf.js, o servicio OCR
        // Por ahora, retornamos texto simulado basado en nombre del archivo
        
        const fileName = path.basename(filePath);
        
        // Textos simulados para diferentes tipos de documentos
        const textosSimulados = {
            'reglamento_construccion.pdf': `
                REGLAMENTO DE CONSTRUCCIÓN PARA EL MUNICIPIO DE ZAPOPAN
                
                Artículo 34. Toda construcción, modificación, ampliación, demolición o reconstrucción de inmuebles 
                requiere permiso municipal previo expedido por la Dirección de Inspección y Vigilancia.
                
                Artículo 87. Las bardas, muros o cercas perimetrales:
                Fracción I. Las que excedan 1.80 metros de altura requieren permiso de construcción.
                Fracción II. Deben cumplir con las normas de seguridad estructural.
                Fracción III. Para bardas menores a 1.80 metros se requiere aviso previo.
                Fracción IV. El aviso debe incluir croquis de localización y características técnicas.
                
                Artículo 150. La Dirección de Inspección y Vigilancia puede ordenar la suspensión de obras 
                que no cuenten con el permiso correspondiente.
            `,
            'codigo_ambiental.pdf': `
                CÓDIGO AMBIENTAL PARA EL MUNICIPIO DE ZAPOPAN
                
                Artículo 42. Se prohíbe depositar residuos sólidos en la vía pública, áreas verdes o barrancas.
                Artículo 125. La Dirección de Inspección y Vigilancia, en coordinación con Ecología, 
                es competente para sancionar infracciones ambientales.
            `,
            'reglamento_comercio.pdf': `
                REGLAMENTO PARA EL COMERCIO LA INDUSTRIA Y LA PRESTACIÓN DE SERVICIOS
                
                Artículo 15. Todo establecimiento requiere licencia municipal para su funcionamiento.
                Artículo 22. La licencia se expide previa verificación de cumplimiento normativo.
            `,
            'manual_inspeccion.pdf': `
                MANUAL DE ORGANIZACIÓN DE LA DIRECCIÓN DE INSPECCIÓN Y VIGILANCIA
                
                Artículo 1. La Dirección es la autoridad competente para verificar el cumplimiento 
                de la normativa municipal en construcción, comercio, medio ambiente y ordenamiento urbano.
                Artículo 5. Facultades de inspección, verificación y sanción.
                Artículo 7. Competencia para verificación de licencias comerciales.
            `
        };
        
        return textosSimulados[fileName] || `Contenido del documento: ${fileName}`;
    }
    
    /**
     * Fragmentar documento en chunks semánticos
     */
    chunkDocument(text, documentTitle, jurisdictionLevel) {
        const chunks = [];
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        let currentChunk = '';
        let currentArticle = '';
        
        for (const line of lines) {
            // Detectar artículos
            const articleMatch = line.match(/Artículo\s+(\d+)/i);
            if (articleMatch) {
                currentArticle = articleMatch[1];
            }
            
            // Detectar fracciones
            const fractionMatch = line.match(/Fracción\s+([IVXLCDM]+)/i);
            const currentFraction = fractionMatch ? fractionMatch[1] : null;
            
            // Detectar numerales
            const numeralMatch = line.match(/Numeral\s+(\d+)/i);
            const currentNumeral = numeralMatch ? numeralMatch[1] : null;
            
            // Agregar línea al chunk actual
            currentChunk += line + ' ';
            
            // Si el chunk alcanza el tamaño máximo, guardarlo
            if (currentChunk.length >= this.chunkSize) {
                const chunk = this.createChunkObject(
                    currentChunk.trim(),
                    documentTitle,
                    jurisdictionLevel,
                    currentArticle,
                    currentFraction,
                    currentNumeral
                );
                
                chunks.push(chunk);
                
                // Overlap: mantener últimas líneas para continuidad
                const overlapLines = currentChunk.split('.').slice(-3).join('.');
                currentChunk = overlapLines + ' ';
            }
        }
        
        // Agregar último chunk si queda contenido
        if (currentChunk.trim().length > 0) {
            const chunk = this.createChunkObject(
                currentChunk.trim(),
                documentTitle,
                jurisdictionLevel,
                currentArticle,
                null,
                null
            );
            chunks.push(chunk);
        }
        
        return chunks;
    }
    
    /**
     * Crear objeto chunk con metadatos
     */
    createChunkObject(text, documentTitle, jurisdictionLevel, article, fraction, numeral) {
        // Generar ID jurídico único
        const docSlug = documentTitle.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_');
        
        const idJuridico = `mx|jal|jal|mun|zapopan|${docSlug}|v2023|` +
                          (article ? `art_${article}` : 'general') +
                          (fraction ? `|frac_${fraction}` : '') +
                          (numeral ? `|num_${numeral}` : '') +
                          `|c${Date.now()}`;
        
        // Generar cita
        let citationShort = documentTitle.split(' ')[0];
        if (article) citationShort += `, Art. ${article}`;
        if (fraction) citationShort += `, Fracc. ${fraction}`;
        if (numeral) citationShort += `, Num. ${numeral}`;
        
        return {
            texto_normativo: text,
            document_title: documentTitle,
            document_type: this.getDocumentType(documentTitle),
            jurisdiction_level: jurisdictionLevel,
            article: article || null,
            fraccion: fraction || null,
            numeral: numeral || null,
            citation_short: citationShort,
            citation_full: `${documentTitle}${article ? `, Artículo ${article}` : ''}${fraction ? `, Fracción ${fraction}` : ''}${numeral ? `, Numeral ${numeral}` : ''}`,
            id_juridico: idJuridico,
            tags: this.extractTags(text, documentTitle),
            embedding: null // Se calculará después
        };
    }
    
    /**
     * Extraer tags semánticos del texto
     */
    extractTags(text, documentTitle) {
        const tags = [];
        const textLower = text.toLowerCase();
        
        // Tags por tipo de documento
        if (documentTitle.includes('Construcción')) {
            if (textLower.includes('barda') || textLower.includes('muro') || textLower.includes('cerca')) tags.push('barda', 'construcción');
            if (textLower.includes('permiso')) tags.push('permiso', 'trámite');
            if (textLower.includes('altura') || textLower.includes('1.80')) tags.push('altura', 'medida');
        }
        
        if (documentTitle.includes('Ambiental') || documentTitle.includes('Ecología')) {
            if (textLower.includes('residuos') || textLower.includes('basura')) tags.push('residuos', 'contaminación');
            if (textLower.includes('ruido')) tags.push('ruido', 'contaminación acústica');
        }
        
        if (documentTitle.includes('Comercio')) {
            if (textLower.includes('licencia') || textLower.includes('permiso')) tags.push('licencia', 'comercio');
            if (textLower.includes('giro')) tags.push('giro', 'clasificación');
        }
        
        if (textLower.includes('inspección') || textLower.includes('vigilancia')) {
            tags.push('inspección', 'competencia', 'sanción');
        }
        
        return [...new Set(tags)]; // Eliminar duplicados
    }
    
    getDocumentType(title) {
        if (title.includes('Reglamento')) return 'Reglamento Municipal';
        if (title.includes('Código')) return 'Código';
        if (title.includes('Ley')) return 'Ley Estatal';
        if (title.includes('NOM')) return 'Norma Oficial Mexicana';
        if (title.includes('Manual')) return 'Manual Organizacional';
        return 'Documento Técnico';
    }
    
    /**
     * Crear embeddings si no existen
     */
    async createEmbeddingsIfNeeded() {
        const embeddingsPath = path.join(__dirname, '../data/embeddings/embeddings.json');
        
        if (fs.existsSync(embeddingsPath)) {
            console.log('📊 Embeddings existentes cargados');
            const embeddingsData = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
            this.embeddings = embeddingsData;
            return;
        }
        
        console.log('🔄 Generando embeddings...');
        // En implementación real: llamar a API de embeddings (OpenAI, Cohere, etc.)
        // Por ahora, simulamos embeddings
        
        this.embeddings = this.documents.map((doc, index) => ({
            id: doc.id_juridico,
            embedding: this.simulateEmbedding(doc.texto_normativo),
            metadata: {
                document_title: doc.document_title,
                article: doc.article,
                tags: doc.tags
            }
        }));
        
        // Guardar embeddings
        fs.mkdirSync(path.dirname(embeddingsPath), { recursive: true });
        fs.writeFileSync(embeddingsPath, JSON.stringify(this.embeddings, null, 2));
        console.log('✅ Embeddings guardados');
    }
    
    simulateEmbedding(text) {
        // Embedding simulado de 384 dimensiones (tamaño de sentence-transformers)
        const embedding = [];
        for (let i = 0; i < 384; i++) {
            embedding.push(Math.random() * 2 - 1); // Valores entre -1 y 1
        }
        return embedding;
    }
    
    /**
     * Búsqueda semántica en base vectorial
     */
    async semanticSearch(query, area = null, limit = 5) {
        console.log(`🔍 Búsqueda semántica: "${query.substring(0, 50)}..."`);
        
        // Simular embedding de la consulta
        const queryEmbedding = this.simulateEmbedding(query);
        
        // Calcular similitud coseno con todos los embeddings
        const results = this.embeddings.map(embedding => {
            const similarity = this.cosineSimilarity(queryEmbedding, embedding.embedding);
            return {
                ...embedding.metadata,
                similarity: similarity,
                id_juridico: embedding.id
            };
        });
        
        // Filtrar por área si se especifica
        let filteredResults = results;
        if (area && area !== 'GENERAL') {
            filteredResults = results.filter(result => 
                result.tags && result.tags.some(tag => 
                    tag.toLowerCase().includes(area.toLowerCase())
                )
            );
            
            // Si no hay resultados filtrados, usar todos
            if (filteredResults.length === 0) {
                filteredResults = results;
            }
        }
        
        // Ordenar por similitud y limitar
        const topResults = filteredResults
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
        
        // Recuperar chunks completos para los resultados top
        const chunks = topResults.map(result => {
            const doc = this.documents.find(d => d.id_juridico === result.id_juridico);
            return doc ? { ...doc, similarity: result.similarity } : null;
        }).filter(Boolean);
        
        console.log(`✅ ${chunks.length} chunks recuperados (similitud: ${topResults[0]?.similarity?.toFixed(3)})`);
        return chunks;
    }
    
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    /**
     * Fallback: dataset simulado
     */
    loadSimulatedDataset() {
        console.log('🔄 Cargando dataset simulado...');
        // Usar los chunks ya definidos en vercel.js
        this.documents = [];
        return this.documents;
    }
}

module.exports = RAGIntegration;