# Academia de Inglés Fullstack

This project is a modern Next.js 16 application designed to connect with a Headless WordPress backend via GraphQL.

## Getting Started

### 1. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Mock Mode vs. Real Backend

This project supports two modes of operation:

#### **Mock Mode (Default for Development)**
Run the application without a WordPress backend connection using static mock data.

In `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

#### **Real Backend (Production/Staging)**
Connect to your WordPress instance.

In `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components and sections.
- `hooks/`: Custom React hooks (e.g., `useLevels`, `useFAQs`).
- `lib/`: Utilities, Apollo Client setup, and Mock Data.
- `types/`: TypeScript definitions.

## Key Features

- **Next.js 16** with App Router.
- **Apollo Client** for GraphQL communication.
- **Tailwind CSS** for styling.
- **Zod** for runtime validation.
- **Mock Mode** for frontend-only development.

## Deployment

Refer to `guia-deploy-mantenimiento.md` for detailed deployment instructions.
