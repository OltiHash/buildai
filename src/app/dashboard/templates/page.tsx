"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  {
    name: "SaaS Landing Page",
    desc: "Modern dark SaaS with glassmorphism, pricing, and CTA sections",
    category: "Business",
    prompt: "A modern dark SaaS landing page with glassmorphism cards, animated hero, feature grid with icons, 3-tier pricing table, testimonials, and newsletter signup",
    gradient: "from-violet-900/30 to-indigo-900/20",
  },
  {
    name: "Developer Portfolio",
    desc: "Minimal portfolio with projects grid, skills, and contact",
    category: "Portfolio",
    prompt: "A minimal developer portfolio with animated hero, projects grid with hover effects, skills section with progress bars, and a contact form",
    gradient: "from-blue-900/30 to-cyan-900/20",
  },
  {
    name: "Restaurant Website",
    desc: "Elegant restaurant site with menu, reservations, and gallery",
    category: "Business",
    prompt: "An elegant restaurant website with full-width hero image, menu grid with categories, online reservation form, photo gallery with lightbox, and customer reviews",
    gradient: "from-amber-900/30 to-orange-900/20",
  },
  {
    name: "Startup Homepage",
    desc: "High-converting startup page with waitlist and social proof",
    category: "Startup",
    prompt: "A high-converting startup homepage with gradient animated hero, problem/solution section, product screenshots, waitlist email form, social proof logos, and FAQ",
    gradient: "from-pink-900/30 to-rose-900/20",
  },
  {
    name: "Agency Website",
    desc: "Creative agency with services, case studies, and team",
    category: "Agency",
    prompt: "A creative agency website with bold typography hero, services grid, case studies with before/after, team profiles, client logos, and contact section",
    gradient: "from-emerald-900/30 to-teal-900/20",
  },
  {
    name: "E-Commerce Product",
    desc: "Product page with 3D-style gallery and reviews",
    category: "E-Commerce",
    prompt: "An e-commerce product page with image gallery, 3D-style product showcase, variant selector, add to cart, customer reviews with ratings, and related products",
    gradient: "from-purple-900/30 to-violet-900/20",
  },
];

export default function TemplatesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-sm text-white/40 mt-1">Start from a professionally crafted template</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl, i) => (
          <motion.div
            key={tpl.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="group h-full">
              <div className={`h-40 bg-gradient-to-br ${tpl.gradient} to-transparent border-b border-white/[0.04] flex items-center justify-center rounded-t-xl`}>
                <div className="w-24 h-16 rounded-xl bg-white/5 border border-white/10" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-white text-sm">{tpl.name}</h3>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{tpl.category}</Badge>
                </div>
                <p className="text-xs text-white/40 leading-relaxed mb-4">{tpl.desc}</p>
                <Button asChild variant="gradient" size="sm" className="w-full h-8 text-xs">
                  <Link href={`/generate?prompt=${encodeURIComponent(tpl.prompt)}`}>
                    <Zap className="h-3 w-3" />
                    Use template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
