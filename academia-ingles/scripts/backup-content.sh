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
