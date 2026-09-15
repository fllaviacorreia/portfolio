import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 block w-fit" aria-label="Voltar ao início">
          <Logo priority />
        </Link>
        <main className="rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
