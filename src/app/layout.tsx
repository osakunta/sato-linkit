import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import Megaphone from "@/assets/megaphone.svg";
import Bear from "@/assets/bear.svg";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SatO Linkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex justify-center items-center bg-[#07526c] min-h-screen min-w-full">
          <Image
            src={Logo}
            alt="Satakuntalainen Osakunta logo"
            width={293}
            height={135}
            className="absolute top-4 left-4 w-3/12 z-10 md:w-2/12"
          />

          <Image
            src={Megaphone}
            alt="A drawing of a megaphone"
            width={268}
            height={241}
            className="absolute bottom-4 left-4 w-3/12 z-10 md:w-2/12"
          />

          <Image
            src={Bear}
            alt="A drawing of a megaphone"
            width={268}
            height={241}
            className="absolute bottom-4 right-4 w-3/12 z-10 md:w-2/12"
          />
          <div className="w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/5 p-4 z-50">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
