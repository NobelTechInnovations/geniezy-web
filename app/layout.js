import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './components/Providers';

// Font imports
import '../public/static/fonts/Linearicons/Font/demo-files/demo.css';
import '../public/static/fonts/font-awesome/css/font-awesome.min.css';
import '../public/static/css/bootstrap.min.css';
import '../public/static/css/slick.min.css';
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
