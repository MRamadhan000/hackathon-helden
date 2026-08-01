import Navbar from "../../../components/kades/Navbar";
import HeroSection from "../../../components/kades/HeroSection";
import BridgeSection from "../../../components/kades/BridgeSection";
import StatSection from "../../../components/kades/StatSection";
import BudgetSection from "../../../components/kades/BudgetSection";
import Footer from "../../../components/kades/Footer";

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
