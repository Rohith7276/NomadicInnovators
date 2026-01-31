"use client"
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar.jsx"
import { ThemeProvider } from "@/app/contexts/themes";

// import store from "../redux/store";
// import { Provider } from "react-redux"
export default function RootLayout({ children }) {
    return (
        <>
    <ThemeProvider>

            {/* <Provider store={store}> */}
                <Navbar />

                <section    className="  min-h-screen dark:bg-black bg-gray-100 ">
                {children}
                </section>
                <Footer />
            {/* </Provider> */}
            </ThemeProvider>

        </>

    );
}