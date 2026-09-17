import type {
  ContactMessage,
  Education,
  Experience,
  HomeContent,
  Portfolio,
  Project,
  Technology,
} from "@/domain/portfolio/portfolio";

export interface PortfolioRepository {
  findById(id: string): Promise<Portfolio | null>;
  findByCode(code: string): Promise<Portfolio | null>;
  findByOwnerId(ownerId: string): Promise<Portfolio | null>;
  create(portfolio: Portfolio): Promise<void>;
  getHome(portfolioId: string): Promise<HomeContent | null>;
  saveHome(portfolioId: string, content: HomeContent): Promise<void>;
  listExperiences(portfolioId: string): Promise<Experience[]>;
  listProjects(portfolioId: string): Promise<Project[]>;
  listTechnologies(portfolioId: string): Promise<Technology[]>;
  listEducation(portfolioId: string): Promise<Education[]>;
  listContacts(portfolioId: string): Promise<ContactMessage[]>;
}
