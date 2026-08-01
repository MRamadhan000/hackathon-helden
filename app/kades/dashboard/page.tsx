import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import BridgeSection from "./components/landing/BridgeSection";
import StatSection from "./components/landing/StatSection";
import BudgetSection from "./components/landing/BudgetSection";
import Footer from "./components/landing/Footer";

export default function LandingPageDesa() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />
      <HeroSection />
      <BridgeSection />
      <StatSection />
      <BudgetSection />
      <Footer />
    </div>
  );
}
