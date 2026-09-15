"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Text, Title } from "@/components/ui/typography";
import { getSafeRedirect } from "@/config/auth";
import { getAuthErrorMessage } from "@/features/auth/auth-error";
import { loginWithEmail } from "@/services/auth/firebase-auth-service";
import { loginSchema } from "@/validators/auth";

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginData) {
    setFormError(undefined);
    try {
      await loginWithEmail(data.email, data.password);
      router.replace(getSafeRedirect(redirectTo));
      router.refresh();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  }

  return (
    <>
      <Title className="text-3xl sm:text-4xl">Boas-vindas</Title>
      <Text className="mt-2 text-muted-foreground">Acesse o painel para editar seu portfólio.</Text>
      <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        {formError && <p role="alert" className="text-sm font-medium text-error">{formError}</p>}
        <Button type="submit" size="lg" className="mt-1 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <Button asChild variant="link" className="mt-4 h-auto w-full">
        <Link href="/auth/forgot-password">Esqueci minha senha</Link>
      </Button>
    </>
  );
}
