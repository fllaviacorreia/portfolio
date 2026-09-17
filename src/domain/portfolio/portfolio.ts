export const PORTFOLIO_SECTIONS = [
  "home",
  "experiences",
  "projects",
  "technologies",
  "education",
  "contact",
] as const;

export type PortfolioSection = (typeof PORTFOLIO_SECTIONS)[number];
export type PortfolioStatus = "draft" | "published" | "archived";
export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface Portfolio {
  id: string;
  ownerId: string;
  code: string;
  name: string;
  status: PortfolioStatus;
  defaultLocale: "pt-BR" | "en" | "es" | "fr" | "ja";
  enabledLocales: Array<"pt-BR" | "en" | "es" | "fr" | "ja">;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface HomeContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryAction: LinkAction;
  secondaryAction: LinkAction | null;
  socialLinks: SocialLink[];
  heroImage: MediaReference | null;
}

export interface LinkAction {
  label: string;
  href: string;
  external: boolean;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface MediaReference {
  path: string;
  alt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  order: number;
  visible: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover: MediaReference | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  sections: ProjectContentSection[];
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface ProjectContentSection {
  id: string;
  anchor: string;
  title: string;
  kind: "richText" | "image" | "gallery" | "warning" | "legal";
  content: string;
  images: MediaReference[];
  order: number;
  visible: boolean;
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
  ariaLabel: string;
  startedAt: string | null;
  projectIds: string[];
  visible: boolean;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  order: number;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  receivedAt: string;
  readAt: string | null;
  repliedAt: string | null;
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  totals: {
    experiences: number;
    projects: number;
    technologies: number;
    education: number;
    unreadContacts: number;
  };
}
