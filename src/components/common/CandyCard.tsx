import type { ReactNode, CSSProperties, MouseEvent } from "react";
import { cn } from "@/utils/id";

interface CandyCardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  hoverable?: boolean;
  gradient?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function CandyCard({
  children,
  className,
  title,
  subtitle,
  actions,
  hoverable,
  gradient,
  style,
  onClick,
}: CandyCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "card-candy",
        hoverable && "card-candy-hover cursor-pointer",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                {gradient && (
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full shadow-inner",
                      `bg-gradient-to-br ${gradient}`,
                    )}
                  />
                )}
                <h3 className="font-display text-xl text-cocoa-600">{title}</h3>
              </div>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-cocoa-500/70">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!(title || actions) && "p-5")}>{children}</div>
    </div>
  );
}
