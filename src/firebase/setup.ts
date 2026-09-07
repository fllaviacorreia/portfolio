import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseEnvironment } from "@/config/env";

export function getFirebaseServices() {
  const app = getApps().length
    ? getApp()
    : initializeApp(getFirebaseEnvironment());

  return {
    app,
    auth: getAuth(app),
    database: getFirestore(app),
    storage: getStorage(app),
  };
}
