"use server";

import { revalidatePath } from "next/cache";
import type { HomeContent } from "@/domain/portfolio/portfolio";
import { FirestorePortfolioRepository } from "@/infrastructure/firebase/firestore-portfolio-repository";
import { getCurrentUser } from "@/services/auth/session-service";
import { PortfolioService } from "@/services/portfolio/portfolio-service";
import { homeFormSchema } from "@/validators/portfolio";

export interface HomeFormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
}

export async function saveHomeAction(
  _previousState: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "Sua sessão expirou. Entre novamente." };

  const values = Object.fromEntries(formData.entries());
  const result = homeFormSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: "Revise os campos destacados.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const repository = new FirestorePortfolioRepository();
  const service = new PortfolioService(repository);
  const portfolio = await service.getOrCreateOwnerPortfolio({ uid: user.uid, name: user.name });
  const data = result.data;
  const hasSecondaryAction = data.secondaryActionLabel && data.secondaryActionHref;
  const socialLinks = [
    data.linkedinUrl ? { id: "linkedin", label: "LinkedIn", url: data.linkedinUrl, icon: "linkedin" } : null,
    data.githubUrl ? { id: "github", label: "GitHub", url: data.githubUrl, icon: "github" } : null,
  ].filter((link): link is NonNullable<typeof link> => link !== null);

  const content: HomeContent = {
    eyebrow: data.eyebrow,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    primaryAction: {
      label: data.primaryActionLabel,
      href: data.primaryActionHref,
      external: /^https?:\/\//.test(data.primaryActionHref),
    },
    secondaryAction: hasSecondaryAction ? {
      label: data.secondaryActionLabel,
      href: data.secondaryActionHref,
      external: /^https?:\/\//.test(data.secondaryActionHref),
    } : null,
    socialLinks,
    heroImage: null,
  };

  try {
    await repository.saveHome(portfolio.id, content);
    revalidatePath("/home");
    revalidatePath(`/${portfolio.code}/home`);
    return { status: "success", message: "Home atualizada com sucesso." };
  } catch {
    return {
      status: "error",
      message: "Não foi possível salvar agora. Tente novamente em instantes.",
    };
  }
}
