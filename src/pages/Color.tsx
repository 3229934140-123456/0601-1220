import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Eye,
  Wand2,
  Droplets,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Slider from "@/components/common/Slider";
import { useProjectStore } from "@/store";
import { COLOR_THEMES } from "@/utils/mockData";
import { cn, hexToRgb } from "@/utils/id";
import type { WorkspaceKey } from "@/types";

export default function Color() {
  const workspaceKey: WorkspaceKey = "color";
  const { themes, activeThemeId, setActiveTheme, orderedPages, currentPage, updatePageBackground } =
    useProjectStore();
  const [selectedThemeId, setSelectedThemeId] = useState(activeThemeId || themes[0]?.id);
  const [saturation, setSaturation] = useState(70);
  const [warmth, setWarmth] = useState(50);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const allThemes = themes.length > 0 ? themes : COLOR_THEMES;

  const checks = [
    {
      id: "c1",
      name: "色调统一性",
      status: "pass" as const,
      score: 92,
      desc: "整体色调和谐统一，暖色系使用一致",
      tip: "建议保持当前的色调搭配",
    },
    {
      id: "c2",
      name: "饱和度平衡",
      status: "warn" as const,
      score: 78,
      desc: "部分页面饱和度略高，可能视觉疲劳",
      tip: "可将饱和度降低 10-15%，视觉会更舒适",
    },
    {
      id: "c3",
      name: "明度层次",
      status: "pass" as const,
      score: 88,
      desc: "前景背景对比良好，文字可读性强",
      tip: "层次丰富，主次分明",
    },
    {
      id: "c4",
      name: "角色色彩识别",
      status: "pass" as const,
      score: 95,
      desc: "各角色主题色区分度足够，辨识度高",
      tip: "保持角色专属色，帮助读者快速识别",
    },
    {
      id: "c5",
      name: "情感氛围匹配",
      status: "pass" as const,
      score: 86,
      desc: "所选配色与故事氛围（温馨童话）匹配",
      tip: "契合当前主题的童话语境",
    },
  ];

  const applyTheme = (themeId: string) => {
    const theme = allThemes.find((t) => t.id === themeId);
    if (!theme) return;
    setActiveTheme(themeId);
    setSelectedThemeId(themeId);
    if (currentPage) updatePageBackground(currentPage.id, theme.background);
    setApplied((prev) => ({ ...prev, [themeId]: true }));
    setTimeout(() => setApplied((prev) => ({ ...prev, [themeId]: false })), 2000);
  };

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex overflow-hidden">
        <div className="w-80 shrink-0 border-r border-cream-200 bg-white/50 backdrop-blur-soft p-5 overflow-auto scrollbar-candy">
          <div className="mb-5">
            <h3 className="font-display text-xl text-cocoa-600 mb-1 flex items-center gap-2">
              <Palette className="w-6 h-6 text-lilac-500" />
              主题配色
            </h3>
            <p className="text-xs text-cocoa-400">点击主题卡片应用到绘本</p>
          </div>

          <div className="space-y-3">
            {allThemes.map((theme, idx) => {
              const active = theme.id === selectedThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-candy border-2 transition-all relative overflow-hidden animate-pop",
                    active
                      ? "border-coral-400 bg-white shadow-candy scale-[1.01]"
                      : "border-cream-200 bg-white/60 hover:border-cream-300",
                  )}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-display text-lg text-cocoa-600">{theme.name}</h4>
                      <span className="chip !py-0 !text-[10px]">{theme.mood}</span>
                      {active && (
                        <span className="ml-auto text-coral-500">
                          <CheckCircle2 size={18} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cocoa-500 mb-3">{theme.description}</p>
                    <div className="flex gap-1.5 mb-3">
                      {theme.palette.map((c, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded-lg shadow-sm border-2 border-white"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ background: theme.primary }}
                          title="主色"
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ background: theme.secondary }}
                          title="次色"
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ background: theme.accent }}
                          title="点缀"
                        />
                      </div>
                      <CandyButton
                        size="sm"
                        variant={active ? "primary" : "soft"}
                        leftIcon={applied[theme.id] ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTheme(theme.id);
                        }}
                      >
                        {applied[theme.id] ? "已应用" : "应用"}
                      </CandyButton>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-candy p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-candy p-6 overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${selectedTheme.primary}44, ${selectedTheme.secondary}44, ${selectedTheme.accent}44)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 className="font-display text-3xl text-cocoa-600 flex items-center gap-2">
                      <Wand2 className="w-7 h-7 text-lemon-500" />
                      当前主题：{selectedTheme.name}
                    </h2>
                    <p className="text-cocoa-500 mt-1">{selectedTheme.description}</p>
                  </div>
                  <CandyButton
                    variant="rainbow"
                    leftIcon={<Sparkles size={16} />}
                    onClick={() => applyTheme(selectedTheme.id)}
                  >
                    一键应用到全绘本
                  </CandyButton>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  {selectedTheme.palette.map((c, idx) => {
                    const { r, g, b } = hexToRgb(c);
                    return (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-candy shadow-candy-sm border-4 border-white animate-pop overflow-hidden"
                        style={{ background: c, animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 flex flex-col items-center justify-center text-white text-[10px] font-bold p-1">
                          <span>{c.toUpperCase()}</span>
                          <span className="opacity-70 mt-0.5">
                            {r},{g},{b}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <Slider
                    label="整体饱和度"
                    value={saturation}
                    showValue
                    unit="%"
                    onChange={setSaturation}
                    accentColor={selectedTheme.primary}
                  />
                  <Slider
                    label="色彩温度（冷暖）"
                    value={warmth}
                    showValue
                    unit="%"
                    onChange={setWarmth}
                    accentColor={selectedTheme.accent}
                  />
                </div>
              </div>
            </div>

            <CandyCard title="📝 画面统一性检查报告" subtitle="基于当前主题对绘本的5项智能分析" gradient="from-lilac-400 via-sky-400 to-mint-400">
              <div className="p-5 pt-0 grid md:grid-cols-2 gap-4">
                {checks.map((c, idx) => (
                  <div
                    key={c.id}
                    className={cn(
                      "p-4 rounded-candy border-2 animate-pop",
                      c.status === "pass"
                        ? "border-mint-300 bg-mint-50/60"
                        : "border-lemon-400 bg-lemon-400/15",
                    )}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          c.status === "pass" ? "bg-mint-500 text-white" : "bg-lemon-500 text-white",
                        )}
                      >
                        {c.status === "pass" ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-display text-lg text-cocoa-600">{c.name}</h5>
                          <span
                            className={cn(
                              "font-bold text-lg",
                              c.status === "pass" ? "text-mint-500" : "text-lemon-500",
                            )}
                          >
                            {c.score}
                          </span>
                        </div>
                        <div className="h-2 bg-white/60 rounded-full mb-2 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              c.status === "pass" ? "bg-gradient-to-r from-mint-400 to-sky-400" : "bg-gradient-to-r from-lemon-400 to-peach-400",
                            )}
                            style={{ width: `${c.score}%` }}
                          />
                        </div>
                        <p className="text-sm text-cocoa-600">{c.desc}</p>
                        <p className="text-xs text-cocoa-500 mt-1 flex items-center gap-1">
                          <Sparkles size={12} className="text-lilac-500" />
                          {c.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-5 p-4 rounded-candy bg-gradient-to-r from-mint-50 via-sky-50 to-lilac-50 border-2 border-dashed border-mint-300 flex items-center gap-4">
                <div className="text-4xl animate-bounce-soft">🌈</div>
                <div className="flex-1">
                  <div className="font-display text-lg text-cocoa-600">综合评分</div>
                  <div className="text-sm text-cocoa-500">色彩整体表现优秀，适合儿童绘本</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-4xl rainbow-text">88</div>
                  <div className="text-xs text-cocoa-400">满分 100</div>
                </div>
              </div>
            </CandyCard>

            <div className="card-candy p-5">
              <h3 className="font-display text-xl text-cocoa-600 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-sky-500" />
                各页面配色预览
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {orderedPages.slice(0, 6).map((p, idx) => (
                  <div key={p.id} className="space-y-2 animate-pop" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div
                      className="aspect-[3/4] rounded-candy-sm shadow-candy-sm flex items-center justify-center text-4xl overflow-hidden relative"
                      style={{ background: p.background.value }}
                    >
                      <div className="absolute inset-0 canvas-bg opacity-20" />
                      <span className="animate-bounce-soft" style={{ animationDelay: `${idx * 200}ms` }}>
                        {["📖", "🐰", "🌳", "🍯", "🎁", "🏡"][idx]}
                      </span>
                      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-cocoa-500">
                        P{p.pageNumber}
                      </div>
                    </div>
                    <div className="text-xs text-cocoa-500 truncate text-center font-medium">
                      {p.sceneDescription || "第 " + p.pageNumber + " 页"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-candy p-5 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-coral-300/20 via-lemon-300/20 to-sky-300/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
                <div className="text-6xl animate-float">💡</div>
                <div className="flex-1">
                  <h4 className="font-display text-xl text-cocoa-600 mb-1">色彩使用小贴士</h4>
                  <ul className="space-y-1.5 text-sm text-cocoa-500 list-disc list-inside">
                    <li>保持主色占比 60%，辅助色 30%，点缀色 10% 的黄金比例</li>
                    <li>情绪激动场景可用高饱和对比色，平静场景优先低饱和</li>
                    <li>每 4-5 页设置一个色彩焦点，避免视觉疲劳</li>
                    <li>
                      <Droplets className="inline w-4 h-4 text-sky-500" /> 建议定期使用配色检查功能发现问题
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
