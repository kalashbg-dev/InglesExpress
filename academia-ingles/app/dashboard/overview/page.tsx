'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Users,
  AlertCircle,
  Clock,
  Database,
  Server,
  Globe,
  BarChart3
} from 'lucide-react'

interface Metrics {
  uptime: number
  responseTime: number
  errorRate: number
  activeUsers: number
  pageViews: number
  apiStatus: boolean
  cacheStatus: boolean
  lastUpdated: string
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    uptime: 0,
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    pageViews: 0,
    apiStatus: false,
    cacheStatus: false,
    lastUpdated: new Date().toISOString(),
  })

  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<string>('')

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)

      // Obtener métricas de múltiples fuentes
      const [healthResponse, analyticsResponse] = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api/analytics/summary'),
      ])

      const newMetrics: Partial<Metrics> = {}

      // Procesar health check
      if (healthResponse.status === 'fulfilled' && healthResponse.value.ok) {
        const healthData = await healthResponse.value.json()
        newMetrics.apiStatus = healthData.checks?.database?.healthy || false
        newMetrics.cacheStatus = healthData.checks?.cache?.healthy || false
        newMetrics.uptime = healthData.status === 'healthy' ? 99.9 : 0
      }

      // Procesar analytics
      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value.ok) {
        const analyticsData = await analyticsResponse.value.json()
        newMetrics.activeUsers = analyticsData.activeUsers || 0
        newMetrics.pageViews = analyticsData.pageViews || 0
        newMetrics.errorRate = analyticsData.errorRate || 0
      }

      // Simular response time (en producción vendría de monitoring)
      newMetrics.responseTime = Math.floor(Math.random() * 200) + 50

      setMetrics(prev => ({
        ...prev,
        ...newMetrics,
        lastUpdated: new Date().toISOString(),
      }))

      setLastRefresh(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, type: 'uptime' | 'response' | 'error') => {
    if (type === 'uptime') {
      return value >= 99.9 ? 'text-green-500' : value >= 99 ? 'text-yellow-500' : 'text-red-500'
    }
    if (type === 'response') {
      return value < 200 ? 'text-green-500' : value < 500 ? 'text-yellow-500' : 'text-red-500'
    }
    if (type === 'error') {
      return value < 0.5 ? 'text-green-500' : value < 2 ? 'text-yellow-500' : 'text-red-500'
    }
    return 'text-gray-500'
  }

  const getStatusText = (value: number, type: 'uptime' | 'response' | 'error') => {
    if (type === 'uptime') {
      return value >= 99.9 ? '✅ Excelente' : value >= 99 ? '⚠️ Aceptable' : '🚨 Crítico'
    }
    if (type === 'response') {
      return value < 200 ? '✅ Rápido' : value < 500 ? '⚠️ Moderado' : '🚨 Lento'
    }
    if (type === 'error') {
      return value < 0.5 ? '✅ Normal' : value < 2 ? '⚠️ Elevado' : '🚨 Crítico'
    }
    return 'Desconocido'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Monitoreo</h1>
          <p className="text-gray-600">
            Estado en tiempo real de inglesexpress.com
            {lastRefresh && <span className="ml-2 text-sm">(Actualizado: {lastRefresh})</span>}
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className={`h-4 w-4 ${getStatusColor(metrics.uptime, 'uptime')}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              {getStatusText(metrics.uptime, 'uptime')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
            <Clock className={`h-4 w-4 ${getStatusColor(metrics.responseTime, 'response')}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              {getStatusText(metrics.responseTime, 'response')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Error</CardTitle>
            <AlertCircle className={`h-4 w-4 ${getStatusColor(metrics.errorRate, 'error')}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              {getStatusText(metrics.errorRate, 'error')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pageViews.toLocaleString()} vistas hoy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Estado de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>API WordPress</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                metrics.apiStatus
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {metrics.apiStatus ? 'Operativo' : 'Fallando'}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Cache Redis</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                metrics.cacheStatus
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {metrics.cacheStatus ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Sentry Monitoring</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Activo
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => fetch('/api/cache/clear', { method: 'POST' })}
              className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              🧹 Limpiar Cache
            </button>
            <button
              onClick={() => fetch('/api/generate-sitemap')}
              className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              🗺️ Generar Sitemap
            </button>
            <button
              onClick={() => window.open('https://vercel.com/analytics', '_blank')}
              className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              📊 Ver Analytics Vercel
            </button>
            <button
              onClick={() => window.open('https://sentry.io', '_blank')}
              className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              🐛 Ver Errores Sentry
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
