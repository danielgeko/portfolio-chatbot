export const MODEL = "claude-haiku-4-5";
export const MAX_TOKENS = 1024;
export const MAX_HISTORY_MESSAGES = 8;

export const CHATBOT_GREETING =
  "Hi! Ask me anything about Daniel — his experience, projects, or background.";

export type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Chat", href: "/" },
  { label: "Resume", href: "/resume" },
  { label: "Projects", href: "/projects" },
  { label: "Contact Info", href: "/contact" },
];
