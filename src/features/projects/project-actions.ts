"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { Project, ProjectContentSection } from "@/domain/portfolio/portfolio";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { PortfolioService } from "@/services/portfolio/portfolio-service";
import { projectFormSchema } from "@/validators/portfolio";

export interface ProjectFormState {
  status: "idle" | "success" | "error";
  message?: string;
  projectId?: string;
  errors?: Record<string, string[]>;
}

export async function saveProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "Sua sessão expirou. Entre novamente." };

  const result = projectFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return {
      status: "error",
      message: "Revise os campos destacados.",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const repository = new FirestorePortfolioRepository();
    const portfolio = await new PortfolioService(repository)
      .getOrCreateOwnerPortfolio({ uid: user.uid, name: user.name });
    const projects = await repository.listProjects(portfolio.id);
    const data = result.data;
    const existing = data.projectId
      ? projects.find((project) => project.id === data.projectId)
      : undefined;

    if (projects.some((project) => project.slug === data.slug && project.id !== data.projectId)) {
      return {
        status: "error",
        message: "Já existe um projeto com este endereço.",
        errors: { slug: ["Escolha um endereço diferente."] },
      };
    }

    const sections: ProjectContentSection[] = data.sections.map((section, index) => ({
      id: section.id,
      anchor: section.anchor,
      title: section.title,
      kind: section.kind,
      content: section.content,
      images: section.imageUrls.map((path) => ({ path, alt: `${section.title} — imagem do projeto` })),
      order: index,
      visible: section.visible,
    }));
    const projectId = existing?.id ?? randomUUID();
    const project: Project = {
      id: projectId,
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      cover: data.coverUrl ? { path: data.coverUrl, alt: data.coverAlt } : null,
      repositoryUrl: data.repositoryUrl || null,
      liveUrl: data.liveUrl || null,
      technologies: data.technologies.split(",").map((item) => item.trim()).filter(Boolean),
      sections,
      featured: data.featured,
      visible: data.visible,
      order: existing?.order ?? projects.length,
    };

    await repository.saveProject(portfolio.id, project);
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/${portfolio.code}/projects`);
    revalidatePath(`/${portfolio.code}/projects/${project.slug}`);
    return { status: "success", message: "Projeto salvo com sucesso.", projectId };
  } catch {
    return { status: "error", message: "Não foi possível salvar o projeto agora." };
  }
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Sessão expirada.");

  const repository = new FirestorePortfolioRepository();
  const portfolio = await repository.findByOwnerId(user.uid);
  if (!portfolio) return;

  const project = await repository.getProject(portfolio.id, projectId);
  if (!project) return;

  await repository.deleteProject(portfolio.id, projectId);
  revalidatePath("/projects");
  revalidatePath(`/${portfolio.code}/projects`);
}
