import { Project, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'Vedant Sattegiri Patil',
  handle: 'VEX',
  githubUsername: 'vedwebsites-eng',
  githubUrl: 'https://github.com/vedwebsites-eng',
  email: 'veddoesai@proton.me',
  personalEmail: 'veddoesai@proton.me',
  workEmail: 'veddoesai@proton.me',
  location: 'Pune, Maharashtra, India',
  timezone: 'Asia/Kolkata (IST • UTC+05:30)',
  age: 15,
  role: 'Student-Builder & Security Researcher',
  bioOneLiner: '15-year-old student-builder crafting autonomous AI tooling, researching cybersecurity vulnerabilities, and engineering resilient software from first principles.',
  pgpFingerprint: '9B2F E74A C190 442D 81A3 E518 70B2 3C8F 61D9 4AA1',
  youtubeUrl: 'https://youtube.com/@RootCauseTech',
};

export const TERMINAL_ROTATING_TITLES = [
  'Builder at the intersection of AI + Cybersecurity',
  'Bug bounty researcher hunting logic & web vulnerabilities',
  'Creator of RootCause — deconstructing zero-days in 60s',
  'Engineering dark-mode tooling with deep craftsmanship',
  'High school student experimenting with autonomous agent swarms',
];

export const PROJECTS: Project[] = [
  {
    id: 'aethos',
    title: 'AETHOS',
    subtitle: 'Gamified Self-Improvement & Neural Copilot',
    tagline: 'Tasks, habits, journaling, and dynamic XP leveling guided by Ace — a relentless AI accountability coach.',
    category: 'AI & Systems',
    badge: 'FLAGSHIP APP',
    interactiveType: 'aethos',
    description:
      'A holistic personal operating system designed with an unapologetic dark cyberpunk interface. AETHOS transforms mundane daily discipline into an immersive questline featuring dynamic XP curve mechanics, streak multiplier perks, deep-work session tracking, and intelligent debriefs from "Ace", an integrated AI coach that analyzes behavioral patterns.',
    details: [
      'Dual-engine quest & habit loops with algorithmic streak preservation',
      'AI Coach "Ace": contextual habit debriefs, cognitive reframing, and task breakdown',
      'Encrypted client-side journaling with emotional tone & cognitive load tagging',
      'Hyper-responsive cyberpunk audio-visual feedback loops and telemetry dashboard',
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'AI Agent System', 'Web Storage API', 'Web Audio Synth'],
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/vedwebsites-eng/aethos', isExternal: true },
      { label: 'Architecture Docs', url: '#aethos-preview', isExternal: false },
    ],
    stats: [
      { label: 'XP Engine', value: 'Lv. 1-100 Adaptive' },
      { label: 'AI Companion', value: 'Ace v2.4' },
      { label: 'Storage', value: 'Zero-Telemetry Local' },
    ],
  },
  {
    id: 'rootcause',
    title: 'RootCause',
    subtitle: 'Faceless Cybersecurity & Tech Dissections',
    tagline: 'High-signal, visually rich short-form videos explaining zero-days, exploit chains, and defensive software patterns.',
    category: 'Cybersecurity & Media',
    badge: 'CONTENT & RESEARCH',
    interactiveType: 'rootcause',
    description:
      'A technical media channel engineered to demystify complex cyber-attacks, CVEs, and AI exploit primitives into 60-second visual masterclasses. RootCause eliminates fluff and clickbait, providing byte-level assembly breakdowns, memory corruption animations, and offensive-to-defensive takeaways for modern builders.',
    details: [
      'Byte-level animations explaining memory corruption, race conditions, and prompt injection',
      'Post-mortems of historic vulnerabilities: CVE-2024-3094, Log4Shell, and OAuth flows',
      'Faceless production workflow leveraging automated animation assets and crisp audio engineering',
      'Bridging offensive security research with actionable secure coding guidelines',
    ],
    techStack: ['Offensive Research', 'Burp Suite', 'Ghidra', 'DaVinci / Motion Graphics', 'CVE Analysis'],
    links: [
      { label: 'YouTube Channel', url: 'https://youtube.com', isExternal: true },
      { label: 'Case Studies', url: '#rootcause-preview', isExternal: false },
    ],
    stats: [
      { label: 'Format', value: '60s Dissections' },
      { label: 'Focus', value: 'CVEs & AI Exploits' },
      { label: 'Audience', value: 'Engineers & Hackers' },
    ],
  },
  {
    id: 'inkwell',
    title: 'Inkwell',
    subtitle: 'Distraction-Free Typographic Note Engine',
    tagline: 'A minimalist digital sanctuary focused on making notes look typographic, refined, and effortless.',
    category: 'Productivity & Tooling',
    badge: 'MINIMAL TOOL',
    interactiveType: 'inkwell',
    description:
      'Engineered out of frustration with bloated, sluggish note-taking applications. Inkwell provides a distraction-free markdown canvas featuring editorial serif typography (Newsreader & Playfair), seamless live formatting, zero-friction local persistence, and clean print/export formatting.',
    details: [
      'Instant markdown parser with graceful inline rendering and split preview mode',
      'Carefully calibrated typographic grid with optimal 65-character line measures',
      'Local-first architecture with instant offline availability and keyboard-driven shortcuts',
      'Export directly to clean printable PDF, standalone HTML, or raw markdown',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Markdown Engine', 'LocalStorage API'],
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/vedwebsites-eng/inkwell', isExternal: true },
      { label: 'Try Note Canvas', url: '#inkwell-preview', isExternal: false },
    ],
    stats: [
      { label: 'Cold Boot', value: '< 20ms' },
      { label: 'Typography', value: 'Editorial Grade' },
      { label: 'Data Model', value: 'Offline Markdown' },
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Offensive & Defensive Security',
    iconName: 'Shield',
    description: 'Methodical vulnerability assessment, reconnaissance, and defensive engineering.',
    skills: [
      { name: 'Web App Pentesting', proficiency: 'Active', note: 'OWASP Top 10, IDOR, SSRF, Auth Bypasses' },
      { name: 'Burp Suite & Proxies', proficiency: 'Primary', note: 'Repeater, Intruder, Match/Replace rules' },
      { name: 'Recon & Scripting', proficiency: 'Active', note: 'Amass, Sublist3r, ffuf, Python automation' },
      { name: 'Network & Protocols', proficiency: 'Core', note: 'Wireshark, Nmap, TCP/IP, DNS deep-dives' },
      { name: 'Threat Modeling', proficiency: 'Applied', note: 'Zero-trust design, least privilege principle' },
    ],
  },
  {
    title: 'AI & Autonomous Systems',
    iconName: 'Cpu',
    description: 'Harnessing generative models, tool execution agents, and context-aware copilots.',
    skills: [
      { name: 'Agentic Workflows', proficiency: 'Active', note: 'Tool-use, autonomous loops, ReAct patterns' },
      { name: 'LLM Integration', proficiency: 'Primary', note: 'Gemini API, Ollama/Local models, structured outputs' },
      { name: 'Prompt Engineering', proficiency: 'Advanced', note: 'Few-shot prompting, system role guardrails' },
      { name: 'Adversarial AI / Red Teaming', proficiency: 'Research', note: 'Prompt injection, jailbreaks, data leakage' },
      { name: 'Context Optimization', proficiency: 'Core', note: 'Token budgeting, retrieval caching' },
    ],
  },
  {
    title: 'Software Development & Systems',
    iconName: 'Code',
    description: 'Writing fast, type-safe, resilient software with clean architecture.',
    skills: [
      { name: 'TypeScript / JavaScript', proficiency: 'Primary', note: 'ESNext, Node.js, strict type systems' },
      { name: 'Python', proficiency: 'Primary', note: 'Security scripts, CLI tools, async scrapers' },
      { name: 'React & Tailwind', proficiency: 'Advanced', note: 'Clean component design, fluid animations' },
      { name: 'Linux / Bash', proficiency: 'Core', note: 'Arch/Debian, shell scripting, process internals' },
      { name: 'Git & Systems Tooling', proficiency: 'Core', note: 'Version control, Docker container basics' },
    ],
  },
];

