import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHome } from "@/components/dashboard/home";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [totalProjects, recentProjects, totalGenerations, deployments] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        _count: { select: { versions: true, files: true, deployments: true } },
      },
    }),
    prisma.analytics.count({ where: { userId, event: "generation_complete" } }),
    prisma.deployment.count({ where: { userId, status: "DEPLOYED" } }),
  ]);

  return (
    <DashboardHome
      user={session!.user}
      stats={{ projects: totalProjects, generations: totalGenerations, deployments }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentProjects={recentProjects as any}
    />
  );
}
