import { Button } from "@/components/button";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Home - My Porftolio",   
}
export default function Home() {
  return (
    <main className="w-full h-dvh p-3 flex flex-col gap-5  justify-center  items-center">
      <h1> FC Freelas</h1>
      <div className="flex flex-row  max-w-1/2 justify-between items-baseline   w-full">
        <Button  size="md">Criar meu portfólio</Button>
        <Button size="md" variant="outline">Saiba mais</Button>
      </div>
    </main>
  );
}
