import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
export function NavMain({
  items,
  currentPath,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  currentPath: string;
}) {
  return (
    <SidebarMenu className="flex flex-col gap-2 mt-6">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            className="px-4"
            asChild
            isActive={currentPath === item.url}
          >
             <Link 
              href={item.url} 
              className="flex items-center gap-4 py-2 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-md transition-colors"
            >
              {item.icon && <item.icon className="h-5 w-5 stroke-2" />}
              <span className="text-base font-medium">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
