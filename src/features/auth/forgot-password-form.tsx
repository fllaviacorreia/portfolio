"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Text, Title } from "@/components/ui/typography";
import { requestPasswordReset } from "@/services/auth/firebase-auth-service";
import { forgotPasswordSchema } from "@/validators/auth";

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit({ email }: ForgotPasswordData) {
    try {
      await requestPasswordReset(email);
    } finally {
      // A resposta é sempre neutra para não revelar contas cadastradas.
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="text-center" aria-live="polite">
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden="true" />
        <Title className="mt-4 text-3xl">Confira seu e-mail</Title>
        <Text className="mt-3 text-muted-foreground">
          Se houver uma conta com esse endereço, enviaremos um link para redefinir a senha.
        </Text>
        <Button asChild className="mt-7 rounded-full">
          <Link href="/auth/access">Voltar ao login</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Title className="text-3xl sm:text-4xl">Recuperar senha</Title>
      <Text className="mt-2 text-muted-foreground">Informe seu e-mail para receber o link de redefinição.</Text>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar link"}
        </Button>
      </form>
      <Button asChild variant="link" className="mt-4 h-auto w-full">
        <Link href="/auth/access">Voltar ao login</Link>
      </Button>
    </>
  );
}
