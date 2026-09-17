import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { PortfolioService } from "@/services/portfolio/portfolio-service";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const repository = new FirestorePortfolioRepository();
  const portfolio = await new PortfolioService(repository)
    .getOrCreateOwnerPortfolio({ uid: user.uid, name: user.name });
  const projects = await repository.listProjects(portfolio.id);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Conteúdo</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projetos</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Crie vitrines completas com sumário, imagens, documentação e páginas legais.</p>
        </div>
        <Button asChild size="lg" className="self-start rounded-full sm:self-auto">
          <Link href="/projects/new"><Plus aria-hidden="true" /> Novo projeto</Link>
        </Button>
      </header>

      {projects.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">Sua vitrine começa aqui</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">Adicione o primeiro projeto e organize sua história em seções navegáveis.</p>
          <Button asChild className="mt-6 rounded-full"><Link href="/projects/new">Criar primeiro projeto</Link></Button>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Projetos cadastrados">
          {projects.map((project) => (
            <article key={project.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {project.cover ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote URLs are user-configurable.
                <img src={project.cover.path} alt={project.cover.alt} className="aspect-[16/9] w-full object-cover" />
              ) : <div className="aspect-[16/9] bg-secondary" aria-hidden="true" />}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <span title={project.visible ? "Visível" : "Oculto"}>{project.visible ? <Eye className="size-5" /> : <EyeOff className="size-5 text-muted-foreground" />}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((technology) => <span key={technology} className="rounded-full bg-secondary px-3 py-1 text-xs">{technology}</span>)}
                </div>
                <div className="mt-auto flex gap-2 pt-6">
                  <Button asChild variant="secondary" className="flex-1"><Link href={`/projects/${project.id}`}>Editar</Link></Button>
                  <Button asChild variant="ghost" size="icon" aria-label={`Abrir página pública de ${project.title}`}>
                    <Link href={`/${portfolio.code}/projects/${project.slug}`}><ExternalLink aria-hidden="true" /></Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
