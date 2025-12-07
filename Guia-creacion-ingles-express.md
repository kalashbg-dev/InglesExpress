# **GUÍA ACADEMIA DE INGLÉS FULLSTACK**

---

## **QUÉ VAS A CONSTRUIR**
- **Frontend:** Aplicación Next.js 16 moderna con TypeScript, Tailwind, Apollo Client
- **Backend:** WordPress Headless con WPGraphQL, ACF y Custom Post Types
- **Conexión:** GraphQL API entre ambos sistemas
- **Despliegue:** Vercel (Frontend) + VPS/Managed Hosting (WordPress)
- **Funcionalidades:** Catálogo de niveles, test de nivel, checkout, newsletter, FAQ

---

# **PARTE 1: PREPARACIÓN DEL ENTORNO LOCAL Y NO LOCAL**

## **MÓDULO 1.1: CONFIGURACIÓN DEL ENTORNO DE DESARROLLO LOCAL**

### **Paso 1.1.1: Instalación de Herramientas Requeridas**

```bash
# 1. VERIFICA QUE TIENES ESTAS HERRAMIENTAS INSTALADAS
# Ejecuta estos comandos uno por uno en tu terminal:

# Node.js (versión LTS 20.x o superior)
node --version
# Debe mostrar v20.x.x o superior

# pnpm (gestor de paquetes)
pnpm --version
# Si no lo tienes, instálalo con:
npm install -g pnpm

# Git
git --version

# 2. CREA UNA CARPETA PARA EL PROYECTO
mkdir academia-ingles
cd academia-ingles
```

### **Paso 1.1.2: Inicialización del Proyecto Next.js**

```bash
# 3. CREA EL PROYECTO NEXT.JS CON PARÁMETROS ESPECÍFICOS
# Esto tomará 1-2 minutos. NO modifiques los parámetros:
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --no-src-dir \
  --import-alias "@/*"

# 4. CONFIRMA LA ESTRUCTURA DE CARPETAS CREADA
# Debes ver estas carpetas:
ls -la
# Debes ver: app/, public/, node_modules/, package.json, etc.
```

### **Paso 1.1.3: Instalación de Dependencias Críticas**

```bash
# 5. INSTALA LAS DEPENDENCIAS PRINCIPALES (una por una para evitar errores)
pnpm add @apollo/client@3.11.0 graphql@16.8.0
pnpm add zod@3.22.0
pnpm add react-hook-form@7.48.0 @hookform/resolvers@3.3.0
pnpm add @tanstack/react-query@5.12.0 @tanstack/react-query-devtools@5.12.0
pnpm add lucide-react@0.309.0
pnpm add clsx@2.0.0 tailwind-merge@2.2.0

# 6. INSTALA DEPENDENCIAS DE DESARROLLO
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D eslint@8.56.0 eslint-config-next@16.0.7
pnpm add -D typescript@5.3.0 @typescript-eslint/parser@6.19.0
pnpm add -D prettier@3.1.0 prettier-plugin-tailwindcss@0.5.0

# 7. VERIFICA QUE TODO SE INSTALÓ CORRECTAMENTE
pnpm list --depth=0
```

### **Paso 1.1.4: Configuración de Variables de Entorno**

**Crea estos archivos EXACTAMENTE como se muestra:**

**Archivo: `.env.local`** (NO lo subas a GitHub)
```env
# ============================================
# WORDPRESS CONFIGURATION
# ============================================
NEXT_PUBLIC_WORDPRESS_API_URL=https://tu-dominio-wordpress.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://tu-dominio-wordpress.com
NEXT_PUBLIC_WORDPRESS_PREVIEW_SECRET=tu-secreto-aqui-123

# ============================================
# STRIPE (SOLO CLAVES PÚBLICAS - NUNCA SECRETAS)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123XYZ789
NEXT_PUBLIC_STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
NEXT_PUBLIC_STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel

# ============================================
# URLS DE LA APLICACIÓN
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Academia de Inglés"
NEXT_PUBLIC_CONTACT_EMAIL=info@academiaingles.com
NEXT_PUBLIC_CONTACT_PHONE=+1 809 555 1234

# ============================================
# ANALYTICS Y MONITOREO (OPCIONAL)
# ============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=1234567
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# ============================================
# FEATURE FLAGS (BANDERAS DE FUNCIONALIDAD)
# ============================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false
NEXT_PUBLIC_ENABLE_PREVIEW_MODE=false
NEXT_PUBLIC_ENABLE_EMAIL_NEWSLETTER=true

# ============================================
# SENTRY (SOLO DSN PÚBLICO)
# ============================================
NEXT_PUBLIC_SENTRY_DSN=https://abc123@sentry.io/456789
```

**Archivo: `.env.example`** (ESTE sí lo subes a GitHub)
```env
# ============================================
# WORDPRESS CONFIGURATION
# ============================================
NEXT_PUBLIC_WORDPRESS_API_URL=https://tu-dominio-wordpress.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://tu-dominio-wordpress.com
NEXT_PUBLIC_WORDPRESS_PREVIEW_SECRET=tu-secreto-aqui-123

# ============================================
# STRIPE
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123XYZ789

# ============================================
# URLS DE LA APLICACIÓN
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Academia de Inglés"

# ============================================
# ANALYTICS Y MONITOREO
# ============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false

# ============================================
# SENTRY
# ============================================
NEXT_PUBLIC_SENTRY_DSN=https://abc123@sentry.io/456789
```

### **Paso 1.1.5: Configuración de Git y Seguridad**

**Archivo: `.gitignore`** (en la raíz del proyecto)
```gitignore
# ============================================
# DEPENDENCIAS
# ============================================
node_modules/
.pnp
.pnp.js
.yarn/install-state.gz

# ============================================
# NEXT.JS
# ============================================
.next/
out/
.next/cache/
.next/standalone/

# ============================================
# PRODUCCIÓN
# ============================================
build/
dist/
*.tgz

# ============================================
# VARIABLES DE ENTORNO (CRÍTICO - NUNCA SUBIR)
# ============================================
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# ============================================
# LOGS
# ============================================
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# ============================================
# IDE
# ============================================
.vscode/
.idea/
*.swp
*.swo

# ============================================
# SISTEMA OPERATIVO
# ============================================
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# ============================================
# TESTING
# ============================================
coverage/
.nyc_output

# ============================================
# MISCELÁNEOS
# ============================================
*.pid
*.seed
*.pid.lock
```

**Ahora inicializa Git:**
```bash
# 8. INICIALIZA GIT Y HAZ EL PRIMER COMMIT
git init
git add .
git commit -m "🚀 Initial commit: Next.js 16 + TypeScript + Tailwind setup"
```

### **Paso 1.1.6: Verificación Final del Entorno Local**

```bash
# 9. EJECUTA ESTOS COMANDOS DE VERIFICACIÓN UNO POR UNO:

# A. Verifica que Next.js se ejecuta
pnpm run dev
# Abre http://localhost:3000 en tu navegador
# Debes ver la página por defecto de Next.js

# B. Verifica TypeScript
pnpm tsc --noEmit
# No debe haber errores

# C. Verifica seguridad de dependencias
pnpm audit --fix
pnpm outdated

# D. Verifica estructura de carpetas
tree -L 2 -I node_modules
# Debes ver:
# ├── app/
# ├── public/
# ├── .env.local
# ├── .env.example
# ├── .gitignore
# ├── package.json
# └── tsconfig.json
```

---

## **MÓDULO 1.2: CONFIGURACIÓN DEL ENTORNO DE PRODUCCIÓN (VERCEL)**

### **Paso 1.2.1: Creación de Cuenta en Vercel**

