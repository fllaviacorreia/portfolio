import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectContentSection } from "@/domain/portfolio/portfolio";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ code: string; slug: string }> };

async function loadProject(code: string, slug: string) {
  const repository = new FirestorePortfolioRepository();
  const portfolio = await repository.findByCode(code);
  if (!portfolio) return null;
  const user = await getCurrentUser();
  const isOwnerPreview = user?.uid === portfolio.ownerId;
  if (portfolio.status !== "published" && !isOwnerPreview) return null;
  const project = await repository.getProjectBySlug(portfolio.id, slug);
  if (!project || (!project.visible && !isOwnerPreview)) return null;
  return { portfolio, project };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code, slug } = await params;
  const data = await loadProject(code, slug);
  if (!data) return {};
  return {
    title: `${data.project.title} | ${data.portfolio.name}`,
    description: data.project.summary,
  };
}

function ProjectSection({ section }: { section: ProjectContentSection }) {
  return (
    <section
      id={section.anchor}
      className={cn(
        "scroll-mt-32 border-b border-border py-10 last:border-0 sm:py-14",
        section.kind === "warning" && "my-8 rounded-3xl border border-warning/50 bg-warning/10 p-6 sm:p-8",
        section.kind === "legal" && "text-sm leading-7",
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
      {section.content && (
        <div className="mt-5 whitespace-pre-line leading-8 text-muted-foreground">{section.content}</div>
      )}
      {section.images.length > 0 && (
        <div className={cn("mt-7 grid gap-4", section.images.length > 1 && "sm:grid-cols-2")}>
          {section.images.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- remote URLs are managed by the portfolio owner.
            <img key={`${image.path}-${index}`} src={image.path} alt={image.alt} className="w-full rounded-2xl border border-border object-cover" />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { code, slug } = await params;
  const data = await loadProject(code, slug);
  if (!data) notFound();
  const { project } = data;
  const sections = project.sections.filter((section) => section.visible).sort((a, b) => a.order - b.order);

  return (
    <article className="py-4 sm:py-8">
      <Button asChild variant="ghost" className="mb-8 -ml-3">
        <Link href={`/${code}/projects`}><ArrowLeft aria-hidden="true" /> Todos os projetos</Link>
      </Button>

      <header className="max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((technology) => <span key={technology} className="rounded-full bg-secondary px-3 py-1 text-sm">{technology}</span>)}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">{project.summary}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl && <Button asChild className="rounded-full"><a href={project.liveUrl} target="_blank" rel="noreferrer">Acessar projeto <ExternalLink aria-hidden="true" /></a></Button>}
          {project.repositoryUrl && <Button asChild variant="outline" className="rounded-full"><a href={project.repositoryUrl} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> Repositório</a></Button>}
        </div>
      </header>

      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element -- remote URLs are managed by the portfolio owner.
        <img src={project.cover.path} alt={project.cover.alt} className="mt-10 aspect-[16/8] w-full rounded-3xl border border-border object-cover shadow-sm" />
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {sections.length > 0 && (
          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <nav aria-label="Sumário do projeto" className="rounded-2xl border border-border bg-card p-4">
              <p className="px-3 pb-2 text-sm font-semibold">Nesta página</p>
              <ol className="grid gap-1">
                {sections.map((section) => (
                  <li key={section.id}><a href={`#${section.anchor}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{section.title}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
        <div className="min-w-0">
          {sections.map((section) => <ProjectSection key={section.id} section={section} />)}
        </div>
      </div>
    </article>
  );
}
