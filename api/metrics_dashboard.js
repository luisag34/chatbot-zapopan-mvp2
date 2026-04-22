// METRICS DASHBOARD - Sistema de monitoreo en tiempo real
// Para Chatbot Zapopan v6.0 - Excelencia Operativa

const fs = require('fs');
const path = require('path');

class MetricsDashboard {
    constructor() {
        this.metricsPath = path.join(__dirname, '../data/metrics');
        this.ensureMetricsDirectory();
        
        // Métricas en memoria para dashboard en tiempo real
        this.liveMetrics = {
            totalQueries: 0,
            successfulQueries: 0,
            failedQueries: 0,
            avgResponseTime: 0,
            queriesByArea: {},
            qualityDistribution: {},
            hourlyActivity: {},
            topQueries: [],
            systemHealth: {
                status: 'healthy',
                lastCheck: new Date().toISOString(),
                uptime: 0
            }
        };
        
        // Inicializar archivos de métricas
        this.initializeMetricsFiles();
        
        // Iniciar monitoreo automático
        this.startMonitoring();
    }
    
    ensureMetricsDirectory() {
        if (!fs.existsSync(this.metricsPath)) {
            fs.mkdirSync(this.metricsPath, { recursive: true });
            console.log('📁 Directorio de métricas creado');
        }
    }
    
    initializeMetricsFiles() {
        const files = [
            'daily_metrics.json',
            'weekly_report.json', 
            'quality_trends.json',
            'user_feedback.json',
            'system_logs.json'
        ];
        
        files.forEach(file => {
            const filePath = path.join(this.metricsPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
            }
        });
    }
    
    /**
     * Registrar nueva consulta en el sistema
     */
    logQuery(auditData, responseData) {
        const timestamp = new Date().toISOString();
        const today = timestamp.split('T')[0];
        
        // Actualizar métricas en memoria
        this.liveMetrics.totalQueries++;
        
        if (responseData.success) {
            this.liveMetrics.successfulQueries++;
        } else {
            this.liveMetrics.failedQueries++;
        }
        
        // Actualizar distribución por área
        const area = auditData.area_identificada || 'GENERAL';
        this.liveMetrics.queriesByArea[area] = (this.liveMetrics.queriesByArea[area] || 0) + 1;
        
        // Actualizar distribución de calidad
        const quality = auditData.calificacion_calidad || 'UNKNOWN';
        this.liveMetrics.qualityDistribution[quality] = (this.liveMetrics.qualityDistribution[quality] || 0) + 1;
        
        // Actualizar actividad por hora
        const hour = new Date().getHours();
        this.liveMetrics.hourlyActivity[hour] = (this.liveMetrics.hourlyActivity[hour] || 0) + 1;
        
        // Actualizar top queries
        const query = auditData.consulta_original?.substring(0, 100) || 'Consulta sin texto';
        this.updateTopQueries(query, area, quality);
        
        // Actualizar tiempo promedio de respuesta
        const responseTime = auditData.tiempo_respuesta_segundos || 0;
        this.updateAverageResponseTime(responseTime);
        
        // Guardar en archivo diario
        this.saveDailyMetric(today, {
            timestamp,
            query: auditData.consulta_original,
            area,
            quality,
            responseTime,
            documentsConsulted: auditData.documentos_consultados?.length || 0,
            success: responseData.success
        });
        
        // Guardar en logs del sistema
        this.saveSystemLog({
            timestamp,
            type: 'QUERY',
            data: {
                query: auditData.consulta_original,
                area,
                quality,
                responseTime
            }
        });
        
        console.log(`📊 Métrica registrada: ${area} - ${quality} - ${responseTime}s`);
    }
    
    updateAverageResponseTime(newTime) {
        const currentTotal = this.liveMetrics.avgResponseTime * (this.liveMetrics.totalQueries - 1);
        this.liveMetrics.avgResponseTime = (currentTotal + newTime) / this.liveMetrics.totalQueries;
    }
    
