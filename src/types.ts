export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: 'AI & Systems' | 'Cybersecurity & Media' | 'Productivity & Tooling';
  description: string;
  details: string[];
  techStack: string[];
  links: {
    label: string;
    url: string;
    isExternal?: boolean;
  }[];
  stats?: {
    label: string;
    value: string;
  }[];
  badge: string;
  interactiveType: 'aethos' | 'rootcause' | 'inkwell';
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    proficiency: string; // e.g. "Primary", "Advanced", "Active"
    note: string;
  }[];
}

export interface TerminalLog {
  id: string;
  command: string;
  output: string | React.ReactNode;
  timestamp: string;
  isError?: boolean;
}
