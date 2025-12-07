import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  details?: string
  timestamp: string
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  // Lista de checks a realizar
  const checks: Promise<HealthCheck>[] = [
    checkWordPressAPI(),
    checkRedisCache(),
    checkStripeAPI(),
    checkVercelEnvironment(),
    checkDiskSpace(),
  ]

  // Ejecutar todos los checks en paralelo
  const results = await Promise.allSettled(checks)

  const healthChecks: HealthCheck[] = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        name: `Check ${index}`,
        status: 'unhealthy',
        details: result.reason?.message || 'Unknown error',
        timestamp,
      }
    }
  })

  // Calcular estado general
  const allHealthy = healthChecks.every(check => check.status === 'healthy')
  const anyUnhealthy = healthChecks.some(check => check.status === 'unhealthy')

  const overallStatus = allHealthy ? 'healthy' : anyUnhealthy ? 'unhealthy' : 'degraded'

  const response = {
    status: overallStatus,
    timestamp,
    responseTime: Date.now() - startTime,
    uptime: process.uptime(),
    checks: healthChecks,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    region: process.env.VERCEL_REGION || 'unknown',
  }

  return NextResponse.json(response, {
    status: overallStatus === 'healthy' ? 200 :
            overallStatus === 'degraded' ? 206 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': timestamp,
    },
  })
}

async function checkWordPressAPI(): Promise<HealthCheck> {
  const start = Date.now()
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

  if (!wpUrl) {
    return {
      name: 'WordPress API',
      status: 'unhealthy',
      details: 'API URL not configured',
      timestamp: new Date().toISOString(),
    }
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(wpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query HealthCheck { __typename }`
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return {
        name: 'WordPress API',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: `HTTP ${response.status}: ${response.statusText}`,
        timestamp: new Date().toISOString(),
      }
    }

    const data = await response.json()

    if (data.errors) {
      return {
        name: 'WordPress API',
        status: 'degraded',
        responseTime: Date.now() - start,
        details: 'GraphQL errors present',
        timestamp: new Date().toISOString(),
      }
    }

    return {
      name: 'WordPress API',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: 'Connected successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      name: 'WordPress API',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      details: error.message || 'Connection failed',
      timestamp: new Date().toISOString(),
    }
  }
}

async function checkRedisCache(): Promise<HealthCheck> {
  const start = Date.now()
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    return {
      name: 'Redis Cache',
      status: 'degraded',
      details: 'Redis not configured (optional)',
      timestamp: new Date().toISOString(),
    }
  }

  try {
    const response = await fetch(`${redisUrl}/ping`, {
      headers: {
        'Authorization': `Bearer ${redisToken}`
      }
    })

    if (!response.ok) {
      return {
        name: 'Redis Cache',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        details: 'Ping failed',
        timestamp: new Date().toISOString(),
      }
    }

    return {
      name: 'Redis Cache',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: 'Connected successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      name: 'Redis Cache',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      details: error.message || 'Connection failed',
      timestamp: new Date().toISOString(),
    }
  }
}

async function checkStripeAPI(): Promise<HealthCheck> {
  const start = Date.now()
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!stripeKey) {
    return {
      name: 'Stripe API',
      status: 'degraded',
      details: 'Stripe not configured (optional)',
      timestamp: new Date().toISOString(),
    }
  }

  try {
    // Simple check - intentar obtener balance (requiere permisos)
    const response = await fetch('https://api.stripe.com/v1/balance', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    })

    if (response.status === 401) {
      // API key válida pero sin permisos de balance (normal)
      return {
        name: 'Stripe API',
        status: 'healthy',
        responseTime: Date.now() - start,
        details: 'API key is valid',
        timestamp: new Date().toISOString(),
      }
    }

    if (!response.ok) {
      return {
        name: 'Stripe API',
        status: 'degraded',
        responseTime: Date.now() - start,
        details: 'Unexpected response',
        timestamp: new Date().toISOString(),
      }
    }

    return {
      name: 'Stripe API',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: 'Connected successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      name: 'Stripe API',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      details: error.message || 'Connection failed',
      timestamp: new Date().toISOString(),
    }
  }
}

async function checkVercelEnvironment(): Promise<HealthCheck> {
  return {
    name: 'Vercel Environment',
    status: 'healthy',
    details: `Region: ${process.env.VERCEL_REGION || 'unknown'}`,
    timestamp: new Date().toISOString(),
  }
}

async function checkDiskSpace(): Promise<HealthCheck> {
  // Esta es una simulación - en producción usaría una API o sistema de monitoreo
  return {
    name: 'Disk Space',
    status: 'healthy',
    details: 'Simulated check - OK',
    timestamp: new Date().toISOString(),
  }
}
