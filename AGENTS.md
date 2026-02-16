# AGENTS.md - ICAA World Website

## Project Overview

The official website for the International Combat Archery Alliance (ICAA), promoting and organizing combat archery events worldwide. Built with React 19, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: TailwindCSS 4.x
- **Routing**: React Router DOM 7.x
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Google OAuth
- **Payment**: Stripe
- **Deployment**: Cloudflare Pages (via Wrangler)

## Available Commands

Always run these commands after making changes:

```bash
# Lint check (MUST pass before committing)
bun run lint

# TypeScript type checking
bun run test:ts

# Format code with Prettier
bun run format

# Build for production
bun run build
```

### Development Commands

```bash
# Start development server
bun run dev

# Start frontend + all backend services (requires other repos)
bun run full-dev

# Preview production build
bun run preview

# Generate TypeScript types from OpenAPI specs
bun run codegen
```

## Code Style Guidelines

### General Rules

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Use functional components with hooks
- **Imports**: Use `@/` alias for src imports (e.g., `import { cn } from '@/lib/utils'`)
- **Styling**: Use TailwindCSS classes, use `cn()` utility for conditional classes
- **No semicolons**: Project uses no-semicolon style
- **Single quotes**: Use single quotes for strings

### Component Structure

```tsx
// Example component pattern
import * as React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

function MyComponent({ className, children }: MyComponentProps) {
  return <div className={cn('base-classes', className)}>{children}</div>;
}

export { MyComponent };
```

### UI Components

UI components are in `src/components/ui/` and follow the shadcn/ui pattern.
**Always use the shadcn CLI to add new UI components:**

```bash
bunx shadcn add <component-name>
```

For example:

```bash
bunx shadcn add button
bunx shadcn add dialog
```

UI components follow these conventions:

- **Always prefer shadcn/ui components** over writing UI components manually
- Use `class-variance-authority` (cva) for variant management
- Use Radix UI primitives as base
- Export component and variants separately

## File Structure

```
src/
├── components/           # Reusable React components
│   ├── ui/              # shadcn/ui style components
│   ├── auth/            # Authentication components
│   └── ...
├── pages/               # Page components
│   ├── news/            # News article pages
│   └── ...
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── api/                 # API type definitions (auto-generated)
├── lib/                 # Utility functions
└── main.tsx            # Application entry point
```

## API Integration

The app connects to multiple backend services:

- **Events API**: `https://api.icaa.world/events`
- **Login API**: `https://api.icaa.world/login`
- **Assets API**: `https://api.icaa.world/assets`

Types are auto-generated from OpenAPI specs:

```bash
bun run codegen
```

### Query Client Pattern

Each API has its own QueryClient provider in `src/context/`:

- `eventQueryClientContext.tsx`
- `loginQueryClientContext.tsx`
- `assetsQueryClientContext.tsx`

## Pre-commit Hooks

Husky runs `bun run lint:fix` before each commit. Ensure lint passes:

```bash
bun run lint
```

## Environment Variables

Development and production configs:

- `.env.development`
- `.env.production`

## Deployment

Deployed to Cloudflare Pages via Wrangler:

- Config: `wrangler.jsonc`
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`)

## Important Notes

1. **Always run lint before committing** - CI will fail if lint doesn't pass
2. **Use the `cn()` utility** from `@/lib/utils` for Tailwind class merging
3. **UI components** in `src/components/ui/` are auto-generated - modify with caution
4. **API types** in `src/api/` are auto-generated - don't edit manually, run `bun run codegen`
5. **Route protection**: Use `ProtectedRoute` and `AdminOnlyRoute` components for auth
6. **Bundle size**: Be mindful of imported libraries

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Header.tsx` or `src/components/Sidebar.tsx`

### Adding a New UI Component

1. Use existing shadcn/ui patterns from `src/components/ui/`
2. Use Radix UI primitives as base
3. Support `className` prop with `cn()` utility
4. Export variants if applicable

### Working with Forms

- Use `react-hook-form` with `@hookform/resolvers` and `zod`
- Use components from `src/components/ui/form.tsx`
- Use `TurnstileFormField` for bot protection on public forms
