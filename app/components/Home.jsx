"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Stars from './Stars'
import { useState } from 'react'
import cook from "../../public/images/cook.gif"
import Background from "../../public/images/homeImg.jpg"
import AiSection from './AiSection'
import StateSectoin from './StateSectoin'
import Loader from './Loader'
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
// import Rough from "../components/Rough.jsx"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger);
import { gsap } from 'gsap';


const Home = () => {
  const [gif, setGif] = useState(false)
  const [filejson, setfilejson] = useState({})
  const [Loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)
  const image = useRef(null)
  const [response, setResponse] = useState(null)

  const dataFetch = async () => {
    let x = await getDocs(collection(fireDB, 'jsonData'));
    setfilejson(x.docs[1].data())
    setFetchData(false)
  }

  const { contextSafe } = useGSAP();

  const animation = contextSafe(() => {
    if (typeof window !== "undefined") {
      // if (window.innerWidth < 768) {
      //   gsap.to(image.current, {
      //     scale: 1.3, duration: 5
      //   });
      // }

      // else {
      // gsap.to(image.current, {
      //   y: -140, duration: 5
      // });
      // }
    }
    gsap.to(image.current, {
      scrollTrigger: {
        trigger: image.current,
        start: "top 4rem",             // Start pinning when `fixedDiv` reaches the top of the viewport
        endTrigger: ".amsterdam",           // End pinning when `nextDiv` reaches the top of the viewport
        end: "top 9rem",                // Stop pinning at this scroll position
        pin: true,                     // Pin `fixedDiv` in place
        // markers: true,                 // Add markers to the page
        pinSpacing: false,             // Prevent extra space below the pinned element
        // scrub: 1                       // Smooth transition when `fixedDiv` unpins
      }
    });
  });

  useEffect(() => {
    animation();

    // setfilejson(data.data)

  }, [filejson]);
  useEffect(() => { dataFetch() }, [])
  const quote = async (e) => {
    setGif(true)
    const finalInput = `Give me a quote related to India travel`;
    try {
      // Send a POST request to the API route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalInput), // Send the user input as JSON
      });
      const jsonData = await res.json();

      setResponse(jsonData.response.split("\n"));


      setGif(false)
      e.target.innerHTML = "Click again for a new quote!"

    } catch (error) {
      setGif(false)
      setResponse(['An error occurred while communicating with the server.']);
    }

  }
  return (
    <div className='min-h-[150vh] min-w-screen '> {fetchData ? <div className='flex fixed  z-10 h-screen w-screen bg-[#381a05ad]'>
      < Loader />
    </div > :
      <>{Loading && <div className='flex fixed  z-10 h-screen w-screen bg-[#381a05ad] dark:bg-white'>
        < Loader />
      </div >}
        <div ref={image} className='mt-[-4rem] h-[100vh] z-[-10] overflow-hidden flex items-center'>
          <Image src={Background} alt='bg' width={"100%"} height={"80vh"} />
          <Stars />
        </div>
        <section>
          <AiSection />
        </section>
        <section className='py-8 my-10 flex justify-start gap-7 rounded-md bg-[#351902]  items-center border border-[#640303]  px-4 mx-14 '>
          <button
            onClick={(e) => quote(e)}
            className='px-4 py-2 h-fit text-nowrap bg-[#ffd867] outline-none text-[#1a1a1a] rounded hover:bg-[#e6c056] transition duration-300'
          >
            Click here for a quote
          </button>
          <div className='w-full flex items-start justify-center flex-col'>
            {gif ? (
              <div className='flex fdlex-col justify-center w-full -my-5 items-center gap-12'>
                <Image src={cook} width="500" className='w-[10rem] ' alt="Loading..." />
                <p className='amsterdam tracking-widest text-xl text-[#ffd867] '>Let me cook!</p>
              </div>
            ) :
              response ? response.map((line, index) => (
                <p key={index} className='text-lg block'>{line}</p>
              )) : (
                <p className='amsterdam tracking-widest flex items-center justify-center w-full text-xl text-[#ffd867]'>Click it, don't be shy!</p>
              )}
          </div>
        </section>
        <h1 className='amsterdam bg-origin-border py-4 text-[#ffd867] mt-50 text-center w-full text-[6rem] mx-auto mt'>
          STATES TO VISIT
        </h1>

        <StateSectoin data={filejson} />
      </>
    }</div>
  )
}

export default Home