1. **Ve a [vercel.com](https://vercel.com)**
2. **Regístrate con GitHub** (recomendado) o email
3. **Verifica tu email** si es necesario
4. **Instala la CLI de Vercel:**
```bash
pnpm add -g vercel
```

### **Paso 1.2.2: Configuración del Proyecto en Vercel**

**Archivo: `vercel.json`** (en la raíz del proyecto)
```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  
  "env": {
    "NEXT_PUBLIC_WORDPRESS_API_URL": "@wordpress_api_url",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe_publishable_key",
    "NEXT_PUBLIC_SITE_URL": "@site_url",
    "NEXT_PUBLIC_SITE_NAME": "@site_name",
    "STRIPE_SECRET_KEY": "@stripe_secret_key",
    "UPSTASH_REDIS_REST_URL": "@upstash_redis_url",
    "UPSTASH_REDIS_REST_TOKEN": "@upstash_redis_token",
    "RESEND_API_KEY": "@resend_api_key",
    "DATABASE_URL": "@database_url"
  },
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        }
      ]
    }
  ],
  
  "redirects": [
    {
      "source": "/admin",
      "destination": "/",
      "permanent": false
    },
    {
      "source": "/wp-admin",
      "destination": "/",
      "permanent": false
    },
    {
      "source": "/login",
      "destination": "/",
      "permanent": false
    }
  ],
  
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": true
  }
}
```

### **Paso 1.2.3: Despliegue Manual de Prueba**

```bash
# 10. DESPLIEGA EN VERCEL PARA PRUEBAS
vercel login
# Sigue las instrucciones en pantalla

vercel
# Responde las preguntas:
# ? Set up and deploy "~/academia-ingles"? Y
# ? Which scope do you want to deploy to? (Selecciona tu usuario)
# ? Link to existing project? N
# ? What's your project's name? academia-ingles
# ? In which directory is your code located? ./
# ? Want to override the settings? N

# Esto creará una URL temporal como: https://academia-ingles.vercel.app
# ANOTA ESTA URL, la necesitarás más adelante
```

---

# **PARTE 2: CONSTRUCCIÓN DEL FRONTEND**

**INSTRUCCIÓN:** Copia y pega estos prompts **EN ORDEN** en [v0.dev](https://v0.dev). Cada prompt genera un componente específico. Guarda cada componente en la carpeta correspondiente.

## **MÓDULO 2.1: CONFIGURACIÓN DEL DESIGN SYSTEM**

### **Prompt 1: Configuración Global y Layout Base**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Actúa como un Senior Frontend Architect especializado en Next.js 16 App Router, TypeScript, Tailwind CSS y accesibilidad WCAG 2.1 AA+. Vamos a crear un Design System completo para una academia de inglés premium.

**REQUISITOS TÉCNICOS EXACTOS:**
1. Next.js 16 App Router con Server Components por defecto
2. TypeScript estricto con interfaces explícitas
3. Tailwind CSS con configuración personalizada
4. Accesibilidad WCAG 2.1 AA+ (nivel AAA donde sea posible)
5. Performance: LCP < 2.0s, CLS < 0.1, FID < 100ms
6. SEO optimizado: meta tags, Open Graph, JSON-LD
7. Mobile-first responsive design

**TAREAS A REALIZAR:**

**1. CONFIGURACIÓN GLOBAL (app/globals.css):**
- Variables CSS personalizadas en :root
- Paleta de colores completa con nombres semánticos
- Tipografía: Montserrat (titulares) y Inter (cuerpo)
- Reset CSS personalizado
- Utilidades Tailwind personalizadas
- Animaciones y transiciones estándar

**2. LAYOUT PRINCIPAL (app/layout.tsx):**
- Layout raíz con metadata optimizada
- Provider para Apollo Client y React Query
- Google Analytics integrado (condicional)
- Font optimization con next/font
- Skip link para accesibilidad
- Announcement para screen readers
- Error boundary global

**3. COMPONENTES BASE:**
- Button: variantes primary, secondary, outline, ghost, link
- Card: variantes default, outline, elevated
- Input: con labels flotantes, validación visual
- Select: accesible con combobox
- Modal: con focus trapping y scroll lock
- Toast/Sonner: sistema de notificaciones

**4. ESTRUCTURA DE CARPETAS:**
components/
├── ui/           # Componentes UI reutilizables
├── layout/       # Componentes de layout
├── shared/       # Componentes compartidos
└── sections/     # Secciones de página

**GENERA EL CÓDIGO COMPLETO PARA:**
1. app/globals.css (con todas las variables CSS)
2. app/layout.tsx (con metadata y providers)
3. components/ui/button.tsx (5 variantes)
4. components/ui/card.tsx (3 variantes)
5. components/ui/input.tsx (con floating label)

**INCLUYE:**
- Comentarios detallados explicando cada decisión
- Atributos ARIA completos
- Estados de focus, hover, active, disabled
- Ejemplos de uso con TypeScript
- Documentación en JSDoc
```

**DESPUÉS DE EJECUTAR ESTE PROMPT, HAZ ESTO:**
1. Guarda los archivos generados en sus respectivas carpetas
2. Asegúrate de que la estructura de carpetas sea:
```
app/
├── globals.css
└── layout.tsx
components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    └── input.tsx
```

### **Prompt 2: Header y Navegación Principal**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Continuando con el Design System creado, ahora genera el Header/Navigation principal de la academia.

**ESPECIFICACIONES TÉCNICAS:**

**1. HEADER PRINCIPAL (components/layout/header.tsx):**
- Position: sticky top-0 con z-index adecuado
- Efecto: glassmorphism con backdrop-blur
- Altura: 80px desktop, 64px mobile
- Transiciones suaves en scroll

**2. LOGO (components/layout/logo.tsx):**
- Textual: "ACADEMIA" (negro bold) + "INGLÉS" (rojo primary)
- Responsive: versión completa y compacta
- Enlace a home con aria-label

**3. NAVEGACIÓN PRINCIPAL (components/layout/main-nav.tsx):**
- Links: Inicio, Metodología, Niveles, Precios, Contacto
- Estados activos con subrayado animado
- Dropdown para "Niveles" con mega-menu
- Navegación por teclado completa
- Mobile: hamburger menu con animación

**4. BOTONES DE ACCIÓN:**
- Language switcher: "ES | EN" con banderas
- CTA principal: "Test de Nivel" (rojo, con ícono)
- CTA secundario: "Contactar" (outline)

**5. MOBILE MENU (components/layout/mobile-nav.tsx):**
- Slide-in desde derecha
- Overlay con backdrop
- Focus trapping dentro del modal
- Animación de entrada/salida
- Mismos links que desktop

**6. SKIP LINK (components/layout/skip-link.tsx):**
- Oculto visualmente, visible con teclado
- Texto: "Saltar al contenido principal"
- Posicionamiento absoluto

**ACCESIBILIDAD REQUERIDA:**
- role="navigation" con aria-label
- aria-current="page" para link activo
- aria-expanded para dropdowns
- aria-controls para mobile menu
- focus-visible outlines
- Skip link funcionando

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/layout/header.tsx
2. components/layout/logo.tsx
3. components/layout/main-nav.tsx
4. components/layout/mobile-nav.tsx
5. components/layout/skip-link.tsx

**INCLUYE:**
- TypeScript interfaces para props
- Estados de loading/error
- Responsive design completo
- SEO metadata en links
- Ejemplo de implementación
```

**DESPUÉS DE EJECUTAR ESTE PROMPT, HAZ ESTO:**
1. Crea la carpeta `components/layout/` si no existe
2. Guarda los 5 archivos generados
3. Verifica que el Header se importe en `app/layout.tsx`

### **Prompt 3: Hero Section con Performance**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Ahora genera la Hero Section (Sección Hero) optimizada para Core Web Vitals.

**OBJETIVO DE PERFORMANCE:**
- LCP (Largest Contentful Paint): < 1.5 segundos
- CLS (Cumulative Layout Shift): 0
- FID (First Input Delay): < 50ms

**DISEÑO DE LA HERO SECTION:**

**1. CONTENIDO PRINCIPAL:**
- H1: "APRENDE INGLÉS" (negro, font-black, text-7xl desktop)
- H1 highlight: "EN 4 MESES" (rojo primary, con subrayado tipo marcador amarillo)
- Badge flotante: "METODOLOGÍA GARANTIZADA" (rotado 12deg, con shadow)

**2. ELEMENTOS VISUALES:**
- Imagen de fondo: estudiantes en clase (optimizada)
- Pattern overlay: dots muy sutiles (opacity-5)
- Gradiente sutil de izquierda a derecha

**3. CALLS TO ACTION:**
- Botón primario: "Empieza Ahora" (rojo, grande, con ícono flecha)
- Botón secundario: "Cómo Funciona" (outline, con ícono play)
- Texto de confianza: "500+ estudiantes confían en nosotros"

**4. ESTADÍSTICAS (Stats Grid):**
- 4 estadísticas: "Años de Experiencia", "Estudiantes", "Niveles", "Profesores"
- Cada stat con número grande, ícono y descripción
- Animación de conteo (opcional)

**5. SCROLL INDICATOR:**
- Flecha animada para indicar scroll
- Enlace ancla a siguiente sección

**OPTIMIZACIONES REQUERIDAS:**

**A. IMÁGENES:**
- Usar next/image con priority
- sizes attribute correcto
- quality=85
- formato WebP con fallback
- loading="eager" para LCP

**B. FUENTES:**
- Montserrat y Inter preloaded
- font-display: swap
- subset: latin, latin-ext

**C. ANIMACIONES:**
- Solo transform y opacity
- Usar will-change donde necesario
- Preferir CSS sobre JavaScript

**D. SEO:**
- Schema.org markup para EducationalOrganization
- Meta description en heading
- Open Graph tags

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/sections/hero.tsx
2. components/sections/stats-grid.tsx
3. public/images/hero/ (estructura sugerida)

**INCLUYE:**
- Componente Image optimizado
- Lazy loading para stats
- Fallbacks para imágenes
- Error boundaries
- Tests de performance en comentarios
```

**DESPUÉS DE EJECUTAR ESTE PROMPT:**
1. Crea `components/sections/hero.tsx`
2. Crea `components/sections/stats-grid.tsx`
3. Añade imágenes placeholder en `public/images/hero/`

### **Prompt 4: Sección de Metodología**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Genera la sección "Nuestra Metodología" con grid de 2 columnas.

**DISEÑO DE LA SECCIÓN:**

**COLUMNA IZQUIERDA (60%):**
- H2: "NUESTRA ESENCIA" (text-4xl, font-bold)
- Subtitle: "No somos una escuela tradicional. Somos tu aceleradora de idiomas."
- Lista de 4 características (Features):
  1. Enfoque Comunicativo (ícono: MessageCircle)
  2. Aprendizaje Personalizado (ícono: Users)
  3. Tecnología Inmersiva (ícono: Monitor)
  4. Resultados Garantizados (ícono: CheckCircle)

**COLUMNA DERECHA (40%):**
- Imagen principal: profesor con estudiantes (aspect-ratio 4:3)
- Card superpuesta: "Director: Vladimir Umaña - 15 Años de Experiencia"
- Badge de certificación: "Certificado CEFR"

**COMPONENTE FEATURE CARD (components/sections/feature-card.tsx):**
- Ícono en círculo rojo suave (bg-red-50, text-red-600)
- Título en bold
- Descripción corta (2 líneas)
- Hover effect: scale-105 y shadow

**ACCESIBILIDAD:**
- role="list" y role="listitem" para features
- aria-labelledby para sección
- alt text descriptivo para imagen

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/sections/methodology.tsx
2. components/sections/feature-card.tsx
3. components/sections/director-card.tsx
```

### **Prompt 5: Roadmap de Niveles (Tarjetas 3D Interactivas)**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
ESTA ES LA SECCIÓN MÁS IMPORTANTE. Genera el componente "LevelRoadmap" con tarjetas 3D.

**ESTRUCTURA DE DATOS (ESTA ES EXACTA, NO LA MODIFIQUES):**
```typescript
interface Level {
  id: number;
  title: string;
  slug: string;
  acf: {
    codigoVisual: string;  // "A1", "A2", "B1", "B2", "C1", "C2", "TOEFL"
    duracion: string;      // "4 Meses"
    precio: number;        // 2500
    descripcion?: string;
    linkPago: string;      // URL de Stripe
    imagenLibro: {
      sourceUrl: string;
      altText: string;
      width?: number;
      height?: number;
    };
  };
}
```

**DISEÑO DEL LEVEL ROADMAP:**

**1. ENCABEZADO DE SECCIÓN:**
- H2: "TU CAMINO A LA FLUIDEZ"
- Descripción: "Comienza en tu nivel y avanza hasta la fluidez"
- Filtros: "Todos", "Principiante", "Intermedio", "Avanzado"

**2. GRID DE TARJETAS:**
- Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop
- Gap: 24px
- Alineación: stretch

**3. TARJETA DE NIVEL (components/levels/level-card.tsx):**

**PARTES DE LA TARJETA:**
- **Header Strip:** 12px de alto, color según nivel (A1:red, A2:orange, B1:blue, B2:green)
- **Badge:** Círculo con código (A1) en esquina superior derecha
- **Imagen del Libro:** 
  - Aspect ratio: 3:4
  - Transformación 3D: rotateY(10deg) perspective(1000px)
  - Sombra: 3D effect
- **Contenido:**
  - Título del nivel
  - Duración (ícono Clock)
  - Precio (ícono DollarSign)
  - Descripción corta
- **Botón:** "Ver Temario" (oculto por defecto, visible en hover)

**4. INTERACCIONES:**
- Hover: card se eleva (-translate-y-2), shadow más pronunciada
- Hover: botón "Ver Temario" aparece con fade-in
- Hover: imagen gira ligeramente (rotateY(15deg))
- Click: abre modal con detalles completos

**5. MODAL DE DETALLE (components/levels/level-detail-modal.tsx):**
- Información completa del nivel
- Lista de temas
- Testimonios de estudiantes
- Botón de inscripción

**6. ESTADOS:**
- Loading: skeleton cards
- Empty: mensaje "No hay niveles disponibles"
- Error: mensaje de error con reintento

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/sections/levels-roadmap.tsx
2. components/levels/level-card.tsx
3. components/levels/level-detail-modal.tsx
4. components/levels/level-skeleton.tsx
```

### **Prompt 6: Test de Nivel y FAQs**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Genera dos secciones: Test de Nivel (CTA) y FAQs (Acordeón).

**1. SECCIÓN TEST DE NIVEL (components/sections/level-test-cta.tsx):**
- Fondo: bg-gray-900 (casi negro)
- Texto: blanco puro
- Título: "¿No sabes tu nivel actual?"
- Descripción: "Toma nuestro examen gratuito de 15 minutos"
- Botón: "Iniciar Test" (blanco con texto negro)
- Estadísticas: "95% de precisión", "Resultados inmediatos"
- Badge: "GRATIS" en esquina

**2. SECCIÓN FAQs (components/sections/faqs.tsx):**
- Título: "PREGUNTAS FRECUENTES"
- Dos columnas: "Académico" y "Administrativo"
- 6 FAQs por categoría (12 total)

**COMPONENTE ACCORDION (components/ui/accordion.tsx):**
- Basado en Radix UI o nativo
- Animación suave de height
- Ícono + que rota a X al abrir
- Borde rojo cuando está abierto
- Accesibilidad completa:
  - aria-expanded
  - aria-controls
  - role="region"

**FAQ ITEM STRUCTURE:**
```typescript
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'academic' | 'administrative';
}
```

**3. BUSCADOR DE FAQS (components/sections/faq-search.tsx):**
- Input de búsqueda en tiempo real
- Filtrado por categoría
- Highlight de términos buscados
- Empty state cuando no hay resultados

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/sections/level-test-cta.tsx
2. components/sections/faqs.tsx
3. components/ui/accordion.tsx
4. components/sections/faq-search.tsx
```

### **Prompt 7: Checkout y Footer**

> **Copia y pega ESTE TEXTO EXACTO en v0.dev:**

```
Genera el componente de Checkout (modal) y el Footer completo.

**1. MODAL DE CHECKOUT (components/checkout/checkout-modal.tsx):**

**LAYOUT DE 3 COLUMNAS:**
- **Columna 1 (30%):** Selección de método de pago
  - Tabs: "Tarjeta", "Transferencia", "PayPal"
  - Iconos de tarjetas aceptadas
  - Badge "Pago Seguro SSL"

- **Columna 2 (50%):** Formulario de pago
  - Input de tarjeta estilo Stripe (simulado)
  - Fecha y CVC separados
  - Validación en tiempo real
  - Checkbox "Guardar para futuros pagos"
  - Botón "Pagar RD$ 2,500"

- **Columna 3 (20%):** Resumen de compra
  - Producto: "Nivel A1 - Cosmopolite"
  - Duración: "4 Meses"
  - Precio: "RD$ 2,500"
  - Total: "RD$ 2,500"
  - Política de reembolso

**ACCESIBILIDAD DEL MODAL:**
- role="dialog"
- aria-labelledby
- aria-describedby
- Focus trapping con Tab
- Cierre con Escape

**2. FOOTER COMPLETO (components/layout/footer.tsx):**

**4 COLUMNAS RESPONSIVE:**

**Columna 1: Marca**
- Logo grande
- Slogan: "Aprende inglés rápido y efectivo"
- Redes sociales: 5 íconos con links

**Columna 2: Enlaces Rápidos**
- Navegación principal
- Links legales
- Mapa del sitio

**Columna 3: Contacto**
- Dirección física
- Teléfono clickeable
- Email clickeable
- Horario de atención

**Columna 4: Newsletter**
- Título: "Mantente actualizado"
- Input de email con validación
- Botón "Suscribir"
- Checkbox de consentimiento
- Texto pequeño de privacidad

**SECCIÓN INFERIOR:**
- Copyright © 2024 Academia de Inglés
- Links legales: Términos, Privacidad, Cookies
- Badge "Sitio Seguro"
- Selector de idioma

**GENERA EL CÓDIGO COMPLETO PARA:**
1. components/checkout/checkout-modal.tsx
2. components/layout/footer.tsx
3. components/checkout/payment-form.tsx
4. components/checkout/order-summary.tsx
```

---

# **PARTE 3: CONFIGURACIÓN DEL BACKEND WORDPRESS (PASO A PASO DETALLADO)**

## **MÓDULO 3.1: INSTALACIÓN DE WORDPRESS**

### **Paso 3.1.1: Elegir Hosting y Dominio**

**OPCIONES RECOMENDADAS:**
1. **VPS (Recomendado para control total):**
   - DigitalOcean ($6/mes)
   - Linode ($5/mes)
   - Vultr ($6/mes)

2. **Managed WordPress (Más fácil):**
   - SiteGround ($3.99/mes)
   - WP Engine ($25/mes)
   - Kinsta ($35/mes)

**ACCIONES REQUERIDAS:**
1. **Compra un dominio:** `academiaingles.com` (o similar)
2. **Contrata hosting** con estas especificaciones:
   - PHP 8.0 o superior
   - MySQL 5.7+ o MariaDB 10.3+
   - SSL Certificate incluido
   - 1GB RAM mínimo
   - 10GB almacenamiento

### **Paso 3.1.2: Instalación Manual de WordPress**

**SI USAS VPS, SIGUE ESTOS PASOS:**

```bash
# 1. CONECTA A TU VPS POR SSH
ssh root@tu-ip-del-vps

# 2. INSTALA LEMP STACK (Linux, Nginx, MySQL, PHP)
# Para Ubuntu/Debian:
apt update && apt upgrade -y
apt install nginx mysql-server php8.2-fpm php8.2-mysql php8.2-curl php8.2-xml php8.2-zip php8.2-gd php8.2-mbstring -y

# 3. CONFIGURA MySQL
mysql_secure_installation
# Sigue las preguntas, establece una contraseña segura

# 4. CREA BASE DE DATOS Y USUARIO
mysql -u root -p
# Dentro de MySQL:
CREATE DATABASE academia_ingles;
CREATE USER 'academia_user'@'localhost' IDENTIFIED BY 'ContraseñaSuperSegura123!';
GRANT ALL PRIVILEGES ON academia_ingles.* TO 'academia_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 5. DESCARGAR WORDPRESS
cd /var/www
wget https://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz
mv wordpress academia-ingles
chown -R www-data:www-data academia-ingles
chmod -R 755 academia-ingles

# 6. CONFIGURAR NGINX
nano /etc/nginx/sites-available/academia-ingles
```

**CONFIGURACIÓN NGINX (copia y pega esto):**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name academiaingles.com www.academiaingles.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name academiaingles.com www.academiaingles.com;
    
    # SSL Certificate (obtén uno gratuito de Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/academiaingles.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/academiaingles.com/privkey.pem;
    
    root /var/www/academia-ingles;
    index index.php index.html index.htm;
    
    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Bloquear acceso a archivos sensibles
    location ~* wp-config.php {
        deny all;
    }
    
    location ~* \.sql$ {
        deny all;
    }
}
```

```bash
# 7. ACTIVAR SITIO Y REINICIAR NGINX
ln -s /etc/nginx/sites-available/academia-ingles /etc/nginx/sites-enabled/
nginx -t  # Verificar configuración
systemctl restart nginx

