"use client";

import {
  GraduationCap,
  Home,
  LayoutGrid,
  Users2,
  BookOpen,
} from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  //   SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "Monkey D. Luffy",
    email: "pirateking@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menuItems: [
    {
      title: "Faculty",
      url: "/faculty",
      icon: Users2,
    },
    {
      title: "Rooms",
      url: "/room",
      icon: Home,
    },
    {
      title: "Sections",
      url: "/section",
      icon: LayoutGrid,
    },
    {
      title: "Subjects",
      url: "/subject",
      icon: BookOpen,
    },
    {
      title: "Courses",
      url: "/course",
      icon: GraduationCap,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row justify-between px-5 py-5 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-6">
        <div className="flex items-center gap-3 ">
          <img
            src="/images/neust_logo.png"
            alt="NEUST Logo"
            className="h-10 w-10 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6"
          />
          <span className="text-2xl font-medium group-data-[collapsible=icon]:hidden">
            Schedulr
          </span>
        </div>
        {/* <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div> */}
      </SidebarHeader>
      <SidebarContent className="px-2 py-6">
        {/* <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3 py-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu> */}
        <NavMain items={data.menuItems} currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooter className="px-2 py-2">
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full">
              <div className="flex w-full items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20247-rH1QVd1bSJBaRv9OqkmN7c7nNehHzF.png"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-sm">
                  <span className="font-medium">John D. Doe</span>
                  <span className="text-xs text-muted-foreground">
                    johndoe@gmail.com
                  </span>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto h-4 w-4 text-muted-foreground"
                >
                  <path
                    d="M6 8.5L3 5.5H9L6 8.5Z"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
