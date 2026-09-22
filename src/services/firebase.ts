import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize singleton Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Test connection on boot per Firebase skill guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message && error.message.includes('client is offline')) {
      console.warn('Firestore offline or connecting...');
    }
  }
}
testFirestoreConnection();

// Google Sign-In
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    await syncUserProfile(result.user);
  }
  return result.user;
}

// Sign-Out
export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

// Sync user profile to Firestore
export async function syncUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        id: user.uid,
        displayName: user.displayName || 'Anonymous Explorer',
        email: user.email || '',
        photoURL: user.photoURL || '',
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}

// Persist a chat message to Firestore
export async function persistChatMessage(
  userId: string,
  sessionId: string,
  role: 'user' | 'model',
  text: string
): Promise<void> {
  try {
    const chatCol = collection(db, 'users', userId, 'chat_messages');
    await addDoc(chatCol, {
      userId,
      chatSessionId: sessionId,
      role,
      text,
      timestamp: new Date().toISOString(),
      serverCreatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not persist chat message to Firestore:', err);
  }
}

// Load chat messages for a session
export async function loadChatHistory(
  userId: string,
  sessionId: string
): Promise<Array<{ role: 'user' | 'model'; text: string }>> {
  try {
    const chatCol = collection(db, 'users', userId, 'chat_messages');
    const q = query(
      chatCol,
      where('chatSessionId', '==', sessionId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        role: data.role as 'user' | 'model',
        text: data.text as string,
      };
    });
  } catch (err) {
    console.warn('Could not fetch chat history from Firestore:', err);
    return [];
  }
}

// Public Guestbook & Endorsement Entry Interface
export interface GuestbookEntry {
  id?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  message: string;
  createdAt: string;
}

export async function addGuestbookNote(
  author: User,
  message: string
): Promise<void> {
  if (!message.trim()) return;
  const col = collection(db, 'guestbook');
  await addDoc(col, {
    authorId: author.uid,
    authorName: author.displayName || 'Anonymous Builder',
    authorEmail: author.email || '',
    authorPhoto: author.photoURL || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    serverCreatedAt: serverTimestamp(),
  });
}

export function subscribeToGuestbook(
  callback: (entries: GuestbookEntry[]) => void
) {
  const col = collection(db, 'guestbook');
  const q = query(col, orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(
    q,
    (snapshot) => {
      const entries: GuestbookEntry[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GuestbookEntry, 'id'>),
      }));
      callback(entries);
    },
    (err) => {
      console.warn('Guestbook subscription warning:', err);
    }
  );
}
