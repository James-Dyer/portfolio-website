import tutorThumbnail from '../assets/project-thumbnails/software-engineering-tutor-card.jpg'
import macrotrackerThumbnail from '../assets/project-thumbnails/macrotracker-card.jpg'
import lGameThumbnail from '../assets/projects/real-l-game-layout.png'
import macrotrackerDemoVideo from '../assets/projects/macrotracker/demo-2x.mp4'
import tutorDashboard from '../assets/projects/ai-tutor/dashboard.png'
import tutorPlanning from '../assets/projects/ai-tutor/planning-workflow.png'
import tutorEditor from '../assets/projects/ai-tutor/editor-and-hints.png'
import tutorIntegrated from '../assets/projects/ai-tutor/integrated-tutor-view.png'
import galloLogo from '../assets/experience-logos/gallo.svg'
import lambdaDeltaLogo from '../assets/experience-logos/lambda-delta.svg'
import mimicLogo from '../assets/experience-logos/mimic.svg'

export interface Screenshot {
  src: string
  alt: string
  caption: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  summary: string
  outcome: string
  highlights: string[]
  tech: string[]
  thumbnailSrc: string
  heroMedia?: string
  links: {
    github: string
    live?: string
    liveLabel?: string
  }
  media: 'video' | 'screenshots' | 'demo'
  screenshots?: Screenshot[]
}

export interface Experience {
  id: string
  company: string
  role: string
  duration: string
  location: string
  summary: string
  highlights: string[]
  tech: string[]
  logoSrc: string
  website?: string
}

export const projects: Project[] = [
  {
    id: 'macrotracker',
    title: 'macroTracker',
    subtitle: 'AI nutrition tracking PWA',
    summary: 'A mobile-first nutrition tracker that turns meal photos into structured macro data.',
    outcome: 'Live full-stack product serving real users',
    highlights: [
      'Built a full-stack React and TypeScript PWA with Supabase-backed storage and PostgreSQL persistence.',
      'Reduced image upload sizes by 80–98% with a client-side compression pipeline.',
      'Integrated multimodal AI analysis through serverless edge functions with a fallback provider.',
    ],
    tech: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini API', 'OpenAI API'],
    thumbnailSrc: macrotrackerThumbnail,
    heroMedia: macrotrackerDemoVideo,
    links: {
      github: 'https://github.com/James-Dyer/macro-tracker',
      live: 'https://james-dyer.github.io/macro-tracker/',
      liveLabel: 'Landing page',
    },
    media: 'video',
  },
  {
    id: 'ai-tutor',
    title: 'Software Engineering Tutor',
    subtitle: 'Guided full-stack learning platform',
    summary: 'A tutoring platform that turns assignments into structured plans and contextual hints.',
    outcome: 'One of three A+ final projects',
    highlights: [
      'Designed an LLM workflow that creates learning goals, plans, and stepwise guidance from assignment prompts.',
      'Built an in-browser Python IDE with hints informed by the student’s current code and assignment constraints.',
      'Delivered one of three A+ final projects in UC Merced’s full-stack web development course.',
    ],
    tech: ['React', 'Flask', 'PostgreSQL', 'Pyodide', 'Monaco Editor', 'OpenAI API'],
    thumbnailSrc: tutorThumbnail,
    heroMedia: tutorDashboard,
    links: { github: 'https://github.com/James-Dyer/cse108-final' },
    media: 'screenshots',
    screenshots: [
      { src: tutorDashboard, alt: 'Assignment dashboard', caption: 'Assignment dashboard' },
      { src: tutorPlanning, alt: 'Planning workflow', caption: 'Planning workflow' },
      { src: tutorEditor, alt: 'Code editor and hints', caption: 'Editor and hints' },
      { src: tutorIntegrated, alt: 'Integrated tutor view', caption: 'Integrated tutor view' },
    ],
  },
  {
    id: 'lgame',
    title: 'L-Game',
    subtitle: 'Search-based Python game agent',
    summary: 'A deterministic game system supporting human and agent-based play.',
    outcome: 'Interactive optimal-move agent',
    highlights: [
      'Implemented legal move generation, board-state transitions, and multiple gameplay modes.',
      'Designed a deterministic search-based agent that selects optimal moves.',
      'Optimized state evaluation to keep agent turns fast enough for interactive play.',
    ],
    tech: ['Python 3', 'Game-tree search', 'State evaluation'],
    thumbnailSrc: lGameThumbnail,
    heroMedia: lGameThumbnail,
    links: { github: 'https://github.com/James-Dyer/L-game' },
    media: 'demo',
  },
]

export const experiences: Experience[] = [
  {
    id: 'gallo',
    company: 'E. & J. Gallo Winery',
    role: 'Capstone Team Lead',
    duration: 'Aug 2025 – Dec 2025',
    location: 'Merced, CA',
    summary: 'Led a five-person team delivering a computer vision system for measuring factory part wear.',
    highlights: [
      'Owned technical direction across camera calibration, desktop UI, infrastructure, and sponsor delivery.',
      'Designed an OpenCV calibration pipeline that converted image-space observations into real-world measurements.',
      'Built the React and Electron operator interface for camera controls, visualization, and inspection-record queries.',
      'Established CI and 29 automated tests to improve reliability across a multi-contributor codebase.',
    ],
    tech: ['React', 'Electron', 'OpenCV', 'Python', 'AWS', 'CI/CD'],
    logoSrc: galloLogo,
  },
  {
    id: 'mimic',
    company: 'Mimic Ransomware Defense',
    role: 'Software Engineering Intern',
    duration: 'May 2025 – Aug 2025',
    location: 'Remote',
    summary: 'Worked across test infrastructure, WebAssembly tooling, and production cybersecurity services.',
    highlights: [
      'Built a Python CLI that provisions GCP VMs, runs end-to-end integration scenarios, and reports results.',
      'Developed a WebAssembly execution engine and migrated three cybersecurity engines to Rust-compiled WASM.',
      'Fixed cross-goroutine logging issues in production Go services, improving runtime observability.',
    ],
    tech: ['Python', 'Go', 'Rust', 'WebAssembly', 'GCP', 'CLI tooling'],
    logoSrc: mimicLogo,
    website: 'https://mimic.com',
  },
  {
    id: 'sigmachi',
    company: 'Sigma Chi Fraternity, Lambda Delta Chapter',
    role: 'Web Developer',
    duration: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    summary: 'Built and maintained the chapter’s public website for recruitment, events, and philanthropy.',
    highlights: [
      'Translated executive committee requirements into a maintainable React-based public site.',
      'Built a real-time event leaderboard backed by spreadsheet data.',
      'Supported more than 150 active users during a high-traffic philanthropy event.',
    ],
    tech: ['React', 'JavaScript', 'GitHub Pages', 'Spreadsheet integration'],
    logoSrc: lambdaDeltaLogo,
  },
]
