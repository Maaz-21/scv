import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/ui/Hero";
import HowItWorks from "@/components/ui/HowItWorks";
import ListingPreviewSection from "@/components/ui/ListingPreviewSection";
import Footer from "@/components/layouts/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <ListingPreviewSection />
      </main>
      <Footer />
    </div>
  );
}
