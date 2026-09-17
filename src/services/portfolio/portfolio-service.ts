import "server-only";

import type { PortfolioRepository } from "@/domain/portfolio/portfolio-repository";
import type { Portfolio, PortfolioSummary } from "@/domain/portfolio/portfolio";

export class PortfolioService {
  constructor(private readonly repository: PortfolioRepository) {}

  async getOrCreateOwnerPortfolio(owner: { uid: string; name?: string | null }): Promise<Portfolio> {
    const existing = await this.repository.findByOwnerId(owner.uid);
    if (existing) return existing;

    const now = new Date().toISOString();
    const portfolio: Portfolio = {
      // One portfolio per owner in the first version. A deterministic id also
      // prevents duplicate portfolios when two first requests run together.
      id: owner.uid,
      ownerId: owner.uid,
      code: `portfolio-${owner.uid.slice(0, 12).toLowerCase()}`,
      name: owner.name?.trim() || "Meu portfólio",
      status: "draft",
      defaultLocale: "pt-BR",
      enabledLocales: ["pt-BR"],
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    };

    await this.repository.create(portfolio);
    return portfolio;
  }

  async getSummary(owner: { uid: string; name?: string | null }): Promise<PortfolioSummary> {
    const portfolio = await this.getOrCreateOwnerPortfolio(owner);
    const [experiences, projects, technologies, education, contacts] = await Promise.all([
      this.repository.listExperiences(portfolio.id),
      this.repository.listProjects(portfolio.id),
      this.repository.listTechnologies(portfolio.id),
      this.repository.listEducation(portfolio.id),
      this.repository.listContacts(portfolio.id),
    ]);

    return {
      portfolio,
      totals: {
        experiences: experiences.length,
        projects: projects.length,
        technologies: technologies.length,
        education: education.length,
        unreadContacts: contacts.filter((contact) => contact.status === "new").length,
      },
    };
  }
}
