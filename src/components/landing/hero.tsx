"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "A modern SaaS landing page with glassmorphism cards and dark mode",
  "A portfolio for a creative director with animated sections",
  "A school website with admin dashboard and achievements section",
  "An e-commerce product page with 3D-style hero and reviews",
  "A startup website with gradient animations and waitlist form",
];

export function LandingHero() {
  const [exampleIndex, setExampleIndex] = useState(0);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 mb-8"
        >
          <Sparkles className="h-3 w-3" />
          Powered by GPT-4o
          <span className="h-1 w-1 rounded-full bg-violet-400" />
          Now in beta
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="gradient-text">Build websites</span>
          <br />
          <span className="text-white/30">with AI.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10"
        >
          Describe your idea. Get production-ready code instantly.
          Edit in a live editor, save versions, and deploy — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Button asChild variant="glow" size="xl" className="group">
            <Link href="/register">
              Start Building Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="#demo">
              <Play className="h-4 w-4" />
              Watch Demo
            </Link>
          </Button>
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xs text-white/20 mb-3 uppercase tracking-widest">Try these examples</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.slice(0, 3).map((example, i) => (
              <button
                key={i}
                onClick={() => setExampleIndex(i)}
                className={`text-left text-sm px-4 py-3 rounded-xl border transition-all duration-200 ${
                  exampleIndex === i
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/10 hover:text-white/60"
                }`}
              >
                &quot;{example}&quot;
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "10K+", label: "Websites built" },
            { value: "< 30s", label: "Generation time" },
            { value: "99%", label: "Satisfaction rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-20 w-full max-w-6xl mx-auto px-4"
      >
        <div className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/50">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-white/5 border border-white/5 flex items-center px-3">
              <span className="text-xs text-white/20">https://buildai.app/project/my-startup</span>
            </div>
          </div>

          {/* App preview */}
          <div className="grid grid-cols-[240px_1fr_280px] h-[420px]">
            {/* File tree */}
            <div className="border-r border-white/[0.06] p-3 space-y-1 overflow-hidden">
              <p className="text-xs text-white/30 mb-3 px-2 uppercase tracking-widest">Project files</p>
              {[
                { name: "index.html", indent: 0, active: true },
                { name: "styles.css", indent: 0 },
                { name: "components/", indent: 0 },
                { name: "hero.html", indent: 1 },
                { name: "navbar.html", indent: 1 },
                { name: "pricing.html", indent: 1 },
                { name: "assets/", indent: 0 },
                { name: "logo.svg", indent: 1 },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs cursor-pointer ${
                    item.active ? "bg-violet-500/20 text-violet-300" : "text-white/40 hover:text-white/70"
                  }`}
                  style={{ paddingLeft: `${8 + item.indent * 16}px` }}
                >
                  <span className={item.name.endsWith("/") ? "text-yellow-500/60" : "text-blue-400/60"}>
                    {item.name.endsWith("/") ? "📁" : "📄"}
                  </span>
                  {item.name}
                </div>
              ))}
            </div>

            {/* Code editor */}
            <div className="bg-[#0d0d0d] p-4 font-mono text-xs overflow-hidden">
              <div className="text-white/20 mb-2">index.html</div>
              {[
                { indent: 0, content: '<html lang="en">', color: "text-blue-400/60" },
                { indent: 1, content: '<head>', color: "text-blue-400/60" },
                { indent: 2, content: '<title>My Startup</title>', color: "text-white/30" },
                { indent: 1, content: '</head>', color: "text-blue-400/60" },
                { indent: 1, content: '<body class="dark">', color: "text-blue-400/60" },
                { indent: 2, content: '<nav class="glass...">', color: "text-green-400/60" },
                { indent: 3, content: '<div class="logo">...</div>', color: "text-white/30" },
                { indent: 2, content: '</nav>', color: "text-green-400/60" },
                { indent: 2, content: '<section class="hero...">', color: "text-violet-400/60" },
                { indent: 3, content: '<h1>Build faster</h1>', color: "text-white/40" },
              ].map((line, i) => (
                <div key={i} className={`${line.color} leading-6`} style={{ paddingLeft: `${line.indent * 16}px` }}>
                  {line.content}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="border-l border-white/[0.06] bg-gradient-to-br from-violet-950/20 to-indigo-950/20 p-6 flex flex-col justify-center">
              <div className="text-xs text-white/30 mb-4">Live Preview</div>
              <div className="rounded-xl bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border border-white/10 p-4 space-y-3">
                <div className="h-3 w-3/4 rounded-full bg-white/20" />
                <div className="h-2 w-1/2 rounded-full bg-white/10" />
                <div className="h-8 w-28 rounded-lg bg-gradient-to-r from-violet-500/60 to-indigo-500/60 mt-4" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/5" />
                <div className="h-2 w-4/5 rounded-full bg-white/5" />
                <div className="h-2 w-3/5 rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </motion.div>
    </section>
  );
}
