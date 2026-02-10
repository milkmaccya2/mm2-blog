export interface Project {
  title: string;
  description: string;
  url: string;
  repoUrl?: string;
  tags: string[];
  linkText?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'mm2-blog',
    description:
      'A personal blog with an automated workflow that rewrites Notion drafts using AI. This is the blog you are currently viewing.',
    url: 'https://blog.milkmaccya.com',
    repoUrl: 'https://github.com/milkmaccya2/mm2-blog',
    tags: [
      'Astro',
      'Tailwind CSS',
      'Biome',
      'Lefthook',
      'Cloudflare Workers',
      'Playwright',
      'Sentry',
      'Renovate',
      'Lighthouse CI',
    ],
  },
  {
    title: 'POS-80 Thermal Printer Controller',
    description:
      'An Astro-based web interface for controlling a POS-80 thermal printer connected to a Raspberry Pi.',
    url: 'https://github.com/milkmaccya2/thermal-printer-app/blob/main/README.md',
    tags: [
      'Astro',
      'React',
      'Tailwind CSS',
      'Node.js',
      'pnpm',
      'Sharp',
      'Puppeteer',
      'Google Calendar API',
      'Raspberry Pi',
      'PM2',
    ],
    linkText: 'View on GitHub',
  },
  {
    title: 'HostSwitch',
    description: 'A CLI tool for switching hosts file comfortably.',
    url: 'https://milkmaccya2.github.io/hostswitch/en/',
    tags: ['TypeScript', 'Node.js', 'Biome', 'Vitest', 'Docusaurus'],
    linkText: 'View Documentation',
  },
  {
    title: 'QR Note',
    description: 'A simple bridge app between your smartphone and PC.',
    url: 'https://qrnote.milkmaccya.com/',
    repoUrl: 'https://github.com/milkmaccya2/qrnote/blob/main/README.md',
    tags: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'qrcode',
      'Web Speech API',
      'MediaRecorder API',
      'AWS S3',
      'PWA',
      'TypeScript',
    ],
  },
];
