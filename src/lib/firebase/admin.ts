import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

import serviceAccountJson from "../../../nst-swc1-firebase-adminsdk-fbsvc-79850ecef3.json";

let adminApp: App | null = null;

const getServiceAccount = (): ServiceAccount | null => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
    } catch (error) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT env", error);
    }
  }
  // Convert the imported JSON (with snake_case) to ServiceAccount format (camelCase)
  const json = serviceAccountJson as ServiceAccount & {
    project_id: string;
    private_key: string;
    client_email: string;
  };
  if (!json || !json.project_id) {
    console.error("Service account JSON is invalid or missing");
    return null;
  }
  return {
    projectId: json.project_id,
    privateKey: json.private_key,
    clientEmail: json.client_email,
  } as ServiceAccount;
};

export const getAdminApp = () => {
  try {
    if (adminApp) {
      console.log("Using existing admin app");
      return adminApp;
    }
    if (getApps().length) {
      console.log("Using existing Firebase app from getApps()");
      adminApp = getApps()[0]!;
      return adminApp;
    }
    console.log("Initializing new Firebase admin app...");
    const credentials = getServiceAccount();
    if (!credentials) {
      throw new Error("Missing Firebase service account credentials");
    }
    console.log("Service account loaded, project:", credentials.projectId);
    adminApp = initializeApp({
      credential: cert(credentials),
    });
    console.log("Firebase admin app initialized successfully");
    return adminApp;
  } catch (error) {
    console.error("Failed to get/initialize Firebase admin app:", error);
    throw error;
  }
};

export const getDb = () => {
  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    console.log("Firestore instance obtained");
    return db;
  } catch (error) {
    console.error("Failed to get Firestore instance:", error);
    throw error;
  }
};
export const serverTimestamp = FieldValue.serverTimestamp;
