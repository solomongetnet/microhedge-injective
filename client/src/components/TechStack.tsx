import SectionHeader from "./SectionHeader";

const techItems = [
  { name: "inEVM", category: "BLOCKCHAIN", description: "EVM-compatible testnet" },
  { name: "Solidity", category: "SMART CONTRACTS", description: "Secure hedge logic" },
  { name: "Next.js", category: "FRONTEND", description: "Modern React framework" },
  { name: "Prisma", category: "ORM", description: "Database queries" },
  { name: "PostgreSQL", category: "DATABASE", description: "Secure data storage" },
  { name: "MetaMask", category: "WALLET", description: "User authentication" },
  { name: "ML Models", category: "AI/ML", description: "Price predictions" },
  { name: "shadcn/ui", category: "UI", description: "Component library" },
];

export default function TechStack() {
  return (
    <section id="techstack" className="flex flex-col w-full bg-white dark:bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px] transition-colors duration-300">
      <SectionHeader
        label="[03] // TECH STACK"
        title={"BUILT WITH PROVEN\nTECHNOLOGY."}
        subtitle="ENTERPRISE-GRADE INFRASTRUCTURE // OPEN SOURCE // DECENTRALIZED FIRST."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-[2px] w-full">
        {techItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-6 md:p-8 bg-gray-50 dark:bg-[#111111] border border-gray-300 dark:border-[#2D2D2D] transition-colors duration-300"
          >
            <span className="font-ibm-mono text-[10px] text-[#00DC82] dark:text-[#FFD600] tracking-[2px] font-bold">
              {item.category}
            </span>
            <h3 className="font-grotesk text-[18px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] transition-colors duration-300">
              {item.name}
            </h3>
            <p className="font-ibm-mono text-[11px] text-gray-600 dark:text-[#888888] tracking-[0.5px] transition-colors duration-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-8 md:p-[40px] bg-blue-50 dark:bg-[#111111] border-2 border-blue-200 dark:border-[#FFD600] transition-colors duration-300">
        <h3 className="font-grotesk text-[20px] font-bold text-black dark:text-[#F5F5F0] tracking-[1px] transition-colors duration-300">
          WHAT MAKES US DIFFERENT
        </h3>
        <ul className="font-ibm-mono text-[13px] text-gray-700 dark:text-[#888888] tracking-[0.5px] leading-[1.8] space-y-2 transition-colors duration-300">
          <li>✓ <strong>Farmer-First Design</strong>: Built directly with smallholder farmers' needs in mind</li>
          <li>✓ <strong>Transparent Pricing</strong>: No hidden fees. Smart contracts show exact hedge costs upfront</li>
          <li>✓ <strong>AI-Powered</strong>: Machine learning models analyze 15+ years of crop price data</li>
          <li>✓ <strong>Blockchain Secure</strong>: All transactions immutable and auditable on-chain</li>
          <li>✓ <strong>MetaMask Ready</strong>: Works with any Ethereum wallet your farmers already use</li>
        </ul>
      </div>
    </section>
  );
}
