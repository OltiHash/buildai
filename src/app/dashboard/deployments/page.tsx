"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Rocket, ExternalLink, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";

const STATUS_ICONS = {
  PENDING: Loader2,
  BUILDING: Loader2,
  DEPLOYED: CheckCircle2,
  FAILED: XCircle,
};

const STATUS_COLORS = {
  PENDING: "warning",
  BUILDING: "warning",
  DEPLOYED: "success",
  FAILED: "destructive",
} as const;

export default function DeploymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["deployments"],
    queryFn: async () => {
      const res = await fetch("/api/deployments");
      return res.json();
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Deployments</h1>
        <p className="text-sm text-white/40 mt-1">All your live sites and deployment history</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-xl" />
          ))}
        </div>
      ) : !data?.deployments?.length ? (
        <div className="text-center py-24">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-white/60 font-medium mb-2">No deployments yet</h3>
          <p className="text-sm text-white/30">Open a project and click Deploy to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.deployments.map((deployment: { id: string; url: string | null; status: keyof typeof STATUS_ICONS; duration: number | null; createdAt: string; project?: { name: string } }, i: number) => {
            const StatusIcon = STATUS_ICONS[deployment.status];
            return (
              <motion.div key={deployment.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card glass>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                        deployment.status === "DEPLOYED" ? "bg-emerald-500/10" : "bg-white/5"
                      }`}>
                        <StatusIcon className={`h-4 w-4 ${
                          deployment.status === "DEPLOYED" ? "text-emerald-400" :
                          deployment.status === "FAILED" ? "text-red-400" : "text-white/40 animate-spin"
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {deployment.project?.name ?? "Project"}
                          </span>
                          <Badge variant={STATUS_COLORS[deployment.status]} className="text-[10px]">
                            {deployment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {deployment.url && (
                            <span className="text-xs text-white/30 truncate">{deployment.url}</span>
                          )}
                          <span className="text-xs text-white/20 flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatRelative(deployment.createdAt)}
                          </span>
                          {deployment.duration && (
                            <span className="text-xs text-white/20">{(deployment.duration / 1000).toFixed(1)}s</span>
                          )}
                        </div>
                      </div>

                      {deployment.url && deployment.status === "DEPLOYED" && (
                        <a
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/70 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
