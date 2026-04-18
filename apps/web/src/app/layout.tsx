import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/ui/TopNav";
import { Sidebar } from "@/components/ui/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TacticLab | Modern Football Tactics Builder",
  description: "Visual builder, AI analysis, and community library for FM23/FM24 players and real-life coaches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground overflow-hidden h-screen flex flex-col")}>
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
