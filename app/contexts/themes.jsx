//first create a context folder and a file and createContext

import React, { useContext, useState, useEffect } from "react";

const ThemeContext = React.createContext()
const ThemeUpdate = React.createContext()

//export the provider
export function useTheme() {
    return useContext(ThemeContext)
}
export function useThemeUpdate() {
    return useContext(ThemeUpdate)
}

export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState()
    const toggleTheme = () => {
        if (themeMode === "light") {
            setThemeMode("dark")
            localStorage.setItem("themeMode", "dark")
        }
        else {
            localStorage.setItem("themeMode", "light")
            setThemeMode("light")
        }
    }
    useEffect(() => {
        document.querySelector("html").classList.remove("dark", "light")
        document.querySelector("html").classList.add(themeMode)
    }, [themeMode])
    useEffect(() => {
        if (localStorage.getItem("themeMode")) {
            setThemeMode(localStorage.getItem("themeMode"))
        }
        else {
            localStorage.setItem("themeMode", "light")
        }
    }, [])

    return (
        <ThemeContext.Provider value={themeMode}>
            <ThemeUpdate.Provider value={toggleTheme}>
                {children}
            </ThemeUpdate.Provider>
        </ThemeContext.Provider>
    )
}