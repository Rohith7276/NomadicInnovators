"use client"
import {auth} from "../../firebase/firebaseConfig";
import React, { useEffect, useContext, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
const AuthContext = createContext();
export function useAuth(){
    return useContext(AuthContext);
}
export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = React.useState(null);
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, initializeUser);
     
      return unsubscribe;
    }, [])
    
    async function initializeUser(user){
      if(user){
          setCurrentUser(user);
        setUserLoggedIn(true);
      }
      else
      {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
        setLoading(false);
    }
    const value = {
        currentUser,
        userLoggedIn,
        loading,
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}