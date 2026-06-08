import { Sidebar } from "@/components/ui/Sidebar";
import { ConfigPanel } from "@/components/pitch/ConfigPanel";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 overflow-hidden relative">
      <Sidebar />
      <ConfigPanel />
      <main className="flex-1 overflow-y-auto relative w-full bg-background">
        {children}
      </main>
    </div>
  );
}
