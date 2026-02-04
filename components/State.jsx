"use client"
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'; 

import { useGSAP } from "@gsap/react";
import Loader from './Loader'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import CommentList from './dispCommet'
import CommentForm from './comment' 
import { collection, getDocs } from 'firebase/firestore'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SliderComponent from './SliderComponent' 
 
import Image from 'next/image'
import { useRouter } from 'next/navigation';
 
import Link from 'next/link';
const State = ({data, comments, id}) => {
  const router = useRouter();
  const [Loading, setLoading] = useState(true)  
  const image = useRef() 
 
  const imghov = useRef(false)
 
 


 
  const [showMore, setShowMore] = useState(4)
  const handleMore = (e) => {
    if (!data.states || !data) return;

    var x = 0;
    if (data?.hotels?.length != 0) {
      x = data?.hotels?.length
    }
    if (x == undefined || data?.hotel?.length > x) {
      x = data?.hotel?.length
    }
    if (x <= 4) {
      setShowMore(x)
      alert("End of the content")
    }
    else if (showMore + 4 < x) {
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
      setShowMore(showMore + 4);
      // setShowMore(showMore + (4 - x % 4))

    }
    else if (showMore == x) {
      document.querySelector('.shwmr').scrollIntoView({
        behavior: 'smooth'
      });
      setShowMore(4) 
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
      setShowMore(showMore + (x % 4))
      document.querySelectorAll(".shdw").forEach(element => {
        element.innerHTML = "show less";
      });
      document.querySelectorAll(".lightMore").forEach(element => {
        element.innerHTML = "show less";
      });
    }
  }
 
const { contextSafe } = useGSAP();

useEffect(() => {

  const animation = contextSafe((load) => {

    // Make leftright visible
    gsap.set(".leftright", { opacity: 1 });

    // CULTURE SECTIONS
    for (let i = 0; i < 5; i++) {
      const section = document.getElementById(`culture${i}`);
      const img = document.getElementById(`cultureImg${i}`);

      if (!section || !img) continue;

      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
          );

          section.onmouseenter = () =>
            gsap.to(img, { scale: 1.3, duration: 1 });

          section.onmouseleave = () =>
            gsap.to(img, { scale: 1, duration: 1 });
        }
      });
    }

    // HERO IMAGE + TEXT
    if (!load && image.current) {
      image.current.style.opacity = 1;

      const isMobile = window.innerWidth < 1200;

      gsap.from(image.current, {
        x: isMobile ? 0 : -90,
        y: isMobile ? -90 : 30,
        duration: 10
      });

      gsap.from(".text", {
        opacity: 0,
        x: isMobile ? 0 : 100,
        y: isMobile ? 100 : 0,
        duration: 1
      });
    }

    // Scroll top
    window.scrollTo(0, 0);

  });

  animation(Loading);

}, [Loading]);
  console.log(data)

  return (<>
    <div className='min-h-screen bg-gray-100  dark:bg-black min-w-screen'>
    
        <div className='w-full h-fit'>
          <div className='h-fit lg:max-h-[95vh] min-w-[50vw] full items-start overflow-hidden w-full flex lg:flex-row flex-col'>
            <div ref={image} className='w-screen opacity-0 relative image stateBg  h-fit flex items-center justify-center  self-center overflow-hidden'>
              {Loading && <div className="flex fixed bg-white  w-screen h-screen"><Loader /></div>}
              <LazyLoadImage
                effect="black-and-white"
                wrapperProps={{
                  style: { transitionDelay: "1s", width: "100%" },
                }}
                className='object-cover spanclass block'
                src={data?.bigImg}
                onLoad={() => {
                  setLoading(false);  // Image has finished loading
                }}
              />
            </div>
            <div className='lg:bg-gradient-to-r  hidden lg:block ml-[-80vw]  from-black/0 w-[80vw] z-10 right-0 h-[100vh] relative  via-black/85 font-bold vsdia-[#cacbc3cc] tfgdo-[#cacbc3]  to-black leftright opacity-0'></div>
            <div className='text bg-gradient-to-b mt-[-33rem] from-[#00000000] h-fit px-5  lg:px-0 via-black/85 to-black lg:bg-none  lg:mt-0 self-center w-screen lg:w-[45vw] z-20  lg:absolute lg:left-[52vw] lg:h-[100vh] flex flex-col max-h-[80vh] justify-center opacity-0 items-center leftright'>
              <p className='amsterdam bg-origin-border curZ  text-[#a2bac2]  dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
                {data?.state}
              </p>
              <p className='inter bgrnd tex t-black pb-4 lg:pb-0  text-white text-center w-full text-[1.3rem] mx-auto h-fit'>
                {data?.desc}
              </p>
            </div>
            <div>
            </div>
          </div>
          <h1 className=' curZamsterdam cur curZ bg-origin-border pt-10 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Places to visit
          </h1>
          <SliderComponent  data={data} />
          <h1 className=' curZamsterdam cur bg-origin-border curZ pt-5 lg:pt-0 py-4 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Culture
          </h1>
          <div className='flex justify-around my-10 flex-wrap'>
            {data?.culture?.map((each, index) => (
              <div id={`culture${index}`} key={each.cultureName} className='flex  curZ flex-col lg:flex-row opacity-0 culture border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4 pt-4 lg:pt-0 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
                <div className='overflow-hidden flex items-center justify-center lg:w-[126vw]'>
                  <Image src={each.cultureImg} id={`cultureImg${index}`} alt={each.cultureName} width={1000} height={100} className="object-cover float-left px-4 h-[18vh] md:h-[35vh] lg:h-[sdf]  w-fit lg:max-w-[25vw]" />

                </div>
                <div className='flex flex-col justify-center px-[1rem] my-6'>
                  <h2 className='text-2xl h-fit text-center font-bold text-[#031a2c] dark:text-yellow-400 '>{each.cultureName}</h2>
                  <p className='text-center pt-3'>{each.cultureDesc}</p>
                </div>
              </div>
            ))}
          </div>
        
    <section className={`flex shwmr overflow-hidden justify-center my-10 flex-wrap`}>
      <h1 className=' curZamsterdam cur bg-origin-border pt-10 text-[#031a2c] curZ  dark:text-yellow-400  mt-50 text-center w-full text-[3rem] lg:text-[4rem] mx-auto mt'>
        Packages
      </h1>
      {
        data?.hotel?.slice(0, showMore).map((each) => (
          <div key={each.name} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden    border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4  text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
           <div ref={imghov} className='overflow-hidden lg:ml-2 hoverimage flex lg:h-[16rem] items-center justify-start lg:w-fit'>
              {/* <Image src={each.image} alt={each.name} width={1000} height={100} className="object-cover  float-left pr-4 h-[18vh] md:h-[35vh] lg:h-[sdf]   w-fit lg:max-w-[25vw]  placeImg" /> */}


            </div> 
            <div className='flex flex-col justify-center px-[1rem]   my-6'>
              <h2 className='text-2xl h-fit text-center w-full font-bold  curZ text-[#031a2c] dark:text-yellow-400 '>{each.name}</h2>
              <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400 '>{each.days}</h2>
              <Link href={each.link} className='  w-full flex justify-center pt-5 items-center' target='_blank'><button className='border  border-whited tracking-wider amsterdam cur hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]   py-1  border-black rounded-[10rem] px-3  '> View Package </button></Link>
            </div>
          </div>
        ))

      }
      {
        data?.hotels?.slice(0, showMore).map((each) => ( 
            
            <div key={each.name} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700]'>

              <div className='flex flex-col justify-center px-[1rem] w-full my-6'>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] curZ  dark:text-yellow-400'>{each.name}</h2>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400'>{each.days}</h2>
                <Link href={each.link} className='  w-full flex justify-center pt-5 items-center' target='_blank'>
                  <button className='border border-whited tracking-wider curZ  amsterdam hover:text-white dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5] py-1 border-black rounded-[10rem] px-3  '>View Package</button>
                </Link>
              </div>
            </div>
        ))
      }

    </section>
    <button className=' z-10 shdw dark:block hidden curZ ' onClick={(e) => handleMore(e)}>show more</button>
    <button className=' z-10 lightMore dark:hidden curZ ' onClick={(e) => handleMore(e)}>show more</button>
    {/* <h1 className=' curZamsterdam bg-origin-border pt-5  curZ lg:pt-0 py-4 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt-[10vh]'>
            Recomended  to visit
          </h1> */}
        
      
            
    <div className='pb-10'>
      <h1 className=' curZamsterdam bg-origin-border  curZ  text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
        COMMENTS
      </h1>
      <CommentForm id={id}/>
      <div className=' text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] mt-6 lg:py-5 py-1 pb-1 lg:px-5 mx-5 lg:mx-52 rounded-md'>
        <CommentList comments={comments} id={id}/>
      </div>
    </div>
  </div >
   

    </div >
  </>

  )
}

export default State