import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteProjectButton } from "@/features/projects/delete-project-button";
import { ProjectEditor } from "@/features/projects/project-editor";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";

export default async function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { projectId } = await params;
  const repository = new FirestorePortfolioRepository();
  const portfolio = await repository.findByOwnerId(user.uid);
  if (!portfolio) notFound();
  const project = await repository.getProject(portfolio.id, projectId);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4 -ml-3"><Link href="/projects"><ArrowLeft aria-hidden="true" /> Projetos</Link></Button>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Editar {project.title}</h1>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </header>
      <ProjectEditor project={project} />
    </div>
  );
}
