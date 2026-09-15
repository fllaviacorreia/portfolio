import { z } from "zod";

const firebaseEnvironmentSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  useEmulators: z.boolean(),
});

const firebaseAdminEnvironmentSchema = z.object({
  projectId: z.string().min(1),
  clientEmail: z.email(),
  privateKey: z.string().min(1),
});

export type FirebaseEnvironment = z.infer<typeof firebaseEnvironmentSchema>;

export function getFirebaseEnvironment(): FirebaseEnvironment {
  return firebaseEnvironmentSchema.parse({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    useEmulators: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true",
  });
}

export type FirebaseAdminEnvironment = z.infer<
  typeof firebaseAdminEnvironmentSchema
>;

export function getFirebaseAdminEnvironment(): FirebaseAdminEnvironment | null {
  const result = firebaseAdminEnvironmentSchema.safeParse({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  });

  return result.success ? result.data : null;
}
