"use client"
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import Footer from "./components/Footer"
import { ThemeProvider } from "@/app/contexts/themes";
 

import store from "./redux/store"
import { Provider } from "react-redux"
import Home from "./components/Home";
import Navbar from "./components/Navbar";
function App() {


  return (
    <div clasName="bg-gray-100 ">
    <ThemeProvider>
      <Provider store={store}>
        
        <Navbar />
        <Home />
        <Footer />
        {/* <Rough /> */}
      </Provider>
    </ThemeProvider>
      
    </div>
  )
}

export default App