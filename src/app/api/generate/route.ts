import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/openai";
import { generateSchema } from "@/lib/validations";
import type { GenerationResult } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { prompt, projectId, options } = generateSchema.parse(body);

    const enrichedPrompt = buildPrompt(prompt, options);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = "";

        try {
          await generateWebsite(enrichedPrompt, (chunk) => {
            fullContent += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          });

          const result: GenerationResult = JSON.parse(fullContent);

          // Persist to DB
          const targetProjectId = projectId ?? (await createProject(session.user.id, prompt, result)).id;
          await saveFiles(targetProjectId, result.files);
          await createVersion(targetProjectId, result);

          // Update project status
          await prisma.project.update({
            where: { id: targetProjectId },
            data: { status: "READY", name: result.name, description: result.description },
          });

          // Track analytics
          await prisma.analytics.create({
            data: { event: "generation_complete", userId: session.user.id, projectId: targetProjectId },
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, projectId: targetProjectId, result })}\n\n`)
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function buildPrompt(base: string, options?: Record<string, unknown>) {
  if (!options) return base;
  const parts = [base];
  if (options.websiteType) parts.push(`Website type: ${options.websiteType}`);
  if (options.colorPalette) parts.push(`Color palette: ${options.colorPalette}`);
  if (Array.isArray(options.pages) && options.pages.length)
    parts.push(`Pages: ${(options.pages as string[]).join(", ")}`);
  if (Array.isArray(options.features) && options.features.length)
    parts.push(`Features: ${(options.features as string[]).join(", ")}`);
  if (options.style) parts.push(`Style: ${options.style}`);
  return parts.join("\n");
}

async function createProject(userId: string, prompt: string, result: GenerationResult) {
  return prisma.project.create({
    data: {
      userId,
      prompt,
      name: result.name,
      description: result.description,
      status: "GENERATING",
    },
  });
}

async function saveFiles(
  projectId: string,
  files: GenerationResult["files"]
) {
  await prisma.projectFile.deleteMany({ where: { projectId } });
  await prisma.projectFile.createMany({
    data: files.map((f) => ({ ...f, projectId })),
  });
}

async function createVersion(projectId: string, result: GenerationResult) {
  const last = await prisma.version.findFirst({
    where: { projectId },
    orderBy: { number: "desc" },
  });
  await prisma.version.create({
    data: {
      projectId,
      number: (last?.number ?? 0) + 1,
      snapshot: JSON.parse(JSON.stringify(result)),
    },
  });
}
