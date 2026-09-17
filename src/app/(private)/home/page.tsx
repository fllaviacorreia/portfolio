import { HomeForm } from "@/features/home/home-form";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { PortfolioService } from "@/services/portfolio/portfolio-service";

const defaultHome = {
  eyebrow: "Olá, eu sou",
  title: "Flávia Correia",
  subtitle: "Desenvolvedora full-stack",
  description: "Transformo ideias em experiências digitais acessíveis e bem construídas.",
  primaryAction: { label: "Conheça meus projetos", href: "/projects", external: false },
  secondaryAction: { label: "Entre em contato", href: "/contact", external: false },
  socialLinks: [],
  heroImage: null,
};

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const repository = new FirestorePortfolioRepository();
  const portfolio = await new PortfolioService(repository)
    .getOrCreateOwnerPortfolio({ uid: user.uid, name: user.name });
  const content = await repository.getHome(portfolio.id) ?? defaultHome;

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Conteúdo</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Home</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Personalize a apresentação inicial. As alterações permanecem no rascunho até a publicação do portfólio.
        </p>
      </header>
      <HomeForm content={content} />
    </div>
  );
}
