import React from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg";

interface MessagesLoaderProps {
  size?: Size;
  className?: string;
  bubbleClassName?: string;
  streaming?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-3 w-3",
};

const gapMap: Record<Size, string> = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

export const MessagesLoader: React.FC<MessagesLoaderProps> = ({
  size = "md",
  className = "",
  bubbleClassName = "",
  streaming = true,
}) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center p-3 rounded-xl max-w-fit",
        "bg-gray-100 dark:bg-gray-800",
        className
      )}
    >
      <div className={clsx("flex", gapMap[size])}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={clsx(
              "rounded-full bg-gray-500 dark:bg-gray-300",
              sizeMap[size],
              streaming && "animate-bounce",
              bubbleClassName
            )}
            style={{
              animationDelay: streaming ? `${dot * 0.2}s` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};
