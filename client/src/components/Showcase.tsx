"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const slides = [
  {
    tag: "[FARMER DASHBOARD]",
    tagBg: "#00DC82",
    tagColor: "#0A0A0A",
    idx: "01 / 03",
    idxColor: "#00DC82",
    title: "MANAGE YOUR\nHEDGES",
    by: "REAL-TIME MONITORING // PRICE ALERTS // AUTOMATIC PAYOUTS",
    border: "#00DC82",
    bg: "#F8F8F8",
    tagBorder: "#00DC82",
  },
  {
    tag: "[AI ASSISTANT]",
    tagBg: "#00D9FF",
    tagColor: "#000000",
    idx: "02 / 03",
    idxColor: "#00D9FF",
    title: "SMART\nRECOMMENDATIONS",
    by: "ML MODELS SUGGEST OPTIMAL HEDGE STRATEGIES BASED ON YOUR FARM",
    border: "#00D9FF",
    bg: "#111111",
    tagBorder: "#00D9FF",
  },
  {
    tag: "[SECURITY]",
    tagBg: "#FFD600",
    tagColor: "#0A0A0A",
    idx: "03 / 03",
    idxColor: "#FFD600",
    title: "BLOCKCHAIN\nTRANSPARENCY",
    by: "VIEW YOUR ENTIRE HEDGE HISTORY ON INEVM TESTNET",
    border: "#FFD600",
    bg: "#0A0A0A",
    tagBorder: "#FFD600",
  },
];

export default function Showcase() {
  const [active, setActive] = useState(1);

  const prev = () => setActive((p) => Math.max(0, p - 1));
  const next = () => setActive((p) => Math.min(slides.length - 1, p + 1));

  const slide = slides[active];

  return (
      <section id="showcase" className="flex flex-col w-full bg-gray-50 dark:bg-[#080808] pt-16 md:pt-[100px] pb-0 gap-8 md:gap-[48px] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-end justify-between px-6 md:px-[120px]">
        <SectionHeader
          label="[04] // SHOWCASE"
          title={"PLATFORM IN\nACTION."}
          titleWidth="w-full max-w-[600px]"
        />
        <div className="flex items-center gap-[8px] shrink-0">
          <button
            onClick={prev}
            className="flex items-center justify-center w-[48px] h-[48px] bg-gray-200 dark:bg-[#111111] border-2 border-gray-400 dark:border-[#3D3D3D] hover:border-gray-600 dark:hover:border-[#888888] transition-colors"
          >
            <span className="font-grotesk text-[18px] font-bold text-gray-700 dark:text-[#888888] transition-colors duration-300">&lt;</span>
          </button>
          <button
            onClick={next}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#00DC82] dark:bg-[#FFD600] hover:opacity-90 transition-opacity"
          >
            <span className="font-grotesk text-[18px] font-bold text-white dark:text-[#0A0A0A] transition-colors duration-300">&gt;</span>
          </button>
        </div>
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden px-6">
        <div
          className="flex flex-col gap-5 p-6 border-2 w-full dark:bg-[#111111] dark:border-[#2D2D2D] bg-gray-100 border-gray-300 transition-colors duration-300"
          style={{ backgroundColor: slide.bg === "#111111" || slide.bg === "#0F0F0F" ? undefined : slide.bg, borderColor: slide.border === "#2D2D2D" ? undefined : slide.border }}
        >
          <div className="flex items-center justify-center h-[160px] bg-gray-200 dark:bg-[#1A1A1A] border border-gray-400 dark:border-[#2D2D2D] transition-colors duration-300">
            <span className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#333333] tracking-[2px] transition-colors duration-300">[SCREENSHOT]</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center justify-center h-[24px] px-[10px] border transition-colors duration-300"
              style={{ backgroundColor: slide.tagBg, borderColor: slide.tagBorder || "transparent" }}
            >
              <span className="font-ibm-mono text-[9px] font-bold tracking-[1px] transition-colors duration-300" style={{ color: slide.tagColor }}>
                {slide.tag}
              </span>
            </div>
            <span className="font-ibm-mono text-[11px] tracking-[2px] transition-colors duration-300" style={{ color: slide.idxColor }}>
              {slide.idx}
            </span>
          </div>
          <h3 className="font-grotesk text-[20px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line transition-colors duration-300">
            {slide.title}
          </h3>
          <p className="font-ibm-mono text-[11px] text-gray-700 dark:text-[#555555] tracking-[1px] transition-colors duration-300">{slide.by}</p>
        </div>
      </div>

      {/* Desktop: carousel track */}
      <div className="hidden md:overflow-hidden h-[416px] md:block px-[120px]">
        <div
          className="flex gap-[2px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${active} * (560px + 2px)))` }}
        >
        {slides.map((s, i) => (
          <div
            key={i}
            className="flex flex-col gap-[24px] p-[40px] h-[412px] w-[560px] shrink-0 border-2 dark:bg-[#111111] dark:border-[#2D2D2D] bg-gray-100 border-gray-300 transition-colors duration-300"
            style={{ backgroundColor: s.bg === "#111111" || s.bg === "#0F0F0F" ? undefined : s.bg, borderColor: s.border === "#2D2D2D" ? undefined : s.border }}
          >
            <div className="flex items-center justify-center h-[200px] bg-gray-200 dark:bg-[#1A1A1A] border border-gray-400 dark:border-[#2D2D2D] transition-colors duration-300">
              <span className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#333333] tracking-[2px] transition-colors duration-300">[SCREENSHOT]</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <div
                className="flex items-center justify-center h-[24px] px-[10px] border transition-colors duration-300"
                style={{ backgroundColor: s.tagBg, borderColor: s.tagBorder || "transparent" }}
              >
                <span className="font-ibm-mono text-[9px] font-bold tracking-[1px] transition-colors duration-300" style={{ color: s.tagColor }}>
                  {s.tag}
                </span>
              </div>
              <span className="font-ibm-mono text-[11px] tracking-[2px] transition-colors duration-300" style={{ color: s.idxColor }}>
                {s.idx}
              </span>
            </div>
            <h3 className="font-grotesk text-[20px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line transition-colors duration-300">
              {s.title}
            </h3>
            <p className="font-ibm-mono text-[11px] text-gray-700 dark:text-[#555555] tracking-[1px] transition-colors duration-300">{s.by}</p>
          </div>
        ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-[8px] px-6 md:px-[120px]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-[4px] transition-all"
            style={{ width: i === active ? 32 : 8, backgroundColor: i === active ? (true ? "#00DC82" : "#FFD600") : "rgb(200,200,200)" }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 md:px-[120px] pb-16 md:pb-[100px]">
        <span className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#444444] tracking-[2px] transition-colors duration-300">
          SHOWING 0{active + 1} OF 03 FEATURES
        </span>
        <span className="font-ibm-mono text-[11px] text-[#00DC82] dark:text-[#FFD600] tracking-[2px] cursor-pointer hover:underline transition-colors duration-300">
          LEARN MORE &gt;
        </span>
      </div>
    </section>
  );
}
