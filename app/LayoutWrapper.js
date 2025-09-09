"use client";

import { usePathname } from "next/navigation";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hasCustomLayout = pathname.startsWith("/login") || pathname.startsWith("/checkout");

  return (
    <div className="flex flex-col min-h-screen">
      {!hasCustomLayout && <Header />}
      <main className="flex-grow">{children}</main>
      {!hasCustomLayout && <Footer />}
    </div>
  );
}
