import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/id";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "rainbow"
  | "soft";
type Size = "sm" | "md" | "lg" | "xl";

interface CandyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-coral-500 text-white hover:bg-coral-400",
  secondary: "bg-sky-500 text-white hover:bg-sky-400",
  ghost: "bg-transparent text-cocoa-600 hover:bg-cream-200",
  danger: "bg-red-500 text-white hover:bg-red-400",
  rainbow:
    "bg-rainbow bg-[length:200%_auto] animate-rainbow text-white font-bold",
  soft: "bg-cream-200 text-cocoa-600 hover:bg-cream-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-candy-sm",
  md: "px-5 py-2.5 text-base rounded-candy-sm",
  lg: "px-7 py-3 text-lg rounded-candy",
  xl: "px-9 py-4 text-xl rounded-candy-lg",
};

export default function CandyButton({
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  loading,
  children,
  disabled,
  ...rest
}: CandyButtonProps) {
  return (
    <button
      className={cn(
        "btn-candy-sm inline-flex items-center justify-center gap-2 font-display",
        "transition-all duration-150 active:translate-y-0.5 active:shadow-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  );
}
