"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  theme: GradientTheme;
  onClick?: () => void;
  cardClassName?: string;
  imageContainerClassName?: string;
}

export type GradientTheme =
  | "purple-pink"
  | "blue-cyan"
  | "emerald-green"
  | "orange-red"
  | "violet-indigo"
  | "rose-pink"
  | "teal-blue"
  | "amber-yellow"
  | "lime-green"
  | "fuchsia-purple"
  | "sky-blue"
  | "coral-orange";

const gradientThemes = {
  "purple-pink": {
    border: "from-purple-400 via-pink-400 to-purple-400",
    glow: "from-purple-400 to-pink-400",
    background:
      "hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20",
    imageOverlay: "group-hover:from-purple-600/10 group-hover:to-purple-400/5",
    titleColor: "group-hover:text-purple-600",
    descColor: "group-hover:text-purple-500",
    particles: ["bg-purple-400", "bg-pink-400", "bg-purple-300"],
  },
  "blue-cyan": {
    border: "from-blue-400 via-cyan-400 to-blue-400",
    glow: "from-blue-400 to-cyan-400",
    background:
      "hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/20 dark:hover:to-cyan-950/20",
    imageOverlay: "group-hover:from-blue-600/10 group-hover:to-cyan-600/5",
    titleColor: "group-hover:text-blue-600",
    descColor: "group-hover:text-blue-500",
    particles: ["bg-blue-400", "bg-cyan-400", "bg-blue-300"],
  },
  "emerald-green": {
    border: "from-emerald-400 via-green-400 to-emerald-400",
    glow: "from-emerald-400 to-green-400",
    background:
      "hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-950/20 dark:hover:to-green-950/20",
    imageOverlay: "group-hover:from-emerald-600/10 group-hover:to-green-600/5",
    titleColor: "group-hover:text-emerald-600",
    descColor: "group-hover:text-emerald-500",
    particles: ["bg-emerald-400", "bg-green-400", "bg-emerald-300"],
  },
  "orange-red": {
    border: "from-orange-400 via-red-400 to-orange-400",
    glow: "from-orange-400 to-red-400",
    background:
      "hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-950/20 dark:hover:to-red-950/20",
    imageOverlay: "group-hover:from-orange-600/10 group-hover:to-red-600/5",
    titleColor: "group-hover:text-orange-600",
    descColor: "group-hover:text-orange-500",
    particles: ["bg-orange-400", "bg-red-400", "bg-orange-300"],
  },
  "violet-indigo": {
    border: "from-violet-400 via-indigo-400 to-violet-400",
    glow: "from-violet-400 to-indigo-400",
    background:
      "hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/20 dark:hover:to-indigo-950/20",
    imageOverlay: "group-hover:from-violet-600/10 group-hover:to-indigo-600/5",
    titleColor: "group-hover:text-violet-600",
    descColor: "group-hover:text-violet-500",
    particles: ["bg-violet-400", "bg-indigo-400", "bg-violet-300"],
  },
  "rose-pink": {
    border: "from-rose-400 via-pink-400 to-rose-400",
    glow: "from-rose-400 to-pink-400",
    background:
      "hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-950/20 dark:hover:to-pink-950/20",
    imageOverlay: "group-hover:from-rose-600/10 group-hover:to-pink-600/5",
    titleColor: "group-hover:text-rose-600",
    descColor: "group-hover:text-rose-500",
    particles: ["bg-rose-400", "bg-pink-400", "bg-rose-300"],
  },
  "teal-blue": {
    border: "from-teal-400 via-blue-400 to-teal-400",
    glow: "from-teal-400 to-blue-400",
    background:
      "hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-950/20 dark:hover:to-blue-950/20",
    imageOverlay: "group-hover:from-teal-600/10 group-hover:to-blue-600/5",
    titleColor: "group-hover:text-teal-600",
    descColor: "group-hover:text-teal-500",
    particles: ["bg-teal-400", "bg-blue-400", "bg-teal-300"],
  },
  "amber-yellow": {
    border: "from-amber-400 via-yellow-400 to-amber-400",
    glow: "from-amber-400 to-yellow-400",
    background:
      "hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-950/20 dark:hover:to-yellow-950/20",
    imageOverlay: "group-hover:from-amber-600/10 group-hover:to-yellow-600/5",
    titleColor: "group-hover:text-amber-600",
    descColor: "group-hover:text-amber-500",
    particles: ["bg-amber-400", "bg-yellow-400", "bg-amber-300"],
  },
  "lime-green": {
    border: "from-lime-400 via-green-400 to-lime-400",
    glow: "from-lime-400 to-green-400",
    background:
      "hover:from-lime-50 hover:to-green-50 dark:hover:from-lime-950/20 dark:hover:to-green-950/20",
    imageOverlay: "group-hover:from-lime-600/10 group-hover:to-green-600/5",
    titleColor: "group-hover:text-lime-600",
    descColor: "group-hover:text-lime-500",
    particles: ["bg-lime-400", "bg-green-400", "bg-lime-300"],
  },
  "fuchsia-purple": {
    border: "from-fuchsia-400 via-purple-400 to-fuchsia-400",
    glow: "from-fuchsia-400 to-purple-400",
    background:
      "hover:from-fuchsia-50 hover:to-purple-50 dark:hover:from-fuchsia-950/20 dark:hover:to-purple-950/20",
    imageOverlay: "group-hover:from-fuchsia-600/10 group-hover:to-purple-600/5",
    titleColor: "group-hover:text-fuchsia-600",
    descColor: "group-hover:text-fuchsia-500",
    particles: ["bg-fuchsia-400", "bg-purple-400", "bg-fuchsia-300"],
  },
  "sky-blue": {
    border: "from-sky-400 via-blue-400 to-sky-400",
    glow: "from-sky-400 to-blue-400",
    background:
      "hover:from-sky-50 hover:to-blue-50 dark:hover:from-sky-950/20 dark:hover:to-blue-950/20",
    imageOverlay: "group-hover:from-sky-600/10 group-hover:to-blue-600/5",
    titleColor: "group-hover:text-sky-600",
    descColor: "group-hover:text-sky-500",
    particles: ["bg-sky-400", "bg-blue-400", "bg-sky-300"],
  },
  "coral-orange": {
    border: "from-coral-400 via-orange-400 to-coral-400",
    glow: "from-orange-400 to-red-400",
    background:
      "hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-950/20 dark:hover:to-red-950/20",
    imageOverlay: "group-hover:from-orange-600/10 group-hover:to-red-600/5",
    titleColor: "group-hover:text-orange-600",
    descColor: "group-hover:text-orange-500",
    particles: ["bg-orange-400", "bg-red-400", "bg-orange-300"],
  },
} as const;

