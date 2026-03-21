"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WalletPopup } from "@/components/WalletPopup";
import {
  LayoutDashboard,
  TrendingUp,
  Plus,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  Settings,
  Wallet,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems: NavItem[] = [
  // { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/markets", label: "Markets", icon: TrendingUp },
  { path: "/dashboard/create-hedge", label: "Create Hedge", icon: Plus },
  { path: "/dashboard/my-hedges", label: "My Hedges", icon: Shield },
  // { path: "/dashboard/transactions", label: "Transactions", icon: Wallet },
  // { path: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
  // { path: "/dashboard/admin", label: "Admin Oracle", icon: ShieldCheck },
];

export function Sidebar({
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            MicroHedge
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  isActive ? "text-accent" : "group-hover:scale-110"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions (Wallet & Collapse) */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <WalletPopup align="start">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary/30 hover:bg-secondary/80 border border-transparent hover:border-border transition-all duration-200 group">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 text-primary" />
            </div>
            {!collapsed && (
              <span className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                Wallet
              </span>
            )}
          </button>
        </WalletPopup>

        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
