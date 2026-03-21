import SectionHeader from "./SectionHeader";
import { Zap, TrendingUp, Layers, ShieldCheck } from "lucide-react";

interface InjectiveBenefitProps {
  icon: any;
  title: string;
  description: string;
  tag: string;
  color: string;
}

function InjectiveBenefit({ icon: Icon, title, description, tag, color }: InjectiveBenefitProps) {
  return (
    <div className="flex flex-col gap-5 p-8 border w-full md:flex-1 dark:bg-[#111111] dark:border-[#2D2D2D] bg-white border-gray-300 transition-all duration-300 hover:border-[#00DC82] dark:hover:border-[#FFD600] group">
      <div className="w-[48px] h-[48px] border border-gray-200 dark:border-[#2D2D2D] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#00DC82] dark:group-hover:bg-[#FFD600]">
        <Icon className="w-6 h-6 text-[#00DC82] dark:text-[#FFD600] group-hover:text-white dark:group-hover:text-black" />
      </div>
      <h3 className="font-grotesk text-[18px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] leading-[1.2] uppercase transition-colors duration-300">
        {title}
      </h3>
      <p className="font-ibm-mono text-[12px] text-gray-700 dark:text-[#666666] tracking-[1px] leading-[1.6] transition-colors duration-300 uppercase">
        {description}
      </p>
      <div
        className="flex items-center justify-center h-[28px] px-[12px] bg-gray-100 dark:bg-[#1A1A1A] border w-fit transition-colors duration-300"
        style={{ borderColor: color }}
      >
        <span className="font-ibm-mono text-[11px] tracking-[2px]" style={{ color }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

export default function WhyInjective() {
  return (
    <section
      id="why-injective"
      className="flex flex-col w-full bg-white dark:bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px] transition-colors duration-300"
    >
      <SectionHeader
        label="[02] // INFRASTRUCTURE"
        title={"POWERED BY INJECTIVE.\nBUILT FOR FINANCE."}
        subtitle="LIGHTNING FAST // LOWEST FEES // FULLY ON-CHAIN."
      />

      <div className="flex flex-col md:flex-row w-full gap-[2px]">
        <InjectiveBenefit
          icon={Zap}
          title="LIGHTNING SPEED"
          description="SUB-SECOND BLOCK TIMES ENSURE INSTANT EXECUTION OF YOUR HEDGING CONTRACTS WHEN MARKET CONDITIONS SHIFT."
          tag="PERFORMANCE"
          color="#00DC82"
        />
        <InjectiveBenefit
          icon={TrendingUp}
          title="LOWEST FEES"
          description="NEAR-ZERO TRANSACTION COSTS ENABLE MICRO-HEDGING STRATEGIES THAT ARE ECONOMICALLY VIABLE FOR EVERY FARMER."
          tag="ECONOMY"
          color="#00D9FF"
        />
        <InjectiveBenefit
          icon={Layers}
          title="DEFI NATIVE"
          description="BUILT-IN SHARED LIQUIDITY AND ON-CHAIN ORDERBOOK INFRASTRUCTURE DESIGNED SPECIFICALLY FOR INSTITUTIONAL FINANCE."
          tag="INFRA"
          color="#FFD600"
        />
        <InjectiveBenefit
          icon={ShieldCheck}
          title="MAX SECURITY"
          description="ENTERPRISE-GRADE SECURITY BACKED BY A GLOBALLY DISTRIBUTED NETWORK OF VALIDATORS AND INSTITUTIONAL SUPPORT."
          tag="TRUST"
          color="#FF3D00"
        />
      </div>
    </section>
  );
}
