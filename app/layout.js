import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GenieZy | Fast Delivery eCommerce Experience",
  description: "GenieZy | Fast Delivery eCommerce Experience",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        {/* Custom meta tag here */}
        <meta name="google-adsense-account" content="ca-pub-9809230558529342" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
