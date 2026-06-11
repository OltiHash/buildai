"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for personal projects and trying things out.",
    features: [
      "5 projects",
      "10 AI generations/month",
      "Export ZIP",
      "Community support",
      "Basic templates",
    ],
    cta: "Get started free",
    href: "/register",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For developers and freelancers building for clients.",
    features: [
      "Unlimited projects",
      "100 AI generations/month",
      "Export ZIP",
      "One-click deploy",
      "Version history",
      "Priority support",
      "Custom domains",
      "Analytics dashboard",
    ],
    cta: "Start Pro trial",
    href: "/register?plan=pro",
    variant: "gradient" as const,
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    desc: "For agencies and teams collaborating on multiple projects.",
    features: [
      "Everything in Pro",
      "Unlimited generations",
      "5 team seats",
      "Team collaboration",
      "Admin dashboard",
      "API access",
      "Dedicated support",
      "Custom AI fine-tuning",
    ],
    cta: "Contact sales",
    href: "/register?plan=team",
    variant: "outline" as const,
    popular: false,
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-transparent shadow-xl shadow-violet-500/10"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 text-xs font-medium text-white">
                    <Zap className="h-3 w-3" />
                    Most popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/40">{plan.period}</span>}
                </div>
                <p className="text-sm text-white/40">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.variant} size="lg" className="w-full">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
