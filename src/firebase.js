import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0x9kbx__PIt2m5ryHxHn1dzc8gGWC6Kw",
  authDomain: "triplebite-62b05.firebaseapp.com",
  projectId: "triplebite-62b05",
  storageBucket: "triplebite-62b05.firebasestorage.app",
  messagingSenderId: "192352255422",
  appId: "1:192352255422:web:c3374240099ee2e6518def",
  measurementId: "G-QP9SMP99FB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
