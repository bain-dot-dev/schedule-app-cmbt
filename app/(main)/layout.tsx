import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/components/sessionContext-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <UserProvider>
          <AppSidebar className="no-print" />
          <Toaster />
          <main className="w-full px-6">
            <div className="no-print flex py-5">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </UserProvider>
      </SidebarProvider>
    </>
  );
}
