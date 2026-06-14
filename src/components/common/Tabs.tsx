import { cn } from "@/utils/id";
import type { ReactNode } from "react";

interface Tab {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  variant?: "default" | "pill" | "underline";
  className?: string;
  size?: "sm" | "md";
}

export default function Tabs({
  tabs,
  value,
  onChange,
  variant = "pill",
  className,
  size = "md",
}: TabsProps) {
  const sizeCls = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base";

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex p-1 bg-cream-200 rounded-candy gap-1",
          className,
        )}
      >
        {tabs.map((tab) => {
          const active = tab.key === value;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-candy-sm font-display transition-all",
                sizeCls,
                active
                  ? "bg-white text-cocoa-600 shadow-candy-sm"
                  : "text-cocoa-500/70 hover:text-cocoa-600",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={cn("flex gap-6 border-b border-cream-200", className)}>
        {tabs.map((tab) => {
          const active = tab.key === value;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative py-3 inline-flex items-center gap-1.5 font-display transition-colors -mb-px",
                active ? "text-coral-500" : "text-cocoa-500/60 hover:text-cocoa-600",
              )}
            >
              {tab.icon}
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coral-400 via-lemon-400 to-sky-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-candy-sm font-display border-2 transition-all",
              active
                ? "border-coral-400 bg-coral-500 text-white shadow-candy-sm"
                : "border-cream-300 bg-white text-cocoa-500 hover:border-coral-300",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
