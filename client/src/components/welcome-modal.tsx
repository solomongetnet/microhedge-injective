"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Star, Sparkles, Gift, X, Zap } from "lucide-react";

const STORAGE_KEY = "credix_welcome_shown";

export function WelcomeModal() {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    if (!address) return;

    // Key is per wallet address so each account only sees it once
    const storageKey = `${STORAGE_KEY}_${address.toLowerCase()}`;
    const alreadyShown = localStorage.getItem(storageKey);

    if (!alreadyShown) {
      // Small delay so the dashboard loads first
      const timer = setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => setAnimatePoints(true), 400);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [address]);

  const handleClose = () => {
    if (address) {
      const storageKey = `${STORAGE_KEY}_${address.toLowerCase()}`;
      localStorage.setItem(storageKey, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.3s ease-out" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl"
          style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/* Glowing gradient border wrapper */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #7c3aed, #4f46e5, #0ea5e9, #7c3aed)",
              backgroundSize: "300% 300%",
              animation: "gradientShift 4s ease infinite",
              padding: "2px",
              borderRadius: "1rem",
            }}
          >
            <div className="relative rounded-2xl bg-[#0d0d1a] overflow-hidden">
              {/* Decorative background blobs */}
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "-40px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 text-white/40 hover:text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative p-8 text-center">
                {/* Animated icon */}
                <div
                  className="mx-auto mb-6 relative"
                  style={{ width: "80px", height: "80px" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Gift className="w-9 h-9 text-white" />
                  </div>

                  {/* Orbiting sparkles */}
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "12px",
                        height: "12px",
                        marginTop: "-6px",
                        marginLeft: "-6px",
                        animation: `orbit 3s linear ${i * 1}s infinite`,
                        transformOrigin: "50px 0px",
                      }}
                    >
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                  ))}
                </div>

                {/* Welcome text */}
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
                    Welcome to CrediX
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-3">
                  You're all set! 🎉
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  Based on your verified freelance account,
                  <br />
                  we've gifted you a{" "}
                  <span className="text-white font-medium">
                    starting credit boost
                  </span>
                  .
                </p>

                {/* Points display */}
                <div
                  className="relative mx-auto mb-8 rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))",
                    border: "1px solid rgba(124,58,237,0.4)",
                    padding: "24px",
                  }}
                >
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                    Credit Points Received
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="w-7 h-7 text-yellow-400" />
                    <span
                      style={{
                        fontSize: "64px",
                        fontWeight: 900,
                        lineHeight: 1,
                        background:
                          "linear-gradient(135deg, #facc15, #f97316, #ec4899)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        opacity: animatePoints ? 1 : 0,
                        transform: animatePoints
                          ? "scale(1)"
                          : "scale(0.5)",
                      }}
                    >
                      50
                    </span>
                    <Zap className="w-7 h-7 text-yellow-400" />
                  </div>
                  <p
                    style={{
                      color: "#a78bfa",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginTop: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    CrediX Points
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleClose}
                  className="w-full rounded-xl py-3 px-6 font-bold text-white text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 0 24px rgba(124,58,237,0.5)",
                  }}
                >
                  Start Building Credit ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(48px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(48px) rotate(-360deg); }
        }
      `}</style>
    </>
  );
}
