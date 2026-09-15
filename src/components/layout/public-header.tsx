"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  ["Início", "home"],
  ["Experiências", "xps"],
  ["Projetos", "projects"],
  ["Tecnologias", "tools"],
  ["Educação", "education"],
  ["Contato", "contact"],
] as const;

export function PublicHeader({ basePath }: { basePath: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-border/70 bg-card/95 px-4 py-2 shadow-sm backdrop-blur sm:px-6">
        <Link href={`${basePath}/home`} aria-label="Ir para o início">
          <Logo priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {navigation.map(([label, route]) => (
            <Button key={route} asChild variant="ghost">
              <Link href={`${basePath}/${route}`}>{label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
          <Button asChild className="ml-2 hidden rounded-full xl:inline-flex">
            <Link href={`${basePath}/contact`}>Entre em contato</Link>
          </Button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Navegação móvel"
        className={cn(
          "mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card p-3 shadow-lg lg:hidden",
          isOpen ? "grid" : "hidden",
        )}
      >
        {navigation.map(([label, route]) => (
          <Button key={route} asChild variant="ghost" className="justify-start">
            <Link href={`${basePath}/${route}`} onClick={() => setIsOpen(false)}>
              {label}
            </Link>
          </Button>
        ))}
      </nav>
    </header>
  );
}
