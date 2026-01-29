"use client"
import React from "react";
import { useState, useEffect } from "react";
import States from "../../../components/State.jsx";
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
   
 useEffect(() => {
  const fetchData = async () => {
    const a = await getData(state);
    setdata(a)
    setLoading(false);
  };

  fetchData();
}, []);

    
  
  
  return (
    <div className="bg-gray-100">
      {loading? <Loader/> :
      <States data={data} />
      }
    </div>
  );
};

export default page;