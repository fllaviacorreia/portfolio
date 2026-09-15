"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  Contact,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  MonitorCog,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Início", "/home", Home],
  ["Experiências", "/xps", BriefcaseBusiness],
  ["Projetos", "/projects", MonitorCog],
  ["Tecnologias", "/tools", Wrench],
  ["Educação", "/education", GraduationCap],
  ["Contatos", "/contact", Contact],
  ["Configurações", "/settings", Settings],
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menu administrativo"
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu administrativo"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card p-5 transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Menu administrativo"
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo priority />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu administrativo"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <nav className="grid gap-1">
          {items.map(([label, href, Icon]) => {
            const active = pathname === href;
            return (
              <Button
                key={href}
                asChild
                variant={active ? "secondary" : "ghost"}
                className="h-11 justify-start rounded-xl"
              >
                <Link href={href} onClick={() => setIsOpen(false)} aria-current={active ? "page" : undefined}>
                  <Icon aria-hidden="true" />
                  {label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto hidden items-center justify-between border-t border-border pt-4 lg:flex">
          <span className="text-sm text-muted-foreground">Aparência</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
