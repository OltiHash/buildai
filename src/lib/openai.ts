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

export const SYSTEM_PROMPT = `You are a senior frontend engineer generating complete, beautiful, self-contained HTML websites.

RULES:
- Output ONLY valid JSON matching the structure below — no markdown, no extra text
- The "content" field must be a complete, working HTML file — never truncate or add TODOs
- All CSS in a <style> tag, all JS in a <script> tag — no external files needed
- Use Google Fonts (add @import in style), Lucide icons via CDN unpkg
- Write real, compelling copy — never Lorem Ipsum
- Dark theme by default: backgrounds #050505/#0a0a0a, accents violet/indigo/cyan
- Use @keyframes animations, glassmorphism (backdrop-filter:blur), gradient text (background-clip:text)
- Every section must be fully fleshed out with real content and styling

REQUIRED SECTIONS (landing page): sticky nav, full-height hero with gradient headline + 2 CTAs, features grid (6 cards), stats row, testimonials (3), pricing (3 tiers), FAQ accordion (5 Q&A), footer
Adapt sections for other site types accordingly.

JSON structure:
{"name":"Project Name","description":"One line description","files":[{"path":"index.html","name":"index.html","content":"<!DOCTYPE html>...</html>","language":"html"}],"metadata":{"pages":["Home"],"theme":"dark","colors":{"primary":"#8b5cf6","background":"#050505"},"features":["responsive","animations"]}}`;

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
    max_tokens: 8000,
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
