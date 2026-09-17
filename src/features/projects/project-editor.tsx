"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import type { Project, ProjectContentSection } from "@/domain/portfolio/portfolio";
import { saveProjectAction, type ProjectFormState } from "@/features/projects/project-actions";

type EditorSection = Omit<ProjectContentSection, "images" | "order"> & { imageUrls: string[] };
const initialState: ProjectFormState = { status: "idle" };

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 100);
}

function newSection(): EditorSection {
  const id = crypto.randomUUID();
  return { id, anchor: `secao-${id.slice(0, 8)}`, title: "Nova seção", kind: "richText", content: "", imageUrls: [], visible: true };
}

export function ProjectEditor({ project }: { project?: Project }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveProjectAction, initialState);
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [sections, setSections] = useState<EditorSection[]>(
    project?.sections.map((section) => ({
      ...section,
      imageUrls: section.images.map((image) => image.path),
    })) ?? [],
  );

  useEffect(() => {
    if (state.status === "success" && state.projectId && !project) {
      router.replace(`/projects/${state.projectId}`);
    }
  }, [project, router, state]);

  function updateSection(id: string, values: Partial<EditorSection>) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, ...values } : section));
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    setSections((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const serializedSections = JSON.stringify(sections);

  return (
    <form action={action} className="space-y-8" noValidate>
      <input type="hidden" name="projectId" value={project?.id ?? ""} />
      <input type="hidden" name="sections" value={serializedSections} />

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <h2 className="text-xl font-semibold">Informações principais</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input
            name="title"
            label="Título"
            defaultValue={project?.title}
            required
            error={state.errors?.title?.[0]}
            onChange={(event) => {
              if (!slugEdited) setSlug(slugify(event.target.value));
            }}
          />
          <Input
            name="slug"
            label="Endereço da página"
            value={slug}
            required
            error={state.errors?.slug?.[0]}
            onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }}
          />
          <div className="md:col-span-2">
            <Textarea name="summary" label="Resumo" defaultValue={project?.summary} required maxLength={1000} error={state.errors?.summary?.[0]} />
          </div>
          <Input name="coverUrl" type="url" label="URL da imagem de capa" defaultValue={project?.cover?.path ?? ""} error={state.errors?.coverUrl?.[0]} />
          <Input name="coverAlt" label="Descrição da imagem de capa" defaultValue={project?.cover?.alt ?? ""} error={state.errors?.coverAlt?.[0]} />
          <Input name="repositoryUrl" type="url" label="Repositório" defaultValue={project?.repositoryUrl ?? ""} error={state.errors?.repositoryUrl?.[0]} />
          <Input name="liveUrl" type="url" label="Projeto publicado" defaultValue={project?.liveUrl ?? ""} error={state.errors?.liveUrl?.[0]} />
          <div className="md:col-span-2">
            <Input name="technologies" label="Tecnologias (separadas por vírgula)" defaultValue={project?.technologies.join(", ") ?? ""} error={state.errors?.technologies?.[0]} />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-2"><input name="visible" type="checkbox" defaultChecked={project?.visible ?? true} /> Visível no portfólio</label>
          <label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} /> Projeto em destaque</label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Seções da página</h2>
            <p className="mt-1 text-sm text-muted-foreground">A ordem abaixo também define o sumário público.</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => setSections((current) => [...current, newSection()])}>
            <Plus aria-hidden="true" /> Adicionar seção
          </Button>
        </div>

        {sections.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Adicione seções para contar a história do projeto, incluir imagens ou publicar termos e privacidade.
          </div>
        )}

        {sections.map((section, index) => (
          <article key={section.id} className="rounded-3xl border border-border bg-card p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="text-muted-foreground" aria-hidden="true" />
                <strong>Seção {index + 1}</strong>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => moveSection(index, -1)}>Subir</Button>
                <Button type="button" variant="ghost" size="sm" disabled={index === sections.length - 1} onClick={() => moveSection(index, 1)}>Descer</Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Excluir seção ${index + 1}`} onClick={() => setSections((current) => current.filter((item) => item.id !== section.id))}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Título da seção" value={section.title} onChange={(event) => updateSection(section.id, { title: event.target.value })} />
              <Input label="Âncora do sumário" value={section.anchor} onChange={(event) => updateSection(section.id, { anchor: slugify(event.target.value) })} />
              <label className="grid gap-2 text-base font-medium">
                Tipo de conteúdo
                <select className="h-12 rounded-full bg-input px-5" value={section.kind} onChange={(event) => updateSection(section.id, { kind: event.target.value as EditorSection["kind"] })}>
                  <option value="richText">Texto</option>
                  <option value="image">Imagem com texto</option>
                  <option value="gallery">Galeria</option>
                  <option value="warning">Aviso</option>
                  <option value="legal">Conteúdo legal</option>
                </select>
              </label>
              <label className="flex items-center gap-2 self-end pb-3"><input type="checkbox" checked={section.visible} onChange={(event) => updateSection(section.id, { visible: event.target.checked })} /> Exibir seção</label>
              <div className="md:col-span-2">
                <Textarea label="Conteúdo" value={section.content} textareaSize="lg" onChange={(event) => updateSection(section.id, { content: event.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="URLs de imagens (uma por linha)"
                  value={section.imageUrls.join("\n")}
                  onChange={(event) => updateSection(section.id, { imageUrls: event.target.value.split("\n").map((url) => url.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          </article>
        ))}
        {state.errors?.sections?.[0] && <p role="alert" className="text-sm text-error">{state.errors.sections[0]}</p>}
      </section>

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={state.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{state.message}</p>
        <Button type="submit" size="lg" className="rounded-full" disabled={pending}>
          <Save aria-hidden="true" /> {pending ? "Salvando…" : "Salvar projeto"}
        </Button>
      </div>
    </form>
  );
}
