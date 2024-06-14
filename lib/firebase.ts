import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7yzAq23Qc__-HjtLMDzqVJaNtq9-aPlI",
  authDomain: "mv-realty.firebaseapp.com",
  projectId: "mv-realty",
  storageBucket: "mv-realty.appspot.com",
  messagingSenderId: "639645859222",
  appId: "1:639645859222:web:dcda005225ddd6848db1b7"
};

// Initialize 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider)
        console.log("Sign-in function successful.")
        const user = result.user
        console.log("Full result body: ", result)
        console.log("User: ", user)
    } catch (error) {
        console.log(error)
    }
}

const signOutUser = async () => {
    try {
        await signOut(auth)
        console.log("Sign-out function successful.")
    } catch (error) {
        console.log(error)
    }
}

const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export { auth, signInWithGoogle, signOutUser, onAuthStateChange };
export type { User };
