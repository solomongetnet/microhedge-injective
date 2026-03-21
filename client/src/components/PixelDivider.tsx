export default function PixelDivider() {
  return (
    <div className="flex w-full">
      <div className="flex-1 h-[4px] bg-[#00DC82] dark:bg-[#FFD600] transition-colors duration-300" />
      <div className="flex-1 h-[4px] bg-gray-200 dark:bg-[#0A0A0A] transition-colors duration-300" />
      <div className="flex-1 h-[4px] bg-[#00DC82] dark:bg-[#FFD600] transition-colors duration-300" />
      <div className="flex-1 h-[4px] bg-gray-200 dark:bg-[#0A0A0A] transition-colors duration-300" />
      <div className="flex-1 h-[4px] bg-[#00DC82] dark:bg-[#FFD600] transition-colors duration-300" />
    </div>
  );
}
