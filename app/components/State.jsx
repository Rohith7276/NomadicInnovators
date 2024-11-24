"use client"
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import Loader from '../components/Loader'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SliderComponent from '../components/SliderComponent'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { notFound } from 'next/navigation';
const State = () => {
  const [fetchData, setFetchData] = useState(true)
  const [filejson, setfilejson] = useState({})
  const dataFetch = async () => {
    try {
      let x = await getDocs(collection(fireDB, 'jsonData'));
      if (x.empty) {
        notFound();
        return;
      }
      setfilejson(x.docs[1].data());
      setFetchData(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      notFound();
    }
  }


  useEffect(() => { dataFetch() }, [])

  //in here we are bringing the variable from the redux store
  const counterValue = useSelector(state => state.counter.value);
  const [Loading, setLoading] = useState(true)
  const [count, setcount] = useState(counterValue)
  const image = useRef()

  useEffect(() => {
    setcount(counterValue);
  }, [counterValue]);
  
  const { contextSafe } = useGSAP();
  useEffect(() => {

  const animation = contextSafe((load) => {
    // Set opacity of all elements with the class 'leftright'
    if(typeof document !== "undefined"){
    document.querySelectorAll('.leftright').forEach(element => {
      element.style.opacity = 1;
    });
  }
    // Function to handle ScrollTrigger and hover events for each culture section
    const applyScrollTrigger = (index, cultureSection, cultureImg) => {
      if (!cultureSection || !cultureImg) return;

      ScrollTrigger.create({
        trigger: cultureSection,
        start: 'top center',
        once: true,
        onEnter: () => {
          cultureSection.style.opacity = 1;

          // Apply hover effects
          cultureSection.addEventListener('mouseenter', () => {
            cultureImg.style.transition = 'transform 1s';
            cultureImg.style.transform = 'scale(1.3)';
          });
          cultureSection.addEventListener('mouseleave', () => {
            cultureImg.style.transition = 'transform 1s';
            cultureImg.style.transform = 'scale(1)';
          });

          // Apply GSAP animation
          gsap.from(cultureSection, {
            duration: 1.5,
            opacity: 0,
            y: 60,
            ease: 'power2.out',
          });
        
        },
      });
    };

    // Loop through culture sections and apply animations
    if(typeof document !== "undefined"){
    for (let index = 0; index < 5; index++) {
      const cultureSection = document.getElementById(`culture${index}`);
      const cultureImg = document.getElementById(`cultureImg${index}`);
      applyScrollTrigger(index, cultureSection, cultureImg);
      // Apply ScrollTrigger to each section
    }
  }


    // Handle animations for images and text based on window size
    if (load !== true && typeof window !== "undefined") {
      const handleImageAnimation = () => {
        image.current.style.opacity = 1;
        if (window.innerWidth < 1200) {
          gsap.from(image.current, { y: -90, duration: 10 });
          gsap.from('.text', { opacity: 0, y: 100, duration: 1 });
        } else {
          gsap.from(image.current, { x: -90, y: 30, duration: 10 });
          gsap.from('.text', { opacity: 0, x: 100, duration: 1 });
        }
      };

      handleImageAnimation();
    }

    // Scroll to top of the page
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  });


    animation(Loading);

  }, [count, Loading]);


  return (
    <div className='min-h-screen min-w-screen'>
      {fetchData ? (
        <div className='flex fixed z-10 h-screen w-screen bg-[#381a05ad]'>
          <Loader />
        </div>
      ) : (
        <div className='w-full h-fit'>
          <div className='h-fit lg:max-h-[95vh] min-w-[50vw] full items-start overflow-hidden w-full flex lg:flex-row flex-col'>
            <div ref={image} className='w-fit opacity-0 relative image stateBg h-fit flex items-center justify-center self-center overflow-hidden'>
              {Loading && <div className="flex fixed bg-[#38sdf1a05ad]  w-screen h-screen"><Loader /></div>}
              <LazyLoadImage
                effect="black-and-white"
                wrapperProps={{
                  style: { transitionDelay: "1s", width: "100%" },
                }}
                src={filejson?.states[count]?.bigImg}
                onLoad={() => {
                  setLoading(false);  // Image has finished loading
                }}
              />
            </div>
            <div className='lg:bg-gradient-to-r  hidden lg:block ml-[-80vw]  from-black/0 w-[80vw] z-10 right-0 h-[100vh] relative via-black/85 to-black leftright opacity-0'></div>
            <div className='text bg-gradient-to-b mt-[-17rem] from-[#00000000] h-fit px-5  lg:px-0 via-black/85 to-black lg:bg-none  lg:mt-0 self-center w-screen lg:w-[45vw] z-20  lg:absolute lg:left-[52vw] lg:h-[100vh] flex flex-col max-h-[80vh] justify-center opacity-0 items-center leftright'>
              <p className='amsterdam bg-origin-border text-[#ffd867] mt-50 text-center w-full text-[4rem] mx-auto mt'>
                {filejson?.states[count]?.state}
              </p>
              <p className='inter bgrnd text-white text-center w-full text-[1.3rem] mx-auto h-fit'>
                {filejson?.states[count]?.desc}
              </p>
            </div>
            <div>
            </div>
          </div>
          <h1 className='amsterdam bg-origin-border pt-10 text-[#ffd867] mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Places to visit
          </h1>
          <SliderComponent />
          <h1 className='amsterdam bg-origin-border py-4 text-[#ffd867] mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Culture
          </h1>
          <div className='flex justify-around my-10 flex-wrap'>
            {filejson?.states[count].culture.map((each, index) => (
              <div id={`culture${index}`} key={each.cultureName} className='flex opacity-0 culture border-[2px] border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4 bg-[#1e0700] '>
                <div className='overflow-hidden flex items-center justify-center w-[126vw]'>
                  <Image src={each.cultureImg} id={`cultureImg${index}`} alt={each.cultureName} width={1000} height={100} className="object-cover float-left px-4 h-[18vh] md:h-[35vh] lg:h-[sdf]  w-fit max-w-[25vw]" />
                </div>
                <div className='flex flex-col justify-center px-[1rem] my-6'>
                  <h2 className='text-2xl h-fit text-center font-bold text-[orange]'>{each.cultureName}</h2>
                  <p className='text-center pt-3'>{each.cultureDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default State