"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "DO I NEED TO INVEST MONEY FIRST?",
    answer:
      "NO. YOU ONLY PAY WHEN YOU CREATE A HEDGE. THERE ARE NO SUBSCRIPTION FEES OR MANDATORY DEPOSITS. YOU CONTROL EXACTLY WHEN AND HOW MUCH YOU HEDGE.",
  },
  { question: "WHAT HAPPENS IF MY CROP PRICE DROPS?", answer: "YOUR HEDGE AUTOMATICALLY TRIGGERS. SMART CONTRACTS EXECUTE ON-CHAIN AND FUNDS FLOW DIRECTLY TO YOUR WALLET WITHIN HOURS. NO MIDDLEMEN, NO DELAYS." },
  { question: "IS MY DATA SAFE ON BLOCKCHAIN?", answer: "YES. BLOCKCHAIN IS IMMUTABLE AND TRANSPARENT. EVERY TRANSACTION IS RECORDED AND AUDITABLE. YOUR PRIVATE KEYS REMAIN WITH YOU AT ALL TIMES. NO ONE CAN FREEZE OR STEAL YOUR FUNDS." },
  { question: "WHAT IF I DON'T HAVE INTERNET?", answer: "YOU CAN ACCESS THE PLATFORM FROM ANY DEVICE WITH INTERNET CONNECTION. WE'RE BUILDING OFFLINE SYNC SUPPORT FOR AREAS WITH POOR CONNECTIVITY. CONTACT US TO PARTICIPATE IN BETA TESTING." },
  { question: "HOW ARE PRICES DETERMINED?", answer: "WE AGGREGATE PRICES FROM MAJOR COMMODITY EXCHANGES ACROSS AFRICA. SMART CONTRACTS VERIFY PRICES ON-CHAIN. ALL DATA IS PUBLIC AND VERIFIABLE ON INEVM TESTNET." },
  { question: "WHAT CROPS ARE SUPPORTED?", answer: "MAIZE, RICE, GROUNDNUTS, SORGHUM, BEANS, AND CASSAVA. WE'RE ADDING MORE CROPS BASED ON FARMER DEMAND. SUGGEST YOUR CROP IN OUR COMMUNITY FORUM." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="flex flex-col w-full bg-white dark:bg-[#060606] py-16 px-6 md:py-[100px] md:px-[120px] transition-colors duration-300">
      <div className="w-full max-w-[480px]">
        <SectionHeader
          label="[05] // FAQ"
          title={"QUESTIONS\nANSWERED."}
          subtitle="EVERYTHING YOU NEED TO KNOW ABOUT MICROHEDGER AFRICA."
          titleWidth="w-full"
          subtitleWidth="w-full"
        />
      </div>

      <div className="h-10 md:h-[64px]" />

      {/* FAQ items - Custom accordion */}
      <div className="w-full max-w-2xl">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-t border-gray-300 dark:border-[#1D1D1D] transition-colors duration-300">
              <button
                className="flex items-center justify-between w-full py-5 md:py-6 text-left gap-4 hover:opacity-80 transition-opacity"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-grotesk text-[14px] md:text-[16px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] transition-colors duration-300">
                  {faq.question}
                </span>
                <span className="font-ibm-mono text-[14px] font-bold text-black dark:text-[#F5F5F0] shrink-0 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <div className="pb-6 animate-in slide-in-from-top">
                  <p className="font-ibm-mono text-[12px] md:text-[13px] text-gray-700 dark:text-[#888888] tracking-[1px] leading-[1.6] transition-colors duration-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div className="border-t border-gray-300 dark:border-[#1D1D1D] transition-colors duration-300" />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px] pt-10 md:pt-[48px]">
        <span className="font-ibm-mono text-[13px] text-gray-600 dark:text-[#555555] tracking-[1px] transition-colors duration-300">
          STILL HAVE QUESTIONS?
        </span>
        <a href="#" className="font-ibm-mono text-[13px] font-bold text-[#00DC82] dark:text-[#FFD600] tracking-[1px] hover:underline transition-colors duration-300">
          EMAIL US →
        </a>
      </div>
    </section>
  );
}
