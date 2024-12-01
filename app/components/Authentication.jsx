'use client'
import React from 'react'
import Background from "../../public/images/homeImg.jpg"
import Image from 'next/image'
import { FaHome } from "react-icons/fa";
import Typed from 'typed.js';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Link from 'next/link';
import { gsap } from "gsap";

import { useEffect, useRef, useState } from 'react';
const Authentication = () => {
    const typedElement = useRef(null);
    const appear = useRef(null);
    const animation = () => {
        appear.current.style.opacity = 1;
        gsap.from(appear.current, {
            opacity: 0,
            delay: 1,
            duration: 2,
        });
    };

    const [account, setAccount] = useState(false)



    useEffect(() => {
        const options = {
            strings: [
                "Your Guide",
                "Your Partner",
                "Your Solution",
                "Tour De India"
            ],
            typeSpeed: 70,
            backSpeed: 70,
            loop: false,
            onComplete: () => {
                animation();
            }
        };

        const typed = new Typed(typedElement.current, options);

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <div className='flex justify-center items-center fixed z-[-10] w-screen h-screen blur-sm '>
                <Image src={Background} alt="Background Image"></Image>
            </div>
            <div className='border-[2px] border-[#640303] rounded-sm shrink-0 justify-between flex-col items-stretch w-[90vw] md:w-[45vw] flex h-[80vh] mx-4 bg-[#1e0700]  '>
                <div>

                    <div className='bg-pinewk-300 font-bold text-[3rem] max-w-[24.5rem] text-wrap py-4 h-[5rem] text-[#ffd867] mt-50 text-center w-fdll  mx-auto mt' ref={typedElement}></div>
                    <div ref={appear} className='opacity-0 bg-origin-border text-[#ffd867] mt-50 text-center   mx-auto mt amsterdama'>Specialist in the art of travel</div>
                </div>

                {account ? <SignIn /> : <SignUp />}
                <div className='px-14 flex justify-between pb-9'>
                    
                {account ? <div>Don&apos;t have an account?
                    <button className='text-[#ffd867] hover:underline' onClick={() => setAccount(false)}>Sign Up</button></div> : <div>Do you have an account? <button className='text-[#ffd867] hover:underline' onClick={() => setAccount(true)}>Sign In</button>
                </div>
                }
                <Link href='/' className='cursor-pointer flex justify-center items-center bg-blfdsck text-[#ffd867] w-5 h-5 roundsfded-full'><FaHome className='cursor-pointer w-10' /></Link>
                </div>
            </div>
        </div>
    )
}

export default Authentication
