"use client"
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import Footer from "../components/Footer"
import { ThemeProvider } from "@/app/contexts/themes";
 
 
import Home from "../components/Home";
import Navbar from "../components/Navbar";
function App() {


  return (
    <div clasName="bg-gray-100 ">
    <ThemeProvider>  
        <Navbar />
        <Home />
        <Footer /> 
    </ThemeProvider>
      
    </div>
  )
}

export default App