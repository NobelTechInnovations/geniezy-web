import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./bootstrap.min.css";
import Providers from './components/Providers';

// Ant Design v5 uses CSS-in-JS by default, no need to import CSS

// Import main SCSS files
import '../scss/style.scss';
import '../scss/home-default.scss';
import '../scss/market-place-1.scss';
import '../scss/market-place-2.scss';
import '../scss/market-place-3.scss';
import '../scss/market-place-4.scss';
import '../scss/electronic.scss';
import '../scss/furniture.scss';
import '../scss/organic.scss';
import '../scss/technology.scss';
import '../scss/autopart.scss';

// Font and other CSS imports
import '../public/static/fonts/Linearicons/Font/demo-files/demo.css';
import '../public/static/fonts/font-awesome/css/font-awesome.min.css';
// import '../public/static/css/bootstrap.min.css'; // Comment out the original import
import '../public/static/css/slick.min.css';

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
        {/* Bootstrap CDN backup in case local file doesn't load */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
