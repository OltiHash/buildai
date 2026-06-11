import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GeneratorUI } from "@/components/editor/generator-ui";

export const metadata = { title: "Generate" };

export default async function GeneratePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <GeneratorUI />
    </div>
  );
}
