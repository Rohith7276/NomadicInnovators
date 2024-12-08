"use client"
import React, { useEffect } from 'react'
import gsap from 'gsap'

const Cursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor')
        const links = document.querySelectorAll('a')
        const but = document.querySelectorAll('.curZ')
        const cursorText = document.querySelector('.cursor-text')

        const onMouseMove = (e) => {
            const { clientX, clientY } = e
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
            })
        }

        const onMouseEnterLink = (e) => {
            const link = e.target
            if (link.classList.contains('view')) {
                gsap.to(cursor, { scale: 4 })
                cursorText.style.display = 'block'
            }
            else {
                gsap.to(cursor, { scale: 4 })
            }
        }
        const onMouseLeaveLink = ( ) => {
            gsap.to(cursor, { scale: 1 })
            cursorText.style.display = 'none'
        }
        document.addEventListener('mousemove', onMouseMove)

        links.forEach(link => {
            link.addEventListener('mouseenter', onMouseEnterLink)

            link.addEventListener('mouseleave', onMouseLeaveLink)

        })
        but.forEach(butt => {
            butt.addEventListener('mouseenter', onMouseEnterLink)

            butt.addEventListener('mouseleave', onMouseLeaveLink)

        })
    }, [])
    return (
        <div id='custom-cursor' className=" custom-cursor">
            <span className=' cursor-text'>view</span>
        </div>
    )
}

export default Cursor
