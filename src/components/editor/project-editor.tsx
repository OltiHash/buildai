"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2, Eye, GitBranch, Download, Rocket, ArrowLeft, Save,
  Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Settings2,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileTree } from "./file-tree";
import { PreviewFrame } from "../preview/preview-frame";
import { VersionList } from "./version-list";
import { useProjectStore } from "@/store/project.store";
import { formatRelative } from "@/lib/utils";
import type { Project, ProjectFile, Version, Deployment } from "@/types";

const MonacoEditor = dynamic(() => import("./code-editor"), { ssr: false });

interface Props {
  project: Project & {
    files: ProjectFile[];
    versions: Version[];
    deployments: Deployment[];
  };
}

const STATUS_COLORS = {
  DRAFT: "secondary", GENERATING: "warning", READY: "success",
  DEPLOYED: "info", ARCHIVED: "outline",
} as const;

export function ProjectEditor({ project }: Props) {
  const { activeFile, setActiveFile, setFiles, setVersions, previewMode, setPreviewMode, editorTheme } = useProjectStore();
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "versions">("editor");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setFiles(project.files);
    setVersions(project.versions);
    if (project.files.length > 0 && !activeFile) {
      const html = project.files.find((f) => f.name === "index.html") ?? project.files[0];
      setActiveFile(html);
    }
  }, [project, setFiles, setVersions, setActiveFile, activeFile]);

  const handleSave = async () => {
    if (!activeFile) return;
    setSaving(true);
    await fetch(`/api/projects/${project.id}/files`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: activeFile.path, content: activeFile.content }),
    });
    setSaving(false);
  };

  const handleExport = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    await fetch(`/api/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });
    setDeploying(false);
  };

  const handleSaveVersion = async () => {
    await fetch(`/api/projects/${project.id}/versions`, { method: "POST" });
  };

  const previewWidth = previewMode === "desktop" ? "100%" : previewMode === "tablet" ? "768px" : "375px";

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.06] bg-[#080808] shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard" className="text-white/30 hover:text-white/70 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Back to dashboard</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-white truncate">{project.name}</span>
          <Badge variant={STATUS_COLORS[project.status] ?? "secondary"} className="text-[10px] shrink-0">
            {project.status}
          </Badge>
        </div>

        <span className="text-xs text-white/20 ml-2 shrink-0 hidden sm:block">
          {formatRelative(project.updatedAt)}
        </span>

        <div className="flex-1" />

        {/* Preview mode toggles */}
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/10 p-0.5 bg-white/[0.02]">
          {([
            { mode: "desktop" as const, icon: Monitor },
            { mode: "tablet" as const, icon: Tablet },
            { mode: "mobile" as const, icon: Smartphone },
          ]).map(({ mode, icon: Icon }) => (
            <Tooltip key={mode}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPreviewMode(mode)}
                  className={`p-1.5 rounded-md transition-all ${
                    previewMode === mode ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{mode}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-4 hidden sm:block" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleSaveVersion} className="h-7 w-7">
                <GitBranch className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save version</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExport} className="h-7 w-7">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export ZIP</TooltipContent>
          </Tooltip>

          <Button variant="secondary" size="sm" onClick={handleSave} loading={saving} className="h-7 text-xs">
            <Save className="h-3 w-3" />
            Save
          </Button>

          <Button variant="gradient" size="sm" onClick={handleDeploy} loading={deploying} className="h-7 text-xs">
            <Rocket className="h-3 w-3" />
            Deploy
          </Button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <div className="w-52 border-r border-white/[0.06] bg-[#080808] overflow-y-auto shrink-0 hidden lg:block">
          <FileTree projectId={project.id} />
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 bg-[#080808]">
              <TabsList className="h-10 rounded-none border-0 bg-transparent gap-0 p-0">
                {[
                  { value: "editor", icon: Code2, label: "Editor" },
                  { value: "preview", icon: Eye, label: "Preview" },
                  { value: "versions", icon: GitBranch, label: "Versions" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet-500 data-[state=active]:bg-transparent h-10 text-xs px-4 gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {activeTab === "preview" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewKey((k) => k + 1)}
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="text-white/30 hover:text-white/70 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <TabsContent value="editor" className="flex-1 overflow-hidden m-0">
              {activeFile ? (
                <MonacoEditor
                  key={activeFile.id}
                  path={activeFile.path}
                  language={activeFile.language}
                  theme={editorTheme}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
                  Select a file from the tree
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden m-0 bg-[#111] flex items-center justify-center p-4">
              <motion.div
                animate={{ width: previewWidth }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <PreviewFrame key={previewKey} projectId={project.id} />
              </motion.div>
            </TabsContent>

            <TabsContent value="versions" className="flex-1 overflow-y-auto m-0">
              <VersionList projectId={project.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
