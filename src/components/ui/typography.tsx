import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

export function Title({ as: Component = "h1", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn("text-4xl font-semibold tracking-tight text-foreground sm:text-5xl", className)}
      {...props}
    />
  );
}

export function Subtitle({ as: Component = "h2", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn("text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", className)}
      {...props}
    />
  );
}

export function Text({ as: Component = "p", className, ...props }: TypographyProps) {
  return <Component className={cn("text-base leading-7 text-foreground", className)} {...props} />;
}

export function SmallText({ as: Component = "p", className, ...props }: TypographyProps) {
  return <Component className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
}

export function WarningText({ as: Component = "p", className, ...props }: TypographyProps) {
  return (
    <Component
      role="alert"
      className={cn("text-sm font-medium text-warning", className)}
      {...props}
    />
  );
}
