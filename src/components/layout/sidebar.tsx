"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, Layers, Rocket, BarChart3,
  Settings, Zap, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
  { href: "/dashboard/templates", icon: Layers, label: "Templates" },
  { href: "/dashboard/deployments", icon: Rocket, label: "Deployments" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 60 : 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-full border-r border-white/[0.06] bg-[#080808] shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-white text-sm whitespace-nowrap"
            >
              BuildAI
            </motion.span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Tooltip key={href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden">{label}</span>
                  )}
                  {active && !sidebarCollapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </Link>
              </TooltipTrigger>
              {sidebarCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] p-3">
        <div className={cn("flex items-center gap-2", sidebarCollapsed && "justify-center")}>
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{session?.user?.name ?? "User"}</div>
              <div className="text-[10px] text-white/30 truncate">{session?.user?.email}</div>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white/20 hover:text-white/60 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3 h-6 w-6 rounded-full border border-white/10 bg-[#111] flex items-center justify-center text-white/30 hover:text-white/70 hover:border-white/20 transition-all z-10 shadow-lg"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
}
