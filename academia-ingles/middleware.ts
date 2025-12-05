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
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

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

  // 4. CSP Header dinámico (Simpler version to avoid hydration issues in dev)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  // Note: strict CSP might block Next.js dev scripts or styles.
  // We apply a more lenient one for now, or ensure 'unsafe-inline' is allowed for styles which Next.js uses heavily.
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;`
  );

  // 5. Rate limiting por IP (implementación básica)
  // En producción, usar Redis o similar para rate limiting

  // 6. Logging para auditoría
  // console.log(`${new Date().toISOString()} - ${ip} - ${request.method} ${request.url} - ${userAgent}`);

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
