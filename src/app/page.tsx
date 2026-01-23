import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import TemplatesCarousel from "@/components/sections/templates-carousel";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TemplatesCarousel />
      <Footer />
    </main>
  );
}
