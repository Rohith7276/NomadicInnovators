"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LOGO from "../../public/images/LOGO.svg";
import Select from "react-dropdown-select";
import Image from "next/image";
import Link from 'next/link';
import { useDispatch } from 'react-redux'
import { setCount } from '../redux/counter/counterSlice';
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'


export default function Navbar() {
  const [loading, setloading] = useState(false)
  const boxRef = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter();
  const [Loading, setLoading] = useState(false)


  const [fetchData, setFetchData] = useState(true)

  const [filejson, setfilejson] = useState({})
  const dataFetch = async () => {
    let x = await getDocs(collection(fireDB, 'jsonData'));
    setfilejson(x.docs[1].data())
    setFetchData(false)
  }
  useEffect(() => { dataFetch() }, [])

  useEffect(() => {
    const googleTranslateElementInit = () => {
      if(typeof window !== "undefined" && typeof document !== "undefined"){
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
      if (window.screen.width < 768 && typeof document !== "undefined") {
        document.querySelector('nav').style.transform = 'translateY(-100%)';
      }
    }
      const handleScroll = () => {
        if (typeof document !== "undefined") {
          var nav = document.querySelector('nav');
        }
        if (typeof window !== "undefined" && nav) { 
          if (window.scrollY > window.innerHeight / 0.5) {
            nav.style.transition = 'transform 0.6s ease-in-out';
            nav.style.transform = 'translateY(-30vh)';
          } else {
            nav.style.transition = 'transform 0.6s ease-in-out';
            nav.style.transform = 'translateY(0)';
          }
        }

      };
      if (typeof document !== "undefined")
        document.querySelectorAll('.scrl').forEach(element => {
          element.addEventListener('click', () => {
            if (typeof window !== "undefined") {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }
          });
        });
      if (typeof window !== "undefined")
        window.addEventListener('scroll', handleScroll);

      return () => {
        if (typeof window !== "undefined")
          window.removeEventListener('scroll', handleScroll);
      };
    };


    if (typeof document !== "undefined")
      document.querySelectorAll('li').forEach(element => {
        element.style.opacity = 1;
      });

    const addGoogleTranslateScript = () => {
      if (typeof document !== "undefined")
        var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      if (typeof document !== "undefined")
        document.body.appendChild(script);
      if (typeof window !== "undefined"){
        window.googleTranslateElementInit = googleTranslateElementInit;}
    };

    addGoogleTranslateScript();

  }, []);

  const options = filejson?.states?.map((each, index) => { return { id: index, name: each.state } })

  return (
    <>
      <nav className='bg-[#351a03] pl-4 h-[4rem] flex flex-col lg:flex-row items-center justify-center lg:justify-start shadow-md shadow-black sticky top-0 w-full z-[100]'>
        <div className='flex items-center w-full justify-between  lg:w-auto'>
          <Image src={LOGO} width={90} alt="Logo" />
          <button className='lg:hidden  px-5 text-white' onClick={() => setLoading(!Loading)}>
            <svg className="w-6 cursor-pointer h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <ul ref={boxRef} className={`absolute gap-4 flex-col items-start lg:top-0 top-[4rem] p-4 right-0 lg:right-[1rem] w-[16rem] bg-[#351a03] lg:flex-row lg:items-center lg:justify-around lg:w-[90vw] lg:h-[4rem] lg:flex ${Loading ? 'flex' : 'hidden'} lg:flex`}>
          <li className='flex flex-col justify-end items-center' id='listanim'>
            <Link href="/" >
              <h2 className='cursor-pointer hover:scale-[1.1] bg-bladck duration-300'>Home</h2>
            </Link>
          </li>
          <li className='flex flex-col justify-end items-center' id='listanim'>
            <h2 className='cursor-pointer scrl hover:scale-[1.1] duration-300'>Contact</h2>
          </li>
          <li className='w-full lg:w-[10rem]'>
            <Select
              className='text-black bg-white'
              options={options}
              placeholder='Select a state'
              labelField={"name"}
              valueField="id"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? 'grey' : 'red',
                }),
              }}
              color='grey'
              onChange={(id) => {
                setloading(true)
                dispatch(setCount(id[0].id));
                router.push('/States');
              }}
            />
          </li>
          <li>
            <div id="google_translate_element" className='overflow-hidden mt-[-0.9rem] h-[2rem]'></div>
          </li>
          <li className='flex flex-col justify-end items-center' id='listanim'>
            <h2 className='cursor-pointer hover:scale-[1.1] scrl duration-300'>About</h2>
          </li>
          <li className='flex flex-col justify-end items-center' id='listanim'>
            <Link href={"/SignIn"} className='cursor-pointer hover:scale-[1.1] scrl duration-300' >Sign In</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
