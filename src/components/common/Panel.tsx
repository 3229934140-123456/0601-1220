import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/id";

interface PanelProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
  width?: string;
  className?: string;
}

export default function Panel({
  open,
  onClose,
  title,
  children,
  side = "right",
  width = "w-80",
  className,
}: PanelProps) {
  const sideClasses = {
    left: "left-0 h-full border-r",
    right: "right-0 h-full border-l",
    bottom: "left-0 w-full bottom-0 border-t",
  }[side];

  const transformClosed = {
    left: "-translate-x-full",
    right: "translate-x-full",
    bottom: "translate-y-full",
  }[side];

  const widthCls = side === "bottom" ? "" : width;

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-30 bg-cocoa-700/10 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "absolute z-40 bg-cream-50/95 backdrop-blur-soft shadow-candy-lg",
          "transition-transform duration-300 ease-out",
          "border-cream-200 rounded-candy-lg m-3",
          sideClasses,
          widthCls,
          open ? "translate-x-0 translate-y-0" : transformClosed,
          !open && "pointer-events-none",
          className,
        )}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-cream-200">
            <div className="font-display text-lg text-cocoa-600">{title}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-cream-200 transition-colors text-cocoa-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="p-4 overflow-auto h-[calc(100%-60px)] scrollbar-candy">
          {children}
        </div>
      </div>
    </>
  );
}
