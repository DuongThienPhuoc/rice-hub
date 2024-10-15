import Navbar from "@/components/navbar/navbar";
import Banner from "@/components/home/banner";
import RiceBanner from "@/components/home/rice-banner";
import BranBanner from "@/components/home/bran-banner";
import SectionInfor from "@/components/home/infor";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div>
      <main>
          <Navbar/>
          <Banner/>
          <RiceBanner/>
          <BranBanner/>
          <SectionInfor/>
          <Footer/>
      </main>
    </div>
  );
}
