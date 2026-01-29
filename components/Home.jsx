"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Stars from "./Stars"
import cook from "../public/images/cook.gif"
import cook2 from "../public/images/cook2.gif"
import Background2 from "../public/images/homeImg2.jpg"
import AiSection from "./AiSection"
import StateSectoin from "./StateSectoin"
import Loader from "./Loader"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

async function getData() {
  const res = await fetch(`http://localhost:3000/api/state`)
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

const Home = () => {

  const [gif, setGif] = useState(false)
  const [data, setData] = useState({})
  const [Loading, setLoading] = useState(true)
  const [fetchData, setFetchData] = useState(true)
  const [response, setResponse] = useState(null)

  const image = useRef(null)


  const { contextSafe } = useGSAP()

  useEffect(() => {

    const animation = contextSafe(() => {
      if (!image.current) return

      gsap.to(image.current, {
        scrollTrigger: {
          trigger: image.current,
          start: "top 4rem",
          endTrigger: ".amsterdam",
          end: "top 9rem",
          pin: true,
          pinSpacing: false
        }
      })
    })

    animation()

  }, [])

  useEffect(() => {
    const fetchDataFn = async () => {
      const a = await getData() 
      setData(a)
      setLoading(false)
    }

    fetchDataFn()
  }, [])

  const quote = async (e) => {
    setGif(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("Give me a quote related to India travel")
      })

      const jsonData = await res.json()
      setResponse(jsonData.response.split("\n"))

      setGif(false)
      e.target.innerHTML = "Click again for a new quote!"

    } catch {
      setGif(false)
      setResponse(["An error occurred while communicating with the server."])
    }
  }

  return (
    <div className=" min-h-[150vh] min-w-screen bgmn,.-gray-100">
      {Loading ? <div className="flex fixed bg-[#38sdf1a05ad]  w-screen h-screen"><Loader /></div> :
        <>
          <div ref={image} className=" mt-[-4rem] h-[100vh] bgHome z-[-10] overflow-hidden flex items-center">
            <div className=" h-full bgHome w-full dark:hidden block"> <div className=" backdrop-blur-[5px] h-screen flex justify-center items-center"> 
              <Image src={Background2} alt="bg" className=" dark:hidden lg:h-screen h-[50vh] object-cover" width={"100"} height={"80"} /> </div> 
              <Stars /> </div> <div className=" h-full bgHome2 w-full dark:block hidden"> <div className=" backdrop-blur-[5px] h-screen flex justify-center items-center"> 
                <Image src="https://res.cloudinary.com/drc0w8qdg/image/upload/v1738262053/liz7n63jwp8lhp6gqglq.jpg" alt="bg" className=" dark:block hidden h-[50vh] lg:h-screen object-cover" width={"100"} height={"80"} /> </div> 
                <Stars /> </div> </div> 
                <section className=" bg-wh ite"> 
                <AiSection /> </section>
          <div className="bg-gray-100 py-11 dark:bg-black">

            <section className="py-8 flex-col lg:flex-row flex gap-7 bg-white dark:bg-[#351902] items-center border px-4 mx-14">

              <button
                onClick={quote}
                className="px-4 py-2 bg-[#031a2c] font-bold text-white dark:bg-[#ffd867] rounded"
              >
                Click here for a quote
              </button>

              <div className="w-full text-[#031a2c] flex flex-col">

                {gif ? (
                  <div className="flex justify-center w-full  items-center gap-4">
                    <Image src={cook2} width={150} className="dark:hidden" alt="Loading" />
                    <Image src={cook} width={150} className="hidden dark:block" alt="Loading" />
                    <p >Let me cook!</p>
                  </div>
                ) : response ? (
                  response.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <p >Click it, don’t be shy!</p>
                )}

              </div>
            </section>

            <h1 className="text-center text-[#031a2c] text-[3rem]  lg:text-[6rem]">
              STATES TO VISIT
            </h1>

            <StateSectoin data={data} />

          </div>
        </>
      }
    </div>
  )
}

export default Home