export const RESUME_DATA = {
  name: 'Vedant Sattegiri Patil',
  handle: 'VEX',
  title: 'Student-Builder & Security Researcher',
  location: 'Pune, Maharashtra, India',
  email: 'veddoesai@proton.me',
  workEmail: 'veddoesai@proton.me',
  github: 'https://github.com/vedwebsites-eng',
  summary:
    '15-year-old self-taught builder and security researcher based in Pune. Blending an offensive cybersecurity mindset with modern AI system development and software engineering. Passionate about uncovering edge-case vulnerabilities, creating developer tooling, and educating builders through high-signal technical content.',
  education: [
    {
      institution: 'Pune High School (Class 10 / Secondary Education)',
      period: '2023 - Present',
      location: 'Pune, MH, India',
      notes: 'Balancing rigorous academic curriculum with independent deep-dive research into computer science, cybersecurity, and applied AI systems.',
    },
  ],
  focusAreas: [
    {
      title: 'Bug Bounty Research & Vulnerability Hunting',
      details: 'Active research on web applications, finding logic bugs, access control failures (IDORs), and misconfigurations. Focus on automated recon tooling.',
    },
    {
      title: 'Autonomous AI Tooling & Local Intelligence',
      details: 'Building agentic workflows that turn unstructured instructions into deterministic multi-step tool execution. Integrating Gemini & local LLMs.',
    },
    {
      title: 'Technical Dissections & Media (RootCause)',
      details: 'Creator and producer of RootCause, turning complex CVE analyses, memory vulnerabilities, and architectural concepts into punchy 60s educational videos.',
    },
  ],
  certificationsAndRankings: [
    'TryHackMe & HackTheBox Active Labs (Web & Linux fundamentals)',
    'OWASP Web Security Standards self-directed study',
    'High School Science & Mathematics Academic Honors (Pune District)',
    'Independent Vulnerability Disclosure Contributor',
  ],
};
