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
    categoria: z.enum(['academic', 'administrative']),
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
