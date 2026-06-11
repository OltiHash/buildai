import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { GenerationResult } from "@/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, versionId } = await params;

  const [project, version] = await Promise.all([
    prisma.project.findFirst({ where: { id, userId: session.user.id } }),
    prisma.version.findFirst({ where: { id: versionId, projectId: id } }),
  ]);

  if (!project || !version) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const snapshot = version.snapshot as unknown as { files: GenerationResult["files"] };

  if (snapshot.files) {
    await prisma.projectFile.deleteMany({ where: { projectId: id } });
    await prisma.projectFile.createMany({
      data: snapshot.files.map((f) => ({ ...f, projectId: id })),
    });
  }

  return NextResponse.json({ success: true });
}
