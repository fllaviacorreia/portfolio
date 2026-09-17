import Link from "next/link";
import {
  BriefcaseBusiness,
  CircleDot,
  FolderKanban,
  GraduationCap,
  Mail,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { PortfolioService } from "@/services/portfolio/portfolio-service";

const cards = [
  { key: "experiences", label: "Experiências", href: "/xps", icon: BriefcaseBusiness },
  { key: "projects", label: "Projetos", href: "/projects", icon: FolderKanban },
  { key: "technologies", label: "Tecnologias", href: "/tools", icon: Wrench },
  { key: "education", label: "Formações", href: "/education", icon: GraduationCap },
  { key: "unreadContacts", label: "Contatos novos", href: "/contact", icon: Mail },
] as const;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const service = new PortfolioService(new FirestorePortfolioRepository());
  const summary = await service.getSummary({ uid: user.uid, name: user.name });
  const publicUrl = `/${summary.portfolio.code}/home`;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Visão geral
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {summary.portfolio.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CircleDot className="size-4" aria-hidden="true" />
            <span>{summary.portfolio.status === "published" ? "Publicado" : "Em preparação"}</span>
          </div>
        </div>

        <Button asChild variant="secondary" className="self-start rounded-full sm:self-auto">
          <Link href={publicUrl}>Visualizar portfólio</Link>
        </Button>
      </header>

      <section aria-labelledby="content-summary-title">
        <h2 id="content-summary-title" className="sr-only">Resumo do conteúdo</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {cards.map(({ key, label, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-7 flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <strong className="block text-3xl font-semibold tabular-nums">
                {summary.totals[key]}
              </strong>
              <span className="mt-1 block text-sm text-muted-foreground group-hover:text-foreground">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Próxima etapa</p>
          <h2 className="mt-2 text-2xl font-semibold">Monte a apresentação da Home</h2>
          <p className="mt-3 text-muted-foreground">
            Defina sua mensagem principal, chamadas para ação, redes sociais e imagem de destaque.
            O conteúdo começa como rascunho e só aparece publicamente depois da publicação.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/home">Configurar Home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
