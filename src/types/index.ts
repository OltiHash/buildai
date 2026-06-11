export type Role = "USER" | "ADMIN";
export type Plan = "FREE" | "PRO" | "TEAM";
export type ProjectStatus = "DRAFT" | "GENERATING" | "READY" | "DEPLOYED" | "ARCHIVED";
export type DeploymentStatus = "PENDING" | "BUILDING" | "DEPLOYED" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: Role;
  plan: Plan;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  prompt: string;
  thumbnail: string | null;
  status: ProjectStatus;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  files?: ProjectFile[];
  versions?: Version[];
  _count?: { versions: number; files: number; deployments: number };
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Version {
  id: string;
  number: number;
  label: string | null;
  snapshot: Record<string, unknown>;
  projectId: string;
  createdAt: Date;
}

export interface Deployment {
  id: string;
  url: string | null;
  status: DeploymentStatus;
  logs: string | null;
  duration: number | null;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
}

export interface GenerationResult {
  name: string;
  description: string;
  files: Array<{
    path: string;
    name: string;
    content: string;
    language: string;
  }>;
  metadata: {
    pages: string[];
    theme: string;
    colors: Record<string, string>;
    features: string[];
  };
}

export interface AnalyticsSummary {
  totalGenerated: number;
  totalDeployed: number;
  totalProjects: number;
  storageUsed: number;
  generationsByDay: Array<{ date: string; count: number }>;
  topProjects: Array<{ name: string; views: number }>;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: string;
      plan: string;
    };
  }
}
