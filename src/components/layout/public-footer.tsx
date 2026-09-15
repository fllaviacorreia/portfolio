import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SmallText } from "@/components/ui/typography";

export function PublicFooter({ basePath }: { basePath: string }) {
  return (
    <footer className="border-t border-border bg-card px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <SmallText>Feito com 🤎 por Flávia Correia</SmallText>
        <Link href={`${basePath}/home`} aria-label="Voltar ao início">
          <Logo />
        </Link>
      </div>
    </footer>
  );
}
