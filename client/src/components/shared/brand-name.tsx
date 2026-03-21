import React from "react";
import clsx from "clsx";

type BrandSize = "sm" | "md" | "lg" | "xl";

interface BrandNameProps {
  size?: BrandSize;
  className?: string;
}

const sizeMap: Record<BrandSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export const BrandName: React.FC<BrandNameProps> = ({
  size = "lg",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        sizeMap[size],
        "font-semibold tracking-normal text-lg md:text-",
        className
      )}
    >
      Chara
      <span className="text-green-600">p</span>
      <span className="text-yellow-600">i</span>
      <span className="text-red-500">a</span>
      <span>.ai</span>
    </div>
  );
};
