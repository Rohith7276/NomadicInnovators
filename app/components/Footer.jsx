import React from "react"
import Image from "next/image"
import Icon from "../../public/images/LOGO.svg"
import Icon2 from "../../public/images/LOGO2.jpg"

const Footer = () => {
  return (
    <footer    className="  min-h-[20rem]  bg-[#a2bac2] dark:bg-[#351a03] flex-col lg:flex-row text-black p-5 flex items-center">
      <div     className="  left flex flex-col items-center py-9 dark:py-0 max-w-[21rem] px-5 bg-[#cacbc3]  dark:bg-black rounded-md mx-7  ">
        <Image src={Icon} alt="icon"    className="   hidden dark:block" width={250}></Image>
        <Image src={Icon2} alt="icon"    className="    dark:hidden" width={250}></Image>
        {/* <span    className="   dark:text-gray-400 text-black text-center font-bold w-3/4">Thank you for visiting us!</span> */}
      </div>
      <div    className="   w-full h-fit py-5  lg:justify-around items-center justify-center flex-col lg:flex-row gap-6 lg:gap-0 lg:items-start  flex">
        <div>
          <h2    className="  cursor-default text-xl  text-white font-bold -m-3 mb-2">About Us</h2>
          <ul>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Our Story</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Team</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Careers</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Press</li>
          </ul>
        </div>
        <div>
          <h2    className="  cursor-default text-xl  text-white font-bold -m-3 mb-2">Follow Us</h2>
          <ul>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Facebook</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Twitter</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Instagram</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">LinkedIn</li>
          </ul>
        </div>
        <div>
          <h2    className="  cursor-default text-xl  text-white font-bold -m-3 mb-2">Contact Us</h2>
          <ul>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Email: contact@insightnow.com</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Phone: (123) 456-7890</li>
            <li    className="    hover:underline   dark:text-gray-400 text-black">Address: 123 News St, bangalore, India</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer