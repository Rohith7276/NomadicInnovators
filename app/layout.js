
import { Gowun_Batang } from "next/font/google";
import "./globals.css";
import Cursor from './components/Cursor';
import dynamic from 'next/dynamic';
import SessionWrapper from "./components/SessionWrapper";
const Bot = dynamic(() => import('./components/bot'), { ssr: false });

const inter = Gowun_Batang({ subsets: ["latin"], weight: ['400', '700'], });

export const metadata = {
  title: "Tour De India",
  description: "News web app",
};


export default function RootLayout({ children }) {
  return (
    <html className={inter.className} lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=New+Amsterdam&display=swap" rel="stylesheet" />



      </head>
      <SessionWrapper>
        <body className="  font-inter scrolling" style={{ top: 0 }}>
          {children}
          <Cursor />
          <Bot />
        </body>
      </SessionWrapper>
    </html >
  );
}

