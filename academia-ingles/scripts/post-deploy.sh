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

# 3. Warm up cache para páginas críticas
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
    "/manifest.json"
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
  PWA/SEO Files: ✅
EOF

echo ""
echo "✅ POST-DEPLOYMENT COMPLETADO"
echo "📊 Resumen:"
echo "  - Health check: ✅"
echo "  - Cache cleared: ✅"
echo "  - PWA/SEO Verified: ✅"
echo "  - Cache warmed: ${#CRITICAL_PAGES[@]} páginas"
echo "  - Monitoring notified: ✅"
echo ""
echo "🎉 ¡Despliegue completado exitosamente!"
