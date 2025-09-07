import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhoWeAre } from "@/components/WhoWeAre";
import { Classes } from "@/components/Classes";
import { Staff } from "@/components/Staff";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import MembershipPlans from "@/components/MembershipPlans";
import { Tools } from "@/components/Tools";
import { Shop } from "@/components/Shop";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { PaymentSuccess } from "@/components/PaymentSuccess";
import { PaymentCancelled } from "@/components/PaymentCancelled";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const paymentStatus = usePaymentStatus();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show payment status screens
  if (paymentStatus === 'success') {
    return <PaymentSuccess />;
  }
  
  if (paymentStatus === 'cancelled') {
    return <PaymentCancelled />;
  }

  return (
    <div className="min-h-screen">
      <Navbar scrollY={scrollY} />
      


      <Hero />
      <WhoWeAre />
      <Classes />
      <Staff />
      <Gallery />
      <Reviews />
      <FAQ />
      <MembershipPlans />
      <Tools />
      <Shop />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
