import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const usernameVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary",
        muted: "text-muted-foreground hover:text-foreground",
        primary: "text-primary hover:text-primary/80",
        secondary:
          "text-secondary-foreground hover:text-secondary-foreground/80",
        accent:
          "text-muted-foreground-foreground hover:text-muted-foreground-foreground/80",
        destructive: "text-destructive hover:text-destructive/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        xs: "text-xs",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
    },
  },
);

export interface UsernameLinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof usernameVariants> {
  username: string;
  showAtSymbol?: boolean;
  prefix?: string;
  suffix?: string;
  external?: boolean;
  disabled?: boolean;
  turncateUsername?: boolean;
  children?: React.ReactNode;
}

export function UsernameLink({
  username,
  showAtSymbol = true,
  prefix,
  suffix,
  external = false,
  disabled = false,
  variant,
  size,
  weight,
  className,
  children,
  turncateUsername = false,
  ...props
}: UsernameLinkProps) {
  const href = `/profile/${username}`;
  const turncatedUsername =
    username.length > 17 ? `${username.slice(0, 17)}..` : username;

  const content = (
    <>
      {prefix && <span className="opacity-70">{prefix}</span>}
      {showAtSymbol && <span className="opacity-70">@</span>}
      <span>{turncateUsername ? `${turncatedUsername}` : username}</span>
      {suffix && <span className="opacity-70">{suffix}</span>}
      {children}
    </>
  );

  if (disabled) {
    return (
      <span
        className={cn(
          usernameVariants({ variant, size, weight }),
          "cursor-not-allowed opacity-50",
          className,
        )}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(usernameVariants({ variant, size, weight }), className)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cn(usernameVariants({ variant, size, weight }), className)}
      {...props}
    >
      {content}
    </a>
  );
}

// Type-safe username validation utility
export function validateUsername(username: string): boolean {
  // Basic username validation - adjust rules as needed
  const usernameRegex = /^[a-zA-Z0-9_-]{1,30}$/;
  return usernameRegex.test(username);
}

// Type for username with validation
export type ValidatedUsername = string & { __brand: "ValidatedUsername" };

export function createValidatedUsername(
  username: string,
): ValidatedUsername | null {
  if (validateUsername(username)) {
    return username as ValidatedUsername;
  }
  return null;
}
