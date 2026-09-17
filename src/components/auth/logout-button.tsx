"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth/firebase-auth-service";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await logout();
      router.replace("/auth/access");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="ghost" className="h-11 w-full justify-start rounded-xl" onClick={handleLogout} disabled={isLoading}>
      <LogOut aria-hidden="true" />
      {isLoading ? "Saindo…" : "Sair"}
    </Button>
  );
}
