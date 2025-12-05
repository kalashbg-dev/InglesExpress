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
      </body>
    </html>
  );
}
