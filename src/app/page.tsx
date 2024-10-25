'use client';
import Navbar from "@/components/navbar/navbar";
import Banner from "@/components/home/banner";
import RiceBanner from "@/components/home/rice-banner";
import BranBanner from "@/components/home/bran-banner";
import SectionInfor from "@/components/home/infor";
import Footer from "@/components/home/footer";
import { useEffect, useState } from "react";
import Sidebar from "@/components/navbar/sidebar";

export default function Home() {
  const [navbarVisible, setNavbarVisible] = useState(false);

  useEffect(() => {
    const updateNavbarVisibility = () => {
      const shouldShowNavbar = window.innerWidth >= 1100;
      setNavbarVisible(shouldShowNavbar);
    };

    updateNavbarVisibility();

    window.addEventListener('resize', updateNavbarVisibility);

    return () => {
      window.removeEventListener('resize', updateNavbarVisibility);
    };
  }, []);

  return (
    <div>
      <main>
        {navbarVisible ? (
          <Navbar />
        ) : (
          <Sidebar />
        )}
        <Banner />
        <RiceBanner />
        <BranBanner />
        <SectionInfor />
        <Footer />
      </main>
    </div>
  );
}
