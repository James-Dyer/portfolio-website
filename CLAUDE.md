# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript compile + Vite build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** as the build tool with `@vitejs/plugin-react`
- **Tailwind CSS 4** with Vite plugin (`@tailwindcss/vite`)
- ESLint with React Hooks and React Refresh plugins

## Architecture

This is a single-page portfolio website with the following structure:

- `src/App.tsx` - Main layout with two-column design: sticky left identity card, scrollable right content
- `src/main.tsx` - React entry point
- `src/index.css` - Global styles, Tailwind imports, CSS custom properties, and animations

### Components (`src/components/`)

- `MagneticShapes.tsx` - Interactive animated background with mouse-reactive shapes (attract/repel/orbit/shy behaviors)
- `Projects.tsx` / `ProjectCard.tsx` - Projects section with card list
- `Experience.tsx` / `ExperienceCard.tsx` - Experience section with card list

### Styling

Custom theme defined in `src/index.css` using Tailwind's `@theme` directive:
- Color palette: `ink`, `card`, `cream`, `stone`, `gold`, `gold-dim`, `line`
- Typography: `font-display` (Cormorant Garamond), `font-body` (Outfit), `font-sans` (Sora)
- Custom animations: `animate-fade`, `animate-slide-up`, `animate-slide-in`, `animate-scale-in` with delay utilities
