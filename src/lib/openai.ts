import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getClient() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? "placeholder",
    });
  }
  return _openai;
}

export const SYSTEM_PROMPT = `You are an expert web developer and UI/UX designer. When given a description of a website, you generate a complete, production-quality website project.

You always generate:
1. A clear project structure with files
2. Modern, responsive HTML/CSS/JS or React/TSX components
3. Beautiful, professional design using Tailwind CSS classes
4. Semantic HTML with proper accessibility attributes
5. Mobile-first responsive design

IMPORTANT RULES:
- Generate complete, working code - no placeholders or TODOs
- Use modern CSS features (grid, flexbox, custom properties)
- Include hover states, transitions, and microinteractions
- Make it visually stunning with gradients, shadows, and depth
- Ensure WCAG AA accessibility compliance
- Output valid JSON only when asked for structured data

When generating a project, return a JSON object with this structure:
{
  "name": "Project name",
  "description": "Brief description",
  "files": [
    {
      "path": "index.html",
      "name": "index.html",
      "content": "...full file content...",
      "language": "html"
    }
  ],
  "metadata": {
    "pages": ["Home", "About"],
    "theme": "modern dark",
    "colors": {"primary": "#6366f1", "background": "#0a0a0a"},
    "features": ["responsive", "dark mode", "animations"]
  }
}`;

export async function generateWebsite(prompt: string, onChunk?: (chunk: string) => void) {
  const client = getClient();
  const stream = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a complete website project based on this description:\n\n${prompt}\n\nReturn valid JSON matching the specified structure. Make it production-quality and visually impressive.`,
      },
    ],
    stream: true,
    max_tokens: 8000,
    temperature: 0.7,
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
    model: process.env.OPENAI_MODEL ?? "gpt-4o",
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
