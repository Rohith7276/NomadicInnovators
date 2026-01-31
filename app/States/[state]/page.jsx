"use client"
import React from "react";
import { useState, useEffect } from "react";
import States from "../../../components/State.jsx";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore"; 
import { fireDB } from "../../firebase/firebaseConfig" 

import Loader from "@/components/Loader.jsx";
async function getData(state) {
  const res = await fetch(`http://localhost:3000/api/state/${state}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

const page = ({ params }) => {

  const { state } = params;
  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState({})
  const [comments, setComments] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const a = await getData(state);
      const q = query(collection(fireDB, `comments${state}`), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      setdata(a)
      unsubscribe()
      setLoading(false);
    };

    fetchData();
  }, []);




  return (
    <div className="bg-gray-100">
      {loading ? <div className="flex fixed bg-white z-[1000]  w-screen h-screen"><Loader /></div> :
        <States data={data} id={state} comments={comments} />
      }
    </div>
  );
};

export default page;