# 8. INSTALAR SSL CON CERTBOT
apt install certbot python3-certbot-nginx -y
certbot --nginx -d academiaingles.com -d www.academiaingles.com
# Sigue las instrucciones en pantalla

# 9. COMPLETAR INSTALACIÓN DE WORDPRESS
# Ahora ve a: https://academiaingles.com
# Sigue el asistente de instalación de WordPress
```

### **Paso 3.1.3: Configuración Inicial de WordPress**

**DENTRO DEL PANEL DE ADMINISTRACIÓN DE WORDPRESS (https://academiaingles.com/wp-admin):**

1. **Configuración General:**
   - Ve a: `Ajustes > Generales`
   - Título del sitio: "Academia de Inglés"
   - Descripción corta: "Aprende inglés en 4 meses con nuestra metodología garantizada"
   - Dirección de WordPress (URL): `https://academiaingles.com`
   - Dirección del sitio (URL): `https://academiaingles.com`
   - Guardar cambios

2. **Enlaces Permanentes:**
   - Ve a: `Ajustes > Enlaces permanentes`
   - Selecciona: **"Nombre de la entrada"** (`/%postname%/`)
   - **ESTO ES CRÍTICO:** No elijas otra opción
   - Guardar cambios

3. **Zona Horaria:**
   - Ve a: `Ajustes > General`
   - Zona horaria: `Santo Domingo` o la de tu ciudad
   - Formato de fecha: `d/m/Y`
   - Formato de hora: `H:i`
   - Guardar cambios

4. **Desactivar Comentarios:**
   - Ve a: `Ajustes > Comentarios`
   - Desmarca: "Permitir comentarios en nuevos artículos"
   - Guardar cambios

---

## **MÓDULO 3.2: INSTALACIÓN DE PLUGINS OBLIGATORIOS**

### **Paso 3.2.1: Instalar Plugins de Seguridad**

**EN EL PANEL DE WORDPRESS, VE A: `Plugins > Añadir nuevo`**

**Busca e instala ESTOS PLUGINS (en este orden):**

1. **Wordfence Security:**
   - Busca: "Wordfence"
   - Instala y activa
   - Configuración inicial:
     - Ve a: `Wordfence > Dashboard`
     - Click: "Click here to install"
     - Configurar correo de alertas
     - Activar firewall en modo "Learning"

2. **WPS Hide Login:**
   - Busca: "WPS Hide Login"
   - Instala y activa
   - Configuración:
     - Ve a: `Ajustes > WPS Hide Login`
     - Login URL personalizada: `/mi-acceso-secreto` (NO uses "admin" o "login")
     - Guardar cambios
     - **ANOTA ESTA URL:** `https://academiaingles.com/mi-acceso-secreto`

### **Paso 3.2.2: Instalar Plugins para Headless/GraphQL**

3. **WPGraphQL:**
   - Busca: "WPGraphQL"
   - Instala y activa
   - No requiere configuración inicial

4. **Advanced Custom Fields (ACF):**
   - Busca: "Advanced Custom Fields"
   - Instala y activa
   - Ve a: `ACF > Tools`
   - Exporta configuración por defecto (opcional)

5. **WPGraphQL for Advanced Custom Fields:**
   - Busca: "WPGraphQL for ACF"
   - Instala y activa
   - Ve a: `ACF > GraphQL`
   - Activa: "Enable ACF GraphQL"

6. **Custom Post Type UI:**
   - Busca: "Custom Post Type UI"
   - Instala y activa

### **Paso 3.2.3: Instalar Plugins de Rendimiento y Backup**

7. **WP Rocket (Caché):**
   - Este es premium, pero crítico
   - Compra en: wp-rocket.me
   - Instala manualmente subiendo el .zip
   - Configuración:
     - Ve a: `Configuración > WP Rocket`
     - Activa todas las opciones
     - Excluye: `/graphql` del caché

8. **UpdraftPlus (Backup):**
   - Busca: "UpdraftPlus"
   - Instala y activa
   - Configuración:
     - Ve a: `Ajustes > UpdraftPlus Backups`
     - Frecuencia: Diariamente
     - Retención: 7 backups
     - Almacenamiento: Google Drive o Dropbox

---

## **MÓDULO 3.3: CREACIÓN DE POST TYPES Y TAXONOMÍAS**

### **Paso 3.3.1: Crear Post Type "Niveles"**

**EN EL PANEL DE WORDPRESS, VE A: `CPT UI > Add/Edit Post Types`**

**1. CONFIGURACIÓN BÁSICA:**
```
Post Type Slug: niveles
Plural Label: Niveles
Singular Label: Nivel
```

**2. CONFIGURACIÓN AVANZADA (copia estos valores):**
```yaml
# En "Additional Labels":
Menu Name: Niveles
All Items: Todos los Niveles
Add New: Añadir Nivel
Add New Item: Añadir Nuevo Nivel
Edit Item: Editar Nivel
New Item: Nuevo Nivel
View Item: Ver Nivel
Search Items: Buscar Niveles
Not Found: No se encontraron niveles
Not Found In Trash: No hay niveles en la papelera
```

**3. CONFIGURACIÓN DE SOPORTES (Supports):**
- [x] Title
- [x] Editor
- [x] Thumbnail
- [ ] Excerpt
- [ ] Trackbacks
- [ ] Custom Fields
- [ ] Comments
- [ ] Revisions
- [ ] Author
- [ ] Page Attributes

**4. CONFIGURACIÓN GRAPHQL (LA MÁS IMPORTANTE):**
```
Show in GraphQL: TRUE
GraphQL Single Name: nivel
GraphQL Plural Name: niveles
```

**5. OTRAS CONFIGURACIONES:**
```
Public: TRUE
Show UI: TRUE
Show in Menu: TRUE
Menu Position: 6
Menu Icon: dashicons-welcome-learn-more
Has Archive: FALSE
```

**6. HAZ CLICK EN: "Add Post Type"**

### **Paso 3.3.2: Crear Taxonomía "Dificultad"**

**VE A: `CPT UI > Add/Edit Taxonomies`**

**1. CONFIGURACIÓN BÁSICA:**
```
Taxonomy Slug: dificultad
Plural Label: Dificultades
Singular Label: Dificultad
```

**2. POST TYPES A LOS QUE SE APLICA:**
- [x] niveles (este es el post type que creamos)
- [ ] posts (deja sin marcar)
- [ ] pages (deja sin marcar)

**3. CONFIGURACIÓN GRAPHQL:**
```
Show in GraphQL: TRUE
GraphQL Single Name: dificultad
GraphQL Plural Name: dificultades
Hierarchical: TRUE
```

**4. HAZ CLICK EN: "Add Taxonomy"**

