import { z } from "zod";

const supabaseEnvironmentSchema = z.object({
  url: z.url(),
  publishableKey: z.string().min(1),
});

export type SupabaseEnvironment = z.infer<typeof supabaseEnvironmentSchema>;

export function getSupabaseEnvironment(): SupabaseEnvironment {
  return supabaseEnvironmentSchema.parse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
