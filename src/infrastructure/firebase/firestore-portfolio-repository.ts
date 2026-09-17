import "server-only";

import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { PortfolioRepository } from "@/domain/portfolio/portfolio-repository";
import type {
  ContactMessage,
  Education,
  Experience,
  HomeContent,
  Portfolio,
  Project,
  Technology,
} from "@/domain/portfolio/portfolio";

function dataWithId<T>(snapshot: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snapshot.id, ...snapshot.data() } as T;
}

export class FirestorePortfolioRepository implements PortfolioRepository {
  private readonly database = getFirebaseAdmin().database;

  async findById(id: string): Promise<Portfolio | null> {
    const snapshot = await this.database.collection("portfolios").doc(id).get();
    return snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as Portfolio) : null;
  }

  async findByCode(code: string): Promise<Portfolio | null> {
    const snapshot = await this.database.collection("portfolios")
      .where("code", "==", code).limit(1).get();
    return snapshot.empty ? null : dataWithId<Portfolio>(snapshot.docs[0]);
  }

  async findByOwnerId(ownerId: string): Promise<Portfolio | null> {
    const snapshot = await this.database.collection("portfolios")
      .where("ownerId", "==", ownerId).limit(1).get();
    return snapshot.empty ? null : dataWithId<Portfolio>(snapshot.docs[0]);
  }

  async create(portfolio: Portfolio): Promise<void> {
    const { id, ...data } = portfolio;
    await this.database.collection("portfolios").doc(id).create(data);
  }

  async getHome(portfolioId: string): Promise<HomeContent | null> {
    const snapshot = await this.database.collection("portfolios").doc(portfolioId)
      .collection("sections").doc("home").get();
    return snapshot.exists ? (snapshot.data() as HomeContent) : null;
  }

  async saveHome(portfolioId: string, content: HomeContent): Promise<void> {
    await this.database.collection("portfolios").doc(portfolioId)
      .collection("sections").doc("home").set(content, { merge: true });
  }

  listExperiences(portfolioId: string): Promise<Experience[]> {
    return this.listOrdered<Experience>(portfolioId, "experiences");
  }

  listProjects(portfolioId: string): Promise<Project[]> {
    return this.listOrdered<Project>(portfolioId, "projects");
  }

  async getProject(portfolioId: string, projectId: string): Promise<Project | null> {
    const snapshot = await this.database.collection("portfolios").doc(portfolioId)
      .collection("projects").doc(projectId).get();
    return snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as Project) : null;
  }

  async getProjectBySlug(portfolioId: string, slug: string): Promise<Project | null> {
    const snapshot = await this.database.collection("portfolios").doc(portfolioId)
      .collection("projects").where("slug", "==", slug).limit(1).get();
    return snapshot.empty ? null : dataWithId<Project>(snapshot.docs[0]);
  }

  async saveProject(portfolioId: string, project: Project): Promise<void> {
    const { id, ...data } = project;
    await this.database.collection("portfolios").doc(portfolioId)
      .collection("projects").doc(id).set(data);
  }

  async deleteProject(portfolioId: string, projectId: string): Promise<void> {
    await this.database.collection("portfolios").doc(portfolioId)
      .collection("projects").doc(projectId).delete();
  }

  listTechnologies(portfolioId: string): Promise<Technology[]> {
    return this.listOrdered<Technology>(portfolioId, "technologies");
  }

  listEducation(portfolioId: string): Promise<Education[]> {
    return this.listOrdered<Education>(portfolioId, "education");
  }

  async listContacts(portfolioId: string): Promise<ContactMessage[]> {
    const snapshot = await this.database.collection("portfolios").doc(portfolioId)
      .collection("contacts").orderBy("receivedAt", "desc").get();
    return snapshot.docs.map(dataWithId<ContactMessage>);
  }

  private async listOrdered<T>(portfolioId: string, collection: string): Promise<T[]> {
    const snapshot = await this.database.collection("portfolios").doc(portfolioId)
      .collection(collection).orderBy("order", "asc").get();
    return snapshot.docs.map(dataWithId<T>);
  }
}
