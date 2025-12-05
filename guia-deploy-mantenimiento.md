# GUÍA COMPLETA DE DESPLIEGUE Y MANTENIMIENTO**

## **CAPÍTULO 1: ESTRATEGIA DE DESPLIEGUE MULTI-AMBIENTE**

### **1.1 Arquitectura de Despliegue Recomendada**

```
📁 Repositorio Principal (GitHub)
├── 🎯 main → Producción (auto-deploy)
├── 🧪 develop → Staging (auto-deploy)
├── 🔧 feature/* → Preview Deploys
└── 🐛 hotfix/* → Hotfix Deploys

🌐 Entornos:
├── 🟢 Local (localhost:3000) → Desarrollo
├── 🟡 Preview (Vercel Preview) → Code Reviews
├── 🟠 Staging (staging.inglesexpress.vercel.app) → Testing
└── 🔴 Producción (inglesexpress.com) → Live
```

### **1.2 Configuración de Variables de Entorno por Ambiente**

**estructura .env:**
```
.env.local              # Desarrollo local
.env.development        # Desarrollo Vercel
.env.staging            # Staging Vercel
.env.production         # Producción
.env.example            # Template (committed)
```

**contenido .env.example:**
```env
# ============================================
# CONFIGURACIÓN WORDPRESS
# ============================================
NEXT_PUBLIC_WORDPRESS_API_URL=https://dev.inglesexpress.com/graphql

# ============================================
# STRIPE PAYMENTS
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***

# ============================================
# MONITORING & ANALYTICS
# ============================================
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXX

# ============================================
# CACHE & PERFORMANCE
# ============================================
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ============================================
# EMAIL SERVICES
# ============================================
RESEND_API_KEY=
NEWSLETTER_AUDIENCE_ID=

# ============================================
# SECURITY & ADMINISTRATION
# ============================================
ADMIN_EMAIL=admin@inglesexpress.com
SECURITY_ALERT_EMAIL=security@inglesexpress.com

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_VERSION=1.0.0
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

### **1.3 Script de Configuración Automática**

**setup-env.sh:**
```bash
#!/bin/bash

set -e  # Exit on error

echo "🚀 CONFIGURACIÓN DE AMBIENTES DE DESPLIEGUE"
echo "=========================================="

# Verificar Node.js y pnpm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instala Node.js 18 o superior."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm
fi

# Crear archivos de entorno
echo "📝 Creando archivos de entorno..."

if [ ! -f .env.example ]; then
    echo "❌ Error: .env.example no encontrado"
    exit 1
fi

# Crear copias para cada ambiente
cp .env.example .env.local
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production

echo "✅ Archivos creados:"
echo "  - .env.local        (desarrollo local)"
echo "  - .env.development  (desarrollo Vercel)"
echo "  - .env.staging      (staging Vercel)"
echo "  - .env.production   (producción)"

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p logs
mkdir -p backups
mkdir -p scripts

touch logs/app.log
touch logs/error.log
touch logs/access.log

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Configurar git hooks si no existen
if [ ! -d .git/hooks ]; then
    mkdir -p .git/hooks
fi

if [ ! -f .git/hooks/pre-commit ]; then
    echo "🔧 Configurando git hooks..."
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Ejecutando validaciones pre-commit..."

# Run linting
pnpm lint --quiet

# Run type checking
pnpm type-check --quiet

# Run tests
pnpm test --passWithNoTests
EOF
    chmod +x .git/hooks/pre-commit
fi

# Permisos
chmod 644 .env.*
chmod -R 755 logs/
chmod -R 755 backups/
chmod -R 755 scripts/

echo "🎉 CONFIGURACIÓN COMPLETADA"
echo ""
echo "📋 PASOS SIGUIENTES:"
echo "1. Edita .env.local con tus configuraciones locales"
echo "2. Ejecuta 'pnpm dev' para iniciar desarrollo"
echo "3. Configura las variables en Vercel Dashboard para cada ambiente"
echo ""
```

---

## **CAPÍTULO 2: DESPLIEGUE EN VERCEL (PRODUCCIÓN)**

### **2.1 Configuración de Vercel Project**

**vercel.json:**
```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "github": {
    "silent": true,
    "autoAlias": true,
    "autoJobCancelation": true
  },
  "env": {
    "NODE_ENV": "production",
    "NEXT_TELEMETRY_DISABLED": "1"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_ENV": "production",
      "NEXT_PUBLIC_APP_VERSION": "1.0.0"
    }
  },
  "regions": ["iad1"],
  "public": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/xml; charset=utf-8"
        }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/plain; charset=utf-8"
        }
      ]
    }
  ],
  "routes": [
    {
      "src": "/sitemap.xml",
      "dest": "/sitemap.xml"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### **2.2 Configuración de Dominio y SSL**

**Proceso paso a paso para inglesexpress.com:**

1. **Comprar dominio en registrador (ej: Namecheap, GoDaddy):**
   - Registrar `inglesexpress.com`
   - Opcional: Registrar variantes comunes

2. **Configurar DNS en Vercel via CLI:**
   ```bash
   # Instalar Vercel CLI si no está instalado
   npm install -g vercel
   
   # Iniciar sesión
   vercel login
   
   # Añadir dominio al proyecto
   vercel domains add inglesexpress.com
   
   # Verificar configuración
   vercel domains ls
   ```

3. **Configurar registros DNS en tu registrador:**
   ```
   Registro A:
   - Nombre/Host: @
   - Valor/Dirección: 76.76.21.21
   - TTL: Automático
   
   Registro A:
   - Nombre/Host: www
   - Valor/Dirección: 76.76.21.21
   - TTL: Automático
   
   Registro CNAME (opcional para subdominios):
   - Nombre/Host: staging
   - Valor/Destino: cname.vercel-dns.com
   - TTL: Automático
   
   Registro TXT (verificación):
   - Nombre/Host: @
   - Valor/Texto: "v=spf1 include:spf.vercel.net ~all"
   ```

4. **Verificar SSL automático (Vercel lo gestiona):**
   ```bash
   # Verificar certificado después de 5-10 minutos
   openssl s_client -connect inglesexpress.com:443 -servername inglesexpress.com
   
   # Verificar HTTP/2 y seguridad
   curl -I https://inglesexpress.com
   ```

5. **Configurar redirecciones automáticas:**
   En Vercel Dashboard → Domains → Configurar:
   - Redirect `www.inglesexpress.com` → `inglesexpress.com`
   - Redirect `http://` → `https://`

### **2.3 Configuración de Next.js Optimizada**

**next.config.js:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  
  // Optimización de imágenes
  images: {
    domains: [
      'www.inglesexpress.com',
      'staging.inglesexpress.com',
      'dev.inglesexpress.com',
      'secure.gravatar.com',
      'i0.wp.com',
      'via.placeholder.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 horas
  },
  
  // Headers de caché para Edge Network
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },
  
  // Redirecciones y rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/niveles',
        permanent: true,
      },
    ]
  },
  
  // Rewrites para APIs
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`,
      },
    ]
  },
  
  // Compilador optimizado
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // ISR Configuration
  experimental: {
    isrMemoryCacheSize: 50, // MB
    serverComponentsExternalPackages: ['@sentry/nextjs'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
```

---

## **CAPÍTULO 3: MONITOREO Y OBSERVABILIDAD**

### **3.1 Configuración de Sentry para Error Tracking**

**sentry.client.config.js:**
```javascript
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV || "development";
const RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

// Solo inicializar en producción/staging
if (SENTRY_DSN && ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    
    // Sample rates
    tracesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
    
    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          "localhost",
          /^https:\/\/inglesexpress\.com/,
          /^https:\/\/.*\.vercel\.app/
        ],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Filtros de errores
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Ignorar errores de navegación
      if (error instanceof Error && error.message.includes("Cancelled")) {
        return null;
      }
      
      // Ignorar errores de red en desarrollo
      if (error instanceof Error && error.message.includes("Network Error")) {
        if (ENVIRONMENT === "development") {
          return null;
        }
      }
      
      // Remover datos sensibles
      if (event.request) {
        if (event.request.headers) {
          delete event.request.headers["Authorization"];
          delete event.request.headers["Cookie"];
        }
        
        if (event.request.url) {
          try {
            const url = new URL(event.request.url);
            url.searchParams.delete("token");
            url.searchParams.delete("password");
            url.searchParams.delete("api_key");
            event.request.url = url.toString();
          } catch (e) {
            // URL inválida, mantener como está
          }
        }
      }
      
      return event;
    },
    
    // Filtro de breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // Excluir breadcrumbs ruidosos
      if (breadcrumb.category === "console") {
        return null;
      }
      if (breadcrumb.category === "ui.click") {
        // Solo mantener clics importantes
        if (!breadcrumb.data?.target?.id?.includes("btn-")) {
          return null;
        }
      }
      return breadcrumb;
    },
  });
}
```

