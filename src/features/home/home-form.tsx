"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import type { HomeContent } from "@/domain/portfolio/portfolio";
import { saveHomeAction, type HomeFormState } from "@/features/home/home-actions";

const initialState: HomeFormState = { status: "idle" };

function fieldError(state: HomeFormState, field: string) {
  return state.errors?.[field]?.[0];
}

export function HomeForm({ content }: { content: HomeContent }) {
  const [state, action, pending] = useActionState(saveHomeAction, initialState);
  const linkedin = content.socialLinks.find((link) => link.id === "linkedin")?.url;
  const github = content.socialLinks.find((link) => link.id === "github")?.url;

  return (
    <form action={action} className="space-y-8" noValidate>
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Apresentação</h2>
          <p className="mt-1 text-sm text-muted-foreground">O primeiro conteúdo visto por quem acessa o portfólio.</p>
        </div>
        <div className="grid gap-5">
          <Input name="eyebrow" label="Texto de apoio" defaultValue={content.eyebrow} maxLength={120} error={fieldError(state, "eyebrow")} />
          <Input name="title" label="Título principal" defaultValue={content.title} maxLength={240} required error={fieldError(state, "title")} />
          <Input name="subtitle" label="Subtítulo" defaultValue={content.subtitle} maxLength={320} error={fieldError(state, "subtitle")} />
          <Textarea name="description" label="Descrição" defaultValue={content.description} maxLength={2000} error={fieldError(state, "description")} />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <h2 className="text-xl font-semibold">Chamadas para ação</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input name="primaryActionLabel" label="Botão principal" defaultValue={content.primaryAction.label} required error={fieldError(state, "primaryActionLabel")} />
          <Input name="primaryActionHref" label="Destino principal" defaultValue={content.primaryAction.href} required error={fieldError(state, "primaryActionHref")} />
          <Input name="secondaryActionLabel" label="Botão secundário" defaultValue={content.secondaryAction?.label ?? ""} error={fieldError(state, "secondaryActionLabel")} />
          <Input name="secondaryActionHref" label="Destino secundário" defaultValue={content.secondaryAction?.href ?? ""} error={fieldError(state, "secondaryActionHref")} />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <h2 className="text-xl font-semibold">Redes profissionais</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input name="linkedinUrl" label="LinkedIn" type="url" defaultValue={linkedin ?? ""} error={fieldError(state, "linkedinUrl")} />
          <Input name="githubUrl" label="GitHub" type="url" defaultValue={github ?? ""} error={fieldError(state, "githubUrl")} />
        </div>
      </section>

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={state.status === "error" ? "text-sm text-error" : "text-sm text-success"}>
          {state.message}
        </p>
        <Button type="submit" size="lg" className="rounded-full" disabled={pending}>
          <Save aria-hidden="true" />
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
