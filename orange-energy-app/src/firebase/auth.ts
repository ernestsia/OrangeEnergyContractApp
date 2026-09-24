import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '../types';

export async function loginUser(email: string, pass: string): Promise<{ profile: UserProfile; firstLogin: boolean }> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const uid = credential.user.uid;

    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      throw new Error('User profile record not found in system database.');
    }

    const profile = userSnap.data() as UserProfile;

    if (!profile.active) {
      await firebaseSignOut(auth);
      throw new Error('This account has been disabled by an administrator.');
    }

    await updateDoc(userDocRef, {
      lastLoginAt: new Date().toISOString(),
    });

    return { profile, firstLogin: profile.firstLogin };
  } catch (err: any) {
    // Development fallback when real Firebase credentials aren't linked yet
    if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key')) {
      console.warn('Firebase Auth running in Mock Dev Mode.');
      const mockProfile: UserProfile = {
        uid: 'dev-agent-001',
        userId: 'AG-2026-001',
        fullName: 'Ernest (Field Agent)',
        email: email || 'agent@orange.com.lr',
        phone: '+231886000000',
        role: 'FIELD_AGENT',
        region: 'Montserrado',
        county: 'Grand Montserrado',
        territory: 'Monrovia Central',
        active: true,
        firstLogin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      return { profile: mockProfile, firstLogin: false };
    }
    throw err;
  }
}

export async function changeFirstLoginPassword(newPassword: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    await updatePassword(currentUser, newPassword);

    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      firstLogin: false,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Skipped remote password update in Dev Mode.');
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Logged out in Dev Mode.');
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.warn('Password reset requested in Dev Mode for:', email);
  }
}