**5. CREA LOS TÉRMINOS DE DIFICULTAD:**
- Ve a: `Niveles > Dificultades`
- Añade estos términos:
  - Principiante (slug: principiante)
  - Intermedio (slug: intermedio)
  - Avanzado (slug: avanzado)

---

## **MÓDULO 3.4: CONFIGURACIÓN DE CAMPOS PERSONALIZADOS (ACF)**

### **Paso 3.4.1: Crear Grupo de Campos "Info Nivel"**

**VE A: `ACF > Grupos de campos > Añadir nuevo`**

**1. INFORMACIÓN BÁSICA:**
```
Título del grupo: Info Nivel
```

**2. CREAR CAMPOS (uno por uno):**

**CAMPO 1: Código Visual**
```
Etiqueta del campo: Código Visual
Nombre del campo: codigo_visual
Tipo de campo: Texto
Valor por defecto: (vacío)
Texto de ayuda: Ej: "A1", "A2", "B1", "B2"
Requerido: Sí
Solo lectura: No
Número máximo de caracteres: 10
```

**CAMPO 2: Duración**
```
Etiqueta del campo: Duración
Nombre del campo: duracion
Tipo de campo: Texto
Valor por defecto: 4 Meses
Texto de ayuda: Ej: "4 Meses", "6 Meses"
Requerido: Sí
```

**CAMPO 3: Precio**
```
Etiqueta del campo: Precio
Nombre del campo: precio
Tipo de campo: Número
Valor mínimo: 0
Valor máximo: 10000
Paso: 100
Requerido: Sí
```

**CAMPO 4: Imagen Libro**
```
Etiqueta del campo: Imagen Libro
Nombre del campo: imagen_libro
Tipo de campo: Imagen
Return Format: Image Object  # CRÍTICO: NO elijas URL ni ID
Tamaño de previsualización: Medio
Requerido: Sí
```

**CAMPO 5: Link Pago Stripe**
```
Etiqueta del campo: Link Pago Stripe
Nombre del campo: link_pago
Tipo de campo: URL
Valor por defecto: (vacío)
Texto de ayuda: URL de checkout de Stripe
Requerido: Sí
```

**CAMPO 6: Descripción**
```
Etiqueta del campo: Descripción
Nombre del campo: descripcion
Tipo de campo: Textarea
Líneas máximas: 3
Requerido: No
```

**3. UBICACIÓN (Location Rules):**
```
Mostrar este grupo de campos si:
Regla 1: Post Type es igual a Nivel
```

**4. OPCIONES DE PRESENTACIÓN:**
```
Posición: Alta (después del título)
Orden de los campos: Normal
Estilo: Estándar (Metabox)
Ocultar en pantalla: Ninguna
```

**5. CONFIGURACIÓN GRAPHQL (IMPORTANTE):**
```
Show in GraphQL: TRUE
GraphQL Field Name: infoNivel  # Exactamente así
```

**6. GUARDAR CAMBIOS:**
- Haz click en: "Publicar"

### **Paso 3.4.2: Crear Campos para FAQs**

**CREA OTRO GRUPO DE CAMPOS:**

**VE A: `ACF > Grupos de campos > Añadir nuevo`**

**1. INFORMACIÓN BÁSICA:**
```
Título del grupo: Info FAQ
```

**2. CREAR CAMPOS:**

**CAMPO 1: Categoría**
```
Etiqueta del campo: Categoría
Nombre del campo: categoria
Tipo de campo: Select
Opciones: académico : Académico, administrativo : Administrativo
Requerido: Sí
```

**3. UBICACIÓN:**
```
Mostrar este grupo de campos si:
Regla 1: Post Type es igual a post
Regla 2: Categoría es igual a FAQ
```

**4. GRAPHQL:**
```
Show in GraphQL: TRUE
GraphQL Field Name: infoFAQ
```

**5. GUARDAR CAMBIOS**

---

## **MÓDULO 3.5: CREACIÓN DE CONTENIDO DE PRUEBA**

### **Paso 3.5.1: Crear Niveles de Prueba**

**VE A: `Niveles > Añadir nuevo`**

**NIVEL A1:**
```
Título: Nivel A1 - Principiante
Contenido: <descripción completa del nivel>
Imagen destacada: Sube imagen de libro A1
Info Nivel:
  - Código Visual: A1
  - Duración: 4 Meses
  - Precio: 2500
  - Imagen Libro: Misma imagen del libro
  - Link Pago: https://buy.stripe.com/test_xxxx (link de prueba)
  - Descripción Corta: Fundamentos básicos del inglés
Dificultad: Principiante
Publicar
```

**NIVEL A2:**
```
Título: Nivel A2 - Básico
Contenido: <descripción completa>
Imagen destacada: Imagen libro A2
Info Nivel:
  - Código Visual: A2
  - Duración: 4 Meses
  - Precio: 2800
  - Link Pago: https://buy.stripe.com/test_xxxx
  - Descripción Corta: Comunicación en situaciones cotidianas
Dificultad: Principiante
Publicar
```

**NIVEL B1:**
```
Título: Nivel B1 - Intermedio
Contenido: <descripción completa>
Imagen destacada: Imagen libro B1
Info Nivel:
  - Código Visual: B1
  - Duración: 6 Meses
  - Precio: 3200
  - Link Pago: https://buy.stripe.com/test_xxxx
  - Descripción Corta: Fluidez en conversaciones
Dificultad: Intermedio
Publicar
```

**NIVEL B2:**
```
Título: Nivel B2 - Avanzado
Contenido: <descripción completa>
Imagen destacada: Imagen libro B2
Info Nivel:
  - Código Visual: B2
  - Duración: 6 Meses
  - Precio: 3800
  - Link Pago: https://buy.stripe.com/test_xxxx
  - Descripción Corta: Dominio del idioma
Dificultad: Avanzado
Publicar
```

### **Paso 3.5.2: Crear FAQs de Prueba**

**VE A: `Entradas > Añadir nueva`**

**PRIMERO CREA LA CATEGORÍA "FAQ":**
1. Ve a: `Entradas > Categorías`
2. Añade nueva categoría: `FAQ`
3. Slug: `faq`
4. Guardar

**AHORA CREA 6 FAQs ACADÉMICAS:**

**FAQ 1:**
```
Título: ¿Cuánto tiempo toma aprender inglés?
Contenido: <respuesta detallada>
Categoría: FAQ
Info FAQ:
  - Categoría: académico
Publicar
```

**FAQ 2:**
```
Título: ¿Qué metodología utilizan?
Contenido: <respuesta>
Categoría: FAQ
Info FAQ: académico
```

**... crea 4 más ...**

**AHORA CREA 6 FAQs ADMINISTRATIVAS:**

**FAQ 7:**
```
Título: ¿Cuáles son los métodos de pago?
Contenido: <respuesta>
Categoría: FAQ
Info FAQ: administrativo
```

**... crea 5 más ...**

---

## **MÓDULO 3.6: CONFIGURACIÓN DE SEGURIDAD AVANZADA**

### **Paso 3.6.1: Configurar Wordfence Completamente**

**VE A: `Wordfence > Firewall`**

1. **Configurar Firewall:**
   - Activa: "Firewall Status: Enabled"
   - Modo: "Learning Mode" por 7 días
   - Después cambia a: "Enabled and Protecting"

2. **Configurar Rate Limiting:**
   - Ve a: `Wordfence > Firewall > Rate Limiting`
   - Activa rate limiting para:
     - Humans: 240 requests/minuto
     - Crawlers: 120 requests/minuto
     - 404s: 60 requests/minuto

3. **Configurar Login Security:**
   - Ve a: `Wordfence > Login Security`
   - Activa 2FA para administradores
   - Requiere contraseñas fuertes

### **Paso 3.6.2: Configurar wp-config.php para Seguridad**

**CONECTA POR SSH A TU SERVIDOR:**
```bash
cd /var/www/academia-ingles
nano wp-config.php
```

**AÑADE ESTAS LÍNEAS ANTES DE "That's all, stop editing!":**
```php
// ==================== SEGURIDAD AVANZADA ====================

// Deshabilitar editor de temas/plugins
define('DISALLOW_FILE_EDIT', true);

// Deshabilitar instalación de plugins/themes
define('DISALLOW_FILE_MODS', true);

// Forzar SSL en admin
define('FORCE_SSL_ADMIN', true);

// Limitar revisiones
define('WP_POST_REVISIONS', 5);

// Auto-save interval (segundos)
define('AUTOSAVE_INTERVAL', 300);

// Deshabilitar trash
define('EMPTY_TRASH_DAYS', 7);

// Deshabilitar cron de WordPress (usar cron real del sistema)
define('DISABLE_WP_CRON', true);

// Cambiar prefix de tablas (si instalación nueva)
$table_prefix = 'academia_';  // Cambia esto si es una instalación nueva

// Bloquer acceso a archivos .log y .txt
define('DISALLOW_UNFILTERED_HTML', true);

// Deshabilitar XML-RPC
add_filter('xmlrpc_enabled', '__return_false');

// Headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
```

### **Paso 3.6.3: Configurar CORS para GraphQL**

**CREA UN PLUGIN PERSONALIZADO PARA CORS:**

**VE A: `Plugins > Añadir nuevo > Subir plugin`**

**Crea un archivo llamado: `graphql-cors.php` con este contenido:**
```php
<?php
/**
 * Plugin Name: GraphQL CORS Headers
 * Description: Configura CORS para WPGraphQL
 * Version: 1.0.0
 * Author: Academia de Inglés
 */

add_filter('graphql_response_headers', function($headers) {
    // Lista de dominios permitidos
    $allowed_origins = [
        'https://academia-ingles.vercel.app',
        'https://www.academiaingles.com',
        'http://localhost:3000',
        'http://localhost:3001',
    ];
    
    // Obtener origen de la solicitud
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Si el origen está en la lista permitida
    if (in_array($origin, $allowed_origins)) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        $headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-WP-Nonce';
        $headers['Access-Control-Allow-Credentials'] = 'true';
        $headers['Access-Control-Max-Age'] = '86400'; // 24 horas
    }
    
    // Headers de seguridad adicionales
    $headers['X-Content-Type-Options'] = 'nosniff';
    $headers['X-Frame-Options'] = 'DENY';
    $headers['X-XSS-Protection'] = '1; mode=block';
    
    return $headers;
});

// Manejar preflight requests
add_action('graphql_process_http_request', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
});

// Rate limiting para GraphQL
add_filter('graphql_request_results', function($response, $schema, $query, $variables, $request) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_name = 'graphql_rate_limit_' . md5($ip);
    $requests = get_transient($transient_name) ?: 0;
    
    // 100 requests por minuto
    if ($requests > 100) {
        return new WP_Error(
            'rate_limit_exceeded',
            'Rate limit exceeded. Please try again in 60 seconds.',
            ['status' => 429]
        );
    }
    
    $requests++;
    set_transient($transient_name, $requests, 60); // 60 segundos
    
    return $response;
}, 10, 5);
```

**SUBE ESTE ARCHIVO COMO PLUGIN Y ACTÍVALO.**

---

## **MÓDULO 3.7: VERIFICACIÓN FINAL DEL BACKEND**

### **Paso 3.7.1: Probar GraphQL API**

**VE A: `GraphQL > GraphiQL IDE` en el panel de WordPress**

**EJECUTA ESTA QUERY PARA VERIFICAR:**
```graphql
query VerifyBackend {
  # Verificar niveles
  niveles(first: 10) {
    nodes {
      databaseId
      title
      slug
      infoNivel {
        codigoVisual
        duracion
        precio
        linkPago
        imagenLibro {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      dificultad {
        nodes {
          name
          slug
        }
      }
    }
  }
  
  # Verificar FAQs
  posts(where: {categoryName: "FAQ"}, first: 10) {
    nodes {
      databaseId
      title
      content
      infoFAQ {
        categoria
      }
    }
  }
}
```

**SI VES LOS DATOS, EL BACKEND ESTÁ LISTO.**

