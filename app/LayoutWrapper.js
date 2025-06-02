"use client";

import { usePathname } from "next/navigation";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen">
      {!isLogin && <Header />}
      <main className="flex-grow">{children}</main>
      {!isLogin && <Footer />}
    </div>
  );
}
