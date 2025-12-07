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

# 4. Verificar sitemap (Next.js App Router lo genera automáticamente)
log "🗺️ Verificando sitemap..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://inglesexpress.com/sitemap.xml")
if [ "$SITEMAP_STATUS" = "200" ]; then
    log "✅ Sitemap accesible"
else
    log "⚠️ Error verificando sitemap: $SITEMAP_STATUS"
fi

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
