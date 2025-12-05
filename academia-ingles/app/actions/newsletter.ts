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
// We need to check if env vars are present, otherwise mock it for build
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : null;

// Rate limiting helper
async function checkRateLimit(ip: string): Promise<boolean> {
  if (!redis) return true; // Skip if no redis

  try {
    const key = `newsletter:${ip}`;
    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, 3600); // 1 hour
    }

    return requests <= 10; // 10 requests per hour
  } catch (e) {
    console.error('Redis error', e);
    return true; // Fail open
  }
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
    const ip = '127.0.0.1'; // In production, get from headers

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
    const rawData = {
      email: formData.get('email'),
      name: formData.get('name'),
      consent: formData.get('consent') === 'on',
    };

    const validatedData = newsletterSchema.parse(rawData);

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
    } else {
      console.log('Newsletter subscription (simulated):', validatedData);
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
