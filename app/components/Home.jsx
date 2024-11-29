"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Stars from './Stars'
import { useState } from 'react'
import Background from "../../public/images/homeImg.jpg"
import Link from 'next/link'
import AiSection from './AiSection'
import StateSectoin from './StateSectoin'
import { useDispatch } from 'react-redux'
import Loader from './Loader'
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
// import Rough from "../components/Rough.jsx"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger);
import { gsap } from 'gsap';


const Home = () => {
  const [yes, setyes] = useState(false)
  const [filejson, setfilejson] = useState({})
  const [Loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)
  const image = useRef(null)

  const dataFetch = async () => {
    let x = await getDocs(collection(fireDB, 'jsonData'));
    setfilejson(x.docs[1].data())
    setFetchData(false)
  }

  const { contextSafe } = useGSAP();

  const animation = contextSafe(() => {
      if(typeof window !== "undefined"){
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
  return (
    <div className='min-h-[150vh] min-w-screen '> {fetchData ? <div className='flex fixed  z-10 h-screen w-screen bg-[#381a05ad]'>
      < Loader />
    </div > :
      <>{Loading && <div className='flex fixed  z-10 h-screen w-screen bg-[#381a05ad]'>
        < Loader />
      </div >}
        <div ref={image} className='mt-[-4rem] h-[100vh] z-[-10] overflow-hidden flex items-center'>
          <Image src={Background} alt='bg' width={"100%"} height={"80vh"} />
        </div>
        <section>
          <AiSection />
          {/* <Stars /> */}
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
