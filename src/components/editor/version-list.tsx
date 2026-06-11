"use client";

import { useState } from "react";
import { useProjectStore } from "@/store/project.store";
import { formatRelative } from "@/lib/utils";
import { RotateCcw, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VersionList({ projectId }: { projectId: string }) {
  const { versions } = useProjectStore();
  const [restoring, setRestoring] = useState<string | null>(null);

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId);
    await fetch(`/api/projects/${projectId}/versions/${versionId}/restore`, { method: "POST" });
    setRestoring(null);
    window.location.reload();
  };

  if (versions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/20 text-sm">
        No versions saved yet
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-white/30 mb-4">
        {versions.length} version{versions.length !== 1 ? "s" : ""} saved
      </p>

      {versions.map((version) => (
        <div
          key={version.id}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-colors"
        >
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Tag className="h-3.5 w-3.5 text-white/30" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white">
              {version.label ?? `Version ${version.number}`}
            </div>
            <div className="text-xs text-white/30 mt-0.5">
              {formatRelative(version.createdAt)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRestore(version.id)}
            loading={restoring === version.id}
            className="h-7 text-xs text-white/30 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Restore
          </Button>
        </div>
      ))}
    </div>
  );
}