    updateTopQueries(query, area, quality) {
        const existingIndex = this.liveMetrics.topQueries.findIndex(q => q.query === query);
        
        if (existingIndex >= 0) {
            this.liveMetrics.topQueries[existingIndex].count++;
            this.liveMetrics.topQueries[existingIndex].lastSeen = new Date().toISOString();
        } else {
            this.liveMetrics.topQueries.push({
                query,
                area,
                quality,
                count: 1,
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString()
            });
        }
        
        // Mantener solo top 10
        this.liveMetrics.topQueries.sort((a, b) => b.count - a.count);
        this.liveMetrics.topQueries = this.liveMetrics.topQueries.slice(0, 10);
    }
    
    saveDailyMetric(date, metric) {
        const filePath = path.join(this.metricsPath, 'daily_metrics.json');
        let dailyData = {};
        
        try {
            if (fs.existsSync(filePath)) {
                dailyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
            
            if (!dailyData[date]) {
                dailyData[date] = {
                    totalQueries: 0,
                    queries: [],
                    summary: {
                        byArea: {},
                        byQuality: {},
                        avgResponseTime: 0
                    }
                };
            }
            
            dailyData[date].queries.push(metric);
            dailyData[date].totalQueries++;
            
            // Actualizar resumen
            dailyData[date].summary.byArea[metric.area] = (dailyData[date].summary.byArea[metric.area] || 0) + 1;
            dailyData[date].summary.byQuality[metric.quality] = (dailyData[date].summary.byQuality[metric.quality] || 0) + 1;
            
            // Actualizar tiempo promedio
            const currentTotal = dailyData[date].summary.avgResponseTime * (dailyData[date].totalQueries - 1);
            dailyData[date].summary.avgResponseTime = (currentTotal + metric.responseTime) / dailyData[date].totalQueries;
            
            fs.writeFileSync(filePath, JSON.stringify(dailyData, null, 2));
            
        } catch (error) {
            console.error('❌ Error guardando métrica diaria:', error);
        }
    }
    
    saveSystemLog(log) {
        const filePath = path.join(this.metricsPath, 'system_logs.json');
        let logs = [];
        
        try {
            if (fs.existsSync(filePath)) {
                logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
            
            logs.push(log);
            
            // Mantener solo últimos 1000 logs
            if (logs.length > 1000) {
                logs = logs.slice(-1000);
            }
            
            fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
            
        } catch (error) {
            console.error('❌ Error guardando log del sistema:', error);
        }
    }
    
    /**
     * Generar reporte semanal
     */
    generateWeeklyReport() {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const report = {
            period: {
                start: oneWeekAgo.toISOString().split('T')[0],
                end: now.toISOString().split('T')[0]
            },
            summary: {
                totalQueries: this.liveMetrics.totalQueries,
                successfulQueries: this.liveMetrics.successfulQueries,
                successRate: ((this.liveMetrics.successfulQueries / this.liveMetrics.totalQueries) * 100).toFixed(2) + '%',
                avgResponseTime: this.liveMetrics.avgResponseTime.toFixed(3) + 's',
                queriesByArea: this.liveMetrics.queriesByArea,
                qualityDistribution: this.liveMetrics.qualityDistribution
            },
            trends: this.calculateTrends(),
            recommendations: this.generateRecommendations(),
            topQueries: this.liveMetrics.topQueries,
            systemHealth: this.liveMetrics.systemHealth
        };
        
        // Guardar reporte
        const reportPath = path.join(this.metricsPath, 'weekly_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('📈 Reporte semanal generado');
        return report;
    }
    
    calculateTrends() {
        const trends = {
            queryGrowth: 'stable',
            qualityImprovement: 'stable',
            responseTimeTrend: 'stable'
        };
        
        // Análisis simple de tendencias (en implementación real usaría datos históricos)
        const successRate = this.liveMetrics.successfulQueries / this.liveMetrics.totalQueries;
        
        if (successRate > 0.9) trends.qualityImprovement = 'improving';
        if (successRate < 0.7) trends.qualityImprovement = 'declining';
        
        if (this.liveMetrics.avgResponseTime < 0.1) trends.responseTimeTrend = 'improving';
        if (this.liveMetrics.avgResponseTime > 0.5) trends.responseTimeTrend = 'declining';
        
        return trends;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Análisis de áreas con menos consultas
        const areas = Object.entries(this.liveMetrics.queriesByArea);
        if (areas.length > 0) {
            const sortedAreas = areas.sort((a, b) => a[1] - b[1]);
            const leastQueriedArea = sortedAreas[0];
            
            if (leastQueriedArea[1] < 5) {
                recommendations.push({
                    type: 'CONTENT_GAP',
                    area: leastQueriedArea[0],
                    message: `El área "${leastQueriedArea[0]}" tiene pocas consultas (${leastQueriedArea[1]}). Considera agregar más contenido normativo.`,
                    priority: 'medium'
                });
            }
        }
        
        // Análisis de calidad
        const qualityCounts = Object.entries(this.liveMetrics.qualityDistribution);
        const insufficientCount = qualityCounts.find(([quality]) => quality === 'INSUFICIENTE')?.[1] || 0;
        
        if (insufficientCount > 0) {
            recommendations.push({
                type: 'QUALITY_ISSUE',
                message: `${insufficientCount} consultas recibieron calificación "INSUFICIENTE". Revisa el dataset RAG para esas áreas.`,
                priority: 'high'
            });
        }
        
        // Análisis de tiempo de respuesta
        if (this.liveMetrics.avgResponseTime > 0.3) {
            recommendations.push({
                type: 'PERFORMANCE',
                message: `Tiempo promedio de respuesta (${this.liveMetrics.avgResponseTime.toFixed(3)}s) es alto. Optimiza el sistema RAG.`,
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Obtener métricas para dashboard
     */
    getDashboardData() {
        return {
            liveMetrics: this.liveMetrics,
            dailySummary: this.getDailySummary(),
            weeklyReport: this.getWeeklyReportSummary(),
            systemStatus: this.checkSystemStatus()
        };
    }
    
    getDailySummary() {
        const today = new Date().toISOString().split('T')[0];
        const filePath = path.join(this.metricsPath, 'daily_metrics.json');
        
        try {
            if (fs.existsSync(filePath)) {
                const dailyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return dailyData[today] || { totalQueries: 0, queries: [] };
            }
        } catch (error) {
            console.error('❌ Error leyendo resumen diario:', error);
        }
        
        return { totalQueries: 0, queries: [] };
    }
    
    getWeeklyReportSummary() {
        const filePath = path.join(this.metricsPath, 'weekly_report.json');
        
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (error) {
            console.error('❌ Error leyendo reporte semanal:', error);
        }
        
        return null;
    }
    
    checkSystemStatus() {
        const status = {
            api: 'healthy',
            database: 'healthy',
            memory: 'healthy',
            lastCheck: new Date().toISOString()
        };
        
        // Verificar uso de memoria
        const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        if (usedMemory > 500) {
            status.memory = 'warning';
            status.memoryUsage = `${usedMemory.toFixed(2)}MB`;
        }
        
        this.liveMetrics.systemHealth = status;
        return status;
    }
    
    /**
     * Iniciar monitoreo automático
     */
    startMonitoring() {
        // Verificar estado cada 5 minutos
        setInterval(() => {
            this.checkSystemStatus();
            console.log('🔍 Monitoreo del sistema ejecutado');
        }, 5 * 60 * 1000);
        
        // Generar reporte semanal cada domingo a las 23:59
        const now = new Date();
        const nextSunday = new Date(now);
        nextSunday.setDate(now.getDate() + (7 - now.getDay()));
        nextSunday.setHours(23, 59, 0, 0);
        
        const timeUntilSunday = nextSunday.getTime() - now.getTime();
        
        setTimeout(() => {
            this.generateWeeklyReport();
            // Programar siguiente ejecución semanal
            setInterval(() => this.generateWeeklyReport(), 7 * 24 * 60 * 60 * 1000);
        }, timeUntilSunday);
        
        console.log('📊 Sistema de monitoreo iniciado');
    }
    
    /**
     * Endpoint API para dashboard
     */
    getDashboardEndpoint(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        const data = this.getDashboardData();
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            data: data
        });
    }
}

module.exports = MetricsDashboard;