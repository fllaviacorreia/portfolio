import "server-only";

import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseAdminEnvironment } from "@/config/env";

export function getFirebaseAdmin() {
  const environment = getFirebaseAdminEnvironment();
  const usesEmulators =
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" ||
    Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  );

  if (usesEmulators) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
    process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
    process.env.FIREBASE_STORAGE_EMULATOR_HOST ??= "127.0.0.1:9199";
  }
  const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: environment
          ? cert({
              projectId: environment.projectId,
              clientEmail: environment.clientEmail,
              privateKey: environment.privateKey,
            })
          : usesEmulators
            ? undefined
            : applicationDefault(),
        projectId:
          environment?.projectId ??
          process.env.GCLOUD_PROJECT ??
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
          undefined,
      });

  return {
    app,
    auth: getAuth(app),
    database: getFirestore(app),
    storage: getStorage(app),
  };
}
