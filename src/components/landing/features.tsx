"use client";

import { motion } from "framer-motion";
import { Zap, Eye, Download, Rocket, GitBranch, Code2, Palette, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "AI Generation",
    desc: "Describe in natural language. GPT-4o generates complete, production-ready code in seconds.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    icon: Eye,
    title: "Live Preview",
    desc: "Instant preview on desktop, tablet, and mobile. See changes as you edit in real-time.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    icon: Code2,
    title: "Monaco Editor",
    desc: "The same editor powering VS Code. Syntax highlighting, autocomplete, and formatting built in.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    icon: GitBranch,
    title: "Version History",
    desc: "Every save creates a snapshot. Restore any version, compare diffs, roll back instantly.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    desc: "Deploy directly to the web with a single click. Get a live URL instantly.",
    color: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-400",
    border: "border-pink-500/20",
  },
  {
    icon: Download,
    title: "Export ZIP",
    desc: "Download your entire project as a ZIP with README, all source files, and assets.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    icon: Palette,
    title: "Design Customization",
    desc: "Choose color palettes, styles, and themes. AI applies them consistently throughout your site.",
    color: "from-indigo-500/20 to-indigo-500/5",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  {
    icon: Shield,
    title: "Production Quality",
    desc: "WCAG AA accessible, SEO-optimized, responsive, and Lighthouse 95+ ready from day one.",
    color: "from-teal-500/20 to-teal-500/5",
    iconColor: "text-teal-400",
    border: "border-teal-500/20",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Everything you need to ship
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From prompt to production. BuildAI handles generation, editing, previewing, versioning, and deployment.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group relative rounded-2xl border ${feature.border} bg-gradient-to-b ${feature.color} p-6 hover:scale-[1.02] transition-transform duration-200 cursor-default`}
            >
              <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
