import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ProjectEditor } from "@/components/editor/project-editor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id }, select: { name: true } });
  return { title: project?.name ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    include: {
      files: { orderBy: { path: "asc" } },
      versions: { orderBy: { number: "desc" }, take: 20 },
      deployments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!project) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProjectEditor project={project as any} />;
}
