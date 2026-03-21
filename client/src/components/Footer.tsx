const platformLinks = ["DASHBOARD", "DOCUMENTATION", "API DOCS"];
const companyLinks = ["ABOUT US", "TEAM", "MISSION"];
const communityLinks = ["DISCORD", "TWITTER", "TELEGRAM"];

export default function Footer() {
  return (
    <footer className="flex flex-col w-full bg-gray-100 dark:bg-[#050505] transition-colors duration-300">
      {/* Top */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-[80px] px-6 md:px-[120px] py-12 md:py-[64px]">
        {/* Brand */}
        <div className="flex flex-col gap-6 md:w-[280px] md:shrink-0">
          <div className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] bg-[#00DC82] dark:bg-[#FFD600] shrink-0 transition-colors duration-300" />
            <span className="font-grotesk text-[16px] font-bold text-[#00DC82] dark:text-[#FFD600] tracking-[3px] transition-colors duration-300">
              MICROHEDGER
            </span>
          </div>
          <p className="font-ibm-mono text-[11px] text-gray-700 dark:text-[#888888] tracking-[1px] leading-[1.6] max-w-[260px] transition-colors duration-300">
            AI-POWERED MICRO-HEDGING FOR SMALLHOLDER FARMERS IN AFRICA. PROTECTING INCOME WITH BLOCKCHAIN TECHNOLOGY.
          </p>
          <div className="flex gap-[12px]">
            {[{ label: "X" }, { label: "DC" }, { label: "TG" }].map((s) => (
              <button
                key={s.label}
                className="flex items-center justify-center w-[36px] h-[36px] bg-gray-200 dark:bg-[#111111] border border-gray-400 dark:border-[#2D2D2D] hover:border-gray-600 dark:hover:border-[#888888] transition-colors"
              >
                <span className="font-grotesk text-[10px] font-bold text-gray-600 dark:text-[#AAAAAA] transition-colors duration-300">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-3 md:flex md:flex-1 gap-8 md:gap-[80px]">
          {[
            { heading: "PLATFORM", links: platformLinks },
            { heading: "COMPANY", links: companyLinks },
            { heading: "COMMUNITY", links: communityLinks },
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-4 md:gap-[20px]">
              <span className="font-grotesk text-[11px] font-bold text-black dark:text-[#F5F5F0] tracking-[2px] transition-colors duration-300">
                {col.heading}
              </span>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-ibm-mono text-[12px] text-gray-700 dark:text-[#888888] tracking-[1px] hover:text-gray-900 dark:hover:text-[#CCCCCC] transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-6 md:px-[120px] py-4 md:h-[56px] border-t border-gray-300 dark:border-t-[#1D1D1D] gap-3 sm:gap-0 transition-colors duration-300">
        <span className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#666666] tracking-[1px] transition-colors duration-300">
          © 2025 MICROHEDGER AFRICA. ALL RIGHTS RESERVED.
        </span>
        <div className="flex items-center gap-6 md:gap-[32px]">
          <a href="#" className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#666666] tracking-[1px] hover:text-gray-900 dark:hover:text-[#AAAAAA] transition-colors">
            PRIVACY
          </a>
          <a href="#" className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#666666] tracking-[1px] hover:text-gray-900 dark:hover:text-[#AAAAAA] transition-colors">
            TERMS
          </a>
          <span className="font-ibm-mono text-[11px] font-bold text-[#00DC82] dark:text-[#FFD600] tracking-[1px] transition-colors duration-300">
            V1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
