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
- **React Router v7** (BrowserRouter in `main.tsx`, Routes in `App.tsx`)
- ESLint with React Hooks and React Refresh plugins

## Architecture

This is a portfolio website with client-side routing and the following structure:

- `src/App.tsx` - Router root; defines `<Routes>` for `/` (HomePage) and `/projects` (ProjectsPage)
- `src/main.tsx` - React entry point
- `src/index.css` - Global styles, Tailwind imports, CSS custom properties, and animations
- `public/404.html` - GitHub Pages SPA redirect shim for BrowserRouter

### Pages (`src/pages/`)

- `ProjectsPage.tsx` - All three projects on one page; anchor IDs enable scroll-to from ProjectCard links (`/projects#macrotracker`, etc.)

### Components (`src/components/`)

- `MagneticShapes.tsx` - Interactive animated background with mouse-reactive shapes (attract/repel/orbit/shy behaviors)
- `Projects.tsx` / `ProjectCard.tsx` - Projects section; ProjectCard uses React Router `<Link>` for internal routes, `<a>` for external
- `Experience.tsx` / `ExperienceCard.tsx` - Experience section with card list

### Styling

Custom theme defined in `src/index.css` using Tailwind's `@theme` directive:
- Color palette: `ink`, `card`, `cream`, `stone`, `gold`, `gold-dim`, `line`, `salmon` (#e8553e)
- Typography: `font-display` (Cormorant Garamond), `font-body` (Outfit), `font-sans` (Sora)
- Custom animations: `animate-fade`, `animate-slide-up`, `animate-slide-in`, `animate-scale-in` with delay utilities

## Images

Portrait uses `<picture>` with AVIF + JPG fallback. To generate an optimized AVIF from a new photo:
```bash
ffmpeg -i input.jpg -vf scale=480:-1 -c:v libaom-av1 -crf 32 -b:v 0 public/output_480.avif
```
Update `src/App.tsx` srcSet and src references accordingly.

## Tooling Notes

- **Visual testing**: Playwright MCP is available; screenshots save to `.playwright-mcp/` (gitignored). Start dev server first with `npm run dev`.
- **Committing**: Use the `/commit-push` skill (global, available in all projects)
