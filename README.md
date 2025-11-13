# Entain Task - Next to Go Racing Information

This is a a React application that displays upcoming racing events with real-time countdown timers and category filtering. Built with modern web technologies and featuring a sample "brand" theming system.

## Tech Stack Used

- **React** - UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching

- **TanStack Query** - Server state management and caching
- **React Context API** - Brand/theme management

### UI Components & Styling

- **Shadcn UI** - Accessible components
- **Lucide React** - Icons library
- **TanStack Table** - Table component

### Testing Tools

- **Vitest** - unit test framework
- **Playwright** - Browser testing

### Code Quality

- **ESLint** - Linting with automatic fixes
- **Prettier** - Code formatting with consistent style
- **Husky** - Git hooks for automated quality checks
- **lint-staged** - Run linters on staged files only
- **React Compiler** - React optimization

## Project Structure

- `api` - API Layer
- `components` - UI components
- `context` - React Context providers
- `hooks` - Custom React hooks
- `lib` - Utility functions
- `styles` - Styling and theming
- `App.tsx` - Root application component
- `main.tsx` - Application entry point
- `constants.ts` - App constants (category IDs)
- `types.ts` - TypeScript type definitions
- `global.css` - Global styles
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Key Features

### Multi-Brand Theming

The application supports multiple brand themes (light/dark) with CSS custom properties. Brand styles are managed through:

- `src/context/brand/` - Brand context and state management
- `src/styles/brands/` - Brand-specific CSS variables
- `src/components/brand/BrandSelector.tsx` - UI for switching brands

See the [Custom Theming](#custom-theming) section below for detailed implementation information.

### Race Categories

Three racing categories are supported:

- **Greyhound Racing**
- **Harness Racing**
- **Horse Racing**

Pre-selected Category IDs are defined in `src/constants.ts` and used for filtering races.

### API Integration

The app fetches race data from the Neds API through a Vite proxy configuration:

- API calls are made to `/api` which proxies to `https://api.neds.com.au/rest/v1/racing/`
- Configured in `vite.config.ts` server proxy settings
- Data fetching logic in `src/api/fetch-next-races.ts`

### Path Aliases

TypeScript path alias `@/*` maps to `./src/*` for cleaner imports:

```typescript
import { cn } from "@/lib/utils";
import { Races } from "@/components/races/Races";
```

## Getting Started

### Prerequisites

- Node.js
- npm package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/alonfai/entain
cd entain
```

2.Install dependencies

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## Available Scripts

### `npm run dev`

Starts the Vite development server with hot module replacement. Use this for local development.

### `npm run build`

Creates an optimized production build:

### `npm run preview`

Serves the production build locally for testing. Run `npm run build` first.

### `npm run lint`

Runs ESLint to check code quality and style issues across the project. Includes automatic fixing where possible.

### `npm run format`

Formats all code files using Prettier with the project's configuration settings. Ensures consistent code style across the entire codebase.

### `npm run prepare`

Sets up Git hooks using Husky. This script runs automatically after `npm install` to configure pre-commit hooks that run lint-staged checks.

### `npm test`

Runs the test suite in watch mode using Vitest with Playwright browser testing.

### `npm run coverage`

Generates a code coverage report for the test suite. Coverage excludes shadcn/ui `components/ui` directory.

### Testing

The project uses Vitest for unit and component tests:

- Browser testing enabled for component tests
- Coverage reporting with V8
- Tests run in headless Chromium by default

Run tests:

```bash
npm test              # Watch mode
npm run coverage      # Generate coverage report
```

## Git Hooks & Code Quality

The project uses automated code quality checks via Git hooks:

### Pre-commit Hooks

Husky manages Git hooks that run automatically before each commit:

- **lint-staged** - Runs on staged files only for faster execution:
  - Prettier formatting on all staged files
  - ESLint with auto-fix on TypeScript/TSX files

### Manual Code Quality Commands

```bash
npm run format        # Format all files with Prettier
npm run lint          # Check and fix ESLint issues
```

The lint-staged configuration in `package.json` ensures that only staged files are processed, making commits faster while maintaining code quality standards.

## Configuration Files

- **vite.config.ts** - Vite build configuration, dev server, proxy, and test setup
- **tsconfig.json** - TypeScript compiler options and path aliases
- **eslint.config.js** - ESLint rules and plugins
- **components.json** - shadcn/ui component configuration
- **.prettierrc** - Prettier code formatting configuration
- **.prettierignore** - Files and directories to exclude from Prettier formatting
- **.husky/pre-commit** - Git pre-commit hook configuration
- **tailwind.config.js** - Tailwind CSS configuration (if present)

## Custom Theming

The application features a flexible, scalable theming system built with CSS variables and React Context.
The theming system consists of three main layers:

1. **Design Tokens** (`src/styles/tokens.css`) - Brand-agnostic foundation
2. **Brand Themes** (`src/styles/brands/`) - Brand-specific color palettes
3. **Context Provider** (`src/context/brand/`) - Runtime theme management

### Brand Themes

Each brand defines its own color palette using CSS custom properties with the OKLCH color space for better perceptual uniformity:

#### Light Theme (`src/styles/brands/light.css`)

```css
.light {
  --custom-bg-primary: oklch(0.98 0.005 240);
  --custom-text-primary: oklch(0.25 0.02 240);
  --custom-accent: oklch(0.55 0.2 240);
  /* ... more variables */
}
```

#### Dark Theme (`src/styles/brands/dark.css`)

```css
.dark {
  --custom-bg-primary: oklch(0.15 0.01 240);
  --custom-text-primary: oklch(0.92 0.01 240);
  --custom-accent: oklch(0.65 0.22 240);
  /* ... more variables */
}
```

### Brand Context & Provider

The `BrandProvider` module manages theme state and applies the appropriate CSS class to the document root.

### Using the Theme System

#### Accessing the Current Brand

Use the `useBrand` hook to access and modify the current brand:

```typescript
import { useBrand } from "@/hooks/useBrand";

function MyComponent() {
  const { brand, setBrand } = useBrand();

  return (
    <button onClick={() => setBrand("dark")}>
      Current: {brand}
    </button>
  );
}
```

### Adding a New Brand Theme

To add a new brand theme:

1. Create a new CSS file in `src/styles/brands/` (e.g., `blue.css`)
2. Define the brand class with all required custom properties:

```css
.blue {
  --custom-bg-primary: oklch(0.96 0.02 240);
  --custom-text-primary: oklch(0.2 0.03 240);
  --custom-accent: oklch(0.5 0.25 240);
  /* ... define all other variables */
}
```

3.Import the stylesheet in your main CSS file or component

4.Update the `Brand` type in `src/context/brand/BrandContext.tsx`:

```typescript
export type Brand = "dark" | "light" | "blue";
```

5.Update the `BrandProvider` to handle the new brand class
