import type { Metadata } from "next";
import { Subtitle, Text } from "@/components/ui/typography";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return (
    <section>
      <Subtitle>Configurações</Subtitle>
      <Text className="mt-2 text-muted-foreground">
        Preferências do portfólio, conta e aparência serão configuradas aqui.
      </Text>
    </section>
  );
}
