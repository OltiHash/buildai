import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const search = searchParams.get("search") ?? "";
  const skip = (page - 1) * limit;

  const where = {
    userId: session.user.id,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { versions: true, files: true, deployments: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({ projects, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: data.name,
        prompt: data.prompt,
        description: data.description ?? "",
        isPublic: data.isPublic ?? false,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
