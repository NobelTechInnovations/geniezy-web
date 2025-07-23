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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9809230558529342"
     crossorigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="adsbygoogle-init"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9809230558529342"
          crossOrigin="anonymous"
        />

        {/* AdSense ad unit */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9809230558529342"
          data-ad-slot="5541942961"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Push AdSense */}
        <Script id="adsbygoogle-push" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
        {children}
      </body>
    </html>
  );
}
