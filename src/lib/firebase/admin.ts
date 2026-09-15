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
  const usesEmulators = Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  );
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
          environment?.projectId ?? process.env.GCLOUD_PROJECT ?? undefined,
      });

  return {
    app,
    auth: getAuth(app),
    database: getFirestore(app),
    storage: getStorage(app),
  };
}
