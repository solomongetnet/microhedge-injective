"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { WalletLoginButton } from "@/components/WalletLoginButton";

import Link from "next/link";

const links = [
  { label: "WHY INJECTIVE", section: "why-injective" },
  { label: "FEATURES", section: "features" },
  { label: "HOW IT WORKS", section: "howitworks" },
  { label: "TECH STACK", section: "techstack" },
  { label: "FAQ", section: "faq" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.href = `/#${id}`;
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = links.map((l) => l.section).filter(Boolean);
    const obs: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -60% 0px" },
      );
      o.observe(el);
      obs.push(o);
    });

    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? theme === "dark"
            ? "rgba(10,10,10,0.88)"
            : "rgba(255,255,255,0.88)"
          : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? theme === "dark"
            ? "1px solid #1E1E1E"
            : "1px solid #E5E5E5"
          : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between h-[60px] px-6 md:px-[48px] max-w-[1400px] mx-auto">
        {/* ── Logo ── */}
        <a href="#" className="flex items-center gap-[10px] shrink-0 group">
          <span className="w-[10px] h-[10px] bg-[#00DC82] dark:bg-[#FFD600] group-hover:scale-110 transition-transform" />
          <span className="font-grotesk text-[13px] font-bold text-black dark:text-[#F5F5F0] tracking-[2.5px]">
            MICROHEDGER
          </span>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-[36px]">
          {links.map(({ label, section, }) => {
            const isActive = active === section;


            return (
              <button
                key={label}
                onClick={() => scrollTo(section!)}
                className="relative font-ibm-mono text-[10px] tracking-[1.5px] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                style={{
                  color: isActive
                    ? theme === "dark"
                      ? "#FFD600"
                      : "#00DC82"
                    : theme === "dark"
                      ? "#555"
                      : "#999",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme === "dark" ? "#FFD600" : "#00DC82";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = theme === "dark" ? "#555" : "#999";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
          <div className="flex items-center gap-4 border-l pl-8 border-gray-100 dark:border-white/10">
            <ModeToggle />
            <WalletLoginButton className="h-[42px] px-6 font-grotesk text-[10px] font-bold tracking-[1.5px] bg-[#00DC82] dark:bg-[#FFD600] text-black border-none" />
          </div>
        </nav>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden flex flex-col gap-[6px] p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className="w-[20px] h-[1px] transition-all duration-300"
            style={{
              backgroundColor: theme === "dark" ? "#FFF" : "#000",
              transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none",
            }}
          />
          <div
            className="w-[20px] h-[1px] transition-all duration-300"
            style={{
              backgroundColor: theme === "dark" ? "#FFF" : "#000",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <div
            className="w-[20px] h-[1px] transition-all duration-300"
            style={{
              backgroundColor: theme === "dark" ? "#FFF" : "#000",
              transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 h-[calc(100vh-60px)] bg-white dark:bg-[#0A0A0A] z-40 p-8 flex flex-col gap-8">
          {links.map(({ label, section, }) => (

            <button
              key={label}
              onClick={() => {
                scrollTo(section!);
                setMenuOpen(false);
              }}
              className="font-grotesk text-[18px] font-bold text-black dark:text-white tracking-[2px] bg-transparent border-none text-left"
            >
              {label}
            </button>
          )
          )}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <ModeToggle />
            <WalletLoginButton className="flex-1 h-[56px] font-grotesk text-[11px] font-bold tracking-[2px] bg-[#00DC82] dark:bg-[#FFD600] text-black border-none" />
          </div>
        </div>
      )}
    </header>
  );
}
