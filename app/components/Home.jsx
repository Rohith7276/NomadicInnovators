"use client"
import React, { useEffect, useRef } from "react"
import Image from "next/image"
import Stars from "./Stars"
import { useState } from "react" 
import cook from "../../public/images/cook.gif"
import cook2 from "../../public/images/cook2.gif"
import Background from "../../public/images/homeImg.jpg"
import Background2 from "../../public/images/homeImg2.jpg"
import AiSection from "./AiSection"
import StateSectoin from "./StateSectoin"
import Loader from "./Loader"
import { fireDB } from "../firebase/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
// import Rough from "../components/Rough.jsx"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react"
gsap.registerPlugin(ScrollTrigger);
import { gsap } from "gsap";


const Home = () => {
  const [gif, setGif] = useState(false)
  const [filejson, setfilejson] = useState({})
  const [Loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)
  const image = useRef(null)
  const [response, setResponse] = useState(null)

  const dataFetch = async () => {
    let x = await getDocs(collection(fireDB, "jsonData"));
    setfilejson(x. docs[0].data())
    setFetchData(false)
  }

  const { contextSafe } = useGSAP();

  const animation = contextSafe(() => {
 
    gsap.to(image.current, {
      scrollTrigger: {
        trigger: image.current,
        start: "top 4rem",    
        endTrigger: ".amsterdam ", 
        end: "top 9rem", 
        pin: true,  
        // markers: true,     
        pinSpacing: false,  
      }
    });
  });

  useEffect(() => {
    animation(); 
  }, [filejson]);
  useEffect(() => { 
    dataFetch() 
   }, [])
  const quote = async (e) => {
    setGif(true)
    const finalInput = `Give me a quote related to India travel`;
    try {
      // Send a POST request to the API route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalInput), // Send the user input as JSON
      });
      const jsonData = await res.json();

      setResponse(jsonData.response.split("\n"));


      setGif(false)
      e.target.innerHTML = "Click again for a new quote!"

    } catch (error) {
      setGif(false)
      setResponse(["An error occurred while communicating with the server."]);
    }

  }
  return (
    <div    className="  min-h-[150vh] min-w-screen bgmn,.-gray-100"> {fetchData ? <div    className="  flex fixed  z-10 h-screen w-screen bg-gray-100 dark:bg-[#381a05ad]">
      < Loader />
    </div > :
      <>{Loading && <div    className="  flex fixed  z-10 h-screen w-screen dark:bg-[#381a05ad] bg-gray-100">
        < Loader />
      </div >}
        <div ref={image}    className="  mt-[-4rem]   h-[100vh] bgHome z-[-10]  overflow-hidden flex items-center">
          <div    className="  h-full bgHome w-full   dark:hidden block">

          <div    className="  backdrop-blur-[5px]   h-screen flex justify-center items-center">

          <Image src={Background2} alt="bg"     className="  dark:hidden   lg:h-screen h-[50vh]  object-cover" width={"100%"} height={"80vh"} />
          </div>
          <Stars />
          </div>
          <div    className="  h-full bgHome2 w-full dark:block hidden">


          <div    className="  backdrop-blur-[5px] h-screen flex justify-center items-center">

          <Image src={Background } alt="bg"     className="  dark:block   hidden h-[50vh] lg:h-screen  object-cover" width={"100%"} height={"80vh"} />
          </div>
          <Stars />
          </div>
        </div>
        <section     className="  bg-wh ite">
          <AiSection />
        </section>
        <div    className="  bg-gray-100 py-11 dark:bg-black">
          <section    className="  py-8 flex-col lg:flex-row flex justify-start gap-7 rounded-md bg-white text-black dark:text-white dark:bg-[#351902]  items-center border border-[#640303]  px-4 mx-14 ">
            <button
              onClick={(e) => quote(e)}
                 className="  px-4  curZ   py-2 h-fit text-nowrap bg-[#031a2c] text-white dark:bg-[#ffd867] outline-none dark:text-[#1a1a1a] rounded hover:bg-[#cacbc3] dark:hover:bg-[#e6c056] transition duration-300"
            >
              Click here for a quote
            </button>
            <div    className="  w-full  flex items-start justify-center flex-col">
              {gif ? (
                <div    className="  flex fdlex-col justify-center w-full -my-5 items-center gap-12">
                  <Image src={cook2} width="500"    className="  curZ  w-[10rem] dark:hidden" alt="Loading..." />
                  <Image src={cook} width="500"    className="  w-[10rem] curZ  hidden dark:block" alt="Loading..." />
                  <p    className="  amsterdam  tracking-widest text-xl text-[#031a2c] curZ  dark:text-yellow-400  ">Let me cook!</p>
                </div>
              ) :
                response ? response.map((line, index) => (
                  <p key={index}    className="  text-lg block">{line}</p>
                )) : (
                  <p    className="  amsterdam  curZ  tracking-widest flex items-center justify-center w-full text-xl text-[#031a2c] dark:text-[#ffd867]">Click it&apos; don&apos;t be shy!</p>
                )}
            </div>
          </section>
          <h1    className="  curZ  amsterdam curZ bg-origin-border py-4 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[3rem] lg:text-[6rem] mx-auto mt">
            STATES TO VISIT
          </h1>

          <StateSectoin data={filejson} />
        </div>
      </>
    }</div>
  )
}

export default Home
