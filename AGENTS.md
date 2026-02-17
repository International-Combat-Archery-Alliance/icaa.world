# AGENTS.md - ICAA World Website

## Project Overview

Official website for the International Combat Archery Alliance (ICAA). React 19 + TypeScript + TailwindCSS.

## Tech Stack

- **Framework**: React 19, TypeScript, Vite 7.x
- **Styling**: TailwindCSS 4.x, shadcn/ui components
- **Routing**: React Router DOM 7.x
- **State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Auth**: Google OAuth
- **Payment**: Stripe
- **Deploy**: Cloudflare Pages (Wrangler)

## Commands

**Required before committing:**

```bash
bun run lint        # ESLint check (MUST pass)
bun run test:ts     # TypeScript type check
bun run format      # Prettier formatting
bun run build       # Production build
```

**Development:**

```bash
bun run dev         # Start dev server
bun run preview     # Preview production build
bun run codegen     # Generate API types from OpenAPI
bun run full-dev    # Frontend + all backend services
```

**Linting:**

```bash
bun run lint        # Check lint
bun run lint:fix    # Fix lint issues
```

**Note:** No unit tests currently configured. Husky runs `bun run lint:fix` pre-commit.

## Code Style

### General

- **TypeScript**: Strict mode, avoid `any`, explicit return types on exports
- **No semicolons**: Omit semicolons at end of statements
- **Quotes**: Single quotes for strings
- **Imports**: Use `@/` alias for src (e.g., `import { cn } from '@/lib/utils'`)
- **Styling**: Tailwind classes with `cn()` utility for conditionals

### Naming Conventions

- **Components**: PascalCase files and exports (e.g., `Button.tsx`, `EventCard`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEvent.ts`)
- **Utils**: camelCase (e.g., `cn()`, `formatDate()`)
- **Types/Interfaces**: PascalCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE for true constants

### Component Pattern

```tsx
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

**Always use shadcn CLI to add new UI components:**

```bash
bunx shadcn add button dialog select
```

UI conventions:

- Prefer shadcn/ui over custom components
- Use `class-variance-authority` (cva) for variants
- Radix UI primitives as base
- Support `className` prop with `cn()` utility
- Export component and variants separately

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   ├── auth/            # Auth components (ProtectedRoute, AdminOnlyRoute)
│   └── ...
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── context/             # QueryClient providers
├── api/                 # Auto-generated types from OpenAPI
├── lib/                 # Utilities (cn, formatters)
└── main.tsx
```

## API Integration

Auto-generated types from OpenAPI specs:

```bash
bun run codegen
```

**APIs:**

- Events: `https://api.icaa.world/events`
- Login: `https://api.icaa.world/login`
- Assets: `https://api.icaa.world/assets`

**Query Clients:** Each API has its own provider in `src/context/`

## Key Guidelines

1. **Always run lint before committing** - CI fails if lint errors
2. **Never edit `src/api/` or `src/components/ui/` manually** - use `codegen` or `shadcn`
3. **Use `cn()` utility** for Tailwind class merging
4. **Route protection**: Use `ProtectedRoute` and `AdminOnlyRoute` components
5. **Forms**: Use `react-hook-form` + Zod + components from `src/components/ui/form.tsx`
6. **Bot protection**: Use `TurnstileFormField` on public forms

## Environment

- `.env.development` - Dev config
- `.env.production` - Production config

## Common Tasks

**Add a page:**

1. Create in `src/pages/`
2. Add route in `src/App.tsx`
3. Add nav link in `Header.tsx` or `Sidebar.tsx`

**Add a UI component:**

1. `bunx shadcn add <component>`
2. Follow existing patterns

**Add a hook:**

1. Create in `src/hooks/`
2. Use `use` prefix
3. Export from file
