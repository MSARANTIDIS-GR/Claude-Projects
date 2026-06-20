import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function getAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use':   'This email is already registered. Try logging in.',
    'auth/wrong-password':          'Incorrect password. Try again.',
    'auth/invalid-credential':      'Incorrect email or password.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed':  'Network error. Check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return {
    user,
    loading,
    login:         (email: string, pw: string) => signInWithEmailAndPassword(auth, email, pw),
    signup:        (email: string, pw: string) => createUserWithEmailAndPassword(auth, email, pw),
    logout:        () => signOut(auth),
    resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
  };
}
