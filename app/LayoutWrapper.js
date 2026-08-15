"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import NavigationProgress from "./components/common/NavigationProgress";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hasCustomLayout = pathname.startsWith("/login") || pathname.startsWith("/checkout");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation progress bar — uses useSearchParams inside so it must be
          wrapped in Suspense (Next.js App Router requirement). Sits at the top
          of the rendering tree so it's always visible regardless of layout. */}
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>

      {!hasCustomLayout && <Header />}
      {/* pb only applies below md, matching MobileBottomNav's own md:hidden,
          so the fixed bar never overlaps page content on small screens and
          nothing changes at tablet/desktop widths. */}
      <main className={`flex-grow ${!hasCustomLayout ? 'pb-14 md:pb-0' : ''}`}>{children}</main>
      {!hasCustomLayout && <Footer />}
      {!hasCustomLayout && <MobileBottomNav />}
    </div>
  );
}
