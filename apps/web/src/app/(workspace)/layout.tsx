import { Sidebar } from "@/components/ui/Sidebar";
import { ConfigPanel } from "@/components/pitch/ConfigPanel";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 overflow-hidden relative">
      <Sidebar />
      <ConfigPanel />
      <main className="flex-1 overflow-y-auto relative w-full bg-[#0d0f14]">
        {children}
      </main>
    </div>
  );
}
