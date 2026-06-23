# James Dyer Portfolio

Portfolio website for James Dyer, a new graduate software engineer focused on complex backend systems, cloud infrastructure, and agentic AI.

Live site: [james-dyer.github.io/portfolio-website](https://james-dyer.github.io/portfolio-website/)

## Overview

This site presents selected software projects and professional experience in a recruiter-friendly format. It highlights shipped products, production internship work, technical depth, and measurable outcomes.

Featured work includes:

- **macroTracker** - AI nutrition tracking PWA with a full-stack React/Supabase architecture, image compression pipeline, multimodal AI analysis, and persistent nutrition tracking.
- **Software Engineering Tutor** - Full-stack learning platform with an in-browser Python IDE, Pyodide execution, LLM-generated guidance, and assignment-aware tutoring workflows.
- **L-Game** - Python implementation of Edward de Bono's L-Game with human, agent, and agent-vs-agent modes backed by search-based move selection.
- **Industry and internship experience** - Computer vision capstone leadership for E. & J. Gallo Winery, cybersecurity engineering internship work at Mimic, and production React work for Sigma Chi Lambda Delta.

## Engineering Highlights

- Built with a modern React 19, TypeScript, Vite, and Tailwind CSS 4 stack.
- Uses React Router with GitHub Pages-compatible SPA redirects for deep links.
- Includes interactive project media: product walkthrough video, screenshot galleries, and an embedded L-Game demo.
- Uses GSAP for motion while respecting reduced-motion preferences.
- Optimizes portfolio media with modern image formats and lazy loading.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- GSAP
- Pyodide
- ESLint

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run quality checks:

```bash
npm run lint
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.tsx                 # Route definitions and home page composition
  components/             # Portfolio sections, cards, media, and demos
  data/portfolio.ts       # Project and experience content
  pages/                  # Detail pages for projects and experience
  lib/gsap.ts             # GSAP plugin setup
public/
  404.html                # GitHub Pages SPA redirect shim
  pyodide/                # Runtime assets for Python-powered demos
```

## Deployment

The Vite base path is configured for GitHub Pages at `/portfolio-website/`. The `public/404.html` redirect shim preserves client-side routing when visitors open nested routes directly.
