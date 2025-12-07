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
