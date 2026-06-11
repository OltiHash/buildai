"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Zap, Rocket, FolderOpen, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";
import type { Project } from "@/types";

interface Props {
  user: { name: string | null; email: string };
  stats: { projects: number; generations: number; deployments: number };
  recentProjects: (Project & { _count: { versions: number; files: number } })[];
}

const STATUS_COLORS = {
  DRAFT: "secondary",
  GENERATING: "warning",
  READY: "success",
  DEPLOYED: "info",
  ARCHIVED: "outline",
} as const;

export function DashboardHome({ user, stats, recentProjects }: Props) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, {user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-white/40 mt-1">Ready to build something amazing?</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Total Projects", value: stats.projects, icon: FolderOpen, color: "text-violet-400" },
          { label: "AI Generations", value: stats.generations, icon: Zap, color: "text-amber-400" },
          { label: "Deployed Sites", value: stats.deployments, icon: Rocket, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} glass>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40">{label}</span>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-3xl font-bold text-white">{value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-medium text-white/50 mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Generate with AI",
              desc: "Describe your website and let AI build it",
              href: "/generate",
              icon: Zap,
              color: "from-violet-500/20",
            },
            {
              title: "Browse templates",
              desc: "Start from a professional template",
              href: "/dashboard/templates",
              icon: FolderOpen,
              color: "from-blue-500/20",
            },
            {
              title: "View deployments",
              desc: "Check your live sites and logs",
              href: "/dashboard/deployments",
              icon: Rocket,
              color: "from-emerald-500/20",
            },
          ].map((action) => (
            <Link key={action.title} href={action.href}>
              <Card hover className={`bg-gradient-to-br ${action.color} to-transparent h-full`}>
                <CardContent className="p-5">
                  <action.icon className="h-5 w-5 text-white/50 mb-3" />
                  <div className="font-medium text-white text-sm">{action.title}</div>
                  <div className="text-xs text-white/40 mt-1 leading-relaxed">{action.desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent projects */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white/50">Recent projects</h2>
          <Link href="/dashboard/projects" className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <Card glass className="p-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-6 w-6 text-white/20" />
            </div>
            <h3 className="text-white/60 font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-white/30 mb-6">Create your first AI-powered website in seconds</p>
            <Button asChild variant="gradient">
              <Link href="/generate">
                <Zap className="h-4 w-4" />
                Generate with AI
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link href={`/project/${project.id}`}>
                  <Card hover className="h-full">
                    {/* Thumbnail */}
                    <div className="h-36 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-transparent border-b border-white/[0.04] flex items-center justify-center rounded-t-xl overflow-hidden">
                      <div className="w-20 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white/20" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-white text-sm truncate flex-1">{project.name}</h3>
                        <Badge variant={STATUS_COLORS[project.status] ?? "secondary"} className="shrink-0 text-[10px]">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/30 line-clamp-2 leading-relaxed mb-3">
                        {project.description || project.prompt}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-white/20">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelative(project.updatedAt)}
                        </span>
                        <span>{project._count.files} files</span>
                        <span>{project._count.versions} versions</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
