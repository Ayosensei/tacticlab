import { Sidebar } from "@/components/ui/Sidebar";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative w-full bg-[#0d0f14]">
        {children}
      </main>
    </div>
  );
}
