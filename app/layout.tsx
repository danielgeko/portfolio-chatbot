import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Ask Daniel",
  description: "A personal AI chatbot that answers questions about Daniel's resume and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-screen flex flex-col overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
