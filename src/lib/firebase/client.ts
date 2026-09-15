import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getFirebaseEnvironment } from "@/config/env";

let emulatorsConnected = false;

export function getFirebaseClient() {
  const environment = getFirebaseEnvironment();
  const app = getApps().length ? getApp() : initializeApp(environment);
  const auth = getAuth(app);
  const database = getFirestore(app);
  const storage = getStorage(app);

  if (
    environment.useEmulators &&
    typeof window !== "undefined" &&
    !emulatorsConnected
  ) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(database, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    emulatorsConnected = true;
  }

  return { app, auth, database, storage };
}