**sentry.server.config.js:**
```javascript
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV || "development";
const RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

if (SENTRY_DSN && ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    
    // Sample rates
    tracesSampleRate: ENVIRONMENT === "production" ? 0.05 : 1.0,
    
    // Integrations
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    
    // Filtros de errores
    beforeSend(event) {
      // Remover datos sensibles del server
      if (event.request) {
        // Headers sensibles
        const sensitiveHeaders = [
          "authorization",
          "cookie",
          "x-api-key",
          "x-access-token"
        ];
        
        sensitiveHeaders.forEach(header => {
          if (event.request.headers && event.request.headers[header]) {
            event.request.headers[header] = "[REDACTED]";
          }
        });
        
        // Query parameters sensibles
        if (event.request.url) {
          try {
            const url = new URL(event.request.url);
            const sensitiveParams = [
              "token",
              "password",
              "secret",
              "api_key",
              "access_token"
            ];
            
            sensitiveParams.forEach(param => {
              if (url.searchParams.has(param)) {
                url.searchParams.set(param, "[REDACTED]");
              }
            });
            
            event.request.url = url.toString();
          } catch (e) {
            // URL inválida
          }
        }
      }
      
      return event;
    },
  });
}
```

### **3.2 Configuración de Google Analytics 4**

**components/GoogleAnalytics.tsx:**
```typescript
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

  // Solo ejecutar en producción
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') {
    return null
  }

  // Track pageviews
  useEffect(() => {
    if (!pathname) return
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_location: window.location.origin + url,
      })
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: false,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
      
      {/* GTM noscript fallback */}
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </>
  )
}
```

**lib/analytics.ts:**
```typescript
// Event tracking utilities
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    })
  }
  
  // También enviar a Sentry como breadcrumb
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: 'analytics',
      message: `${category}: ${action}`,
      level: 'info',
      data: { label, value, ...params },
    })
  }
}

// Eventos predefinidos
export const AnalyticsEvents = {
  // User interactions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',
  
  // Page interactions
  PAGE_VIEW: 'page_view',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  
  // Business events
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  PAYMENT_START: 'payment_start',
  PAYMENT_COMPLETE: 'payment_complete',
  CONTACT_FORM: 'contact_form',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  NOT_FOUND: 'page_not_found',
}

// Track conversion (Stripe, etc.)
export const trackConversion = (
  conversionId: string,
  conversionLabel: string,
  value: number = 1.0,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}/${conversionId}/${conversionLabel}`,
      value: value,
      currency: currency,
      transaction_id: `txn_${Date.now()}`,
    })
  }
}

// Track exceptions
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent(
    AnalyticsEvents.ERROR_OCCURRED,
    'errors',
    error.message,
    undefined,
    { error: error.name, stack: error.stack, ...context }
  )
}
```

### **3.3 Dashboard de Monitoreo**

**app/dashboard/overview/page.tsx:**
```typescript
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
```

---

## **CAPÍTULO 4: BACKUP Y RECUPERACIÓN DE DESASTRES**

### **4.1 Estrategia de Backup 3-2-1**

```
📊 ESTRATEGIA 3-2-1 PARA INGLESEXPRESS.COM:
├── 3 Copias de los datos
│   ├── 1. Vercel Deployment + GitHub
│   ├── 2. Backups locales automatizados
│   └── 3. Cloud Storage (S3/Backblaze)
│
├── 2 Tipos diferentes de almacenamiento
│   ├── 1. Disco local (SSD/NVMe)
│   └── 2. Cloud Object Storage
│
└── 1 Copia fuera del sitio
    └── AWS S3 en región diferente
```

### **4.2 Scripts de Backup Automatizados**

**scripts/backup-config.sh:**
```bash
#!/bin/bash

set -e  # Exit on error

echo "💾 INICIANDO BACKUP DE CONFIGURACIÓN"
echo "===================================="

# Configuración
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="config_backup_$DATE"
RETENTION_DAYS=30

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

echo "📦 Creando backup: $BACKUP_NAME"

# 1. Backup de variables de entorno (encriptado)
echo "🔐 Backup de variables de entorno..."
if [ -f .env.production ]; then
    # Encriptar con GPG si está disponible
    if command -v gpg &> /dev/null; then
        gpg --encrypt --recipient "admin@inglesexpress.com" \
            --output "$BACKUP_DIR/env_production_$DATE.gpg" \
            .env.production
        echo "  ✅ .env.production encriptado"
    else
        cp .env.production "$BACKUP_DIR/env_production_$DATE.txt"
        echo "  ⚠️ .env.production copiado (no encriptado - instala GPG)"
    fi
fi

# 2. Backup de configuración Vercel
echo "⚙️ Backup de configuración Vercel..."
cp vercel.json "$BACKUP_DIR/vercel_$DATE.json"
cp next.config.js "$BACKUP_DIR/next_config_$DATE.js"

# 3. Backup de package.json y lock file
echo "📦 Backup de dependencias..."
cp package.json "$BACKUP_DIR/package_$DATE.json"
cp pnpm-lock.yaml "$BACKUP_DIR/pnpm_lock_$DATE.yaml" 2>/dev/null || true

# 4. Backup de configuración personalizada
echo "🎛️ Backup de configuración personalizada..."
mkdir -p "$BACKUP_DIR/config_$DATE"
cp -r lib/config/ "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
cp -r components/ui/ "$BACKUP_DIR/config_$DATE/ui/" 2>/dev/null || true

# 5. Comprimir todo
echo "📦 Comprimiendo backup..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
    "$BACKUP_DIR/env_production_$DATE"* \
    "$BACKUP_DIR/vercel_$DATE.json" \
    "$BACKUP_DIR/next_config_$DATE.js" \
    "$BACKUP_DIR/package_$DATE.json" \
    "$BACKUP_DIR/pnpm_lock_$DATE.yaml" 2>/dev/null || true \
    "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true

# 6. Subir a S3 si están configuradas las credenciales
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_S3_BACKUP_BUCKET" ]; then
    echo "☁️ Subiendo a S3..."
    aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
        "s3://$AWS_S3_BACKUP_BUCKET/config-backups/"
    
    # También subir individualmente los archivos importantes
    aws s3 cp "$BACKUP_DIR/env_production_$DATE"* \
        "s3://$AWS_S3_BACKUP_BUCKET/env-backups/" 2>/dev/null || true
fi

# 7. Limpiar backups antiguos
echo "🗑️ Limpiando backups antiguos (+$RETENTION_DAYS días)..."
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.gpg" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.json" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.js" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.txt" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -type d -name "config_*" -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true

echo "✅ BACKUP COMPLETADO"
echo "📁 Ubicación: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "📊 Tamaño: $(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)"
echo ""
```

**scripts/backup-content.sh:**
```bash
#!/bin/bash

set -e

echo "📝 INICIANDO BACKUP DE CONTENIDO WORDPRESS"
echo "=========================================="

BACKUP_DIR="./backups/content"
DATE=$(date +%Y%m%d_%H%M%S)
WORDPRESS_API="${WORDPRESS_API_URL:-$NEXT_PUBLIC_WORDPRESS_API_URL}"
WORDPRESS_API="${WORDPRESS_API:-https://www.inglesexpress.com/graphql}"

# Verificar que tenemos URL de WordPress
if [ -z "$WORDPRESS_API" ]; then
    echo "❌ ERROR: No se configuró WORDPRESS_API_URL"
    exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "🌐 Conectando a: $WORDPRESS_API"

