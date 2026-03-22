"use client"

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelDivider from "@/components/PixelDivider";
import Features from "@/components/Features";
import WhyInjective from "@/components/WhyInjective";
import HowItWorks from "@/components/HowItWorks";
import TechStack from "@/components/TechStack";
import Showcase from "@/components/Showcase";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full bg-white dark:bg-[#0A0A0A] pt-[60px] transition-colors duration-300">
        <Navbar />

        <Hero />
        <PixelDivider />
        <Features />
        <WhyInjective />
        <HowItWorks />
        <TechStack />
        <Showcase />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
