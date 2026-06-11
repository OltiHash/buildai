import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const versions = await prisma.version.findMany({
    where: { projectId: id },
    orderBy: { number: "desc" },
  });

  return NextResponse.json({ versions });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    include: { files: true },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const last = await prisma.version.findFirst({
    where: { projectId: id },
    orderBy: { number: "desc" },
  });

  const version = await prisma.version.create({
    data: {
      projectId: id,
      number: (last?.number ?? 0) + 1,
      label: body.label,
      snapshot: JSON.parse(JSON.stringify({ files: project.files, name: project.name })),
    },
  });

  return NextResponse.json({ version }, { status: 201 });
}
