"use client";

import { useProjectStore } from "@/store/project.store";
import { FileCode2, FileJson, FileType, FileText, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const FILE_ICONS: Record<string, React.ElementType> = {
  html: FileCode2,
  css: FileType,
  js: FileCode2,
  ts: FileCode2,
  tsx: FileCode2,
  jsx: FileCode2,
  json: FileJson,
};

function getIcon(language: string) {
  return FILE_ICONS[language] ?? FileText;
}

function buildTree(files: { path: string; name: string; language: string; id: string; content: string; projectId: string; createdAt: Date; updatedAt: Date }[]) {
  const tree: Record<string, unknown[]> = { "": [] };

  for (const file of files) {
    const parts = file.path.split("/");
    if (parts.length === 1) {
      (tree[""] as typeof files).push(file);
    } else {
      const dir = parts.slice(0, -1).join("/");
      if (!tree[dir]) tree[dir] = [];
      (tree[dir] as typeof files).push(file);
    }
  }
  return tree;
}

export function FileTree({ projectId: _projectId }: { projectId: string }) {
  const { files, activeFile, setActiveFile } = useProjectStore();
  const tree = buildTree(files);

  const dirs = Object.keys(tree).filter((k) => k !== "");
  const rootFiles = tree[""] ?? [];

  return (
    <div className="py-2">
      <div className="px-3 py-1.5 flex items-center gap-2">
        <span className="text-[10px] text-white/20 uppercase tracking-widest">Files</span>
      </div>

      {/* Root files */}
      {(rootFiles as typeof files).map((file) => {
        const Icon = getIcon(file.language);
        const isActive = activeFile?.path === file.path;
        return (
          <button
            key={file.id}
            onClick={() => setActiveFile(file)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors",
              isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-blue-400/70" />
            <span className="truncate">{file.name}</span>
          </button>
        );
      })}

      {/* Directories */}
      {dirs.map((dir) => (
        <div key={dir}>
          <div className="flex items-center gap-2 px-3 py-1.5">
            <FolderOpen className="h-3.5 w-3.5 text-yellow-500/50" />
            <span className="text-xs text-white/30">{dir}</span>
          </div>
          {(tree[dir] as typeof files).map((file) => {
            const Icon = getIcon(file.language);
            const isActive = activeFile?.path === file.path;
            return (
              <button
                key={file.id}
                onClick={() => setActiveFile(file)}
                className={cn(
                  "w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-xs transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-blue-400/70" />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