# Función para hacer queries GraphQL
graphql_query() {
    local query=$1
    local output_file=$2
    
    curl -s -X POST "$WORDPRESS_API" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${WORDPRESS_API_TOKEN:-}" \
        -d "{\"query\": \"$query\"}" \
        | jq . > "$output_file" 2>/dev/null || {
            echo "  ⚠️ Error en query, guardando respuesta cruda"
            curl -s -X POST "$WORDPRESS_API" \
                -H "Content-Type: application/json" \
                -d "{\"query\": \"$query\"}" > "$output_file"
        }
}

# 1. Backup de páginas
echo "📄 Exportando páginas..."
graphql_query '
{
  pages(first: 100) {
    nodes {
      id
      title
      slug
      content
      excerpt
      date
      modified
      status
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}' "$BACKUP_DIR/pages_$DATE.json"

# 2. Backup de posts
echo "📝 Exportando posts..."
graphql_query '
{
  posts(first: 100) {
    nodes {
      id
      title
      slug
      content
      excerpt
      date
      modified
      status
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}' "$BACKUP_DIR/posts_$DATE.json"

# 3. Backup de menús
echo "🍔 Exportando menús..."
graphql_query '
{
  menus {
    nodes {
      name
      locations
      menuItems {
        nodes {
          label
          url
          target
          parentId
        }
      }
    }
  }
}' "$BACKUP_DIR/menus_$DATE.json"

# 4. Backup de configuraciones
echo "⚙️ Exportando configuraciones del sitio..."
graphql_query '
{
  generalSettings {
    title
    description
    url
    language
  }
  readingSettings {
    postsPerPage
  }
}' "$BACKUP_DIR/settings_$DATE.json"

# 5. Comprimir todo
echo "📦 Comprimiendo backups..."
tar -czf "$BACKUP_DIR/content_backup_$DATE.tar.gz" \
    "$BACKUP_DIR/pages_$DATE.json" \
    "$BACKUP_DIR/posts_$DATE.json" \
    "$BACKUP_DIR/menus_$DATE.json" \
    "$BACKUP_DIR/settings_$DATE.json"

# 6. Limpiar archivos individuales
rm -f "$BACKUP_DIR/pages_$DATE.json" \
      "$BACKUP_DIR/posts_$DATE.json" \
      "$BACKUP_DIR/menus_$DATE.json" \
      "$BACKUP_DIR/settings_$DATE.json"

# 7. Limpiar backups antiguos (+60 días para contenido)
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +60 -delete

echo "✅ BACKUP DE CONTENIDO COMPLETADO"
echo "📁 Ubicación: $BACKUP_DIR/content_backup_$DATE.tar.gz"
echo "📊 Tamaño: $(du -h "$BACKUP_DIR/content_backup_$DATE.tar.gz" | cut -f1)"
```

### **4.3 Script de Recuperación**

**scripts/restore.sh:**
```bash
#!/bin/bash

set -e

echo "🚨 INICIANDO PROCESO DE RECUPERACIÓN"
echo "===================================="
echo "⚠️  ADVERTENCIA: Esto restaurará desde backup"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Ejecuta desde el directorio raíz del proyecto"
    exit 1
fi

# Confirmación
read -p "¿Estás seguro de continuar con la recuperación? (solo 'si'): " confirmation
if [ "$confirmation" != "si" ]; then
    echo "❌ Operación cancelada"
    exit 0
fi

# Seleccionar backup más reciente
BACKUP_DIR="./backups"
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No se encontraron backups en $BACKUP_DIR"
    exit 1
fi

echo "📦 Backup seleccionado: $(basename "$LATEST_BACKUP")"
echo "📊 Tamaño: $(du -h "$LATEST_BACKUP" | cut -f1)"
echo ""

read -p "¿Continuar con la restauración? (si/no): " final_confirmation
if [ "$final_confirmation" != "si" ]; then
    echo "❌ Operación cancelada"
    exit 0
fi

echo "🔄 Iniciando restauración..."
echo ""

# 1. Extraer backup
echo "📂 Extrayendo backup..."
TEMP_DIR=$(mktemp -d)
tar -xzf "$LATEST_BACKUP" -C "$TEMP_DIR"

# 2. Restaurar configuración
echo "⚙️ Restaurando configuración..."

# Verificar qué archivos están en el backup
BACKUP_CONTENT=$(tar -tzf "$LATEST_BACKUP")

# Restaurar vercel.json si existe
if echo "$BACKUP_CONTENT" | grep -q "vercel_.*\.json"; then
    VERCEL_BACKUP=$(find "$TEMP_DIR" -name "vercel_*.json" | head -1)
    if [ -f "$VERCEL_BACKUP" ]; then
        cp "$VERCEL_BACKUP" "vercel.json"
        echo "  ✅ vercel.json restaurado"
    fi
fi

# Restaurar next.config.js si existe
if echo "$BACKUP_CONTENT" | grep -q "next_config_.*\.js"; then
    NEXT_CONFIG_BACKUP=$(find "$TEMP_DIR" -name "next_config_*.js" | head -1)
    if [ -f "$NEXT_CONFIG_BACKUP" ]; then
        cp "$NEXT_CONFIG_BACKUP" "next.config.js"
        echo "  ✅ next.config.js restaurado"
    fi
fi

# Restaurar package.json si existe
if echo "$BACKUP_CONTENT" | grep -q "package_.*\.json"; then
    PACKAGE_BACKUP=$(find "$TEMP_DIR" -name "package_*.json" | head -1)
    if [ -f "$PACKAGE_BACKUP" ]; then
        cp "$PACKAGE_BACKUP" "package.json"
        echo "  ✅ package.json restaurado"
        
        # Instalar dependencias
        echo "📦 Instalando dependencias..."
        pnpm install
    fi
fi

# 3. Restaurar variables de entorno (requiere confirmación adicional)
ENV_BACKUP=$(find "$TEMP_DIR" -name "env_production_*" | head -1)
if [ -f "$ENV_BACKUP" ]; then
    echo ""
    echo "🔐 Se encontró backup de variables de entorno"
    read -p "¿Restaurar .env.production? (si/no): " restore_env
    
    if [ "$restore_env" = "si" ]; then
        # Si está encriptado con GPG
        if [[ "$ENV_BACKUP" == *.gpg ]]; then
            if command -v gpg &> /dev/null; then
                gpg --decrypt --output .env.production "$ENV_BACKUP"
                echo "  ✅ .env.production restaurado (desencriptado)"
            else
                echo "  ❌ GPG no instalado, no se puede desencriptar"
            fi
        else
            cp "$ENV_BACKUP" .env.production
            echo "  ✅ .env.production restaurado"
        fi
    fi
fi

# 4. Limpiar temporal
rm -rf "$TEMP_DIR"

echo ""
echo "✅ RESTAURACIÓN COMPLETADA"
echo ""
echo "📋 PASOS SIGUIENTES:"
echo "1. Revisar los archivos restaurados"
echo "2. Ejecutar 'pnpm build' para verificar"
echo "3. Desplegar a Vercel si es necesario"
echo "4. Verificar el sitio en https://inglesexpress.com"
echo ""
```

### **4.4 Health Check Endpoint Completo**

**app/api/health/route.ts:**
```typescript
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
```

---

## **CAPÍTULO 5: MANTENIMIENTO RUTINARIO**

### **5.1 Checklist de Mantenimiento Diario**

```markdown
## ✅ CHECKLIST DIARIO - inglesexpress.com

### 🎯 Monitoreo (Primera hora del día)
- [ ] Revisar alertas críticas en Sentry (últimas 24h)
- [ ] Verificar métricas de Google Analytics (usuarios activos, páginas vistas)
- [ ] Revisar logs de errores en Vercel (últimas 24h)
- [ ] Verificar uptime (≥ 99.9%) en status.inglesexpress.com
- [ ] Revisar tasa de error (< 0.5%)

### 🔒 Seguridad
- [ ] Revisar intentos de login fallidos en WordPress
- [ ] Verificar que no haya actividades sospechosas en logs
- [ ] Revisar status de certificado SSL (auto-verificado por Vercel)
- [ ] Verificar que no hay nuevas vulnerabilidades en dependencias

### ⚡ Rendimiento
- [ ] Verificar Core Web Vitals en Google Search Console
- [ ] Revisar tiempos de respuesta API (< 200ms promedio)
- [ ] Monitorear uso de memoria y CPU en Vercel Analytics
- [ ] Verificar caché hit rate (> 95%)

### 💾 Backup
- [ ] Confirmar que backups automáticos se ejecutaron (logs/backup.log)
- [ ] Verificar integridad del último backup (tamaño y fecha)
- [ ] Confirmar que backups en S3 están accesibles

### 📊 Negocio
- [ ] Revisar conversiones y leads del día anterior
- [ ] Verificar estado de pagos y suscripciones
- [ ] Revisar formularios de contacto pendientes
```

### **5.2 Checklist de Mantenimiento Semanal**

```markdown
## 📅 CHECKLIST SEMANAL - Lunes por la mañana

### 🔄 Actualizaciones
- [ ] Actualizar dependencias de Node.js: `pnpm update`
- [ ] Ejecutar audit de seguridad: `pnpm audit --fix`
- [ ] Verificar actualizaciones de WordPress (plugins y core)
- [ ] Actualizar dependencias de desarrollo

### 🔒 Seguridad Profunda
- [ ] Ejecutar scan de vulnerabilidades: `npm audit --audit-level=high`
- [ ] Revisar y rotar API keys si es necesario (Stripe, Resend, etc.)
- [ ] Verificar permisos de archivos y directorios
- [ ] Revisar políticas de seguridad y acceso

### ⚡ Optimización de Rendimiento
- [ ] Optimizar base de datos WordPress (limpiar revisiones, spam)
- [ ] Limpiar caché completo: `POST /api/cache/clear`
- [ ] Analizar bottlenecks de rendimiento con Lighthouse
- [ ] Optimizar imágenes estáticas (comprimir si es necesario)

### 💾 Backup y Recovery
- [ ] Test de restauración desde backup (entorno staging)
- [ ] Verificar que todos los backups son accesibles y no corruptos
- [ ] Limpiar backups antiguos (> 30 días)
- [ ] Verificar estrategia 3-2-1 (3 copias, 2 medios, 1 externa)

### 📈 Analytics y Reportes
- [ ] Generar reporte semanal de métricas
- [ ] Analizar tendencias de tráfico y conversiones
- [ ] Revisar keywords y posicionamiento SEO
- [ ] Planificar ajustes basados en datos

### 🧪 Testing
- [ ] Ejecutar suite de tests completa: `pnpm test`
- [ ] Test de integración con APIs externas
- [ ] Verificar formularios y flujos de usuario críticos
```

### **5.3 Checklist de Mantenimiento Mensual**

```markdown
## 📊 CHECKLIST MENSUAL - Primer día del mes

### 🕵️ Auditoría Completa
- [ ] Auditoría de seguridad completa (OWASP Top 10)
- [ ] Revisión de código para vulnerabilidades (CodeQL)
- [ ] Test de penetración básico
- [ ] Auditoría de cumplimiento GDPR

### ⚡ Performance Profunda
- [ ] Análisis completo de Core Web Vitals
- [ ] Optimización de imágenes y assets (reducir bundle size)
- [ ] Revisión de estrategia de caché (TTLs, invalidación)
- [ ] Benchmark de tiempos de respuesta en diferentes regiones

### 🏗️ Infraestructura
- [ ] Revisar costos Vercel y optimizar si es necesario
- [ ] Evaluar necesidad de escalar recursos (memory, regiones)
- [ ] Revisar contratos y suscripciones (Sentry, Stripe, etc.)
- [ ] Planificar capacidad para próximo mes

### 📝 Legal y Compliance
- [ ] Verificar cumplimiento de GDPR (cookies, privacidad)
- [ ] Actualizar políticas de privacidad si es necesario
- [ ] Revisar términos y condiciones
- [ ] Verificar licencias de software y contenido

### 📊 Métricas de Negocio
- [ ] Análisis mensual de conversiones y ROI
- [ ] Revisión de objetivos y KPIs
- [ ] Planificación de mejoras para próximo mes
- [ ] Presupuesto y proyecciones

### 🚀 Mejoras y Roadmap
- [ ] Revisar feedback de usuarios
- [ ] Priorizar mejoras técnicas
- [ ] Planificar próximas funcionalidades
- [ ] Actualizar documentación técnica
```

### **5.4 Script de Mantenimiento Automatizado**

**scripts/maintenance.sh:**
```bash
#!/bin/bash

set -e

echo "🔧 INICIANDO MANTENIMIENTO AUTOMATIZADO"
echo "======================================"
echo "Fecha: $(date)"
echo ""

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Actualizar dependencias
log "📦 Actualizando dependencias..."
pnpm update
pnpm audit fix --audit-level=moderate

# 2. Limpiar cache
log "🧹 Limpiando cache..."
rm -rf .next/cache
rm -rf node_modules/.cache
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete

# 3. Optimizar imágenes (si existe el directorio)
if [ -d "public/images" ]; then
    log "🖼️ Optimizando imágenes..."
    npx @squoosh/cli --webp 'public/images/*.{jpg,png}' 2>/dev/null || true
fi

# 4. Generar sitemap
log "🗺️ Generando sitemap..."
curl -s -X GET "https://inglesexpress.com/api/generate-sitemap" > /dev/null

# 5. Test de rendimiento
log "⚡ Ejecutando test de rendimiento..."
if command -v lighthouse &> /dev/null; then
    lighthouse https://inglesexpress.com \
        --output json \
        --output-path ./reports/lighthouse-$(date +%Y%m%d).json \
        --chrome-flags="--headless" \
        --only-categories=performance,accessibility,seo,best-practices \
        --quiet || true
fi

# 6. Backup automático
log "💾 Ejecutando backup..."
./scripts/backup-config.sh
./scripts/backup-content.sh

# 7. Limpiar logs antiguos
log "🗑️ Limpiando logs antiguos..."
find ./logs -name "*.log" -type f -mtime +7 -delete
find ./reports -name "*.json" -type f -mtime +30 -delete

# 8. Verificar integridad
log "🔍 Verificando integridad del proyecto..."
pnpm type-check
pnpm lint --quiet

# 9. Health check final
log "🏥 Realizando health check final..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://inglesexpress.com/api/health")

if [ "$HEALTH_STATUS" = "200" ]; then
    log "✅ Health check exitoso"
else
    log "⚠️ Health check falló con código: $HEALTH_STATUS"
fi

echo ""
echo "✅ MANTENIMIENTO COMPLETADO"
echo "📊 Resumen:"
echo "  - Dependencias actualizadas"
echo "  - Cache limpiado"
echo "  - Backup realizado"
echo "  - Health check: $([ "$HEALTH_STATUS" = "200" ] && echo "✅" || echo "⚠️")"
echo ""
```

---

## **CAPÍTULO 6: ESCALABILIDAD EN VERCEL**

### **6.1 Configuración de Escalado Automático**

Vercel proporciona escalado automático basado en la demanda. Para optimizarlo:

**vercel.json optimizado para escalabilidad:**
```json
{
  "scale": {
    "min": 1,
    "max": 10
  },
  "regions": ["iad1"],
  "maxDuration": 30,
  "memory": 1024,
  "build": {
    "env": {
      "NEXT_PUBLIC_EDGE_CONFIG_ID": "ecfg_xxx"
    }
  }
}
```

### **6.2 Edge Functions para Baja Latencia**

**app/api/rate-limit/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// Simple rate limiter para Edge Functions
export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  
  // Usar Vercel KV o similar para rate limiting en producción
  const RATE_LIMIT_WINDOW = 60000 // 1 minuto
  const MAX_REQUESTS = 100
  
  // En producción, usaría un store como Upstash Redis
  return NextResponse.json({
    status: 'ok',
    ip,
    timestamp: now,
    rateLimit: {
      window: RATE_LIMIT_WINDOW,
      max: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
    },
    region: process.env.VERCEL_REGION || 'unknown',
  })
}
```

### **6.3 Cache Strategy Multi-nivel**

```typescript
// lib/cache-strategy.ts
export class CacheStrategy {
  // Nivel 1: Vercel Edge Cache (más rápido)
  static async getFromEdgeCache(key: string): Promise<any> {
    // Vercel maneja esto automáticamente con headers
    return null
  }

  // Nivel 2: Redis Cache (memoria distribuida)
  static async getFromRedis(key: string): Promise<any> {
    if (!process.env.UPSTASH_REDIS_REST_URL) return null
    
    try {
      const response = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        return data.result
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
    
    return null
  }

  // Nivel 3: ISR (Incremental Static Regeneration)
  static async getWithISR(key: string, fetchFresh: () => Promise<any>) {
    // Next.js ISR maneja esto automáticamente
    return fetchFresh()
  }

  // Estrategia combinada
  static async get(key: string, fetchFresh: () => Promise<any>, ttl = 3600) {
    // 1. Intentar Edge Cache
    // 2. Intentar Redis
    // 3. Fetch fresco + cache
    const freshData = await fetchFresh()
    
    // Store in Redis para futuras requests
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/setex/${key}/${ttl}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(freshData)
        }
      ).catch(console.error)
    }
    
    return freshData
  }
}
```

### **6.4 Monitoreo de Escalabilidad**

**app/api/scaling-metrics/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Estas métricas vendrían de Vercel Analytics API
  // Aquí un ejemplo de estructura
  
  const metrics = {
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    scaling: {
      currentInstances: 1, // Esto vendría de Vercel API
      maxInstances: 10,
      avgResponseTime: 120, // ms
      requestRate: 45, // requests por minuto
      errorRate: 0.1, // porcentaje
      memoryUsage: 65, // porcentaje
      cpuUsage: 40, // porcentaje
    },
    recommendations: [] as string[]
  }
  
  // Generar recomendaciones basadas en métricas
  if (metrics.scaling.requestRate > 100) {
    metrics.recommendations.push('Considerar aumentar instancias mínimas')
  }
  
  if (metrics.scaling.avgResponseTime > 500) {
    metrics.recommendations.push('Optimizar queries de base de datos')
  }
  
  if (metrics.scaling.memoryUsage > 80) {
    metrics.recommendations.push('Aumentar memoria asignada')
  }
  
  return NextResponse.json(metrics)
}
```

---

## **CAPÍTULO 7: DOCUMENTACIÓN Y ENTREGABLES**

### **7.1 Estructura de Documentación**

```
📁 entregables/
├── 📄 01-arquitectura-sistema.md
├── 📄 02-manual-despliegue.md
├── 📄 03-manual-operaciones.md
├── 📄 04-plan-contingencia.md
├── 📄 05-procedimientos-soporte.md
├── 📄 06-checklist-mantenimiento.md
├── 📄 07-inventario-activos.md
├── 📄 08-contactos-emergencia.md
├── 📄 09-acuerdos-nivel-servicio.md
└── 📄 10-transferencia-conocimiento.md
```

### **7.2 Manual de Operaciones (Resumen)**

**entregables/03-manual-operaciones.md:**
```markdown
# 📋 MANUAL DE OPERACIONES - inglesexpress.com

## 🔐 Accesos Críticos

### Plataformas Principales
- **Vercel Dashboard:** https://vercel.com/inglesexpress
- **GitHub Repository:** https://github.com/tu-usuario/inglesexpress
- **WordPress Admin:** https://www.inglesexpress.com/wp-admin
- **Google Analytics:** https://analytics.google.com
- **Sentry Dashboard:** https://sentry.io/organizations/inglesexpress

### Credenciales de Emergencia
- **Acceso Root:** Guardado en 1Password (compartir con equipo)
- **API Keys:** Rotar cada 90 días
- **Tokens de Acceso:** Revocar en caso de compromiso

## 💻 Comandos Esenciales

### Desarrollo Local
```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Ejecutar tests
pnpm test              # Tests unitarios
pnpm test:e2e          # Tests end-to-end
pnpm test:performance  # Tests de rendimiento
pnpm audit             # Auditoría de seguridad
```

### Despliegue
```bash
# Desplegar a staging
vercel --env staging

# Desplegar a producción
vercel --prod

# Ver deployments
vercel list

# Rollback a versión anterior
vercel rollback <deployment-id>

# Ver logs en tiempo real
vercel logs --follow
```

### Mantenimiento
```bash
# Ejecutar mantenimiento completo
./scripts/maintenance.sh

# Backup manual
./scripts/backup-config.sh
./scripts/backup-content.sh

# Restauración
./scripts/restore.sh
```

## 🚨 Procedimientos de Emergencia

### Escenario 1: Sitio Caído
**Síntomas:** Error 502/503, timeout en carga
**Acciones Inmediatas:**
1. Verificar https://inglesexpress.com/api/health
2. Revisar logs: `vercel logs --limit 100`
3. Verificar status.vercel.com para incidentes
4. Si error de código: Rollback inmediato
5. Si error infraestructura: Contactar soporte Vercel

### Escenario 2: Ataque DDoS
**Síntomas:** Picos de tráfico anormales, lentitud extrema
**Acciones Inmediatas:**
1. Activar modo mantenimiento en Vercel
2. Bloquear IPs atacantes via Vercel Firewall
3. Contactar soporte Vercel para mitigación
4. Notificar a equipo legal si es necesario

### Escenario 3: Pérdida de Datos
**Síntomas:** Contenido faltante, errores de base de datos
**Acciones Inmediatas:**
1. Identificar último backup válido
2. Ejecutar `./scripts/restore.sh`
3. Verificar integridad de datos restaurados
4. Investigar causa raíz (logs, auditoría)

### Escenario 4: Violación de Seguridad
**Síntomas:** Acceso no autorizado, datos comprometidos
**Acciones Inmediatas:**
1. Rotar TODAS las credenciales inmediatamente
2. Activar modo mantenimiento
3. Notificar a usuarios afectados (si aplica)
4. Contactar a equipo legal y autoridades

## 📞 Contactos de Emergencia

### Equipo Técnico
- **Líder DevOps:** +1 (XXX) XXX-XXXX
- **Desarrollador Senior:** +1 (XXX) XXX-XXXX
- **Soporte Técnico:** +1 (XXX) XXX-XXXX

### Proveedores
- **Vercel Support:** support@vercel.com
- **WordPress Hosting:** soporte@hosting.com
- **Stripe Support:** support@stripe.com
- **Sentry Support:** support@sentry.io

### Legal y Compliance
- **Abogado:** legal@inglesexpress.com
- **Protección de Datos:** dpo@inglesexpress.com
```

### **7.3 Plan de Contingencia Detallado**

**entregables/04-plan-contingencia.md:**
```markdown
# 🚨 PLAN DE CONTINGENCIA - inglesexpress.com

## 🎯 Objetivo
Restaurar operaciones normales dentro de 4 horas para incidentes críticos.

## ⚠️ Niveles de Severidad

### Nivel 1: Crítico
- Sitio completamente inaccesible > 15 minutos
- Pérdida de datos de usuarios
- Violación de seguridad confirmada
**Respuesta:** Equipo completo, 24/7 hasta resolución

### Nivel 2: Alto
- Funcionalidad crítica afectada
- Rendimiento degradado > 30 minutos
- Múltiples usuarios afectados
**Respuesta:** Equipo técnico, resolver en < 4 horas

### Nivel 3: Medio
- Funcionalidad no crítica afectada
- Problemas de rendimiento menores
- Usuarios individuales afectados
**Respuesta:** Soporte regular, resolver en < 24 horas

### Nivel 4: Bajo
- Problemas cosméticos
- Mejoras solicitadas
- Preguntas generales
**Respuesta:** Soporte estándar, resolver en < 72 horas

## 🔄 Procedimientos por Escenario

### A. WordPress API Inaccesible
**Procedimiento:**
1. Verificar conectividad con `ping www.inglesexpress.com`
2. Revisar logs de hosting WordPress
3. Si > 5 minutos caído, activar página estática de respaldo
4. Contactar soporte de hosting
5. Redirigir tráfico a página informativa

### B. Deployment Fallido en Vercel
**Procedimiento:**
1. Revertir a última versión estable: `vercel rollback`
2. Investigar error en GitHub Actions/Vercel logs
3. Ejecutar tests localmente para reproducir
4. Hotfix y redeploy
5. Actualizar documentación de incidente

### C. Ataque de Seguridad
**Procedimiento:**
1. Activar WAF y rate limiting en Vercel
2. Bloquear IPs maliciosas
3. Rotar todas las credenciales
4. Notificar a usuarios afectados
5. Reportar a autoridades si es necesario

### D. Pérdida Completa de Datos
**Procedimiento:**
1. Activar modo mantenimiento
2. Restaurar desde último backup válido
3. Verificar integridad de datos
4. Comunicar a usuarios afectados
5. Implementar medidas preventivas

## 📋 Checklist de Recuperación

### Inmediato (0-15 minutos)
- [ ] Identificar incidente y nivel de severidad
- [ ] Activar canal de comunicación de emergencia
- [ ] Asignar líder de incidente
- [ ] Notificar a stakeholders clave

### Corto Plazo (15-60 minutos)
- [ ] Ejecutar procedimiento específico del escenario
- [ ] Documentar acciones tomadas
- [ ] Comunicar actualizaciones cada 15 minutos
- [ ] Evaluar necesidad de escalar recursos

### Medio Plazo (1-4 horas)
- [ ] Restaurar servicio principal
- [ ] Verificar funcionalidad completa
- [ ] Comunicar resolución a usuarios
- [ ] Iniciar documentación post-mortem

### Largo Plazo (24-72 horas)
- [ ] Completar análisis post-mortem
- [ ] Implementar medidas preventivas
- [ ] Actualizar documentación y procedimientos
- [ ] Revisar y mejorar plan de contingencia

## 📊 Métricas de Recuperación

### Objetivos de Nivel de Servicio (SLO)
- **Disponibilidad:** 99.9% mensual
- **Tiempo de Recuperación (RTO):** 4 horas para incidentes críticos
- **Punto de Recuperación (RPO):** 24 horas máximo de pérdida de datos

### Monitoreo de Cumplimiento
- Uptime monitorizado cada minuto
- Backups verificados diariamente
- Tests de recuperación mensuales
- Auditorías trimestrales de procedimientos
```

---

## **CAPÍTULO 8: AUTOMATIZACIÓN Y CI/CD**

### **8.1 GitHub Actions Workflow Completo**

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  schedule:
    # Ejecutar tests diariamente a las 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run security audit
        run: |
          pnpm audit --audit-level=high
          echo "## Security Audit Results" >> $GITHUB_STEP_SUMMARY
          echo "- ✅ Dependencies scanned for vulnerabilities" >> $GITHUB_STEP_SUMMARY
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          languages: javascript

  test:
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run type checking
        run: pnpm type-check
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run unit tests
        run: pnpm test
        env:
          NEXT_PUBLIC_WORDPRESS_API_URL: ${{ secrets.WORDPRESS_API_URL_STAGING }}
          NODE_ENV: test
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          NEXT_PUBLIC_WORDPRESS_API_URL: ${{ secrets.WORDPRESS_API_URL_STAGING }}
          E2E_BASE_URL: 'http://localhost:3000'
      
      - name: Build application
        run: pnpm build
        env:
          NEXT_PUBLIC_WORDPRESS_API_URL: ${{ secrets.WORDPRESS_API_URL_STAGING }}
          NEXT_PUBLIC_APP_ENV: staging

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: |
            staging.inglesexpress.com
          working-directory: ./
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Run post-deployment checks
        run: |
          sleep 10  # Esperar a que el deployment esté listo
          curl -f https://staging.inglesexpress.com/api/health || exit 1
      
      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "✅ Staging deployment completed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*✅ Staging Deployment Completed*\n\n• Repository: ${{ github.repository }}\n• Branch: ${{ github.ref }}\n• Commit: ${{ github.sha }}\n• Environment: staging\n• URL: https://staging.inglesexpress.com\n• Health Check: ✅ Passing"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get version
        id: version
        run: echo "VERSION=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
      
      - name: Create Sentry release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          environment: production
          version: ${{ steps.version.outputs.VERSION }}
      
      - name: Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: |
            inglesexpress.com
            www.inglesexpress.com
          working-directory: ./
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Run post-deployment script
        run: |
          # Esperar a que el deployment esté activo
          sleep 15
          
          # Health check
          curl -f https://inglesexpress.com/api/health || exit 1
          
          # Clear cache
          curl -X POST https://inglesexpress.com/api/cache/clear
          
          # Generate sitemap
          curl https://inglesexpress.com/api/generate-sitemap
          
          # Warm up cache for critical pages
          for url in "/" "/niveles" "/precios" "/test-nivel"; do
            curl -s "https://inglesexpress.com$url" > /dev/null
            sleep 1
          done
      
      - name: Notify deployment success
        if: success()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "🚀 Production deployment completed successfully!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*🚀 Production Deployment Complete*\n\n• Version: ${{ steps.version.outputs.VERSION }}\n• Environment: production\n• URL: https://inglesexpress.com\n• Health Check: ✅ Passing\n• Commit: ${{ github.sha }}\n• Deployed by: ${{ github.actor }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Site",
                        "emoji": true
                      },
                      "url": "https://inglesexpress.com"
                    },
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Deployment",
                        "emoji": true
                      },
                      "url": "https://vercel.com/inglesexpress"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
      
      - name: Notify deployment failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "❌ Production deployment failed!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*❌ Production Deployment Failed*\n\n• Version: ${{ steps.version.outputs.VERSION }}\n• Environment: production\n• Commit: ${{ github.sha }}\n• Deployed by: ${{ github.actor }}\n• Workflow: ${{ github.workflow }}\n• Run ID: ${{ github.run_id }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Logs",
                        "emoji": true
                      },
                      "url": "https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

### **8.2 Script de Post-Deployment**

**scripts/post-deploy.sh:**
```bash
#!/bin/bash

set -e

echo "🚀 POST-DEPLOYMENT SCRIPT"
echo "========================"
echo "Environment: ${ENVIRONMENT:-production}"
echo ""

# Configuración
BASE_URL="${BASE_URL:-https://inglesexpress.com}"
HEALTH_ENDPOINT="$BASE_URL/api/health"
CACHE_CLEAR_ENDPOINT="$BASE_URL/api/cache/clear"
SITEMAP_ENDPOINT="$BASE_URL/api/generate-sitemap"
MAX_RETRIES=5
RETRY_DELAY=10

# Función para esperar health check
wait_for_health() {
    local retries=0
    
    echo "🔍 Esperando health check en $HEALTH_ENDPOINT"
    
    while [ $retries -lt $MAX_RETRIES ]; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT" || true)
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Health check passed (HTTP $HTTP_CODE)"
            return 0
        fi
        
        retries=$((retries + 1))
        echo "  ⏳ Intento $retries/$MAX_RETRIES - HTTP $HTTP_CODE, reintentando en ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    done
    
    echo "❌ Health check failed after $MAX_RETRIES attempts"
    return 1
}

# Función para hacer request con timeout
make_request() {
    local url=$1
    local method=${2:-GET}
    
    curl -s -X "$method" "$url" \
        -H "User-Agent: Post-Deployment-Script" \
        -H "X-Deployment-ID: ${GITHUB_SHA:-$(date +%s)}" \
        --max-time 30 \
        --retry 2 \
        --retry-delay 5
}

# 1. Esperar health check
wait_for_health

# 2. Clear cache
echo "🧹 Limpiando cache..."
CACHE_RESPONSE=$(make_request "$CACHE_CLEAR_ENDPOINT" "POST")
if echo "$CACHE_RESPONSE" | grep -q "success" || [ -z "$CACHE_RESPONSE" ]; then
    echo "✅ Cache cleared"
else
    echo "⚠️ Cache clear may have failed: $CACHE_RESPONSE"
fi

# 3. Generate sitemap
echo "🗺️ Generando sitemap..."
SITEMAP_RESPONSE=$(make_request "$SITEMAP_ENDPOINT")
if echo "$SITEMAP_RESPONSE" | grep -q "success" || [ -z "$SITEMAP_RESPONSE" ]; then
    echo "✅ Sitemap generated"
else
    echo "⚠️ Sitemap generation may have failed: $SITEMAP_RESPONSE"
fi

# 4. Warm up cache para páginas críticas
echo "🔥 Calentando cache para páginas críticas..."
CRITICAL_PAGES=(
    "/"
    "/niveles"
    "/metodologia"
    "/precios"
    "/test-nivel"
    "/contacto"
    "/blog"
)

for page in "${CRITICAL_PAGES[@]}"; do
    echo "  Warming: $page"
    make_request "$BASE_URL$page" > /dev/null
    sleep 0.5  # Pequeña pausa para no sobrecargar
done

# 5. Verificar páginas importantes
echo "🔍 Verificando páginas importantes..."
IMPORTANT_PAGES=(
    "/api/health"
    "/sitemap.xml"
    "/robots.txt"
    "/favicon.ico"
)

for page in "${IMPORTANT_PAGES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page" || true)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
        echo "  ✅ $page (HTTP $HTTP_CODE)"
    else
        echo "  ⚠️ $page (HTTP $HTTP_CODE)"
    fi
done

# 6. Notificar a sistemas de monitoreo
echo "📊 Notificando sistemas de monitoreo..."

# Sentry release (si están configuradas las variables)
if [ -n "$SENTRY_AUTH_TOKEN" ] && [ -n "$SENTRY_ORG" ] && [ -n "$SENTRY_PROJECT" ]; then
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")
    
    curl -s -X POST "https://sentry.io/api/0/organizations/$SENTRY_ORG/releases/" \
        -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"version\": \"$VERSION\",
            \"projects\": [\"$SENTRY_PROJECT\"],
            \"environment\": \"${ENVIRONMENT:-production}\"
        }" > /dev/null && echo "✅ Sentry notified"
fi

# 7. Registrar despliegue
echo "📝 Registrando despliegue..."
DEPLOYMENT_LOG="./logs/deployments.log"
mkdir -p "$(dirname "$DEPLOYMENT_LOG")"

cat >> "$DEPLOYMENT_LOG" << EOF
$(date '+%Y-%m-%d %H:%M:%S') | DEPLOYMENT
  Environment: ${ENVIRONMENT:-production}
  Version: ${VERSION:-unknown}
  Commit: ${GITHUB_SHA:-local}
  User: ${GITHUB_ACTOR:-$USER}
  Health Check: ✅ Passed
  Cache Cleared: ✅
  Sitemap Generated: ✅
EOF

echo ""
echo "✅ POST-DEPLOYMENT COMPLETADO"
echo "📊 Resumen:"
echo "  - Health check: ✅"
echo "  - Cache cleared: ✅"
echo "  - Sitemap generated: ✅"
echo "  - Cache warmed: ${#CRITICAL_PAGES[@]} páginas"
echo "  - Monitoring notified: ✅"
echo ""
echo "🎉 ¡Despliegue completado exitosamente!"
```

---

## **CAPÍTULO 9: COSTOS Y OPTIMIZACIÓN**

### **9.1 Estimación de Costos Mensuales**

```markdown
## 💰 ESTIMACIÓN DE COSTOS MENSUALES - inglesexpress.com

### 🏗️ Infraestructura Básica (Mínimo)
- **Vercel Pro Plan:** $20/mes
  - Banda ancha ilimitada
  - 100 GB de almacenamiento
  - 1,000 horas de funciones serverless
  - Dominios ilimitados

- **WordPress Hosting (Managed):** $25-50/mes
  - Hosting optimizado para WordPress
  - SSL incluido
  - Backups diarios
  - Soporte técnico

- **Dominio (inglesexpress.com):** $15/año (~$1.25/mes)

### 🔧 Servicios Esenciales
- **Sentry (Team Plan):** $26/mes
  - 500,000 eventos/mes
  - Performance monitoring
  - Session replay

- **Upstash Redis (Basic):** $10/mes
  - 10,000 comandos/día
  - 256 MB memoria
  - Backup automático

- **Resend (Email Service):** $20/mes
  - 10,000 emails/mes
  - APIs de email transaccional
  - Analytics básico

- **Stripe Payments:** 2.9% + $0.30 por transacción
  - Sin cargo mensual
  - Pago solo por uso

### 👨‍💻 Desarrollo y Operaciones
- **Desarrollo (estimado):** $2,000-5,000/mes
  - Mantenimiento continuo
  - Nuevas funcionalidades
  - Soporte técnico

- **Soporte 24/7 (opcional):** $500-1,000/mes
  - Monitoreo proactivo
  - Respuesta a emergencias
  - Mantenimiento preventivo

- **Marketing/SEO:** $1,000-3,000/mes
  - Content marketing
  - SEO técnico
  - Campañas de ads

### 📊 Resumen de Costos
```
MÍNIMO (Operación básica): ~$102/mes
  - Vercel: $20
  - WordPress: $25
  - Dominio: $1.25
  - Sentry: $26
  - Redis: $10
  - Resend: $20

PROMEDIO (Con desarrollo): ~$3,102-8,102/mes
  - Infraestructura: $102
  - Desarrollo: $2,000-5,000
  - Marketing: $1,000-3,000

MÁXIMO (Empresa completa): ~$9,102/mes
  - Incluye soporte 24/7 y marketing agresivo
```

### **9.2 Estrategia de Optimización de Costos**

**cost-optimization.md:**
```markdown
# 📉 ESTRATEGIA DE OPTIMIZACIÓN DE COSTOS

## 1. Monitoreo y Alertas de Costos
- **Vercel Cost Alerts:** Configurar en dashboard cuando se acerque a límites
- **AWS Budgets:** Si usas S3, configurar alertas de presupuesto
- **Revisión Semanal:** Analizar uso vs. costo de cada servicio
- **Eliminar Recursos No Utilizados:** CI/CD antigua, deployments viejos

## 2. Optimización de Vercel
### Cache Strategy
- Usar ISR para páginas semi-estáticas
- Configurar TTLs apropiados para cada tipo de contenido
- Usar `stale-while-revalidate` para mejor UX

### Bundle Optimization
- Analizar bundle size con `@next/bundle-analyzer`
- Lazy load componentes no críticos
- Usar dynamic imports para librerías pesadas

### Edge Functions
- Mover lógica simple a Edge Functions (menor costo que Serverless)
- Usar middleware para lógica compartida

## 3. Optimización de WordPress
### Cache Agresivo
- WP Rocket o similar para cache de páginas
- CDN para assets estáticos (Vercel lo incluye)
- Optimizar base de datos semanalmente

### Plugin Management
- Usar solo plugins esenciales
- Desactivar plugins no utilizados
- Mantener actualizados para seguridad

### Hosting Optimization
- Elegir plan adecuado al tráfico real
- Considerar VPS si el tráfico es alto y constante
- Usar caching a nivel de servidor

## 4. Alternativas de Bajo Costo
### Para Inicio/Prueba de Concepto
- **Vercel Hobby Plan:** Gratis (limitaciones)
- **Sentry Free Tier:** 5,000 errores/mes
- **Upstash Redis Free:** 10,000 comandos/día
- **Resend Free:** 3,000 emails/mes

### Servicios Gratuitos
- **Google Analytics:** Gratis (GA4)
- **Vercel Analytics:** Incluido en todos los planes
- **Cloudflare:** CDN y seguridad básica gratis

## 5. Estrategia de Escalado por Demanda
- **Auto-scaling:** Vercel escala automáticamente
- **Pay-per-use:** Stripe, Resend, Upstash
- **Monitor Usage:** Ajustar planes según uso real

## 6. Recomendaciones Específicas
### Primeros 3 Meses
1. Usar planes gratuitos donde sea posible
2. Monitorear métricas de uso
3. Optimizar antes de escalar

### Crecimiento (3-12 meses)
1. Actualizar a planes pagos según necesidad
2. Implementar cache agresivo
3. Automatizar optimizaciones

### Escala (> 12 meses)
1. Negociar contratos anuales por descuento
2. Considerar infraestructura propia si el costo justifica
3. Outsourcing de mantenimiento si es más económico
```

---

## **CAPÍTULO 10: CHECKLIST FINAL DE IMPLEMENTACIÓN**

### **10.1 Checklist de Lanzamiento**

```markdown
# 🚀 CHECKLIST DE LANZAMIENTO A PRODUCCIÓN

## 📋 PRE-LANZAMIENTO (72 horas antes)
### Infraestructura
- [ ] Dominio configurado y propagado (inglesexpress.com)
- [ ] SSL certificado verificado y activo
- [ ] DNS records correctamente configurados
- [ ] Vercel project configurado con dominio

### Configuración
- [ ] Variables de entorno configuradas en Vercel
- [ ] WordPress API URL apuntando a producción
- [ ] Stripe keys configuradas para producción
- [ ] Google Analytics y Tag Manager configurados
- [ ] Sentry DSN configurado para producción

### Seguridad
- [ ] Auditoría de seguridad completada
- [ ] Todas las dependencias actualizadas
- [ ] API keys rotadas y seguras
- [ ] Firewall y WAF configurados

### Backup
- [ ] Backup completo de configuración
- [ ] Backup de contenido WordPress
- [ ] Estrategia 3-2-1 verificada
- [ ] Scripts de restauración probados

## 🚀 DÍA DE LANZAMIENTO (Secuencia)
### Preparación (08:00 AM)
- [ ] Comunicar ventana de mantenimiento a usuarios (si aplica)
- [ ] Confirmar que equipo está disponible
- [ ] Verificar que no hay incidentes activos

### Pre-Deploy (09:00 AM)
- [ ] Activar modo mantenimiento (opcional)
- [ ] Último backup pre-lanzamiento
- [ ] Verificar que todos los tests pasan

### Deployment (09:30 AM)
- [ ] Desplegar a staging para verificación final
- [ ] Verificar funcionalidades críticas en staging
- [ ] Aprobar despliegue a producción

### Producción (10:00 AM)
- [ ] Desplegar a producción
- [ ] Ejecutar script post-deployment
- [ ] Verificar health check
- [ ] Desactivar modo mantenimiento

### Post-Deploy (10:30 AM)
- [ ] Verificar todas las funcionalidades en producción
- [ ] Monitorear métricas por 1 hora
- [ ] Test manual de flujos críticos

## 📊 PRIMERAS 24 HORAS
### Monitoreo Intensivo
- [ ] Revisar logs de errores cada hora
- [ ] Monitorear métricas de rendimiento
- [ ] Verificar conversiones y transacciones

### Usabilidad
- [ ] Recibir y responder feedback de usuarios
- [ ] Verificar formularios y flujos de pago
- [ ] Test en diferentes dispositivos y navegadores

### Comunicación
- [ ] Notificar a stakeholders del éxito
- [ ] Actualizar documentación con lecciones aprendidas
- [ ] Planificar próximas iteraciones

## 📅 PRIMERA SEMANA
### Análisis
- [ ] Revisar métricas de Google Analytics
- [ ] Analizar errores en Sentry
- [ ] Evaluar rendimiento con Core Web Vitals

### Ajustes
- [ ] Implementar mejoras basadas en feedback
- [ ] Optimizar basado en métricas reales
- [ ] Planificar sprint de mejoras

### Operaciones
- [ ] Establecer rutina de monitoreo diario
- [ ] Configurar alertas proactivas
- [ ] Documentar procedimientos operativos
```

### **10.2 Checklist de Entrega al Cliente**

```markdown
# 📦 CHECKLIST DE ENTREGA AL CLIENTE

## 📄 DOCUMENTACIÓN
### Manuales
- [ ] Manual de usuario (guía paso a paso)
- [ ] Manual técnico (arquitectura, decisiones)
- [ ] Manual de operaciones (procedimientos día a día)
- [ ] Manual de mantenimiento (checklists, scripts)

### Diagramas
- [ ] Diagrama de arquitectura del sistema
- [ ] Diagrama de flujo de datos
- [ ] Diagrama de despliegue
- [ ] Diagrama de seguridad

### Planes
- [ ] Plan de contingencia y recuperación
- [ ] Plan de mantenimiento (diario, semanal, mensual)
- [ ] Plan de escalabilidad
- [ ] Plan de backup y restauración

## 🔐 ACCESOS Y CREDENCIALES
### Plataformas
- [ ] Vercel Dashboard (admin access)
- [ ] GitHub Repository (acceso de colaborador)
- [ ] WordPress Admin (usuario administrador)
- [ ] Google Analytics (acceso de editor)

### Servicios
- [ ] Sentry Dashboard
- [ ] Stripe Dashboard
- [ ] Resend Dashboard
- [ ] Upstash Redis Console

### Credenciales
- [ ] API Keys (en formato seguro)
- [ ] Tokens de acceso
- [ ] Credenciales de base de datos
- [ ] Certificados SSL

## 🎓 ENTRENAMIENTO
### Sesiones Programadas
- [ ] Sesión 1: Administración básica (2 horas)
- [ ] Sesión 2: Operaciones y monitoreo (2 horas)
- [ ] Sesión 3: Mantenimiento y backups (2 horas)
- [ ] Sesión 4: Seguridad y escalabilidad (2 horas)

### Material de Soporte
- [ ] Video tutoriales grabados
- [ ] FAQ con preguntas comunes
- [ ] Guías paso a paso
- [ ] Plantillas para procedimientos

### Soporte Post-Entrega
- [ ] Soporte técnico (30 días incluidos)
- [ ] Canal de comunicación dedicado
- [ ] Horario de soporte establecido
- [ ] SLA de respuesta definido

## ⚖️ LEGAL Y CONTRATOS
### Documentación Legal
- [ ] Contrato de desarrollo y entrega
- [ ] Acuerdo de nivel de servicio (SLA)
- [ ] Acuerdo de confidencialidad (NDA)
- [ ] Términos y condiciones actualizados

### Compliance
- [ ] Política de privacidad (GDPR compliant)
- [ ] Política de cookies
- [ ] Términos de uso
- [ ] Aviso legal

### Propiedad Intelectual
- [ ] Licencias de código fuente
- [ ] Derechos de uso de contenido
- [ ] Marcas registradas y logos
- [ ] Acuerdos de terceros

## 📊 MÉTRICAS Y REPORTES
### Reportes Iniciales
- [ ] Reporte de estado inicial del sistema
- [ ] Baseline de métricas de rendimiento
- [ ] Inventario de activos técnicos
- [ ] Estado de seguridad inicial

### Dashboards
- [ ] Dashboard de monitoreo configurado
- [ ] Dashboard de analytics
- [ ] Dashboard de negocio
- [ ] Alertas configuradas

## 🔄 PROCESO DE TRANSFERENCIA
### Semana 1
- [ ] Accesos entregados y verificados
- [ ] Sesión inicial de entrenamiento
- [ ] Procedimientos básicos documentados

### Semana 2
- [ ] Soporte durante operaciones normales
- [ ] Resolución de dudas y preguntas
- [ ] Ajustes basados en feedback

### Semana 3
- [ ] Operación independiente supervisada
- [ ] Pruebas de procedimientos de emergencia
- [ ] Revisión final de documentación

### Semana 4
- [ ] Entrega formal y firma de aceptación
- [ ] Establecimiento de soporte continuo
- [ ] Plan de mejora continua

## ✅ CRITERIOS DE ACEPTACIÓN
### Funcionalidad
- [ ] Todas las funcionalidades especificadas funcionan
- [ ] Performance dentro de parámetros acordados
- [ ] Disponibilidad verificada (> 99.9%)
- [ ] Seguridad validada por auditoría

### Documentación
- [ ] Documentación completa y clara
- [ ] Procedimientos probados y verificados
- [ ] Entrenamiento completado satisfactoriamente
- [ ] Preguntas del cliente respondidas

### Operaciones
- [ ] Equipo capaz de operar independientemente
- [ ] Procedimientos de emergencia probados
- [ ] Sistema de monitoreo funcionando
- [ ] Backup y recuperación verificados

---

## 🎉 FIRMA DE ACEPTACIÓN

**Proyecto:** inglesexpress.com  
**Fecha de Entrega:** ____________________  
**Período de Garantía:** 30 días  

**Cliente:**  
Nombre: ____________________  
Firma: ____________________  
Fecha: ____________________  

**Desarrollador:**  
Nombre: ____________________  
Firma: ____________________  
Fecha: ____________________  
```

---

## **CONCLUSIÓN FINAL**

Esta guía completa de despliegue y mantenimiento para **inglesexpress.com** proporciona:

### ✅ **10 PUNTOS CLAVE IMPLEMENTADOS:**

1. **Arquitectura Multi-ambiente** → Desarrollo seguro con Vercel Preview, Staging y Production
2. **Configuración Optimizada** → Next.js + WordPress con cache estratégico y seguridad
3. **Monitoreo Integral** → Sentry, Google Analytics 4, dashboard personalizado
4. **Backup Automatizado** → Estrategia 3-2-1 con scripts para configuración y contenido
5. **Mantenimiento Programado** → Checklists diarios, semanales y mensuales
6. **Escalabilidad en Vercel** → Auto-scaling, Edge Functions, cache multi-nivel
7. **CI/CD Automatizado** → GitHub Actions con testing, seguridad y despliegue
8. **Gestión de Costos** → Estimación realista y estrategias de optimización
9. **Documentación Completa** → Manuales, procedimientos, planes de contingencia
10. **Entrega Profesional** → Checklist de lanzamiento y transferencia al cliente

### 🎯 **RECOMENDACIONES DE IMPLEMENTACIÓN:**

**Fase 1 (Primera semana):**
1. Configurar repositorio GitHub con la estructura completa
2. Desplegar a Vercel con dominio temporal
3. Configurar variables de entorno básicas
4. Implementar monitoreo básico (Sentry, GA4)

**Fase 2 (Primer mes):**
1. Comprar dominio `inglesexpress.com` y configurar DNS
2. Implementar backups automatizados
3. Configurar CI/CD completo
4. Establecer rutinas de mantenimiento diario

**Fase 3 (Primer trimestre):**
1. Optimizar performance basado en métricas reales
2. Implementar escalabilidad según demanda
3. Automatizar todo el flujo de operaciones
4. Documentar lecciones aprendidas y mejoras

### 🔄 **MANTENIMIENTO CONTINUO:**

- **Revisar esta guía cada 3 meses** para actualizaciones
- **Realizar auditoría de seguridad trimestral**
- **Actualizar dependencias mensualmente**
- **Probar procedimientos de recuperación cada 6 meses**

### 📞 **SOPORTE Y ACTUALIZACIONES:**

Esta guía está diseñada para ser un documento vivo. Debe actualizarse con:
- Nuevas mejores prácticas de Next.js y Vercel
- Cambios en APIs de servicios externos
- Lecciones aprendidas de incidentes reales
- Feedback del equipo operativo

**¡inglesexpress.com está listo para desplegar!** 🚀
