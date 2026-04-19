"use client"
import React from "react";
import { useState, useEffect } from "react";
import StateNotFound from "./not-found.jsx";
import States from "../../../components/State.jsx";
import { onSnapshot, deleteDoc, collection, getDocs, orderBy, query, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/firebaseConfig"

import Loader from "@/components/Loader.jsx";
async function getData(state) {
  // const res = await fetch(`http://localhost:3000/api/state/${state}`);
  const res = await fetch(`https://tourdeindia.vercel.app//api/state/${state}`); 
  if (!res.ok) {
    const error = new Error("Failed to fetch data")
    error.status = res.status
    throw error
  }
  return res.json();
}

const Page = ({ params }) => {

  const { state } = params;
  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState({})
  const [comments, setComments] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await getData(state);
        
        const colRef = collection(fireDB, `comments${state}`);

        const q = query(colRef, orderBy("timestamp", "desc"));

        const snapshot = await getDocs(q);
 
        const x = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(x) 

        setdata(a)
        // unsubscribe()
      }
      catch (e) {
        console.log("error occured in fetching data", e)
        setNotFound(true)
        setdata(null)
        setComments(null)
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!state || typeof state !== "string" || !state.trim()) {
      setNotFound(true)
      setLoading(false)
    }
  }, [state])




  return (
    <div className="bg-gray-100">
      {notFound ? <StateNotFound /> : loading ? <div className="flex fixed bg-white z-[1000]  w-screen h-screen"><Loader /></div> :
        <States data={data} id={state} comments={comments} />
      }
    </div>
  );
};

export default Page;