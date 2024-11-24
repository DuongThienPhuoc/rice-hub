import Navbar from "@/components/navbar/navbar";
import ContactBanner from "@/components/home/contact-banner";
import ProductBanner from "@/components/home/product-banner";
import SectionInfor from "@/components/home/infor";
import Footer from "@/components/home/footer";
import Banner from '@/components/home/banner';
import AnimalFeedBanner from '@/components/home/animal-feed-banner';
import NavbarResponsive from '@/components/navbar/navbar-responsive';

export default function Home() {
  return (
    <div>
      <main className='bg-white'>
        <Navbar />
        <NavbarResponsive />
        <Banner />
        <ContactBanner />
        <ProductBanner />
        <SectionInfor />
        <AnimalFeedBanner/>
        <Footer />
      </main>
    </div>
  );
}
