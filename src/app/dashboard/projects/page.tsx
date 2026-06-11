"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Zap, Trash2, ExternalLink, Clock, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";
import type { Project } from "@/types";

const STATUS_COLORS = {
  DRAFT: "secondary", GENERATING: "warning", READY: "success",
  DEPLOYED: "info", ARCHIVED: "outline",
} as const;

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", search],
    queryFn: async () => {
      const res = await fetch(`/api/projects?search=${encodeURIComponent(search)}&limit=24`);
      return res.json() as Promise<{ projects: (Project & { _count: { versions: number; files: number } })[] }>;
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/40 mt-1">
            {data?.projects.length ?? 0} project{data?.projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/generate">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="h-36 skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.projects.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-white/60 font-medium mb-2">No projects found</h3>
          <p className="text-sm text-white/30 mb-6">
            {search ? "Try a different search term" : "Create your first AI-powered website"}
          </p>
          <Button asChild variant="gradient">
            <Link href="/generate">
              <Zap className="h-4 w-4" />
              Generate with AI
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover className="group relative h-full">
                {/* Thumbnail */}
                <div className="h-36 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-transparent border-b border-white/[0.04] flex items-center justify-center rounded-t-xl overflow-hidden">
                  <Zap className="h-6 w-6 text-white/10" />
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-white text-sm truncate flex-1">{project.name}</h3>
                    <Badge variant={STATUS_COLORS[project.status] ?? "secondary"} className="text-[10px] shrink-0">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/30 line-clamp-2 mb-3 leading-relaxed">
                    {project.description || project.prompt}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-white/20 mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelative(project.updatedAt)}</span>
                    <span>{project._count.files} files</span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm" className="flex-1 h-7 text-xs">
                      <Link href={`/project/${project.id}`}>
                        <ExternalLink className="h-3 w-3" />
                        Open
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        if (confirm("Delete this project?")) deleteProject.mutate(project.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
