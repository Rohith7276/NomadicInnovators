'use client'
import React from 'react'
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setCount } from '../redux/counter/counterSlice';
 
gsap.registerPlugin(ScrollTrigger);
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap';
import { useEffect } from 'react';
import Loader from './Loader'
const StateSectoin = (data) => {
  const [theme, setTheme] = useState("light")
  const [filejson, setfilejson] = useState(data.data)
  const [Loading, setLoading] = useState(false)
  const image = useRef(null)
  const imghov = useRef(false)
  const { contextSafe } = useGSAP();
  useEffect(() => {
    let x = localStorage.getItem("themeMode")
    setTheme(x)
  }, [])

  const animation = contextSafe(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        gsap.to(image.current, {
          scale: 1.3, duration: 5
        });
      }

      else {
        gsap.to(image.current, {
          y: -90, scale: 1.1, duration: 5
        });
      }
    }
    for (let index = 0; index < 9; index++) {

      let scalediv = `#scale${index}`;

      ScrollTrigger.create({
        trigger: scalediv,
        start: 'top 60%',
        end: 'top 20%',
        yoyo: true,
        // markers: true,
        scrub: true,
        onEnter: () => {
          gsap.to(scalediv, {
            opacity: 1,
            y: -40,
            ease: 'power2.out',
          });
        },
      });
    }
  });

  const [showMore, setShowMore] = useState(4)
  const handleMore = (e) => {

    if (showMore + 4 < filejson.IndiaPackages.length) {
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
      setShowMore(showMore + 4);
      setShowMore(showMore + (4 - filejson.IndiaPackages.length % 4))
     
    }
    else if (showMore == filejson.IndiaPackages.length) {
      document.querySelector('.shwmr').scrollIntoView({
        behavior: 'smooth'
      });
      setShowMore(4)
      // setShowMore(showMore + (4 - filejson.IndiaPackages.length % 4))
      document.querySelectorAll(".shdw").forEach(element => {
        element.innerHTML = "show more";
      });
      document.querySelectorAll(".lightMore").forEach(element => {
        element.innerHTML = "show more";
      });
    }
    else {
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
      setShowMore(showMore + (4 - filejson.IndiaPackages.length % 4))
      document.querySelectorAll(".shdw").forEach(element => {
        element.innerHTML = "show less";
      });
      document.querySelectorAll(".lightMore").forEach(element => {
        element.innerHTML = "show less";
      });
    }
  }

  useEffect(() => {
    animation();

    setfilejson(data.data)

  }, [data]);

  const dispatch = useDispatch()


  return (
    <div className='flex flex-col justify-center items-center'>
      <div>
        {Loading && <div className='flex fixed top-0 left-0  z-[10] h-screen w-screen bg-gray-100 dark:bg-[#351a03]'>
          < Loader />
        </div >}
      </div>

      {filejson.states?.map((item, index) => (
        <Link href="/States" key={index} onClick={() => setLoading(true)} >
          <div id={`scale${index}`} onClick={() => dispatch(setCount(index))} className={index % 2 ? 'flex-col py-3 lg:py-0 lg:flex-row shadow-lg bg-white text-black  dark:text-white dark:bg-[#351a03] opacity-0 px-2 pfy-2 rounded-md w-[80vw] flex justify-around items-center gap-4 m-6 h-fit animates' : 'flex-col py-3 lg:py-0 lg:flex-row shadow-lg bg-white text-black  dark:text-white dark:bg-[#351a03] opacity-0 rounded-md w-[80vw] scalediv m-6 h-fit flex gap-6 justify-around items-center p-2'}>
            <Image loading='lazy' src={item.PortraitImg} alt={`${item.state} portrait`} width={200} height={300} className=' h-[15rem]' />
            <div className='flex justify-around text-2xl h-full gap-3 text-center flex-col'>
              <h2 className='text-[#031a2c] dark:text-yellow-400 textdiv text-3xl font-bold '>
                {item.state}
              </h2>
              <p className='text-sm px-3 lg:px-0 lg:text-xl'>
                {item.description}
              </p>
            </div>
          </div>
        </Link>
      ))}



      <section className={`flex shwmr overflow-hidden justify-center my-10 flex-wrap`}>
        <h1 className='amsterdam bg-origin-border pt-10 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[3rem] lg:text-[4rem] mx-auto mt'>
          Places to visit in India
        </h1>
        {
          filejson.IndiaPackages.slice(0, showMore).map((each) => (
            <div key={each.placeName} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden    border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4  text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
              <div ref={imghov} className='overflow-hidden lg:ml-2 hoverimage flex lg:h-[16rem] items-center justify-start lg:w-[126vw]'>
                <Image src={each.image} alt={each.placeName} width={1000} height={100} className="object-cover blurimage float-left pr-4 h-[18vh] md:h-[35vh] lg:h-[sdf]   w-fit lg:max-w-[25vw]  placeImg" />
                {window.innerWidth >= 700 && (
                  <div className='  flex justify-center items-center h-[10rem] lg:h-[16rem] hoverpack  w-[65vw] lg:w-[24vw] absolute'>
                    <Link href={each.hotel} className='cursor-pointer' target='_blank'><button className='border bg-[#745f4e81] tracking-wider amsterdam hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]  py-1  border-white rounded-[10rem] px-3 cursor-pointer'> Book Hotels </button></Link>
                  </div>
                )}
              </div>
              <div className='flex flex-col justify-center px-[1rem]   my-6'>
                <h2 className='text-2xl h-fit text-center font-bold text-[#031a2c] dark:text-yellow-400 '>{each.placeName}</h2>
                <p className='text-center px-5 lg:px-0 lg:pt-3'>{each.desc}</p>
                {window.innerWidth < 700 && (
                  <Link href={each.hotel} className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'><button className='border  border-whited tracking-wider amsterdam hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]   py-1  border-black rounded-[10rem] px-3 cursor-pointer'> Book Hotels </button></Link>
                )}
              </div>
            </div>
          ))

        }
      </section>
      <button className=' z-10 shdw dark:block hidden' onClick={(e) => handleMore(e)}>show more</button>
      <button className=' z-10 lightMore dark:hidden' onClick={(e) => handleMore(e)}>show more</button>



      <div className='overflow-hidden w-fit h-fit'>
        {/* <StarsCanvas /> */}
        <section className='flex flex-col items-center my-10 p-6  text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] dark:border-[#640303] border-[2px]  w-[90vw] md:w-[70vw]'>
          <h2 className='text-3xl font-bold text-[#031a2c] dark:text-yellow-400  mb-4'>About Tour De India</h2>
          <p className='text-lg dark:text-white text-center'>
            Tour De India is dedicated to helping travelers discover the beauty and diversity of India. Our platform provides detailed information on various states&#39; cultural experiences&#39; and travel packages to ensure that every traveler finds their perfect adventure. Whether you&apos;re looking for historical landmarks&#39; natural wonders&#39; or vibrant festivals&#39; Tour De India has something for everyone. Join us in exploring the incredible landscapes and rich heritage of India&#39; and make your journey unforgettable.
          </p>
        </section>
        <section className='flex flex-col items-center my-10 p-6  text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] dark:border-[#640303] border-[2px] w-[90vw] md:w-[70vw]'>
          <h2 className='text-3xl font-bold text-[#031a2c] dark:text-yellow-400 mb-4'>Why Choose Tour De India?</h2>
          <p className='text-lg dark:text-white text-center'>
            At Tour De India, we believe in providing a seamless and enriching travel experience. Our team of experts curates the best travel packages&#39; ensuring that you get the most out of your trip. We offer personalized recommendations&#39; 24/7 customer support&#39; and a user-friendly platform to make your travel planning hassle-free. With Tour De India&#39; you can explore hidden gems&#39; enjoy authentic local experiences&#39; and create memories that will last a lifetime. Choose us for a journey that goes beyond the ordinary.
            <br />
            <br />
            <strong className='text-[#031a2c] dark:text-yellow-400 '>Our services include:</strong>
            <br />
            <br />
            <ul className='text-lg w-fit m-auto dark:text-white list-disc list-inside flex flex-col items-start'>
              <li>Expertly curated travel packages</li>
              <li>Personalized recommendations</li>
              <li>24/7 customer support</li>
              <li>User-friendly platform</li>
              <li>Authentic local experiences</li>
              <li>Memorable journeys</li>
            </ul>
          </p>
        </section>
      </div>
    </div>
  )
}

export default StateSectoin
