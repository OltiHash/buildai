"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProjectStore } from "@/store/project.store";

interface Props {
  progress: number;
  onCancel: () => void;
}

export function GenerationProgress({ progress, onCancel }: Props) {
  const { generationSteps } = useProjectStore();

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 text-center">
          {/* Animated icon */}
          <div className="relative h-16 w-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Building your website</h2>
          <p className="text-sm text-white/40 mb-8">AI is generating your project files...</p>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30">Progress</span>
              <span className="text-xs text-white/50 font-mono">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Steps */}
          <div className="space-y-3 text-left">
            {generationSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="shrink-0">
                  {step.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {step.status === "active" && <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />}
                  {step.status === "pending" && <Circle className="h-4 w-4 text-white/20" />}
                  {step.status === "error" && <XCircle className="h-4 w-4 text-red-400" />}
                </div>
                <span
                  className={`text-sm ${
                    step.status === "done"
                      ? "text-white/60 line-through"
                      : step.status === "active"
                      ? "text-white"
                      : "text-white/25"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={onCancel} className="mt-8 text-white/30 hover:text-white/60">
            <X className="h-3.5 w-3.5" />
            Cancel generation
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
