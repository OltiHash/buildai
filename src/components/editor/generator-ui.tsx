"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles, Zap, Globe, Palette, Layout, Star, ChevronDown, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/project.store";
import { GenerationProgress } from "./generation-progress";

const WEBSITE_TYPES = [
  "Landing Page", "Portfolio", "E-commerce", "Blog", "Dashboard",
  "SaaS", "Agency", "Restaurant", "School", "Startup",
];

const STYLES = ["Modern", "Minimal", "Bold", "Elegant", "Playful", "Corporate"];

const EXAMPLE_PROMPTS = [
  "A dark-themed SaaS landing page for a project management tool with glassmorphism cards, animated stats, feature section, and pricing table",
  "A creative portfolio for a UI/UX designer with animated hero, case studies grid, skills section, and contact form",
  "A school website with achievements gallery, faculty profiles, events calendar, and modern admin dashboard",
  "A restaurant website with full-width hero video, menu grid, reservation form, and customer reviews section",
  "A startup landing page with gradient animations, problem/solution section, waitlist email capture, and social proof",
];

export function GeneratorUI() {
  const router = useRouter();
  const { setIsGenerating, updateGenerationStep, setFiles, isGenerating } = useProjectStore();

  const [prompt, setPrompt] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [pages, setPages] = useState<string[]>(["Home"]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  const addPage = (page: string) => {
    if (!pages.includes(page)) setPages([...pages, page]);
    else setPages(pages.filter((p) => p !== page));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);

    const steps = ["analyze", "plan", "generate", "style", "optimize", "save"];
    steps.forEach((id) => updateGenerationStep(id, "pending"));
    updateGenerationStep("analyze", "active");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          options: {
            websiteType: selectedType,
            style: selectedStyle,
            pages,
          },
        }),
        signal: abortRef.current.signal,
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let stepIndex = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.chunk) {
              setProgress((p) => Math.min(p + 2, 90));
              if (stepIndex < steps.length - 1 && Math.random() > 0.85) {
                updateGenerationStep(steps[stepIndex], "done");
                stepIndex++;
                updateGenerationStep(steps[stepIndex], "active");
              }
            }

            if (data.done) {
              steps.forEach((id) => updateGenerationStep(id, "done"));
              setProgress(100);
              if (data.result?.files) setFiles(data.result.files);
              setGeneratingProjectId(data.projectId);

              setTimeout(() => {
                setIsGenerating(false);
                if (data.projectId) router.push(`/project/${data.projectId}`);
              }, 1000);
            }

            if (data.error) {
              throw new Error(data.error);
            }
          } catch {
            // JSON parse error on chunk data — skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setIsGenerating(false);
      steps.forEach((id) => updateGenerationStep(id, "pending"));
    }
  };

  if (isGenerating || generatingProjectId) {
    return (
      <GenerationProgress
        progress={progress}
        onCancel={() => {
          abortRef.current?.abort();
          setIsGenerating(false);
          setGeneratingProjectId(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 mb-6">
            <Sparkles className="h-3 w-3" />
            AI Website Generator
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Describe your website
          </h1>
          <p className="text-white/40">
            Be as detailed as you want. The more context, the better the result.
          </p>
        </div>

        {/* Main prompt */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build a modern SaaS landing page for a project management tool with dark theme, animated hero section, feature cards with icons, pricing table with 3 tiers, and a clean footer..."
              className="min-h-[140px] text-sm pr-4 resize-none border-white/10 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30 bg-white/[0.03]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-white/15">
              {prompt.length}/2000
            </div>
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-white/20 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>

          {/* Quick options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div>
              <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> Website type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {WEBSITE_TYPES.slice(0, 5).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? "" : t)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selectedType === t
                        ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                        : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Style
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(selectedStyle === s ? "" : s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selectedStyle === s
                        ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
                        : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            Advanced options
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                    <Layout className="h-3 w-3" /> Pages to include
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Home", "About", "Services", "Portfolio", "Blog", "Pricing", "Contact", "FAQ"].map((p) => (
                      <button
                        key={p}
                        onClick={() => addPage(p)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          pages.includes(p)
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            variant="gradient"
            size="xl"
            className="w-full group"
          >
            <Zap className="h-5 w-5" />
            Generate website
            <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-center text-xs text-white/20">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/30">⌘ Enter</kbd> to generate
          </p>
        </div>

        {/* Selected options badges */}
        {(selectedType || selectedStyle || pages.length > 1) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {selectedType && <Badge variant="gradient"><Star className="h-3 w-3" />{selectedType}</Badge>}
            {selectedStyle && <Badge variant="gradient">{selectedStyle}</Badge>}
            {pages.filter((p) => p !== "Home").map((p) => (
              <Badge key={p} variant="secondary">{p}</Badge>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
