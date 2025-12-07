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
