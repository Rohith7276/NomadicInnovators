"use client"
import { Webchat, WebchatProvider, Fab, getClient } from "@botpress/webchat";
import { buildTheme } from "@botpress/webchat-generator";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { TbXboxXFilled } from "react-icons/tb";
import { FcCustomerSupport } from "react-icons/fc";
const { theme, style } = buildTheme({
  themeName: "prism",
  themeColor: "#634433",
});

//Add your Client ID here ⬇️
const clientId = "07e214ad-1aba-4a64-90a0-944c4b4677f0";

export default function App() {
  const client = getClient({ clientId });
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const [closee, setClose] = useState(false)

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };
  useEffect(() => {
    const popElement = document.querySelector(".pop");
    
      gsap.to(popElement, { width: "14rem", opacity: 1, duration: 0.5});
    
  }, [])
  useEffect(() => {
    const popElement = document.querySelector(".pop");

    if (closee && popElement) {
      gsap.to(popElement, { width: 5, paddingLeft:0, paddingRight:0, duration: 0.3, onComplete: () => popElement.style.display = "none" });
    }
    
  
    
  }, [closee])
  
  const hide = () => {
    setClose(true)
  }
  return (
    <div     className="  shadow-md">
      <div     className="  shadow-lg w-[14rem] fixed pop z-[100] bottom-4 flex gap-2 items-center  text-nowrap overflow-hidden pt-[18px] pb-[18px] pl-[20px] opacity-0 rounded-md pr-[43px] right-[3rem] bg-white text-black">
        <button     className="   bg-blacdfsk absolute flex fl mt-[-3.1rem] ml-[-1.47rem] rounded-full p-0    text-black" onClick={hide}><TbXboxXFilled     className="   " /></button>
        Hey we&apos;re online<FcCustomerSupport     className="  text-xl" /></div>
      <style>{style}</style>
      <WebchatProvider
        theme={theme}
        client={client}
      >
        <Fab onClick={toggleWebchat}     className="  shadfgdw-sm" />
        <div
          style={{
            display: isWebchatOpen ? "block" : "none",
          }}
        >
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}