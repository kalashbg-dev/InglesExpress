import { Level, FAQ } from '@/types';

// Mock Data for Levels
export const MOCK_LEVELS: Level[] = [
  {
    id: 1,
    databaseId: 1,
    title: 'Nivel A1 - Principiante',
    slug: 'nivel-a1',
    content: 'Curso introductorio para principiantes sin conocimientos previos.',
    excerpt: 'Comienza tu viaje con el inglés desde cero.',
    infoNivel: {
      codigoVisual: 'A1',
      duracion: '4 Meses',
      precio: 2500,
      descripcion: 'Domina los fundamentos básicos, saludos, y vocabulario esencial.',
      linkPago: 'https://buy.stripe.com/mock_a1',
      imagenLibro: {
        sourceUrl: 'https://via.placeholder.com/300x400?text=Libro+A1',
        altText: 'Libro Nivel A1',
        mediaDetails: {
          width: 300,
          height: 400
        }
      }
    },
    dificultad: {
      nodes: [{ name: 'Principiante', slug: 'principiante' }]
    }
  },
  {
    id: 2,
    databaseId: 2,
    title: 'Nivel A2 - Básico',
    slug: 'nivel-a2',
    content: 'Curso básico para consolidar conocimientos.',
    excerpt: 'Mejora tu gramática y vocabulario básico.',
    infoNivel: {
      codigoVisual: 'A2',
      duracion: '4 Meses',
      precio: 2800,
      descripcion: 'Comunícate en situaciones cotidianas y mejora tu comprensión.',
      linkPago: 'https://buy.stripe.com/mock_a2',
      imagenLibro: {
        sourceUrl: 'https://via.placeholder.com/300x400?text=Libro+A2',
        altText: 'Libro Nivel A2',
        mediaDetails: {
          width: 300,
          height: 400
        }
      }
    },
    dificultad: {
      nodes: [{ name: 'Principiante', slug: 'principiante' }]
    }
  },
  {
    id: 3,
    databaseId: 3,
    title: 'Nivel B1 - Intermedio',
    slug: 'nivel-b1',
    content: 'Curso intermedio para fluidez conversacional.',
    excerpt: 'Empieza a hablar con mayor confianza.',
    infoNivel: {
      codigoVisual: 'B1',
      duracion: '6 Meses',
      precio: 3200,
      descripcion: 'Desarrolla la capacidad de mantener conversaciones fluidas.',
      linkPago: 'https://buy.stripe.com/mock_b1',
      imagenLibro: {
        sourceUrl: 'https://via.placeholder.com/300x400?text=Libro+B1',
        altText: 'Libro Nivel B1',
        mediaDetails: {
          width: 300,
          height: 400
        }
      }
    },
    dificultad: {
      nodes: [{ name: 'Intermedio', slug: 'intermedio' }]
    }
  },
  {
    id: 4,
    databaseId: 4,
    title: 'Nivel B2 - Avanzado',
    slug: 'nivel-b2',
    content: 'Curso avanzado para perfeccionamiento.',
    excerpt: 'Alcanza un nivel profesional de inglés.',
    infoNivel: {
      codigoVisual: 'B2',
      duracion: '6 Meses',
      precio: 3800,
      descripcion: 'Domina estructuras complejas y vocabulario técnico.',
      linkPago: 'https://buy.stripe.com/mock_b2',
      imagenLibro: {
        sourceUrl: 'https://via.placeholder.com/300x400?text=Libro+B2',
        altText: 'Libro Nivel B2',
        mediaDetails: {
          width: 300,
          height: 400
        }
      }
    },
    dificultad: {
      nodes: [{ name: 'Avanzado', slug: 'avanzado' }]
    }
  }
];

// Mock Data for FAQs
export const MOCK_FAQS: FAQ[] = [
  {
    id: 1,
    databaseId: 1,
    title: "¿Cuánto tiempo toma aprender inglés?",
    content: "Con nuestra metodología intensiva, puedes avanzar un nivel completo cada 4 meses. Para llegar a una fluidez conversacional (B2), el promedio es de 16 meses comenzando desde cero.",
    excerpt: "Tiempo estimado para aprender inglés.",
    infoFAQ: {
      categoria: 'academic'
    }
  },
  {
    id: 2,
    databaseId: 2,
    title: "¿Qué metodología utilizan?",
    content: "Utilizamos un enfoque comunicativo inmersivo. Desde la primera clase hablarás inglés. Combinamos clases en vivo con profesores nativos y una plataforma digital de refuerzo.",
    excerpt: "Descripción de nuestra metodología.",
    infoFAQ: {
      categoria: 'academic'
    }
  },
  {
    id: 3,
    databaseId: 3,
    title: "¿Tienen clases los fines de semana?",
    content: "Sí, tenemos horarios sabatinos intensivos de 9:00 AM a 1:00 PM, perfectos para quienes trabajan o estudian durante la semana.",
    excerpt: "Información sobre horarios de fin de semana.",
    infoFAQ: {
      categoria: 'administrative'
    }
  },
  {
    id: 4,
    databaseId: 4,
    title: "¿Cuáles son los métodos de pago?",
    content: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias y pagos en efectivo en nuestras oficinas. También ofrecemos planes de financiamiento.",
    excerpt: "Opciones de pago disponibles.",
    infoFAQ: {
      categoria: 'administrative'
    }
  },
  {
    id: 5,
    databaseId: 5,
    title: "¿Otorgan certificado al finalizar?",
    content: "Sí, al completar cada nivel recibes un certificado digital. Al finalizar el programa completo, recibes un diploma con validez curricular alineado al Marco Común Europeo (CEFR).",
    excerpt: "Información sobre certificación.",
    infoFAQ: {
      categoria: 'academic'
    }
  },
  {
    id: 6,
    databaseId: 6,
    title: "¿Puedo cambiar de horario?",
    content: "Sí, puedes solicitar cambio de horario al inicio de cada mes, sujeto a disponibilidad del grupo al que desees integrarte.",
    excerpt: "Política de cambio de horarios.",
    infoFAQ: {
      categoria: 'administrative'
    }
  }
];
