"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DEMO_STEPS = [
  { id: 1, label: "Type your prompt", desc: "Describe what you want to build" },
  { id: 2, label: "AI analyzes & plans", desc: "Structures your project intelligently" },
  { id: 3, label: "Code is generated", desc: "Complete files appear in real-time" },
  { id: 4, label: "Preview & edit", desc: "Refine in the live editor" },
  { id: 5, label: "Deploy or export", desc: "Ship it to the world" },
];

export function LandingDemo() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="demo" className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            From idea to website in 5 steps
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-3">
            {DEMO_STEPS.map((step, i) => (
              <motion.button
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                  activeStep === i
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    activeStep === i ? "bg-violet-500 text-white" : "bg-white/10 text-white/40"
                  }`}
                >
                  {step.id}
                </div>
                <div>
                  <div className={`font-medium text-sm ${activeStep === i ? "text-white" : "text-white/60"}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5">{step.desc}</div>
                </div>
                {activeStep === i && <ChevronRight className="h-4 w-4 text-violet-400 ml-auto" />}
              </motion.button>
            ))}

            <div className="pt-4">
              <Button asChild variant="gradient" size="lg">
                <Link href="/register">
                  <Sparkles className="h-4 w-4" />
                  Try it now — it&apos;s free
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              {/* Terminal-style header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-white/20 ml-2">BuildAI Generator</span>
              </div>

              {/* Content based on step */}
              <div className="p-6 h-72 font-mono text-sm">
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="text-white/30 text-xs">Enter your prompt:</div>
                    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-violet-300 text-sm leading-relaxed">
                      &quot;Build a modern SaaS landing page for a project management tool with dark theme, glassmorphism cards, feature section, pricing table, and animated hero&quot;
                    </div>
                    <div className="flex items-center gap-2 text-white/20 text-xs mt-4">
                      <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                      Ready to generate
                    </div>
                  </div>
                )}
                {activeStep === 1 && (
                  <div className="space-y-2">
                    <div className="text-white/30 text-xs mb-4">Analyzing prompt...</div>
                    {["Detecting website type: SaaS Landing Page", "Identifying required sections: 6", "Planning component structure", "Selecting design tokens", "Preparing generation pipeline"].map((line, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span className="text-white/50">{line}</span>
                        <span className="text-emerald-400 ml-auto">✓</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="space-y-1 text-xs">
                    <div className="text-white/30 mb-3">Generating files...</div>
                    {[
                      { file: "index.html", status: "done", lines: "284 lines" },
                      { file: "styles.css", status: "done", lines: "412 lines" },
                      { file: "components/hero.html", status: "done", lines: "98 lines" },
                      { file: "components/pricing.html", status: "active", lines: "..." },
                      { file: "components/footer.html", status: "pending", lines: "" },
                    ].map((f) => (
                      <div key={f.file} className="flex items-center gap-2">
                        <span className={f.status === "done" ? "text-emerald-400" : f.status === "active" ? "text-violet-400 animate-pulse" : "text-white/20"}>
                          {f.status === "done" ? "✓" : f.status === "active" ? "⟳" : "○"}
                        </span>
                        <span className={f.status === "pending" ? "text-white/20" : "text-white/60"}>{f.file}</span>
                        <span className="text-white/20 ml-auto">{f.lines}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="space-y-3">
                    <div className="text-white/30 text-xs mb-3">Monaco Editor — index.html</div>
                    <div className="text-xs space-y-1 font-mono">
                      <div><span className="text-blue-400/70">&lt;section</span> <span className="text-green-400/70">class=</span><span className="text-amber-400/70">&quot;hero glass&quot;</span><span className="text-blue-400/70">&gt;</span></div>
                      <div className="pl-4"><span className="text-blue-400/70">&lt;h1</span> <span className="text-green-400/70">class=</span><span className="text-amber-400/70">&quot;gradient-text&quot;</span><span className="text-blue-400/70">&gt;</span></div>
                      <div className="pl-8 text-white/60">Ship faster than ever</div>
                      <div className="pl-4"><span className="text-blue-400/70">&lt;/h1&gt;</span></div>
                      <div className="pl-4 text-white/30 text-xs">← cursor blink here</div>
                    </div>
                  </div>
                )}
                {activeStep === 4 && (
                  <div className="space-y-3">
                    <div className="text-white/30 text-xs">Deployment ready</div>
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-sm font-medium">Deployed successfully</span>
                      </div>
                      <div className="text-xs text-white/40">https://my-saas.buildai.app</div>
                      <div className="text-xs text-white/30 pt-1">Lighthouse: Performance 97 · SEO 100 · A11y 95</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
