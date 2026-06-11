import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">BuildAI</span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed max-w-[160px]">
              Build production websites with AI.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Templates", "Changelog"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Press"],
            },
            {
              title: "Resources",
              links: ["Documentation", "API Reference", "Community", "Status"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "Cookies"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/[0.06] gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} BuildAI. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with Next.js, Tailwind CSS, and OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
