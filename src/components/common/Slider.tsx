import { cn } from "@/utils/id";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  showValue?: boolean;
  unit?: string;
  className?: string;
  accentColor?: string;
}

export default function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue,
  unit = "",
  className,
  accentColor = "#FF6B6B",
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-cocoa-500">{label}</span>
          {showValue && (
            <span className="font-display text-cocoa-600">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-cream-200" />
        <div
          className="absolute h-2 rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute h-5 w-5 rounded-full bg-white shadow-candy border-2 transition-all -translate-x-1/2"
          style={{ left: `${pct}%`, borderColor: accentColor }}
        />
      </div>
    </div>
  );
}
