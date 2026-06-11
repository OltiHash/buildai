"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "What kind of websites can BuildAI generate?",
    a: "BuildAI can generate any type of website — landing pages, portfolios, e-commerce sites, dashboards, blogs, SaaS products, agency sites, and more. Just describe what you want in plain English.",
  },
  {
    q: "How good is the generated code quality?",
    a: "Generated code is production-ready, semantic HTML with accessible markup, responsive CSS using modern techniques, and clean JavaScript. Lighthouse scores consistently hit 90+.",
  },
  {
    q: "Can I edit the generated code?",
    a: "Yes — BuildAI includes a full Monaco editor (the engine behind VS Code) with syntax highlighting, autocomplete, and auto-formatting. Edit any file directly in the browser.",
  },
  {
    q: "What happens when I deploy?",
    a: "Your project is built and deployed to a global CDN. You get a live URL instantly. Pro and Team plans support custom domains.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 5 projects and 10 AI generations per month — no credit card required. Upgrade anytime.",
  },
  {
    q: "Can I export and host the code myself?",
    a: "Absolutely. Export a ZIP archive with all your source files, assets, and a README. Host it anywhere — Vercel, Netlify, GitHub Pages, or your own server.",
  },
];

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">FAQ</p>
          <h2 className="text-4xl font-bold text-white">Questions answered</h2>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`text-sm font-medium ${open === i ? "text-white" : "text-white/70"}`}>
                  {faq.q}
                </span>
                <div className="shrink-0 text-white/30">
                  {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-white/40 leading-relaxed border-t border-white/[0.04] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
