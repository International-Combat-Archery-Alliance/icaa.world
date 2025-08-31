# ICAA World - International Combat Archery Alliance

The official website for the International Combat Archery Alliance (ICAA), promoting and organizing combat archery events worldwide.

## About

The International Combat Archery Alliance is dedicated to promoting the sport of combat archery globally, connecting communities, and organizing world-class competitions. Our website serves as the central hub for information about the sport, upcoming events, registration, and community resources.

## Features

- **Event Management**: Browse and register for combat archery events including tournaments and play-ins
- **Community Hub**: Connect with combat archery communities and alliance members worldwide
- **Interactive Map**: Explore combat archery locations with our integrated Leaflet map
- **News & Updates**: Stay informed with the latest ICAA news and announcements
- **Registration System**: Streamlined event registration with form handling
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: TailwindCSS 4.x
- **Build Tool**: Vite 7.x
- **Routing**: React Router DOM 7.x
- **Deployment**: Cloudflare Pages (via Wrangler)
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/International-Combat-Archery-Alliance/icaa.world.git
cd icaa.world

# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun run dev

# The site will be available at http://localhost:5173
```

### Building

```bash
# Build for production
bun run build

# Preview the production build
bun run preview
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test:ts` - Run TypeScript type checking
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues automatically
- `bun run format` - Format code with Prettier
- `bun run codegen` - Generate TypeScript types from OpenAPI spec
- `bun run run-all-backend` - Run both login and event services concurrently. Assumes that the other repos are cloned one directory up.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ArcheryMap.tsx  # Interactive map component
│   ├── ContactForm.tsx # Contact form handling
│   └── ...
├── pages/              # Page components
│   ├── events/         # Event-specific pages
│   ├── news/           # News article pages
│   └── ...
├── events/             # Event-related type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Event Registration

The site integrates with the ICAA Event Registration API for handling event signups. API types are automatically generated from the OpenAPI specification.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow the existing TypeScript and React patterns
- Use TailwindCSS for styling
- Ensure all lint checks pass (`bun run lint`)
- Format code with Prettier (`bun run format`)
- Pre-commit hooks will automatically run checks

## Deployment

The site is deployed on Cloudflare Pages. The deployment configuration is managed through `wrangler.jsonc`.
