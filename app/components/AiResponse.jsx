import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";
import DOMPurify from 'dompurify';
import { useGSAP } from '@gsap/react';
import Loader from './Loader';
import { useEffect } from 'react';
import { gsap } from 'gsap';
function ChatApp() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false)
    const { contextSafe } = useGSAP();
    useEffect(() => {
        const animation = contextSafe(() => {
            if (typeof document !== "undefined") {
                Array.from(document.getElementsByClassName("aiRes")).forEach(element => {
                    element.style.opacity = 1;
                });
            }
            gsap.from(".aiRes", {
                y: 20,
                opacity: 0,
                stagger: 0.2
            })
        });

        animation();
    }, [response])

    const handleSendMessage = async () => {
        
            setLoading(true);
            document.querySelector('.scrollBrown').scrollTo({ top: 0, behavior: 'smooth' });
            const finalInput = `Pretend like you are a travel guide for India working for "Tour De India website": You asked for "where do you wanna travel in India?" I replied ${input} you reply back for the reply based on context of a traveler and  you can also suggest best places to vist in there, food places to try, etc. if required and don't forget to mention website name in the conversation.`;

            try {
                // Send a POST request to the API route
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(finalInput), // Send the user input as JSON
                });
                const jsonData = await res.json();

                setResponse(jsonData.response.split("\n"));
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setResponse(['An error occurred while communicating with the server.']);
                setLoading(false);
            }
           
    };


    const HtmlRenderer = ({ htmlString }) => {
        // Sanitize the HTML string before rendering
        const sanitizedHtml = DOMPurify.sanitize(htmlString);

        return (
            <div className="aiRes opacidfty-0 " dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        );
    };
    return (
        <div>
            <div className=' rounded-md m-auto w-fit px-3  bg-[#4F2109] flex justify-center items-center'>

                <textarea className='w-[47vw] p-[0.5rem] h-[2.5rem] bg-[#4F2109] resize-none self-center outline-none'
                    value={input}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            // setInput(e.target.value)
                            e.preventDefault();
                            handleSendMessage()
                        }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter the place name here..."
                />
                <button onClick={handleSendMessage} className='text-yellow-400 cursor-pointer'><IoSend /></button>
            </div>
            {loading && <div className='absolute ml-[45vw] mt-[7rem] '><Loader /></div>}
            <div className='h-[60vh] my-6 px-4 scrollBrown overflow-y-scroll  w-[80vw] py-7 m-auto'>
                {response.map((item, index) => {
                    let formattedItem = item;
                    let isBold = true;
                    while (formattedItem.includes("**")) {
                        formattedItem = formattedItem.replace("**", isBold ? `<span className="aibold">` : `</span>`);
                        isBold = !isBold;
                    }
                    return (
                        <div key={index}>
                            <HtmlRenderer htmlString={formattedItem} />
                            <br />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatApp;
