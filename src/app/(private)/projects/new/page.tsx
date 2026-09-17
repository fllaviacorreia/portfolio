import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectEditor } from "@/features/projects/project-editor";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <header>
        <Button asChild variant="ghost" className="mb-4 -ml-3"><Link href="/projects"><ArrowLeft aria-hidden="true" /> Projetos</Link></Button>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Novo projeto</h1>
        <p className="mt-3 text-muted-foreground">Comece pelas informações principais e monte as seções da página.</p>
      </header>
      <ProjectEditor />
    </div>
  );
}
