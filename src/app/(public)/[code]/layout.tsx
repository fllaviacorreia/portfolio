import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default async function PortfolioLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}>) {
  const { code } = await params;
  const basePath = `/${code}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-2 z-50 -translate-y-20 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <PublicHeader basePath={basePath} />
      <main id="main-content" className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <PublicFooter basePath={basePath} />
    </div>
  );
}
