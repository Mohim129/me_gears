import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturesSection from '@/components/home/FeaturesSection';
import BestSellers from '@/components/home/BestSellers';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterFAQ from '@/components/home/NewsletterFAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mt-20 flex-grow">
        <HeroSection />
        <StatsBar />
        <FeaturedCategories />
        <NewArrivals />
        <FeaturesSection />
        <BestSellers />
        <TestimonialsSection />
        <NewsletterFAQ />
      </main>
      <Footer />
    </>
  );
}
