import { cn } from "@/utils/id";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  label?: string;
  className?: string;
}

const DEFAULT_PRESETS = [
  "#5D4E37", "#FF6B6B", "#FFA775", "#FFE66D", "#7ED47E",
  "#4ECDC4", "#A882D8", "#FFB6C1", "#8B7355", "#FFFFFF",
  "#333333", "#6FE0D8", "#FFEC8A", "#C8A2E0", "#FFC9A8",
  "#E03E3E", "#3DB5AD", "#5CC05C", "#8A64C2", "#FF8A4C",
];

export default function ColorPicker({
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  label,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="text-sm font-medium text-cocoa-500">{label}</div>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-11 h-11 rounded-candy-sm shadow-candy-sm border-2 border-white cursor-pointer"
            style={{ background: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-sm font-mono text-cocoa-500 bg-cream-200 px-3 py-1 rounded-full">
          {value.toUpperCase()}
        </div>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              "w-7 h-7 rounded-lg shadow-sm transition-all hover:scale-110 border-2",
              value.toLowerCase() === color.toLowerCase()
                ? "border-cocoa-500 scale-110 ring-2 ring-offset-1 ring-cocoa-300"
                : "border-white/60",
            )}
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}
