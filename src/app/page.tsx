import { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Text, Title } from "@/components/ui/typography";

export const metadata: Metadata = { title: "Início" };

export default function Home() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Logo className="mb-5" priority />
        <Title>Seu trabalho merece uma vitrine à altura.</Title>
        <Text className="mt-5 max-w-xl text-muted-foreground sm:text-lg">
          Portfólios acessíveis, responsivos e feitos para apresentar experiências e projetos com personalidade.
        </Text>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/auth/access">Acessar painel</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/0000/home">Ver demonstração</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
