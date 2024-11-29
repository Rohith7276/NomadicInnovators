"use client"
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import Footer from './components/Footer'

// Import the dynamic function
import dynamic from 'next/dynamic';

// Dynamically import the component and disable SSR

import store from './redux/store'
import { Provider } from 'react-redux'
import Home from './components/Home';
import Navbar from './components/Navbar';
function App() {


  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Home />
        <Footer />
      </Provider>
      
    </>
  )
}

export default App