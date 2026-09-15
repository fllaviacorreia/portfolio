import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  const imageClassName = cn("h-auto w-full", className);

  return (
    <span className="block w-28 sm:w-32">
      <Image
        src="/logo_light.png"
        alt="FC Freelas"
        width={500}
        height={500}
        className={cn(imageClassName, "dark:hidden")}
        priority={priority}
      />
      <Image
        src="/logo_dark.png"
        alt="FC Freelas"
        width={500}
        height={500}
        className={cn(imageClassName, "hidden dark:block")}
        priority={priority}
      />
    </span>
  );
}
