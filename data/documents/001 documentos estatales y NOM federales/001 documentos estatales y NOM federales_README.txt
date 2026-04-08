001 documentos estatales y NOM federales

Archivos generados:
- 001_dataset_rag_combinado.jsonl -> una unidad jurídica o sección fuente por registro.
- 001_chunks_ia_combinados.jsonl -> chunks optimizados para embeddings / Gemini / Vertex AI.
- Subcarpetas por documento con texto_limpio_estructurado.txt, dataset_rag.jsonl y chunks_ia.jsonl.

Observaciones:
- En leyes, códigos y reglamentos el dataset se segmentó principalmente por Artículo.
- En NOM federales el dataset se segmentó por secciones numeradas y subapartados relevantes.
- Los chunks IA se generaron con partición semántica aproximada para mantener bloques manejables.

Resumen por documento:
- Código Urbano para el Estado de Jalisco: 462 unidades fuente, 489 chunks IA
- Reglamento Estatal de Zonificación: 472 unidades fuente, 521 chunks IA
- Ley del Procedimiento Administrativo del Estado de Jalisco y sus Municipios: 180 unidades fuente, 182 chunks IA
- NOM-011-STPS-2001, Condiciones de seguridad e higiene en los centros de trabajo donde se genere ruido: 103 unidades fuente, 116 chunks IA
- NOM-081-SEMARNAT-1994, Límites máximos permisibles de emisión de ruido de las fuentes fijas y su método de medición: 10 unidades fuente, 15 chunks IA