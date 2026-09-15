import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="fixed left-4 top-2 z-[60] -translate-y-20 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <AdminSidebar />
      <main id="main-content" className="px-4 pb-8 pt-24 sm:px-6 lg:ml-72 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