### **Paso 3.7.2: Crear Script de Verificación**

**CREA UN ARCHIVO `verify-backend.sh` EN TU COMPUTADORA:**
```bash
#!/bin/bash

echo "=== VERIFICACIÓN BACKEND WORDPRESS ==="
echo ""

# 1. Verificar URL de WordPress
echo "1. Verificando WordPress..."
curl -s -o /dev/null -w "%{http_code}\n" https://academiaingles.com
echo ""

# 2. Verificar GraphQL endpoint
echo "2. Verificando GraphQL..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}' \
  https://academiaingles.com/graphql | jq .
echo ""

# 3. Verificar niveles
echo "3. Verificando niveles..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ niveles { nodes { title } } }"}' \
  https://academiaingles.com/graphql | jq '.data.niveles.nodes'
echo ""

# 4. Verificar headers de seguridad
echo "4. Verificando headers de seguridad..."
curl -I https://academiaingles.com/graphql | grep -i "access-control\|x-"
echo ""

# 5. Verificar SSL
echo "5. Verificando SSL..."
openssl s_client -connect academiaingles.com:443 -servername academiaingles.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
echo ""

echo "=== VERIFICACIÓN COMPLETA ==="
```

**EJECÚTALO:**
```bash
chmod +x verify-backend.sh
./verify-backend.sh
```

---

# **PARTE 4: INTEGRACIÓN FRONTEND-BACKEND CON ANTIGRAVITY/VS CODE**

> **NOTA IMPORTANTE:** Gran parte del código de esta sección (Apollo Client, Queries, Hooks, Types) **YA HA SIDO CREADO** por el agente para facilitar la integración.
>
> **Archivos ya existentes:**
> - `lib/apollo-client.ts`
> - `lib/queries.ts` (¡Ojo! Este archivo espera un campo `descripcion` en ACF, no `descripcion_corta`)
> - `hooks/useLevels.ts`
> - `types/index.ts`
>
> Tu trabajo será verificar que estos archivos existen y conectar el WordPress para que cumpla con los requisitos definidos en ellos.

## **MÓDULO 4.1: CONFIGURACIÓN DEL PROYECTO PARA INTEGRACIÓN**

### **Paso 4.1.1: Estructura Final de Carpetas**

**ASEGÚRATE DE QUE TU PROYECTO TIENE ESTA ESTRUCTURA:**
```
academia-ingles/
├── app/
│   ├── (dashboard)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── levels/
│   ├── checkout/
│   └── shared/
├── lib/
│   ├── apollo-client.ts
│   ├── queries.ts
│   ├── mutations.ts
│   ├── validation.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── useLevels.ts
│   ├── useFAQs.ts
│   └── useNewsletter.ts
├── public/
│   ├── images/
│   └── fonts/
└── ...
```

### **Paso 4.1.2: Configurar Apollo Client**

**ABRE VS CODE Y PEGA ESTE PROMPT EN ANTIGRAVITY O USA CURSOR:**

> **PROMPT PARA ANTIGRAVITY/CURSOR:**
```
Actúa como Senior Fullstack Developer. Necesito configurar Apollo Client para conectar mi Next.js 16 App Router con WordPress Headless via GraphQL.

**REQUERIMIENTOS:**

1. **ARCHIVO: lib/apollo-client.ts**
- Configurar Apollo Client con manejo de errores avanzado
- Implementar retry logic con exponential backoff
- Configurar cache optimizado
- Añadir headers de seguridad
- Manejar autenticación si es necesario

2. **ARCHIVO: lib/queries.ts**
- Query para obtener todos los niveles con sus campos ACF
- Query para obtener FAQs por categoría
- Query para obtener información del sitio
- Usar fragmentos para reutilización

3. **ARCHIVO: app/providers.tsx**
- Provider para Apollo Client
- Provider para React Query
- Error Boundary global
- Suspense boundaries

4. **ARCHIVO: hooks/useLevels.ts**
- Custom hook para fetching de niveles
- Manejo de loading, error, data
- Refetching automático
- Cache management

**DATOS DE CONEXIÓN:**
- URL GraphQL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL
- WordPress está configurado con WPGraphQL y ACF

**GENERA EL CÓDIGO COMPLETO PARA LOS 4 ARCHIVOS.**
```

**DESPUÉS DE EJECUTAR, VERIFICA QUE SE CREARON LOS ARCHIVOS.**

### **Paso 4.1.3: Crear Types TypeScript**

**ARCHIVO: `types/index.ts` (crea manualmente o con prompt):**

```typescript
// WordPress Image Type
export interface WordPressImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

// Level ACF Fields
export interface LevelACF {
  codigoVisual: string;
  duracion: string;
  precio: number;
  descripcion?: string;
  linkPago: string;
  imagenLibro: WordPressImage;
}

// Level Type
export interface Level {
  id: number;
  databaseId: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: {
    node: WordPressImage;
  };
  infoNivel: LevelACF;
  dificultad?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
}

// FAQ Type
export interface FAQ {
  id: number;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  infoFAQ?: {
    categoria: 'académico' | 'administrativo';
  };
}

// Site Settings
export interface SiteSettings {
  title: string;
  description: string;
  language: string;
  timezone: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// Pagination
export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Filter Params
export interface LevelFilterParams {
  search?: string;
  dificultad?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';
}
```

### **Paso 4.1.4: Crear Validación con Zod**

**ARCHIVO: `lib/validation.ts`:**

```typescript
import { z } from 'zod';

// WordPress Image Schema
export const wordPressImageSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().min(1, 'Alt text is required'),
  mediaDetails: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
});

// Level ACF Schema
export const levelACFSchema = z.object({
  codigoVisual: z.string().min(1, 'Código visual is required').max(10),
  duracion: z.string().min(1, 'Duración is required'),
  precio: z.number().min(0, 'Precio must be positive'),
  descripcion: z.string().optional(),
  linkPago: z.string().url('Link de pago must be a valid URL'),
  imagenLibro: wordPressImageSchema,
});

// Level Schema
export const levelSchema = z.object({
  id: z.number(),
  databaseId: z.number(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.object({
    node: wordPressImageSchema,
  }).optional(),
  infoNivel: levelACFSchema,
  dificultad: z.object({
    nodes: z.array(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    ),
  }).optional(),
});

// FAQ Schema
export const faqSchema = z.object({
  id: z.number(),
  databaseId: z.number(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  infoFAQ: z.object({
    categoria: z.enum(['académico', 'administrativo']),
  }).optional(),
});

// Newsletter Subscription Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone must be at least 8 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  subject: z.enum(['general', 'admissions', 'support', 'other']),
});

// Validation Functions
export const validateLevels = (data: unknown) => {
  try {
    return levelSchema.array().parse(data);
  } catch (error) {
    console.error('Level validation error:', error);
    throw new Error('Invalid level data structure');
  }
};

export const validateFAQs = (data: unknown) => {
  try {
    return faqSchema.array().parse(data);
  } catch (error) {
    console.error('FAQ validation error:', error);
    throw new Error('Invalid FAQ data structure');
  }
};
```

---

## **MÓDULO 4.2: CONEXIÓN REAL CON WORDPRESS**

### **Paso 4.2.1: Configurar Apollo Client Real**

**ARCHIVO: `lib/apollo-client.ts` (versión completa):**

```typescript
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// HTTP Link configuration
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
  credentials: 'same-origin',
  headers: {
    'Apollo-Require-Preflight': 'true',
    'Content-Type': 'application/json',
  },
  fetchOptions: {
    mode: 'cors',
  },
});

// Error Link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );
      
      // Log to Sentry or other monitoring service
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry.captureException(new Error(`GraphQL Error: ${message}`));
      }
      
      // Handle specific error codes
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Handle authentication errors
        console.log('User authentication required');
      }
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle specific network errors
    if ('statusCode' in networkError) {
      switch (networkError.statusCode) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limit exceeded');
          // Implement exponential backoff
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Server error');
          break;
      }
    }
  }
});

// Retry Link with exponential backoff
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error) => {
      // Retry on network errors, but not on GraphQL errors
      return !!error && !('graphQLErrors' in error);
    },
  },
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        niveles: {
          keyArgs: false,
          merge(existing = [], incoming: any[], { args }) {
            if (!args || !args.after) {
              return incoming;
            }
            return [...existing, ...incoming];
          },
        },
        posts: {
          keyArgs: ['where'],
          merge(existing = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Nivel: {
      keyFields: ['databaseId'],
    },
    Post: {
      keyFields: ['databaseId'],
    },
  },
});

// Create Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to clear cache
export const clearApolloCache = () => {
  client.cache.reset();
};

// Helper function to refetch queries
export const refetchQueries = (queryNames: string[]) => {
  queryNames.forEach(queryName => {
    client.refetchQueries({
      include: [queryName],
    });
  });
};
```

### **Paso 4.2.2: Crear Queries GraphQL**

**ARCHIVO: `lib/queries.ts`:**

```typescript
import { gql } from '@apollo/client';

// Fragment for WordPress Image
export const MEDIA_ITEM_FRAGMENT = gql`
  fragment MediaItemFragment on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

// Fragment for Level ACF Fields
export const LEVEL_ACF_FRAGMENT = gql`
  fragment LevelAcfFragment on Nivel_InfoNivel {
    codigoVisual
    duracion
    precio
    descripcion
    linkPago
    imagenLibro {
      ...MediaItemFragment
    }
  }
`;

// Fragment for Level
export const LEVEL_FRAGMENT = gql`
  fragment LevelFragment on Nivel {
    databaseId
    title
    slug
    content
    excerpt
    featuredImage {
      node {
        ...MediaItemFragment
      }
    }
    infoNivel {
      ...LevelAcfFragment
    }
    dificultad {
      nodes {
        name
        slug
      }
    }
  }
  ${MEDIA_ITEM_FRAGMENT}
  ${LEVEL_ACF_FRAGMENT}
`;

// Query to get all levels
export const GET_ALL_LEVELS = gql`
  query GetAllLevels(
    $first: Int = 100
    $after: String
    $where: RootQueryToNivelConnectionWhereArgs
  ) {
    niveles(first: $first, after: $after, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...LevelFragment
      }
    }
  }
  ${LEVEL_FRAGMENT}
`;

// Query to get a single level by slug
export const GET_LEVEL_BY_SLUG = gql`
  query GetLevelBySlug($slug: ID!) {
    nivel(id: $slug, idType: SLUG) {
      ...LevelFragment
    }
  }
  ${LEVEL_FRAGMENT}
`;

// Query to get FAQs
export const GET_FAQS = gql`
  query GetFAQs($category: String) {
    posts(
      where: { 
        categoryName: "FAQ"
        orderby: { field: DATE, order: DESC }
      }
      first: 100
    ) {
      nodes {
        databaseId
        title
        content
        excerpt
        infoFAQ {
          categoria
        }
      }
    }
  }
`;

// Query to get site settings
export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings {
    generalSettings {
      title
      description
      language
      timezone
    }
    menuItems(where: { location: PRIMARY }) {
      nodes {
        label
        url
        target
      }
    }
  }
`;

// Query to search levels
export const SEARCH_LEVELS = gql`
  query SearchLevels($search: String!) {
    niveles(where: { search: $search }, first: 10) {
      nodes {
        ...LevelFragment
      }
    }
  }
  ${LEVEL_FRAGMENT}
`;
```

### **Paso 4.2.3: Crear Providers**

**ARCHIVO: `app/providers.tsx`:**

```typescript
'use client';

import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, useState } from 'react';
import { client } from '@/lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
            </div>
          }
        >
          {children}
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApolloProvider>
  );
}
```

### **Paso 4.2.4: Actualizar Layout Principal**

**ARCHIVO: `app/layout.tsx` (actualizado):**

