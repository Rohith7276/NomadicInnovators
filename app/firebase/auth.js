import {auth} from "./firebaseConfig"
import { createUserWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
export const doCreateUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}
export const doSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const result = signInWithPopup(auth, provider)
    
    return result;
}

export const doSignOut = () => {
    return signOut(auth)
}

