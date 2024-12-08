"use client"
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap';
import { useDispatch } from 'react-redux'

import { useGSAP } from "@gsap/react";
import Loader from '../components/Loader'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import CommentList from './dispCommet'
import CommentForm from './comment'
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SliderComponent from '../components/SliderComponent'
import { setCount } from '../redux/counter/counterSlice';

import { useSelector } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

import { notFound } from 'next/navigation';
import Link from 'next/link';
const State = () => {
  const router = useRouter();

  const [fetchData, setFetchData] = useState(true)
  const counterValue = useSelector(state => state.counter.value);
  const [Loading, setLoading] = useState(true)
  const [count, setcount] = useState(counterValue)
  const [imageSection, setimageSection] = useState(false)
  const image = useRef()
  const [Random, setRandom] = useState({ x: 0, y: 0 })

  const [filejson, setfilejson] = useState({})
  const imghov = useRef(false)
  const dispatch = useDispatch()

  const dataFetch = async () => {
    try {
      let x = await getDocs(collection(fireDB, 'jsonData'));
      if (x.empty) {
        notFound(); 
      }
      setfilejson(x.docs[0].data());
      setFetchData(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      notFound();
    }
  }


  useEffect(() => {
   
    let x, y;
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
    } while (x === y || x === count || y === count);

    setRandom({ x: x, y: y })
    dataFetch()
  }, [])
  const [showMore, setShowMore] = useState(4)
  const handleMore = (e) => {
    if (!filejson.states || !filejson.states[count]) return;

    var x = 0;
    if (filejson.states[count]?.hotels?.length != 0) {
      x = filejson.states[count]?.hotels?.length
    }
    if (x == undefined || filejson.states[count]?.hotel?.length > x) {
      x = filejson.states[count]?.hotel?.length
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
      setShowMore(showMore + (x % 4))
      document.querySelectorAll(".shdw").forEach(element => {
        element.innerHTML = "show less";
      });
      document.querySelectorAll(".lightMore").forEach(element => {
        element.innerHTML = "show less";
      });
    }
  }

  useEffect(() => {
    let x, y;
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
    } while (x === y || x === count || y === count);

    setRandom({ x: x, y: y })
  }, [count])

  //in here we are bringing the variable from the redux store
  useEffect(() => {
    if (counterValue == 0 || counterValue == 3 || counterValue == 4 || counterValue == 6)
      setimageSection(true)
    else
      setimageSection(false)
    setcount(counterValue);

  }, [counterValue]);


  const { contextSafe } = useGSAP();
  useEffect(() => {

    const animation = contextSafe((load) => {
      // Set opacity of all elements with the class 'leftright'
      if (typeof document !== "undefined") {
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
      if (typeof document !== "undefined") {
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


  return (<>
    <div className='min-h-screen bg-gray-100  dark:bg-black min-w-screen'>
      {fetchData ? (
        <div className='flex fixed z-10 h-screen w-screen bg-gray-100 dark:bg-[#381a05ad]'>
          <Loader />
        </div>
      ) : (
        <div className='w-full h-fit'>
          <div className='h-fit lg:max-h-[95vh] min-w-[50vw] full items-start overflow-hidden w-full flex lg:flex-row flex-col'>
            <div ref={image} className='w-screen opacity-0 relative image stateBg  h-fit flex items-center justify-center  self-center overflow-hidden'>
              {Loading && <div className="flex fixed bg-[#38sdf1a05ad]  w-screen h-screen"><Loader /></div>}
              <LazyLoadImage
                effect="black-and-white"
                wrapperProps={{
                  style: { transitionDelay: "1s", width: "100%" },
                }}
                className='object-cover spanclass block'
                src={filejson?.states[count]?.bigImg}
                onLoad={() => {
                  setLoading(false);  // Image has finished loading
                }}
              />
            </div>
            <div className='lg:bg-gradient-to-r  hidden lg:block ml-[-80vw]  from-black/0 w-[80vw] z-10 right-0 h-[100vh] relative  via-black/85 font-bold vsdia-[#cacbc3cc] tfgdo-[#cacbc3]  to-black leftright opacity-0'></div>
            <div className='text bg-gradient-to-b mt-[-33rem] from-[#00000000] h-fit px-5  lg:px-0 via-black/85 to-black lg:bg-none  lg:mt-0 self-center w-screen lg:w-[45vw] z-20  lg:absolute lg:left-[52vw] lg:h-[100vh] flex flex-col max-h-[80vh] justify-center opacity-0 items-center leftright'>
              <p className='amsterdam bg-origin-border text-[#a2bac2]  dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
                {filejson?.states[count]?.state}
              </p>
              <p className='inter bgrnd tex t-black pb-4 lg:pb-0  text-white text-center w-full text-[1.3rem] mx-auto h-fit'>
                {filejson?.states[count]?.desc}
              </p>
            </div>
            <div>
            </div>
          </div>
          <h1 className='amsterdam bg-origin-border pt-10 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Places to visit
          </h1>
          <SliderComponent />
          <h1 className='amsterdam bg-origin-border pt-5 lg:pt-0 py-4 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
            Culture
          </h1>
          <div className='flex justify-around my-10 flex-wrap'>
            {filejson?.states[count].culture.map((each, index) => (
              <div id={`culture${index}`} key={each.cultureName} className='flex flex-col lg:flex-row opacity-0 culture border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4 pt-4 lg:pt-0 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
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
      <h1 className='amsterdam bg-origin-border pt-10 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[3rem] lg:text-[4rem] mx-auto mt'>
        Packages
      </h1>
      {
        filejson?.states[count]?.hotel?.slice(0, showMore).map((each) => (
          <div key={each.name} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden    border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4  text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
            {(count == 0 || count == 3 || count == 4 || count == 6) && <div ref={imghov} className='overflow-hidden lg:ml-2 hoverimage flex lg:h-[16rem] items-center justify-start lg:w-fit'>
              <Image src={each.image} alt={each.name} width={1000} height={100} className="object-cover  float-left pr-4 h-[18vh] md:h-[35vh] lg:h-[sdf]   w-fit lg:max-w-[25vw]  placeImg" />


            </div>}
            <div className='flex flex-col justify-center px-[1rem]   my-6'>
              <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400 '>{each.name}</h2>
              <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400 '>{each.days}</h2>
              <Link href={each.link} className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'><button className='border  border-whited tracking-wider amsterdam hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]   py-1  border-black rounded-[10rem] px-3 cursor-pointer'> View Package </button></Link>
            </div>
          </div>
        ))

      }
      {
        filejson?.states[count]?.hotels?.slice(0, showMore).map((each) => (
          imageSection ?
            <div key={each.name} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw]  m-4 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700]'>
              <div ref={imghov} className='overflow-hidden lg:ml-2 hoverimage flex lg:h-[16rem] items-center justify-start lg:w-fit'>
                <Image src={each.image} alt={each.placeName} width={1000} height={100} className="object-cover float-left pr-4 h-[18vh] md:h-[35vh] lg:h-[sdf] w-fit lg:max-w-[25vw] placeImg" />
              </div>
              <div className='flex flex-col justify-center px-[1rem] w-full my-6'>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400'>{each.name}</h2>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400'>{each.days}</h2>
                <Link href={each.link} className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'>
                  <button className='border border-whited tracking-wider amsterdam hover:text-white dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5] py-1 border-black rounded-[10rem] px-3 cursor-pointer'>View Package</button>
                </Link>
              </div>
            </div>
            :
            <div key={each.name} className='flex-col py-3 mx-4 lg:my-4 lg:py-0 lg:flex-row flex placeDiv items-center overflow-hidden border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[45vw] m-4 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700]'>

              <div className='flex flex-col justify-center px-[1rem] w-full my-6'>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400'>{each.name}</h2>
                <h2 className='text-2xl h-fit text-center w-full font-bold text-[#031a2c] dark:text-yellow-400'>{each.days}</h2>
                <Link href={each.link} className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'>
                  <button className='border border-whited tracking-wider amsterdam hover:text-white dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5] py-1 border-black rounded-[10rem] px-3 cursor-pointer'>View Package</button>
                </Link>
              </div>
            </div>
        ))
      }

    </section>
    <button className=' z-10 shdw dark:block hidden' onClick={(e) => handleMore(e)}>show more</button>
    <button className=' z-10 lightMore dark:hidden' onClick={(e) => handleMore(e)}>show more</button>
    <h1 className='amsterdam bg-origin-border pt-5 lg:pt-0 py-4 text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt-[10vh]'>
            Recomended  to visit
          </h1>
          <div className='flex justify-around my-10 flex-wrap'>
            <div className='flex flex-col lg:flex-row border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[79vw] m-4 pt-4 lg:pt-0 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
              <div className='overflow-hidden flex items-center justify-center lg:w-full'>
                <Image src={filejson?.states[Random.x]?.bigImg} alt={filejson?.states[Random.x]?.state} width={1000} height={100} className="object-cover float-left px-4 h-[18vh] md:h-[35vh] lg:h-[sdf]  w-fit lg:max-w-[25vw]" />
              </div>
              <div className='flex flex-col justify-center gap-2 px-[1rem] my-6'>
                <h2 className='text-2xl h-fit text-center font-bold text-[#031a2c] dark:text-yellow-400 '> {filejson?.states[Random.x]?.state}</h2>
                <p className='text-center pt-3'> {filejson?.states[Random.x]?.desc}</p>
                <div  className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'><button className='border  border-whited tracking-wider amsterdam hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]   py-1  border-black rounded-[10rem] px-3 cursor-pointer' onClick={( ) => {
                dispatch(setCount(Random.x));
                // window.location.reload();
                router.push('/States');
              }} > Visit Now! </button></div>
              </div>
            </div>
          </div>
          <div className='flex justify-around my-10 flex-wrap'>
            <div className='flex flex-col lg:flex-row border-[2px] dark:border-[#640303] rounded-sm shrink-0 justify-between w-[90vw] md:w-[79vw] m-4 pt-4 lg:pt-0 text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] '>
              <div className='overflow-hidden flex items-center justify-center lg:w-full'>
                <Image src={filejson?.states[Random.y]?.bigImg} alt={filejson?.states[Random.y]?.state} width={1000} height={100} className="object-cover float-left px-4 h-[18vh] md:h-[35vh] lg:h-[sdf]  w-fit lg:max-w-[25vw]" />
              </div>
              <div className='flex flex-col justify-center gap-2 px-[1rem] my-6'>
                <h2 className='text-2xl h-fit text-center font-bold text-[#031a2c] dark:text-yellow-400 '> {filejson?.states[Random.y]?.state}</h2>
                <p className='text-center pt-3'> {filejson?.states[Random.y]?.desc}</p>
                <div  className='cursor-pointer w-full flex justify-center pt-5 items-center' target='_blank'><button className='border  border-whited tracking-wider amsterdam hover:text-white  dark:hover:text-yellow-400 text-lg hover:bg-[#a2bac2] dark:hover:bg-[#351a03d5]   py-1  border-black rounded-[10rem] px-3 cursor-pointer' onClick={( ) => {
                dispatch(setCount(Random.y));
                // window.location.reload();
                router.push('/States');
              }} > Visit Now! </button></div>
              </div>
            </div>
          </div>
            
    <div className='pb-10'>
      <h1 className='amsterdam bg-origin-border  text-[#031a2c] dark:text-yellow-400  mt-50 text-center w-full text-[4rem] mx-auto mt'>
        COMMENTS
      </h1>
      <CommentForm />
      <div className=' text-black dark:text-white bg-white shadow-lg dark:bg-[#1e0700] mt-6 lg:py-5 py-1 pb-1 lg:px-5 mx-5 lg:mx-52 rounded-md'>
        <CommentList />
      </div>
    </div>
  </div >
      )}

    </div >
  </>

  )
}

export default State