```typescript
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SkipLink } from '@/components/layout/skip-link';
import { Announcement } from '@/components/layout/announcement';
import { Providers } from './providers';
import './globals.css';

// Font optimization
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: 'Academia de Inglés - Aprende inglés en 4 meses',
    template: '%s | Academia de Inglés',
  },
  description: 'Aprende inglés rápido y efectivo con nuestra metodología garantizada. Clases personalizadas, profesores nativos y resultados en 4 meses.',
  keywords: ['inglés', 'academia', 'cursos', 'aprender inglés', 'clases inglés', 'inglés rápido'],
  authors: [{ name: 'Academia de Inglés' }],
  creator: 'Academia de Inglés',
  publisher: 'Academia de Inglés',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'es-DO': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: '/',
    title: 'Academia de Inglés - Aprende inglés en 4 meses',
    description: 'Aprende inglés rápido y efectivo con nuestra metodología garantizada.',
    siteName: 'Academia de Inglés',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Academia de Inglés',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academia de Inglés',
    description: 'Aprende inglés rápido y efectivo',
    images: ['/twitter-image.jpg'],
    creator: '@academiaingles',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Academia de Inglés',
  description: 'Academia especializada en enseñanza de inglés con metodología acelerada',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Principal #123',
    addressLocality: 'Santo Domingo',
    addressRegion: 'Distrito Nacional',
    postalCode: '10101',
    addressCountry: 'DO',
  },
  priceRange: '$$',
  openingHours: 'Mo-Fr 08:00-20:00, Sa 08:00-14:00',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/_next/static/media/`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Add any other preloads here */}
      </head>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <SkipLink />
        <Announcement />
        <Providers>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        
        {/* Sentry (if configured) */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <script
            src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"
            crossOrigin="anonymous"
            async
          />
        )}
      </body>
    </html>
  );
}
```

---

## **MÓDULO 4.3: INTEGRAR DATOS REALES EN LOS COMPONENTES**

### **Paso 4.3.1: Crear Hook para Niveles**

**ARCHIVO: `hooks/useLevels.ts`:**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { Level } from '@/types';
import { validateLevels } from '@/lib/validation';

// GraphQL query
const GET_LEVELS_QUERY = gql`
  query GetLevelsForHook {
    niveles(first: 100) {
      nodes {
        databaseId
        title
        slug
        infoNivel {
          codigoVisual
          duracion
          precio
          descripcion
          linkPago
          imagenLibro {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        dificultad {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Fetch function
const fetchLevels = async (): Promise<Level[]> => {
  try {
    const { data } = await client.query({
      query: GET_LEVELS_QUERY,
      fetchPolicy: 'network-only',
    });

    if (!data?.niveles?.nodes) {
      throw new Error('No levels data received');
    }

    // Transform WordPress data to our format
    const transformedLevels = data.niveles.nodes.map((node: any) => ({
      id: node.databaseId,
      databaseId: node.databaseId,
      title: node.title,
      slug: node.slug,
      infoNivel: {
        codigoVisual: node.infoNivel.codigoVisual,
        duracion: node.infoNivel.duracion,
        precio: node.infoNivel.precio,
        descripcion: node.infoNivel.descripcion || '',
        linkPago: node.infoNivel.linkPago,
        imagenLibro: {
          sourceUrl: node.infoNivel.imagenLibro.sourceUrl,
          altText: node.infoNivel.imagenLibro.altText || `Libro ${node.title}`,
          mediaDetails: node.infoNivel.imagenLibro.mediaDetails,
        },
      },
      dificultad: node.dificultad,
    }));

    // Validate with Zod
    return validateLevels(transformedLevels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

// React Query hook
export const useLevels = () => {
  return useQuery({
    queryKey: ['levels'],
    queryFn: fetchLevels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for single level
export const useLevel = (slug: string) => {
  return useQuery({
    queryKey: ['level', slug],
    queryFn: async () => {
      const { data } = await client.query({
        query: gql`
          query GetLevel($slug: ID!) {
            nivel(id: $slug, idType: SLUG) {
              databaseId
              title
              slug
              content
              infoNivel {
                codigoVisual
                duracion
                precio
                descripcion
                linkPago
                imagenLibro {
                  sourceUrl
                  altText
                }
              }
            }
          }
        `,
        variables: { slug },
      });

      return data.nivel;
    },
    enabled: !!slug,
  });
};

// Hook for filtered levels
export const useFilteredLevels = (filters: {
  dificultad?: string[];
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ['levels', 'filtered', filters],
    queryFn: () => fetchLevels().then(levels => {
      return levels.filter(level => {
        // Filter by difficulty
        if (filters.dificultad && filters.dificultad.length > 0) {
          const levelDifficulties = level.dificultad?.nodes.map(n => n.slug) || [];
          const hasMatchingDifficulty = filters.dificultad.some(diff => 
            levelDifficulties.includes(diff)
          );
          if (!hasMatchingDifficulty) return false;
        }

        // Filter by price
        if (filters.minPrice !== undefined && level.infoNivel.precio < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && level.infoNivel.precio > filters.maxPrice) {
          return false;
        }

        return true;
      });
    }),
  });
};
```

### **Paso 4.3.2: Actualizar Componente de Niveles con Datos Reales**

**ARCHIVO: `components/sections/levels-roadmap.tsx` (actualizado):**

```typescript
'use client';

import { useState } from 'react';
import { useLevels } from '@/hooks/useLevels';
import { LevelCard } from '@/components/levels/level-card';
import { LevelSkeleton } from '@/components/levels/level-skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function LevelsRoadmap() {
  const [activeFilter, setActiveFilter] = useState<LevelFilter>('all');
  const { data: levels, isLoading, error, refetch } = useLevels();

  // Filter levels based on active filter
  const filteredLevels = levels?.filter(level => {
    if (activeFilter === 'all') return true;
    
    const difficulty = level.dificultad?.nodes?.[0]?.slug;
    switch (activeFilter) {
      case 'beginner':
        return difficulty === 'principiante' || level.infoNivel.codigoVisual.startsWith('A');
      case 'intermediate':
        return difficulty === 'intermedio' || level.infoNivel.codigoVisual.startsWith('B');
      case 'advanced':
        return difficulty === 'avanzado' || level.infoNivel.codigoVisual.startsWith('C');
      default:
        return true;
    }
  });

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertDescription>
              Error cargando los niveles. Por favor, intenta de nuevo.
              <Button onClick={() => refetch()} className="ml-4">
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="niveles" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            TU CAMINO A LA FLUIDEZ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comienza en tu nivel actual y avanza hasta dominar el inglés
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Todos los Niveles
          </Button>
          <Button
            variant={activeFilter === 'beginner' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('beginner')}
          >
            Principiante (A1-A2)
          </Button>
          <Button
            variant={activeFilter === 'intermediate' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('intermediate')}
          >
            Intermedio (B1-B2)
          </Button>
          <Button
            variant={activeFilter === 'advanced' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('advanced')}
          >
            Avanzado (C1-C2)
          </Button>
        </div>

        {/* Levels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LevelSkeleton key={i} />
            ))}
          </div>
        ) : filteredLevels && filteredLevels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLevels.map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron niveles con los filtros seleccionados.
            </p>
          </div>
        )}

        {/* Stats */}
        {!isLoading && filteredLevels && filteredLevels.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {filteredLevels.length}
                </div>
                <div className="text-sm text-gray-600">Niveles Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {Math.min(...filteredLevels.map(l => l.infoNivel.precio))}
                </div>
                <div className="text-sm text-gray-600">Precio Desde (RD$)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">4</div>
                <div className="text-sm text-gray-600">Meses Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">100%</div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

### **Paso 4.3.3: Actualizar Página Principal**

**ARCHIVO: `app/page.tsx` (final):**

```typescript
import { Hero } from '@/components/sections/hero';
import { Methodology } from '@/components/sections/methodology';
import { LevelsRoadmap } from '@/components/sections/levels-roadmap';
import { LevelTestCTA } from '@/components/sections/level-test-cta';
import { FAQs } from '@/components/sections/faqs';
import { StatsGrid } from '@/components/sections/stats-grid';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Stats Section */}
      <StatsGrid />
      
      {/* Methodology Section */}
      <Methodology />
      
      {/* Levels Roadmap */}
      <LevelsRoadmap />
      
      {/* Level Test CTA */}
      <LevelTestCTA />
      
      {/* FAQs Section */}
      <FAQs />
      
      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Confiado por más de 500 estudiantes
          </h3>
          <p className="text-gray-600">
            Únete a nuestra comunidad y comienza tu viaje hacia la fluidez en inglés
          </p>
        </div>
      </section>
    </>
  );
}
```

---

## **MÓDULO 4.4: IMPLEMENTAR FUNCIONALIDADES CRÍTICAS**

### **Paso 4.4.1: Newsletter con Server Actions**

**ARCHIVO: `app/actions/newsletter.ts`:**

```typescript
'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

// Zod schema for validation
const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

// Redis setup for rate limiting
const redis = Redis.fromEnv();

// Rate limiting helper
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `newsletter:${ip}`;
  const requests = await redis.incr(key);
  
  if (requests === 1) {
    await redis.expire(key, 3600); // 1 hour
  }
  
  return requests <= 10; // 10 requests per hour
}

// Honeypot detection
function isBotSubmission(formData: FormData): boolean {
  const honeypot = formData.get('website');
  return !!honeypot && honeypot !== '';
}

// Main server action
export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}> {
  try {
    // Get IP for rate limiting
    const ip = 'unknown'; // In production, get from headers
    
    // Rate limiting check
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return {
        success: false,
        message: 'Demasiadas solicitudes. Por favor, intenta de nuevo en una hora.',
      };
    }
    
    // Honeypot check
    if (isBotSubmission(formData)) {
      console.log('Bot detected, returning fake success');
      return {
        success: true,
        message: '¡Gracias por suscribirte!',
      };
    }
    
    // Extract and validate data
    const data = {
      email: formData.get('email'),
      name: formData.get('name'),
      consent: formData.get('consent') === 'on',
    };
    
    const validatedData = newsletterSchema.parse(data);
    
    // Save to database (example with Supabase)
    // In production, implement your database logic here
    
    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'Academia de Inglés <no-reply@academiaingles.com>',
        to: validatedData.email,
        subject: '¡Bienvenido a nuestra newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #E63946;">¡Gracias por suscribirte!</h1>
            <p>Hola ${validatedData.name || 'estudiante'},</p>
            <p>Te has suscrito exitosamente a la newsletter de Academia de Inglés.</p>
            <p>Recibirás nuestros mejores consejos, ofertas especiales y actualizaciones.</p>
            <p>Si no solicitaste esta suscripción, por favor ignora este email.</p>
            <br>
            <p>Saludos,<br>El equipo de Academia de Inglés</p>
          </div>
        `,
      });
    }
    
    return {
      success: true,
      message: '¡Gracias por suscribirte! Te hemos enviado un email de confirmación.',
    };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      
      return {
        success: false,
        message: 'Error de validación',
        errors,
      };
    }
    
    // Handle other errors
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Error interno del servidor. Por favor, intenta de nuevo más tarde.',
    };
  }
}
```

**ARCHIVO: `components/newsletter/newsletter-form.tsx`:**

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { Loader2, CheckCircle } from 'lucide-react';

type NewsletterFormData = {
  email: string;
  name?: string;
  consent: boolean;
};

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      name: '',
      consent: false,
    },
  });
  
  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      if (data.name) formData.append('name', data.name);
      formData.append('consent', data.consent ? 'on' : '');
      
      const result = await subscribeToNewsletter(null, formData);
      
      if (result.success) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ¡Suscripción Exitosa!
        </h3>
        <p className="text-green-700">
          Te has suscrito correctamente a nuestra newsletter.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot field - hidden from users */}
      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} />
      </div>
      
      {/* Name field */}
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Nombre (opcional)
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Tu nombre"
          {...register('name')}
          disabled={isSubmitting}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      {/* Email field */}
      <div>
        <Label htmlFor="email" className="mb-2 block">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          {...register('email')}
          disabled={isSubmitting}
          className={errors.email ? 'border-red-500' : ''}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      {/* Consent checkbox */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="consent"
          {...register('consent')}
          disabled={isSubmitting}
        />
        <Label htmlFor="consent" className="text-sm">
          Acepto recibir comunicaciones de marketing y acepto la{' '}
          <a href="/privacidad" className="text-red-600 hover:underline">
            política de privacidad
          </a>
          .
        </Label>
      </div>
      {errors.consent && (
        <p className="text-sm text-red-500">{errors.consent.message}</p>
      )}
      
      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Suscribiendo...
          </>
        ) : (
          'Suscribirse'
        )}
      </Button>
      
      {/* Privacy note */}
      <p className="text-xs text-gray-500">
        Respetamos tu privacidad. Puedes cancelar tu suscripción en cualquier momento.
      </p>
    </form>
  );
}
```

### **Paso 4.4.2: Configurar Next.js para Imágenes Externas**

> **NOTA IMPORTANTE:** Este paso YA HA SIDO REALIZADO Y MEJORADO por el agente. El archivo `next.config.js` actual ya incluye la configuración de imágenes, más soporte para PWA y Sentry. **NO SOBRESCRIBAS EL ARCHIVO ACTUAL** con el código de abajo a menos que quieras perder esas funcionalidades. Úsalo solo como referencia.

**ARCHIVO: `next.config.js` (final):**

```javascript
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Optimizaciones de Build
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false, // Por seguridad (Guía 2)

  // Configuración de Imágenes (Fusión Guía 1 + Guía 2)
  // Usamos remotePatterns (moderno) cubriendo todos los dominios necesarios
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'academiaingles.com', // WordPress Prod
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.academiaingles.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'inglesexpress.com', // Dominio final Guía 2
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.inglesexpress.com', // Subdominios (staging, dev)
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com', // Avatares
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com', // Jetpack/Photon CDN
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Placeholders
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 60 segundos mínimo
  },

  // Headers de Seguridad y Caché (Fusión Completa)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Seguridad (Guía 1 + 2)
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Guía 1 decía SAMEORIGIN, Guía 2 DENY. SAMEORIGIN es más seguro para iframes propios.
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      // Caché para Assets Estáticos (Guía 2 - Crítico para performance)
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },

  // Redirecciones (Guía 2)
  async redirects() {
    return [
      { source: '/admin', destination: '/', permanent: false },
      { source: '/wp-admin', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: false },
      { source: '/home', destination: '/', permanent: true }, // Normalización
      { source: '/courses', destination: '/niveles', permanent: true }, // Alias
    ];
  },

  // Rewrites para Proxy de API (Guía 2 - Muy útil para evitar CORS en cliente)
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://inglesexpress.com/graphql',
      },
    ];
  },

  // Configuración del Compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Configuración Experimental (ISR y Sentry)
  experimental: {
    // isrMemoryCacheSize: 50, // Comentado: Usar valor por defecto a menos que haya problemas de memoria
    serverComponentsExternalPackages: ['@sentry/nextjs'], // Necesario para Sentry en App Router
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

### **Paso 4.4.3: Configurar Middleware para Seguridad**

**ARCHIVO: `middleware.ts` (en la raíz del proyecto):**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de user agents de bots maliciosos
const MALICIOUS_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'Barkrowler',
  'Baiduspider',
  'YandexBot',
  'ccbot',
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // 1. Bloquear bots maliciosos
  const isMaliciousBot = MALICIOUS_BOTS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
  
  if (isMaliciousBot) {
    console.log(`Blocked malicious bot: ${userAgent} from IP: ${ip}`);
    return new NextResponse('Access denied', { status: 403 });
  }
  
  // 2. Headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 3. Prevenir MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // 4. CSP Header dinámico
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;`
  );
  
  // 5. Rate limiting por IP (implementación básica)
  const rateLimitKey = `rate-limit:${ip}`;
  // En producción, usar Redis o similar para rate limiting
  
  // 6. Logging para auditoría
  console.log(`${new Date().toISOString()} - ${ip} - ${request.method} ${request.url} - ${userAgent}`);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

## **MÓDULO 4.5: PREPARACIÓN PARA OPERACIONES Y DEPLOY (BRIDGE)**

Antes de pasar a la guía de despliegue, debemos preparar la infraestructura local para que soporte los scripts de mantenimiento y la monitorización avanzada que configuraremos más adelante.

### **Paso 4.5.1: Instalación de Dependencias de Operaciones**

La guía de despliegue utiliza Redis para una estrategia de caché multinivel y herramientas de análisis que no instalamos al inicio.

```bash
# 1. Instalar cliente de Redis (necesario para caché avanzado y rate limiting)
pnpm add @upstash/redis

# 2. Instalar analizador de bundles (para optimización de build)
pnpm add -D @next/bundle-analyzer

# 3. Instalar cross-env para scripts de mantenimiento (compatibilidad Windows/Linux)
pnpm add -D cross-env
```

### **Paso 4.5.2: Estandarización de Variables de Entorno**

Necesitamos alinear nuestro archivo `.env.local` actual con lo que exigirá el sistema de despliegue profesional.

**Actualiza tu archivo `.env.local` agregando estas variables al final:**

```env
# ============================================
# BRIDGE CONFIGURATION (Requerido para Guía de Despliegue)
# ============================================
# Identificación de ambiente
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_APP_VERSION=1.0.0

# Emails administrativos (para alertas del sistema)
ADMIN_EMAIL=admin@inglesexpress.com
SECURITY_ALERT_EMAIL=security@inglesexpress.com

# Redis (Dejar vacío por ahora, se configurará en Vercel)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### **Paso 4.5.3: Creación de Estructura de Operaciones**

Los scripts de mantenimiento y backups automatizados de la siguiente fase requieren carpetas específicas que Next.js no crea por defecto.

**Ejecuta estos comandos en la raíz del proyecto para crear la estructura:**

```bash
# 1. Carpetas para logs y auditoría
mkdir -p logs
touch logs/.gitkeep

# 2. Carpetas para backups automatizados
mkdir -p backups/config
mkdir -p backups/content
touch backups/.gitkeep

# 3. Carpeta para scripts de automatización (DevOps)
mkdir -p scripts
```

---

## **MÓDULO 4.6: IMPLEMENTACIÓN DE PWA Y SEO TÉCNICO**

### **Paso 4.6.1: Instalación de Dependencias PWA**

Para convertir la aplicación en una Progressive Web App (PWA) instalable y offline-first, usaremos una librería optimizada para App Router.

```bash
pnpm add @ducanh2912/next-pwa
```

### **Paso 4.6.2: Configuración de Archivos Técnicos SEO**

Next.js 16 permite generar archivos técnicos dinámicamente usando código TypeScript.

**ARCHIVO: `app/manifest.ts` (Configuración PWA):**

```typescript
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Academia de Inglés - Aprende en 4 Meses',
    short_name: 'Academia Inglés',
    description: 'Aprende inglés rápido y efectivo con nuestra metodología garantizada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E63946', // Rojo de la marca
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

**ARCHIVO: `app/sitemap.ts` (Mapa del sitio automático):**

```typescript
import { MetadataRoute } from 'next';
import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

const GET_ALL_SLUGS = gql`
  query GetAllSlugs {
    niveles(first: 100) {
      nodes {
        slug
        modified
      }
    }
    posts(first: 100) {
      nodes {
        slug
        modified
      }
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://academiaingles.com';

  // Obtener datos dinámicos
  let nivelesLines: any[] = [];
  try {
    const { data } = await client.query({
      query: GET_ALL_SLUGS,
      fetchPolicy: 'no-cache' // Siempre datos frescos para sitemap
    });

    nivelesLines = data.niveles.nodes.map((nivel: any) => ({
      url: `${baseUrl}/niveles/${nivel.slug}`,
      lastModified: new Date(nivel.modified),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generando sitemap:', error);
  }

  // Rutas estáticas
  const staticRoutes = [
    '',
    '/niveles',
    '/metodologia',
    '/contacto',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...nivelesLines];
}
```

**ARCHIVO: `app/robots.ts` (Control de robots):**

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://academiaingles.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/wp-admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### **Paso 4.6.3: Actualización de Configuración Next.js**

Actualizamos `next.config.js` para integrar PWA.

**ARCHIVO: `next.config.js` (Actualizado con PWA):**

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development', // Desactivar en desarrollo
  workboxOptions: {
    disableDevLogs: true,
  },
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Optimizaciones de Build
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Configuración de Imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'academiaingles.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.academiaingles.com',
        pathname: '/**',
      },
      // ... otros dominios ...
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers de Seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // ... redirects y rewrites ...
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
```

### **Paso 4.6.4: Preparación de Assets**

**Debes crear/añadir estos iconos en la carpeta `public/icons/`:**
1. `icon-192x192.png`
2. `icon-512x512.png`
3. `apple-icon.png` (en raíz `public/`)

---

# **PARTE 5: DEPLOYMENT FINAL Y VERIFICACIÓN**

## **MÓDULO 5.1: DESPLIEGUE EN VERCEL**

### **Paso 5.1.1: Configurar Variables de Entorno en Vercel**

1. **Ve a [vercel.com](https://vercel.com)**
2. **Selecciona tu proyecto** "academia-ingles"
3. **Ve a: Settings > Environment Variables**
4. **Añade TODAS estas variables:**

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://academiaingles.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://academiaingles.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123XYZ789
NEXT_PUBLIC_SITE_URL=https://academia-ingles.vercel.app
NEXT_PUBLIC_SITE_NAME="Academia de Inglés"
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false
STRIPE_SECRET_KEY=sk_test_51ABC123XYZ789
RESEND_API_KEY=re_123456789
UPSTASH_REDIS_REST_URL=https://upstash.io/redis/123
UPSTASH_REDIS_REST_TOKEN=abc123
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### **Paso 5.1.2: Desplegar a Producción**

```bash
# 1. Sube todos los cambios a GitHub
git add .
git commit -m "🚀 Ready for production deployment"
git push origin main

# 2. Despliega en Vercel
vercel --prod

# 3. Verifica el despliegue
# Visita: https://academia-ingles.vercel.app
```

### **Paso 5.1.3: Configurar Dominio Personalizado**

1. **En Vercel, ve a: Settings > Domains**
2. **Añade tu dominio:** `academiaingles.com`
3. **Configura los DNS records en tu proveedor de dominio:**

```
Tipo: A
Nombre: @
Valor: 76.76.21.21
TTL: 3600

Tipo: A
Nombre: www
Valor: 76.76.21.21
TTL: 3600

Tipo: TXT
Nombre: @
Valor: "vercel-verification=abc123"
TTL: 3600
```

4. **Espera 1-24 horas** para que se propaguen los DNS

---

## **MÓDULO 5.2: VERIFICACIÓN FINAL**

### **Paso 5.2.1: Script de Verificación Completa**

**CREA UN ARCHIVO: `verify-production.sh`:**

```bash
#!/bin/bash

echo "=== VERIFICACIÓN DE PRODUCCIÓN COMPLETA ==="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
FRONTEND_URL="https://academiaingles.com"
WORDPRESS_URL="https://academiaingles.com"
GRAPHQL_URL="${WORDPRESS_URL}/graphql"

# Función para verificar URL
check_url() {
    local url=$1
    local name=$2
    echo -n "Verificando ${name}... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ ERROR${NC}"
        return 1
    fi
}

# Función para verificar GraphQL
check_graphql() {
    echo -n "Verificando GraphQL API... "
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"{ __typename }"}' \
        "$GRAPHQL_URL")
    
    if echo "$response" | grep -q "data"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ ERROR${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Función para verificar niveles
check_levels() {
    echo -n "Verificando datos de niveles... "
    
    query='{"query":"{ niveles { nodes { title infoNivel { codigoVisual precio } } } }"}'
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$query" \
        "$GRAPHQL_URL")
    
    if echo "$response" | grep -q "niveles"; then
        count=$(echo "$response" | jq '.data.niveles.nodes | length')
        echo -e "${GREEN}✓ OK (${count} niveles)${NC}"
        return 0
    else
        echo -e "${RED}✗ ERROR${NC}"
        return 1
    fi
}

# Función para verificar SSL
check_ssl() {
    echo -n "Verificando SSL... "
    
    if openssl s_client -connect academiaingles.com:443 -servername academiaingles.com < /dev/null 2>/dev/null | openssl x509 -noout -checkend 86400 > /dev/null; then
        echo -e "${GREEN}✓ Válido${NC}"
        return 0
    else
        echo -e "${RED}✗ Expirado o inválido${NC}"
        return 1
    fi
}

# Función para verificar headers de seguridad
check_security_headers() {
    echo -n "Verificando headers de seguridad... "
    
    headers=$(curl -s -I "$FRONTEND_URL")
    
    missing_headers=()
    
    if ! echo "$headers" | grep -q "Strict-Transport-Security"; then
        missing_headers+=("HSTS")
    fi
    
    if ! echo "$headers" | grep -q "X-Content-Type-Options"; then
        missing_headers+=("X-Content-Type-Options")
    fi
    
    if ! echo "$headers" | grep -q "X-Frame-Options"; then
        missing_headers+=("X-Frame-Options")
    fi
    
    if ! echo "$headers" | grep -q "X-XSS-Protection"; then
        missing_headers+=("X-XSS-Protection")
    fi
    
    if [ ${#missing_headers[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Advertencia: Faltan headers: ${missing_headers[*]}${NC}"
        return 1
    fi
}

# Función para verificar performance
check_performance() {
    echo -n "Verificando performance (LCP estimado)... "
    
    # Simulación simple
    load_time=$(curl -s -w "%{time_total}" -o /dev/null "$FRONTEND_URL")
    
    if (( $(echo "$load_time < 3" | bc -l) )); then
        echo -e "${GREEN}✓ Rápido (${load_time}s)${NC}"
        return 0
    elif (( $(echo "$load_time < 5" | bc -l) )); then
        echo -e "${YELLOW}⚠ Moderado (${load_time}s)${NC}"
        return 1
    else
        echo -e "${RED}✗ Lento (${load_time}s)${NC}"
        return 1
    fi
}

# Ejecutar todas las verificaciones
echo "1. Verificando URLs..."
check_url "$FRONTEND_URL" "Frontend"
check_url "$WORDPRESS_URL" "WordPress"
check_url "$GRAPHQL_URL" "GraphQL Endpoint"

echo ""
echo "2. Verificando APIs..."
check_graphql
check_levels

echo ""
echo "3. Verificando Seguridad..."
check_ssl
check_security_headers

echo ""
echo "4. Verificando Performance..."
check_performance

echo ""
echo "=== RESUMEN ==="
echo "- Frontend: https://academiaingles.com"
echo "- WordPress: https://academiaingles.com/wp-admin"
echo "- GraphQL: https://academiaingles.com/graphql"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- GitHub: https://github.com/tu-usuario/academia-ingles"
echo ""
echo "¡Verificación completa! 🎉"
```

**EJECUTA EL SCRIPT:**
```bash
chmod +x verify-production.sh
./verify-production.sh
```

### **Paso 5.2.2: Checklist Final de Producción**

**COPIA Y COMPLETA ESTE CHECKLIST:**

```
✅ FRONTEND (Next.js)
  [ ] 1. Next.js 16.0.7 instalado
  [ ] 2. TypeScript compilando sin errores
  [ ] 3. Tailwind CSS funcionando
  [ ] 4. Apollo Client configurado
  [ ] 5. Variables de entorno configuradas
  [ ] 6. Imágenes optimizadas con next/image
  [ ] 7. Headers de seguridad implementados
  [ ] 8. Middleware configurado
  [ ] 9. Server Actions funcionando
  [ ] 10. Formularios con validación

✅ BACKEND (WordPress)
  [ ] 1. WordPress instalado con HTTPS
  [ ] 2. WPGraphQL activado
  [ ] 3. ACF con campos personalizados
  [ ] 4. Post Types creados
  [ ] 5. Datos de prueba cargados
  [ ] 6. CORS configurado
  [ ] 7. Rate limiting implementado
  [ ] 8. Wordfence configurado
  [ ] 9. Backups automáticos
  [ ] 10. SSL certificado instalado

✅ INTEGRACIÓN
  [ ] 1. GraphQL queries funcionando
  [ ] 2. Datos de WordPress mostrándose en frontend
  [ ] 3. Imágenes cargando desde WordPress
  [ ] 4. Formularios conectados a APIs
  [ ] 5. Newsletter funcionando
  [ ] 6. Error handling implementado
  [ ] 7. Loading states en todos los componentes
  [ ] 8. Cache funcionando correctamente
  [ ] 9. Revalidation automática
  [ ] 10. Fallbacks para datos faltantes

✅ DESPLIEGUE
  [ ] 1. Vercel configurado
  [ ] 2. Dominio personalizado configurado
  [ ] 3. SSL activado
  [ ] 4. Variables de entorno en Vercel
  [ ] 5. Build passing sin errores
  [ ] 6. Deployment automático con GitHub
  [ ] 7. Rollback strategy definida
  [ ] 8. Monitoring configurado
  [ ] 9. Alertas configuradas
  [ ] 10. Backup del código en GitHub

✅ SEGURIDAD
  [ ] 1. HTTPS en todas las URLs
  [ ] 2. Headers de seguridad implementados
  [ ] 3. Rate limiting en APIs
  [ ] 4. Validación de datos con Zod
  [ ] 5. Sanitización de inputs
  [ ] 6. Protección contra XSS
  [ ] 7. Protección contra CSRF
  [ ] 8. SQL injection prevenida
  [ ] 9. Credenciales seguras
  [ ] 10. Logging de seguridad

✅ PERFORMANCE
  [ ] 1. LCP < 2.5 segundos
  [ ] 2. CLS < 0.1
  [ ] 3. FID < 100ms
  [ ] 4. Images optimizadas
  [ ] 5. Fonts optimizadas
  [ ] 6. Code splitting funcionando
  [ ] 7. Cache headers configurados
  [ ] 8. Bundle size optimizado
  [ ] 9. CDN funcionando
  [ ] 10. Core Web Vitals pasando

✅ ACCESIBILIDAD
  [ ] 1. WCAG 2.1 AA cumplido
  [ ] 2. Navegación por teclado
  [ ] 3. Screen reader compatible
  [ ] 4. Contraste de colores adecuado
  [ ] 5. Textos alternativos en imágenes
  [ ] 6. ARIA labels implementados
  [ ] 7. Skip link funcionando
  [ ] 8. Focus management
  [ ] 9. Semantic HTML
  [ ] 10. Testing con herramientas de a11y

✅ SEO
  [ ] 1. Meta tags optimizados
  [ ] 2. Open Graph configurado
  [ ] 3. Twitter Cards configurado
  [ ] 4. JSON-LD structured data
  [ ] 5. Sitemap generado
  [ ] 6. Robots.txt configurado
  [ ] 7. URLs amigables
  [ ] 8. Canonical tags
  [ ] 9. Mobile-friendly
  [ ] 10. Page speed optimizado

TOTAL: ___/80 ✅
```

---

## **MÓDULO 5.3: MANTENIMIENTO Y MONITOREO**

### **Paso 5.3.1: Scripts de Mantenimiento**

**ARCHIVO: `package.json` (scripts actualizados):**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    
    "security:audit": "pnpm audit --fix",
    "security:outdated": "pnpm outdated",
    "security:check": "pnpm run security:audit && pnpm run security:outdated",
    "security:update": "pnpm update --latest next react react-dom @apollo/client graphql",
    "security:scan": "npx @next/security scan",
    
    "deploy:staging": "vercel --env NEXT_PUBLIC_WORDPRESS_API_URL=staging_url",
    "deploy:production": "vercel --prod",
    "deploy": "pnpm run type-check && pnpm run lint && pnpm run test && pnpm run security:check && pnpm run build",
    
    "verify:local": "echo 'Not implemented'",
    "verify:production": "bash scripts/post-deploy.sh",
    "verify:security": "pnpm run security:check",
    
    "backup:config": "bash scripts/backup-config.sh",
    "backup:content": "bash scripts/backup-content.sh",
    "backup:full": "pnpm run backup:config && pnpm run backup:content",
    "restore": "bash scripts/restore.sh",
    "maintenance": "bash scripts/maintenance.sh",
    
    "monitor:performance": "echo 'Use Vercel Analytics'",
    "monitor:errors": "echo 'Use Sentry Dashboard'",
    "monitor:uptime": "echo 'Use UptimeRobot'",
    
    "generate:sitemap": "echo 'Handled by Next.js App Router'",
    "generate:robots": "echo 'Handled by Next.js App Router'",
    
    "clean": "rm -rf .next node_modules",
    "reset": "pnpm run clean && pnpm install && pnpm run build",
    
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build"
  }
}
```

### **Paso 5.3.2: Monitoreo Automático**

**CONFIGURA ESTOS SERVICIOS:**

1. **UptimeRobot:** Para monitoreo de uptime
   - URL: https://academiaingles.com
   - Intervalo: 5 minutos
   - Alertas: Email, Slack, Telegram

2. **Sentry:** Para error tracking
   - Integración con Next.js
   - Alertas por errores críticos
   - Performance monitoring

3. **Google Search Console:**
   - Verificar propiedad del sitio
   - Monitorear indexación
   - Errores de crawling

4. **Vercel Analytics:**
   - Core Web Vitals
   - Analytics en tiempo real
   - Performance insights

5. **Cloudflare (opcional):**
   - CDN global
   - DDoS protection
   - Firewall rules

---

# **RESUMEN Y PRÓXIMOS PASOS**

## **LO QUE HAS CONSTRUIDO:**

1. ✅ **Frontend Next.js 16** moderno con TypeScript y Tailwind
2. ✅ **Backend WordPress Headless** con GraphQL y ACF
3. ✅ **Conexión completa** via Apollo Client
4. ✅ **Sistema de Niveles** con tarjetas interactivas 3D
5. ✅ **Newsletter funcional** con Server Actions y validación
6. ✅ **Checkout simulado** para pagos
7. ✅ **FAQs dinámicas** desde WordPress
8. ✅ **SEO completo** con metadata y structured data
9. ✅ **Seguridad avanzada** en ambos lados
10. ✅ **Despliegue profesional** en Vercel con dominio personalizado

## **PRÓXIMOS PASOS RECOMENDADOS:**

1. **Semana 1:** Monitorear errores y performance
2. **Semana 2:** Añadir analytics real (Google Analytics 4)
3. **Semana 3:** Implementar Stripe para pagos reales
4. **Semana 4:** Añadir blog con contenido educativo
5. **Mes 2:** Implementar sistema de usuarios
6. **Mes 3:** Añadir dashboard de estudiante
7. **Mes 6:** Escalar a múltiples sedes/países

## **RECURSOS ADICIONALES:**

1. **Documentación:** Crea `/docs` en el repositorio
2. **Backups:** Configura backups automáticos diarios
3. **Monitoring:** Setup completo de alertas
4. **CI/CD:** Automatizar testing y deployment
5. **Cache:** Optimizar cache para alto tráfico

---

**🎉 ¡FELICITACIONES! HAS COMPLETADO UN PROYECTO FULLSTACK PROFESIONAL.**

Tu aplicación está ahora en producción, segura, escalable y lista para recibir estudiantes. Recuerda hacer mantenimiento regular y monitorear el performance.

**Para soporte continuo:**
- Revisa los logs en Vercel
- Monitorea errores en Sentry
- Actualiza dependencias mensualmente
- Haz backups semanales

**¡Éxito con tu academia de inglés! 🚀**
