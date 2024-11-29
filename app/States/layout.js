"use client"
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar.jsx'

import store from '../redux/store';
import { Provider } from 'react-redux'
export default function RootLayout({ children }) {
    return (
        <>
            <Provider store={store}>
                <Navbar />

                <section className='min-h-screen '>
                {children}
                </section>
                <Footer />
            </Provider>

        </>

    );
}