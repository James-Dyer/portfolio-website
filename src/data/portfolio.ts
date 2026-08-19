import tutorThumbnail from '../assets/project-thumbnails/software-engineering-tutor-card.jpg'
import macrotrackerThumbnail from '../assets/project-thumbnails/macrotracker-card.jpg'
import lGameThumbnail from '../assets/projects/real-l-game-layout.png'
import macrotrackerDemoVideo from '../assets/projects/macrotracker/demo-2x.mp4'
import tutorDashboard from '../assets/projects/ai-tutor/dashboard.png'
import tutorPlanning from '../assets/projects/ai-tutor/planning-workflow.png'
import tutorEditor from '../assets/projects/ai-tutor/editor-and-hints.png'
import tutorIntegrated from '../assets/projects/ai-tutor/integrated-tutor-view.png'
import lambdaDeltaLogo from '../assets/experience-logos/lambda-delta.svg'
import mimicLogo from '../assets/experience-logos/mimic.svg'
import partScan from '../assets/projects/part-scan/part-scan.jpeg'

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
    github?: string
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
  websiteLabel?: string
}

export const projects: Project[] = [
  {
    id: 'inspection-system',
    title: 'Computer Vision Inspection System',
    subtitle: 'Industry-sponsored factory wear measurement',
    summary: 'A computer vision system that measures factory part wear from standard camera hardware, replacing a manual inspection process with a repeatable, data-driven workflow.',
    outcome: "Placed second at UC Merced's Innovate to Grow showcase",
    highlights: [
      'Led a 5-person industry-sponsored team in developing a computer vision system that measured factory part wear with less than 0.5 mm mean absolute error, transforming a manual inspection process into a repeatable data-driven workflow.',
      'Designed an OpenCV calibration pipeline that converted image coordinates into real-world measurements, enabling accurate wear analysis from standard camera hardware.',
      'Developed the primary operator-facing desktop application, integrating camera controls and inspection record retrieval into a single workflow for factory users.',
      "Owned DevOps infrastructure and implemented CI pipelines that ran the team's 29-test suite to improve reliability and prevent regressions.",
    ],
    tech: ['OpenCV', 'Python', 'React', 'Electron', 'AWS', 'CI/CD'],
    thumbnailSrc: partScan,
    links: {},
    media: 'screenshots',
    screenshots: [
      { src: partScan, alt: 'Scanning rig', caption: 'Scanning rig' }
    ],
  },
  {
    id: 'macrotracker',
    title: 'macroTracker',
    subtitle: 'AI nutrition tracking PWA',
    summary: 'An AI-powered nutrition tracker that transforms meal photos into structured macro data, eliminating manual entry.',
    outcome: 'Working full-stack product built end-to-end, solo',
    highlights: [
      'Architected and implemented the full-stack platform, including database design, API infrastructure, and client application for persistent nutrition tracking.',
      'Designed a secure image pipeline with client-side compression, reducing upload sizes by 80–98% and enabling efficient storage and fast retrieval.',
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
    summary: 'A tutoring platform that guides students through assignments while preserving academic integrity.',
    outcome: 'One of three A+ final projects',
    highlights: [
      'Designed an LLM workflow that transformed assignment prompts into personalized learning objectives, implementation plans, and stepwise guidance.',
      'Built an in-browser Python IDE with dynamic hint generation based on code state and assignment constraints.',
      "Delivered one of three A+ final projects in UC Merced's full-stack web development course.",
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
    summary: "A reimplementation of Edward de Bono's L-Game with human, agent-based, and agent-vs-agent play.",
    outcome: 'Interactive optimal-move agent',
    highlights: [
      'Implemented support for human, agent-based, and agent-vs-agent gameplay modes.',
      'Designed a deterministic game-playing agent that selects optimal moves using state evaluation and search-based logic.',
      'Applied optimization techniques to ensure fast decision-making while preserving optimal play behavior.',
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
    id: 'mimic',
    company: 'Mimic Ransomware Defense',
    role: 'Software Engineering Intern',
    duration: 'May 2025 – Aug 2025',
    location: 'Remote',
    summary: 'Worked across test infrastructure, WebAssembly tooling, and production cybersecurity services.',
    highlights: [
      'Built a Python-based integration testing platform that provisions GCP infrastructure and executes end-to-end validation scenarios, enabling test workflows that were previously impossible due to service restart requirements.',
      'Developed a WebAssembly runtime and migrated three cybersecurity engines to Rust-compiled WASM, improving portability across deployment environments.',
      'Patched a concurrency bug in production Go logging that had been degrading observability, given a reported issue.',
    ],
    tech: ['Python', 'Go', 'Rust', 'WebAssembly', 'GCP', 'CLI tooling'],
    logoSrc: mimicLogo,
    website: 'https://mimic.com',
  },
]

export const additionalExperiences: Experience[] = [
  {
    id: 'sigmachi',
    company: 'Sigma Chi Fraternity, Lambda Delta Chapter',
    role: 'Web Developer',
    duration: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    summary: 'Built a multi-page production website for the chapter that supported a UC Merced campus fundraising record.',
    highlights: [
      'Designed and built a multi-page production React website from the ground up that supported a UC Merced campus fundraising record, covering recruitment, philanthropy, donations, and alumni pages.',
      'Built a real-time fundraising leaderboard that held up under 150+ users during a week-long event.',
      'Converted an Amazon wishlist on the donations page into unsolicited alumni donations.',
      'Designed a spreadsheet-driven backend so non-technical exec board members could update leaderboard data themselves post-launch.',
    ],
    tech: ['React', 'JavaScript', 'GitHub Pages', 'Spreadsheet integration'],
    logoSrc: lambdaDeltaLogo,
    website: 'https://james-dyer.github.io/lambda-delta-chapter-website/',
    websiteLabel: 'Archived site',
  },
]
