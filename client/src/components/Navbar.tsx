"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { WalletLoginButton } from "@/components/WalletLoginButton";

const links = [
  { label: "FEATURES", section: "features" },
  { label: "HOW IT WORKS", section: "howitworks" },
  { label: "TECH STACK", section: "techstack" },
  { label: "FAQ", section: "faq" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => scrollTo(section)}
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
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      theme === "dark" ? "#F5F5F0" : "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = isActive
                    ? theme === "dark"
                      ? "#FFD600"
                      : "#00DC82"
                    : theme === "dark"
                      ? "#555"
                      : "#999";
                }}
              >
                {label}
                <span
                  className="absolute left-0 -bottom-[3px] h-[1.5px] transition-all duration-300"
                  style={{
                    backgroundColor: theme === "dark" ? "#FFD600" : "#00DC82",
                    width: isActive ? "100%" : "0%",
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-[14px]">
          <ModeToggle />
          <WalletLoginButton redirectOnAuth className="font-grotesk text-[11px] font-bold tracking-[1.5px] px-[18px] py-[9px]">
            DEMO
          </WalletLoginButton>
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-[#F5F5F0] transition-transform duration-200 origin-center"
            style={{
              transform: menuOpen
                ? "translateY(-6.5px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          background:
            theme === "dark" ? "rgba(10,10,10,0.97)" : "rgba(255,255,255,0.97)",
          backdropFilter: "blur(14px)",
          borderBottom: menuOpen
            ? theme === "dark"
              ? "1px solid #1E1E1E"
              : "1px solid #E5E5E5"
            : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => {
                  scrollTo(section);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full font-ibm-mono text-[12px] tracking-[2px] py-[14px] border-b transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{
                  color: isActive
                    ? theme === "dark"
                      ? "#FFD600"
                      : "#00DC82"
                    : theme === "dark"
                      ? "#666"
                      : "#999",
                  borderColor: theme === "dark" ? "#141414" : "#E5E5E5",
                }}
              >
                <span
                  className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors"
                  style={{
                    background: isActive
                      ? theme === "dark"
                        ? "#FFD600"
                        : "#00DC82"
                      : theme === "dark"
                        ? "#2D2D2D"
                        : "#D0D0D0",
                  }}
                />
                {label}
              </button>
            );
          })}
          <div className="flex flex-col gap-[10px] pt-5 w-full">
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="font-ibm-mono text-[12px] tracking-[1.5px] w-full"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </Button>
            <WalletLoginButton redirectOnAuth className="font-grotesk text-[11px] font-bold tracking-[1.5px] w-full">
              TRY DEMO
            </WalletLoginButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
