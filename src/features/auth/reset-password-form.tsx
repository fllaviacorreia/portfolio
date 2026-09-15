"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Text, Title } from "@/components/ui/typography";
import { getAuthErrorMessage } from "@/features/auth/auth-error";
import { resetPassword, validatePasswordResetCode } from "@/services/auth/firebase-auth-service";
import { resetPasswordSchema } from "@/validators/auth";

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
type CodeState = "checking" | "valid" | "invalid" | "success";

export function ResetPasswordForm({ code }: { code?: string }) {
  const [codeState, setCodeState] = useState<CodeState>(code ? "checking" : "invalid");
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    if (!code) return;

    validatePasswordResetCode(code)
      .then(() => setCodeState("valid"))
      .catch(() => setCodeState("invalid"));
  }, [code]);

  async function onSubmit({ password }: ResetPasswordData) {
    if (!code) return;
    setFormError(undefined);
    try {
      await resetPassword(code, password);
      setCodeState("success");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  if (codeState === "checking") {
    return <Text aria-live="polite">Validando o link…</Text>;
  }

  if (codeState === "invalid") {
    return (
      <div className="text-center">
        <Title className="text-3xl">Link inválido</Title>
        <Text className="mt-3 text-muted-foreground">O link expirou, já foi utilizado ou está incompleto.</Text>
        <Button asChild className="mt-7 rounded-full">
          <Link href="/auth/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  if (codeState === "success") {
    return (
      <div className="text-center" aria-live="polite">
        <Title className="text-3xl">Senha atualizada</Title>
        <Text className="mt-3 text-muted-foreground">Sua nova senha já pode ser utilizada.</Text>
        <Button asChild className="mt-7 rounded-full">
          <Link href="/auth/access">Entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Title className="text-3xl sm:text-4xl">Criar nova senha</Title>
      <Text className="mt-2 text-muted-foreground">Use pelo menos 8 caracteres.</Text>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Nova senha" type="password" autoComplete="new-password" required error={errors.password?.message} {...register("password")} />
        <Input label="Confirmar senha" type="password" autoComplete="new-password" required error={errors.confirmation?.message} {...register("confirmation")} />
        {formError && <p role="alert" className="text-sm font-medium text-error">{formError}</p>}
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </>
  );
}
