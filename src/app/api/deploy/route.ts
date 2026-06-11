import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { files: true },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const deployment = await prisma.deployment.create({
    data: {
      projectId,
      userId: session.user.id,
      status: "BUILDING",
    },
  });

  // Simulate deployment (in production this would call Vercel API)
  setTimeout(async () => {
    const deployUrl = `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${deployment.id.slice(0, 6)}.buildai.app`;
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "DEPLOYED",
        url: deployUrl,
        duration: Math.floor(Math.random() * 30000) + 10000,
        logs: `Build started\nInstalling dependencies\nBuilding project\nOptimizing assets\nDeployment complete\nLive at: ${deployUrl}`,
      },
    });
    await prisma.project.update({ where: { id: projectId }, data: { status: "DEPLOYED" } });
  }, 5000);

  return NextResponse.json({ deployment });
}
