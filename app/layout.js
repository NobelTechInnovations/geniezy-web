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
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: '%s | GenieZy',
    default: 'GenieZy | Fast Delivery eCommerce Experience',
  },
  description: "GenieZy | Fast Delivery eCommerce Experience",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
