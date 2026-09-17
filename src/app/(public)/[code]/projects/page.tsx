import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";

export default async function PublicProjectsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const repository = new FirestorePortfolioRepository();
  const portfolio = await repository.findByCode(code);
  if (!portfolio) notFound();
  const user = await getCurrentUser();
  const isOwnerPreview = user?.uid === portfolio.ownerId;
  if (portfolio.status !== "published" && !isOwnerPreview) notFound();

  const allProjects = await repository.listProjects(portfolio.id);
  const projects = isOwnerPreview ? allProjects : allProjects.filter((project) => project.visible);

  return (
    <div className="space-y-10 py-4 sm:py-8">
      <header className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Portfólio</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Projetos selecionados</h1>
        <p className="mt-4 text-lg text-muted-foreground">Produtos, experimentos e soluções construídas com atenção aos detalhes.</p>
      </header>

      {projects.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Nenhum projeto publicado ainda.</p>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Lista de projetos">
          {projects.map((project) => (
            <article key={project.id} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              {project.cover ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote URLs are managed by the portfolio owner.
                <img src={project.cover.path} alt={project.cover.alt} className="aspect-[16/9] w-full object-cover" />
              ) : <div className="aspect-[16/9] bg-secondary" aria-hidden="true" />}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-2xl font-semibold">{project.title}</h2>
                <p className="mt-3 line-clamp-4 text-muted-foreground">{project.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologias">
                  {project.technologies.map((technology) => <li key={technology} className="rounded-full bg-secondary px-3 py-1 text-xs">{technology}</li>)}
                </ul>
                <Button asChild variant="link" className="mt-auto w-fit px-0 pt-6">
                  <Link href={`/${code}/projects/${project.slug}`}>Conheça o projeto <ArrowUpRight aria-hidden="true" /></Link>
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
