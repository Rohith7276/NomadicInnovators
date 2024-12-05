
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, form.current, {
                publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            })
            .then(
                () => {
                    alert("Thank you. I will get back to you as soon as possible.");
                    
                },
                 
            form.current.reset()
            );
    };

    return (<>
    <div className='backdrop-blur-md fixed top-5 flex justify-center items-center w-screen h-screen overflow-y-scroll z-[99] '>
        <form ref={form} onSubmit={sendEmail} className="max-w-[60vw] min-w-[50vw]  mx-auto p-4 bg-white shadow-md rounded-lg">
        <p className=" text-black">Get in touch</p>
        <h3 className=" text-black">Contact.</h3>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="user_name" placeholder='Enter Your Name' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" name="user_email" placeholder='Enter Your Email' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea name="message"   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center bg-blue-700 w-fit justify-between">
                <input type="submit" value="Send" className="  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
            </div>
        </form >
    </div>

    </>
    );
};
export default Contact