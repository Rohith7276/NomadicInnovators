"use client"
import React, { useEffect } from "react"
import gsap from "gsap"

const Cursor = () => {
    useEffect(() => {
        const cursor = document.querySelector("#custom-cursor")
        const links = document.querySelectorAll("a")
        const but = document.querySelectorAll(".curZ")
        const cursorText = document.querySelector(".cursor-text")

        const onMouseMove = (e) => { 
            gsap.to(cursor, {
                x: e.clientX-10,
                y: e.clientY-10, 
                duration:0
            })
        }

        const onMouseEnterLink = (e) => {
            const link = e.target
            if (link.classList.contains("view")) {
                gsap.to(cursor, { scale: 4 })
                cursorText.style.display = "block"
            }
            else {
                gsap.to(cursor, { scale: 4 })
            }
        }
        const onMouseLeaveLink = ( ) => {
            gsap.to(cursor, { scale: 1 })
            cursorText.style.display = "none"
        }
        document.addEventListener("mousemove", onMouseMove)

        links.forEach(link => {
            link.addEventListener("mouseenter", onMouseEnterLink)

            link.addEventListener("mouseleave", onMouseLeaveLink)

        }) 
        but.forEach(link => {
            link.addEventListener("mouseenter", onMouseEnterLink)

            link.addEventListener("mouseleave", onMouseLeaveLink)

        }) 
    }, [])
    return (
        <div id="custom-cursor"     className="hidden   lg:flex  custom-cursor">
            <span  className="cursor-text">view</span>
        </div>
    )
}

export default Cursor
