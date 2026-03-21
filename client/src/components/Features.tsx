import SectionHeader from "./SectionHeader";

interface FeatureCardProps {
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  bgColor?: string;
  borderColor?: string;
}

function FeatureCard({
  iconColor,
  title,
  description,
  tag,
  tagColor,
  bgColor = "#111111",
  borderColor = "#2D2D2D",
}: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-5 p-8 md:p-[32px] border w-full md:flex-1 md:h-[320px] dark:bg-[#111111] dark:border-[#2D2D2D] bg-white border-gray-300 transition-colors duration-300"
      style={{ backgroundColor: bgColor === "#111111" ? undefined : bgColor, borderColor: borderColor === "#2D2D2D" ? undefined : borderColor }}
    >
      <div className="w-[40px] h-[40px] shrink-0" style={{ backgroundColor: iconColor }} />
      <h3 className="font-grotesk text-[18px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line transition-colors duration-300">
        {title}
      </h3>
      <p className="font-ibm-mono text-[12px] text-gray-700 dark:text-[#666666] tracking-[1px] leading-[1.6] transition-colors duration-300">
        {description}
      </p>
      <div
        className="flex items-center justify-center h-[28px] px-[12px] bg-gray-100 dark:bg-[#1A1A1A] border w-fit transition-colors duration-300"
        style={{ borderColor: tagColor }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color: tagColor }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="flex flex-col w-full bg-gray-50 dark:bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px] transition-colors duration-300"
    >
      <SectionHeader
        label="[01] // FEATURES"
        title={"PROTECT YOUR INCOME.\nEARN WITH CONFIDENCE."}
        subtitle="AI-GUIDED HEDGING // TRANSPARENT PRICING // FARMER-FIRST DESIGN."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <FeatureCard
          iconColor="#00DC82"
          title={"AI PRICE\nPREDICTIONS"}
          description="OUR MACHINE LEARNING MODELS ANALYZE CROP PRICES ACROSS AFRICA TO RECOMMEND OPTIMAL HEDGE STRATEGIES IN REAL-TIME."
          tag="AI"
          tagColor="#00DC82"
          borderColor="#00DC82"
        />
        <FeatureCard
          iconColor="#00D9FF"
          title={"BLOCKCHAIN\nSECURE"}
          description="BUILT ON INEVM TESTNET. YOUR CONTRACTS ARE IMMUTABLE, TRANSPARENT, AND TAMPER-PROOF. FULL CONTROL OF YOUR DATA."
          tag="WEB3"
          tagColor="#00D9FF"
          bgColor="rgba(0,217,255,0.05)"
          borderColor="#00D9FF"
        />
        <FeatureCard
          iconColor="#FFD600"
          title={"INSTANT\nPAYOUTS"}
          description="WHEN PRICES DROP, YOUR HEDGE TRIGGERS AUTOMATICALLY. FUNDS FLOW DIRECTLY TO YOUR WALLET WITH ZERO INTERMEDIARIES."
          tag="FAST"
          tagColor="#FFD600"
          borderColor="#FFD600"
        />
      </div>
    </section>
  );
}
