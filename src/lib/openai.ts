import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getClient() {
  if (!_openai) {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      _openai = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
    } else {
      _openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY ?? "placeholder",
      });
    }
  }
  return _openai;
}

function getModel() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  return process.env.OPENAI_MODEL ?? "gpt-4o";
}

export const SYSTEM_PROMPT = `You are a world-class senior frontend engineer and UI/UX designer with 15+ years of experience building award-winning websites. You generate complete, visually stunning, production-ready websites.

OUTPUT REQUIREMENTS — follow every rule exactly:

DESIGN QUALITY:
- Hero sections must have large bold headlines (4xl-7xl), compelling subtext, and prominent CTAs
- Use rich color palettes: deep backgrounds (#050505, #0a0a0a, #0f0f1a), vibrant accents (violet, indigo, cyan, emerald)
- Apply glassmorphism: backdrop-filter: blur(20px), semi-transparent backgrounds with borders
- CSS animations: fade-in, slide-up, float, gradient-shift using @keyframes — make it feel alive
- Sections must be TALL and RICH: hero (100vh), features (detailed cards with icons), stats, testimonials, pricing, CTA, footer
- Use CSS Grid and Flexbox for sophisticated layouts (not just stacked divs)
- Gradients everywhere: text gradients (background-clip: text), border gradients, background gradients
- Box shadows for depth: 0 0 40px rgba(139,92,246,0.15)
- Real content — never Lorem Ipsum. Write compelling real copy relevant to the product

CODE QUALITY:
- Every file must be 100% complete — no "// add more here", no placeholders, no TODOs
- All CSS must be inline in <style> tags within the HTML (no external dependencies except Google Fonts and CDN icons)
- Include Lucide icons via CDN: <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script> then use <i data-lucide="icon-name"></i> and call lucide.createIcons() in a script at the bottom
- Use Google Fonts: import 1-2 fonts that match the style (Inter, Geist, Sora, Plus Jakarta Sans, etc.)
- JavaScript: smooth scroll, scroll-triggered animations (IntersectionObserver), mobile nav toggle, any interactive features requested
- Mobile responsive: hamburger menu, fluid typography (clamp()), responsive grid

MANDATORY SECTIONS for a landing page (adapt for other site types):
1. Navigation: sticky, with logo, nav links, and CTA button — blur backdrop on scroll
2. Hero: full-height, bold headline with gradient text, subheadline, 2 CTA buttons, hero visual (SVG illustration, grid, or animated element)
3. Social proof: logos or stats bar
4. Features: 6 feature cards minimum, each with icon, title, and 2-sentence description
5. How it works: numbered steps section
6. Stats: impressive numbers with labels (animated counters if possible)
7. Testimonials: 3+ cards with avatar, name, role, company, quote
8. Pricing: 3 tiers (Free, Pro, Enterprise) with feature lists and highlighted recommended tier
9. FAQ: accordion with 6+ questions
10. CTA banner: final conversion section
11. Footer: multi-column with links, social icons, copyright

Return ONLY valid JSON with this exact structure:
{
  "name": "Project Name",
  "description": "One sentence description",
  "files": [
    {
      "path": "index.html",
      "name": "index.html",
      "content": "<!DOCTYPE html>...complete file...",
      "language": "html"
    }
  ],
  "metadata": {
    "pages": ["Home"],
    "theme": "dark",
    "colors": {"primary": "#8b5cf6", "background": "#050505"},
    "features": ["responsive", "animations", "glassmorphism"]
  }
}

The "content" field must contain the ENTIRE file — thousands of lines if needed. Never truncate.`;

export async function generateWebsite(prompt: string, onChunk?: (chunk: string) => void) {
  const client = getClient();
  const model = getModel();
  const stream = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a complete, visually stunning website based on this description:\n\n${prompt}\n\nRequirements:\n- Write ALL sections in full — do not skip or abbreviate any section\n- Every section must have rich, real content (no Lorem Ipsum)\n- CSS must be detailed: specific pixel values, named colors, full @keyframes animations\n- The HTML file must be fully self-contained and work when opened in a browser\n- Return valid JSON. The "content" field must contain the entire HTML file as a single escaped string.`,
      },
    ],
    stream: true,
    max_tokens: 32000,
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  let fullContent = "";

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    fullContent += delta;
    onChunk?.(delta);
  }

  return fullContent;
}

export async function improveCode(code: string, instruction: string, language: string): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: "system",
        content: `You are an expert ${language} developer. Improve the provided code based on the instruction. Return only the improved code, no explanations.`,
      },
      { role: "user", content: `Instruction: ${instruction}\n\nCode:\n${code}` },
    ],
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content ?? code;
}
