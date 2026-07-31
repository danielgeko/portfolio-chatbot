export const MODEL = "claude-haiku-4-5";
export const MAX_TOKENS = 1024;
export const MAX_HISTORY_MESSAGES = 8;

export const CHATBOT_GREETING =
  "Hi! Ask me anything about Daniel — his experience, projects, or background.";

export type NavIcon = "chat" | "resume" | "projects" | "contact";
export type NavItem = { label: string; href: string; icon: NavIcon };

export const NAV_ITEMS: NavItem[] = [
  { label: "Chat", href: "/", icon: "chat" },
  { label: "Resume", href: "/resume", icon: "resume" },
  { label: "Projects", href: "/projects", icon: "projects" },
  { label: "Contact Info", href: "/contact", icon: "contact" },
];
