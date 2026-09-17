"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/features/projects/project-actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button type="button" variant="outline" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden="true" /> Excluir projeto
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirmar exclusão">
      <span className="text-sm text-error">Esta ação não pode ser desfeita.</span>
      <Button
        type="button"
        variant="destructive"
        disabled={pending}
        onClick={() => startTransition(async () => {
          await deleteProjectAction(projectId);
          router.replace("/projects");
          router.refresh();
        })}
      >
        {pending ? "Excluindo…" : "Confirmar exclusão"}
      </Button>
      <Button type="button" variant="ghost" disabled={pending} onClick={() => setConfirming(false)}>
        Cancelar
      </Button>
    </div>
  );
}