export default function GradientCard({
  title,
  description,
  imageUrl,
  imageAlt,
  theme,
  onClick,
  cardClassName,
  imageContainerClassName,
}: CardProps) {
  const themeConfig = gradientThemes[theme];

  return (
    <div
      className={cn(
        `hover:bg-red-300 p-3 w-full aspect-square border-2 rounded-3xl flex flex-col justify-center items-center gap-3 cursor-pointer transition-all duration-500 hover:border-transparent hover:bg-gradient-to-br ${themeConfig.background} relative group overflow-hidden ${cardClassName}`
      )}
      onClick={onClick}
    >
      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${themeConfig.border} bg-[length:200%_200%] animate-gradient-x p-[2px]`}
      >
        <div className="w-full h-full rounded-3xl bg-background" />
      </div>

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${themeConfig.glow} blur-xl`}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div
          className={`absolute top-1/4 left-1/4 w-1 h-1 ${themeConfig.particles[0]} rounded-full animate-ping animation-delay-100`}
        />
        <div
          className={`absolute top-3/4 right-1/4 w-1 h-1 ${themeConfig.particles[1]} rounded-full animate-ping animation-delay-300`}
        />
        <div
          className={`absolute bottom-1/4 left-1/3 w-1 h-1 ${themeConfig.particles[2]} rounded-full animate-ping animation-delay-500`}
        />
      </div>

      {/* Pulse indicator for certain themes */}
      {(theme === "emerald-green" || theme === "teal-blue") && (
        <div className="absolute top-4 right-4 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div
            className={`w-full h-full ${themeConfig.particles[0]} rounded-full animate-pulse`}
          />
          <div
            className={`absolute inset-0 ${themeConfig.particles[0]} rounded-full animate-ping`}
          />
        </div>
      )}

      <div
        className={cn(
          `w-full rounded-xl overflow-hidden relative z-10  h-[200px] ${imageContainerClassName}`
        )}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={imageAlt}
          width={300}
          height={200}
          className="size-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent ${themeConfig.imageOverlay} transition-all duration-500`}
        />
      </div>

      <div className="text-center z-10">
        <h2
          className={`text-sm font-bold transition-all duration-300 ${themeConfig.titleColor} group-hover:drop-shadow-sm`}
        >
          {title}
        </h2>
        <p
          className={`text-xs text-muted-foreground transition-all duration-300 ${themeConfig.descColor}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
