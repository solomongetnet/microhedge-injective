"use client";

import GlitchText from "@/components/GlitchText";
import { Button } from "@/components/ui/button";
import { WalletLoginButton } from "@/components/WalletLoginButton";

export default function FinalCTA() {
  return (
    <section className="flex flex-col items-center w-full bg-white dark:bg-[#0A0A0A] py-16 px-6 md:p-[120px] gap-10 md:gap-[48px] border-t-2 border-[#00DC82] dark:border-t-[#FFD600] transition-colors duration-300">
      {/* Badge */}
      <div className="flex items-center justify-center gap-[8px] h-[32px] px-[16px] bg-green-100 dark:bg-[#1A1A1A] border-2 border-[#00DC82] dark:border-[#FFD600]">
        <span className="font-ibm-mono text-[11px] font-bold text-[#00DC82] dark:text-[#FFD600] tracking-[2px]">
          <GlitchText text="[READY TO PROTECT YOUR FARM?]" speed={30} />
        </span>
      </div>

      {/* Title */}
      <h2 className="font-grotesk text-[44px] md:text-[80px] font-bold text-black dark:text-[#F5F5F0] tracking-[-2px] leading-none text-center w-full max-w-[1000px] whitespace-pre-line transition-colors duration-300">
        <GlitchText text={"JOIN THOUSANDS OF\nPROTECTED FARMERS."} speed={40} delay={200} />
      </h2>

      {/* Subtitle */}
      <p className="font-ibm-mono text-[10px] md:text-[14px] text-gray-700 dark:text-[#666666] tracking-[0.5px] md:tracking-[2px] text-center text-pretty w-full max-w-[700px] px-2 transition-colors duration-300">
        <GlitchText text="GET STARTED TODAY. HEDGE YOUR NEXT HARVEST WITH AI-POWERED RECOMMENDATIONS." speed={20} delay={450} />
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-[16px] w-full sm:w-auto">
        <WalletLoginButton redirectOnAuth className="w-full sm:w-[260px] h-[64px] font-grotesk text-[13px] font-bold tracking-[2px]">
          TRY DEMO — FREE
        </WalletLoginButton>
        <Button variant="outline" size="lg" className="w-full sm:w-[220px] h-[64px] font-ibm-mono text-[12px] tracking-[2px]">
          CONTACT US
        </Button>
      </div>
    </section>
  );
}
