import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar className="no-print" />
        <Toaster />
        <main className="w-full px-6">
          <div className="flex py-5">
            <SidebarTrigger className="no-print" />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
