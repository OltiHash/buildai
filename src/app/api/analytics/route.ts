import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalProjects, totalDeployed, recentActivity, generationsByDay] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.deployment.count({ where: { userId, status: "DEPLOYED" } }),
    prisma.analytics.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.analytics.groupBy({
      by: ["createdAt"],
      where: { userId, event: "generation_complete", createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const byDay = generationsByDay.reduce<Record<string, number>>(
    (acc: Record<string, number>, row: { createdAt: Date; _count: { id: number } }) => {
      const day = row.createdAt.toISOString().slice(0, 10);
      acc[day] = (acc[day] ?? 0) + row._count.id;
      return acc;
    },
    {}
  );

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: byDay[key] ?? 0 };
  });

  return NextResponse.json({
    totalProjects,
    totalDeployed,
    totalGenerated: recentActivity.filter((a) => a.event === "generation_complete").length,
    generationsByDay: chartData,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const { event, projectId, meta } = await req.json();

  await prisma.analytics.create({
    data: {
      event,
      projectId: projectId ?? undefined,
      userId: session?.user?.id ?? undefined,
      meta,
    },
  });

  return NextResponse.json({ ok: true });
}
