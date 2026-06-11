import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fileUpdateSchema } from "@/lib/validations";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const files = await prisma.projectFile.findMany({
    where: { projectId: id },
    orderBy: { path: "asc" },
  });

  return NextResponse.json({ files });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { content, path } = fileUpdateSchema.parse(body);

    const file = await prisma.projectFile.update({
      where: { projectId_path: { projectId: id, path } },
      data: { content },
    });

    return NextResponse.json({ file });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
