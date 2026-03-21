import SectionHeader from "./SectionHeader";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

function StepCard({
  number,
  title,
  description,
  bgColor = "#0A0A0A",
  borderColor = "#2D2D2D",
  borderWidth = 1,
}: StepCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-8 md:p-[40px] border w-full md:flex-1 md:h-[260px] dark:bg-[#0A0A0A] dark:border-[#2D2D2D] bg-white border-gray-300 transition-colors duration-300"
      style={{ backgroundColor: bgColor === "#0A0A0A" ? undefined : bgColor, borderColor: borderColor === "#2D2D2D" ? undefined : borderColor, borderWidth }}
    >
      <span className="font-grotesk text-[48px] font-bold text-[#00DC82] dark:text-[#FFD600] tracking-[-2px] transition-colors duration-300">
        {number}
      </span>
      <h3 className="font-grotesk text-[20px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] leading-[1.2] whitespace-pre-line transition-colors duration-300">
        {title}
      </h3>
      <p className="font-ibm-mono text-[11px] text-gray-700 dark:text-[#555555] tracking-[1px] leading-[1.5] transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="howitworks" className="flex flex-col w-full bg-gray-50 dark:bg-[#0D0D0D] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px] transition-colors duration-300">
      <SectionHeader
        label="[03] // HOW IT WORKS"
        title={"FOUR SIMPLE STEPS.\nPERMANENT PROTECTION."}
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <StepCard
          number="01"
          title={"CONNECT\nWALLET"}
          description="LINK YOUR METAMASK. VERIFY YOUR IDENTITY ON INEVM TESTNET."
        />
        <StepCard
          number="02"
          title={"SELECT CROP &\nPRICE FLOOR"}
          description="CHOOSE YOUR CROP. SET YOUR MINIMUM PRICE WITH AI SUGGESTIONS."
          bgColor="#111111"
          borderColor="#00DC82"
          borderWidth={2}
        />
        <StepCard
          number="03"
          title={"AI MONITORS\nPRICES"}
          description="OUR ML MODELS TRACK REAL-TIME MARKET DATA 24/7/365."
        />
        <StepCard
          number="04"
          title={"GET PAID\nON TRIGGER"}
          description="PRICE DROPS? YOU GET AUTOMATIC PAYOUT. INCOME PROTECTED."
          borderColor="#FFD600"
          borderWidth={1}
        />
      </div>
    </section>
  );
}
