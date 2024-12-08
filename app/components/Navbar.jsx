"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LOGO from "../../public/images/LOGO.svg";
import LOGO2 from "../../public/images/LOGO2.jpg";
import Select from "react-dropdown-select";
import { deleteDoc } from 'firebase/firestore';
import Image from "next/image";
import Contact from "./contact.jsx"
import Link from 'next/link';
import { useDispatch } from 'react-redux'
import { setCount } from '../redux/counter/counterSlice';
import { fireDB } from '../firebase/firebaseConfig'
import { collection, getDocs, doc } from 'firebase/firestore' 
import { CiMenuBurger } from "react-icons/ci";
import ThemeBtn from './themeBtn'
import { FaRegUserCircle } from "react-icons/fa";
export default function Navbar() {
  const boxRef = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter();
  const [user, setuser] = useState("null")
  const [userClick, setUserClick] = useState(false)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) { 
      setuser([JSON.parse(storedUser).name, JSON.parse(storedUser).email]);
    }

  }, [])
  const [filejson, setfilejson] = useState({})
  const [Comment, setComment] = useState(false)
  const dataFetch = async () => {
    let x = await getDocs(collection(fireDB, 'jsonData'));
    setfilejson(x. docs[0].data())
  }
  useEffect(() => { dataFetch() }, [])

  useEffect(() => {
    const googleTranslateElementInit = () => {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      }
     
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
      if (typeof window !== "undefined") {
        window.googleTranslateElementInit = googleTranslateElementInit;
      }
    };

    addGoogleTranslateScript();

  }, []);
  const handleUser = () => {
    setUserClick(!userClick)

  }
  const handleLogOut = async () => {
    try {
      localStorage.removeItem('user');
      setuser("null");
      setUserClick(false);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
    window.location.reload();
  };
  const options = filejson?.states?.map((each, index) => { return { id: index, name: each.state } })
  const [menu, setmenu] = useState(false)
  const handleMenu = () => {
    setmenu(!menu)
  }
  return (
    <>

    
      <nav className='bg-[#cacbc3]  text-black dark:text-white dark:bg-[#351a03] pl-4 h-[4rem] flex  overdfflow-hidden lg:flex-row items-center justify-between lg:justify-start shadow-md shadow-gray-700   dark:shadow-md dark:shadow-black sticky top-0 w-full z-[100] backdrop-filter backdrop-blur-sm'>
        <div className='flex items-center bdfsg-[#351a03] w-fit justify-between lg:w-fit'>
          <Image class src={LOGO} className="hidden dark:block" width={90} alt="Logo" />
          <Image class src={LOGO2} className='dark:hidden' width={90} alt="Logo" />
        </div>
        <button onClick={handleMenu} className='lg:hidden mx-7'>
          <CiMenuBurger />
        </button>
        <ul ref={boxRef} className={`absolute ${menu ? "flex" : "hidden"}  gafp-4 flex-col items-start lg:top-0 top-[4rem] p-4 right-0 lg:right-[1rem] w-[12rem] bg-[#cacbc3] dark:bg-[#351a03] lg:flex-row lg:items-center lg:justify-around lg:w-[90vw] lg:h-[4rem]  lg:flex`}>
          <li className='border border-t-0 border-l-0 border-r-0 w-full lg:w-fit py-3 lg:bordver-b-0 border-b-sm lg:border-b-0 flex flex-col justify-end items-center' id='listanim'>
            <Link href="/" >
              <h2 className='cursor-pointer cursor-none hover:scale-[1.1] duration-300'>Home</h2>
            </Link>
          </li>
          <li onClick={()=>setComment(!Comment)} className='border border-t-0 border-l-0 border-r-0 w-full lg:w-fit py-3 border-b-sm lg:border-b-0 flex flex-col justify-end items-center' id='listanim'>
            <h2 className='cursor-pointer scrl hover:scale-[1.1] curZ duration-300'>Contact</h2>
          </li>
          <li className='border border-t-0 border-l-0 border-r-0  py-3 lggfd:w-fit border-b-sm lg:border-b-0 w-full lg:w-[10rem]'>
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
                
                dispatch(setCount(id[0].id));
                router.push('/States');
              }}
            />
          </li>
          <li className='border border-t-0 border-l-0 border-r-0   py-1 lggfd:w-fit border-b-sm lg:border-b-0 w-full lg:w-[10rem]'>

            <div id="google_translate_element" className='lg:w-fit overflow-hidden mt-[-0.9rem] h-[2rem]'></div>
          </li>
          <li className='border lg:w-fit border-t-0 border-l-0 border-r-0 w-full py-3 border-b-sm lg:border-b-0 flex flex-col justify-end items-center' id='listanim'>
            <h2 className='cursor-pointer hover:scale-[1.1] scrl duration-300'>About</h2>
          </li>
          <li className='border lg:w-fit border-t-0 border-l-0 border-r-0 w-full py-3 border-b-sm lg:border-b-0 flex flex-col justify-end items-center' id='listanim'>
            <ThemeBtn />
          </li>
          <li className='border lg:w-fit border-t-0 border-l-0  border-r-0 w-full py-3 border-b-sm lg:border-b-0 flex flex-col justify-end cursor-pointer items-center bdfsg-[#cacbc3] text-black dark:text-white' id='listanim'>
            {user === "null" ? <Link href={"/SignIn"} className='cursor-pointer hover:scale-[1.1] scrl duration-300' >Sign In</Link> :
              <FaRegUserCircle className='cursor-pointer w-[3rem] h-[1.5rem]' onClick={handleUser} />}
            {(userClick && user != null) && <div className='absolute shadow-lg top-[18rem] right-[12rem] bg-[#cacbc3] dark:bg-[#351a03] rounded-l-md lg:rounded-l-none lg:rounded-b-md lg:top-[4rem] lg:-right-[1rem] flex flex-col gap-4 p-4'> {user[0]} <br /> {user[1]} <button className='bg-black text-white dark:bg-yellow-400 rounded-lg dark:text-black font-bold' onClick={handleLogOut}>Logout</button></div>}
          </li>
        </ul>
      </nav>
     {Comment && <section className="contact">
              <Contact/>
      </section>}
    </>
  );
};
