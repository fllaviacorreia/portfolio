export type homeSection = {
  title: string;
  subtitle: string;
  actionButton1: string;
  actionButton2: string;
  background: { type: "color" | "image"; value: string };
  curriculumLink: string;
  socialLinks: { platform: string; url: string }[];
};

export type xpSection = {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
};

export type projectSection = {
  title: string;
  company?: string;
  description: string;
  repository: string;
  screenshots?: string[];
  tools: string[];
  contact?: string;
  startDate: Date;
  endDate?: Date;
  customSection?: {
    title?: string;
    content?: string;
    image?: string;
    position?: "up" | "down" | "left" | "right" | "center" | "background";
  }[];
};

export type toolSection = {
  name: string;
  proficiency: number; // 1 to 10
  startedAt: Date;
  icon?: string;
  projects?: string[];
};

export type educationSection = {
    institution: string;
    degree: string; // e.g., Bachelor's, Master's
    fieldOfStudy: string; // e.g., Computer Science
    startDate: Date;
    endDate?: Date;
    description: string;
}

export type contactSection = {
    email: string;
    phone?: string;
    name: string;
    message: string;
    receivedAt: Date;
}