import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SleepLog, FeedLog, DiaperLog, CustomActivityLog, BabyProfile } from '../types';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection on Initial Boot as mandated by Skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase status: Client is offline or initializing.');
    }
    return false;
  }
}

// Run initial connection test safely
testConnection().catch(() => {});

// Authentication helpers
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    // Fallback to anonymous auth if popup is blocked in iframe
    try {
      const anonResult = await signInAnonymously(auth);
      return anonResult.user;
    } catch (anonErr) {
      console.error('Anonymous auth fallback error:', anonErr);
      return null;
    }
  }
}

export async function loginAnonymously(): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous Sign In Error:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

// Data Sync Services
export async function saveSleepLogToCloud(userId: string, log: SleepLog): Promise<void> {
  const path = `users/${userId}/sleep_logs`;
  try {
    const docRef = doc(db, path, log.id);
    await setDoc(docRef, { ...log, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}

export async function deleteSleepLogFromCloud(userId: string, logId: string): Promise<void> {
  const path = `users/${userId}/sleep_logs`;
  try {
    const docRef = doc(db, path, logId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${logId}`);
  }
}

export async function saveFeedLogToCloud(userId: string, log: FeedLog): Promise<void> {
  const path = `users/${userId}/feed_logs`;
  try {
    const docRef = doc(db, path, log.id);
    await setDoc(docRef, { ...log, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}

export async function deleteFeedLogFromCloud(userId: string, logId: string): Promise<void> {
  const path = `users/${userId}/feed_logs`;
  try {
    const docRef = doc(db, path, logId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${logId}`);
  }
}

export async function saveDiaperLogToCloud(userId: string, log: DiaperLog): Promise<void> {
  const path = `users/${userId}/diaper_logs`;
  try {
    const docRef = doc(db, path, log.id);
    await setDoc(docRef, { ...log, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}

export async function deleteDiaperLogFromCloud(userId: string, logId: string): Promise<void> {
  const path = `users/${userId}/diaper_logs`;
  try {
    const docRef = doc(db, path, logId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${logId}`);
  }
}

export async function saveActivityLogToCloud(userId: string, log: CustomActivityLog): Promise<void> {
  const path = `users/${userId}/activity_logs`;
  try {
    const docRef = doc(db, path, log.id);
    await setDoc(docRef, { ...log, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${log.id}`);
  }
}

export async function deleteActivityLogFromCloud(userId: string, logId: string): Promise<void> {
  const path = `users/${userId}/activity_logs`;
  try {
    const docRef = doc(db, path, logId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${logId}`);
  }
}

export async function saveBabyProfileToCloud(userId: string, profile: BabyProfile): Promise<void> {
  const path = `users/${userId}/baby_profile`;
  try {
    const docRef = doc(db, path, 'current');
    await setDoc(docRef, { ...profile, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/current`);
  }
}
