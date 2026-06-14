import { useState } from "react";
import {
  Book,
  BookOpen,
  Maximize2,
  Grid3x3,
  Download,
  Wand2,
  Sparkles,
  Type,
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoveRight,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Tabs from "@/components/common/Tabs";
import Slider from "@/components/common/Slider";
import ColorPicker from "@/components/common/ColorPicker";
import { useProjectStore } from "@/store";
import { COLOR_THEMES } from "@/utils/mockData";
import { cn } from "@/utils/id";
import type { WorkspaceKey } from "@/types";

type ViewTab = "cover" | "spread" | "thumbnails";

export default function Composite() {
  const workspaceKey: WorkspaceKey = "composite";
  const {
    currentProject,
    orderedPages,
    currentPage,
    setCurrentPage,
    updateProjectTitle,
    updateProjectAuthor,
  } = useProjectStore();
  const [viewTab, setViewTab] = useState<ViewTab>("cover");
  const [bookTitle, setBookTitle] = useState(currentProject?.title ?? "");
  const [author, setAuthor] = useState(currentProject?.author ?? "");
  const [coverColor, setCoverColor] = useState(COLOR_THEMES[0].palette[2]);
  const [previewSpread, setPreviewSpread] = useState(0);
  const [show3D, setShow3D] = useState(true);
  const [flipAngle, setFlipAngle] = useState(0);

  const currentTheme = COLOR_THEMES[0];
  const totalSpreads = Math.max(1, Math.floor(orderedPages.length / 2));
  const pageEmojis = ["📖", "🐰", "🌳", "🍯", "🎁", "🏡", "🌈", "⭐"];

  const saveProject = () => {
    updateProjectTitle(bookTitle);
    updateProjectAuthor(author);
  };

  const renderSpread = (pageIdx: number) => {
    const left = orderedPages[pageIdx];
    const right = orderedPages[pageIdx + 1];
    return (
      <div className="flex items-stretch gap-0 shadow-candy-lg rounded-candy-lg overflow-hidden h-[360px]">
        <div
          className="w-[280px] flex items-center justify-center relative border-r-4 border-cocoa-500/10"
          style={{ background: left?.background.value || "#FFFAF0" }}
        >
          <div className="absolute inset-0 canvas-bg opacity-30" />
          <div className="text-6xl animate-bounce-soft">
            {pageEmojis[pageIdx % pageEmojis.length]}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-cocoa-400 bg-white/60 backdrop-blur px-2 py-0.5 rounded-full">
            P{left?.pageNumber}
          </div>
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold text-cocoa-500">
            L
          </div>
        </div>
        <div className="w-1 shrink-0 bg-gradient-to-b from-cream-200 via-cocoa-500/30 to-cream-200" />
        <div
          className="w-[280px] flex items-center justify-center relative"
          style={{ background: right?.background.value || "#FFFAF0" }}
        >
          <div className="absolute inset-0 canvas-bg opacity-30" />
          <div className="text-6xl animate-bounce-soft" style={{ animationDelay: "200ms" }}>
            {pageEmojis[(pageIdx + 1) % pageEmojis.length]}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-cocoa-400 bg-white/60 backdrop-blur px-2 py-0.5 rounded-full">
            P{right?.pageNumber}
          </div>
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold text-cocoa-500">
            R
          </div>
        </div>
      </div>
    );
  };

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex flex-col">
        <div className="px-6 py-3 border-b border-cream-200 bg-white/50 backdrop-blur-soft flex items-center justify-between">
          <Tabs
            tabs={[
              { key: "cover", label: "封面设计", icon: <Book size={16} /> },
              { key: "spread", label: "跨页排版", icon: <BookOpen size={16} /> },
              { key: "thumbnails", label: "缩略图", icon: <Grid3x3 size={16} /> },
            ]}
            value={viewTab}
            onChange={(k) => setViewTab(k as ViewTab)}
          />
          <div className="flex items-center gap-2">
            <CandyButton
              size="sm"
              variant="soft"
              leftIcon={<Maximize2 size={14} />}
              onClick={() => setShow3D(!show3D)}
            >
              {show3D ? "2D 预览" : "3D 预览"}
            </CandyButton>
            <CandyButton
              size="sm"
              variant="primary"
              leftIcon={<Download size={14} />}
            >
              生成输出
            </CandyButton>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 shrink-0 border-r border-cream-200 bg-white/50 backdrop-blur-soft p-5 overflow-auto scrollbar-candy space-y-6">
            {viewTab === "cover" && (
              <>
                <div>
                  <h4 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                    <Book className="w-5 h-5 text-coral-500" />
                    封面信息
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-cocoa-500 block mb-1.5 flex items-center gap-1">
                        <Type size={14} /> 书名
                      </label>
                      <input
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        onBlur={saveProject}
                        className="w-full px-4 py-3 rounded-candy-sm border-2 border-cream-300 focus:border-coral-400 outline-none bg-cream-50 font-display text-xl text-cocoa-600"
                        placeholder="输入绘本书名"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-cocoa-500 block mb-1.5 flex items-center gap-1">
                        <User size={14} /> 作者 / 创作团队
                      </label>
                      <input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        onBlur={saveProject}
                        className="w-full px-4 py-3 rounded-candy-sm border-2 border-cream-300 focus:border-sky-400 outline-none bg-cream-50 text-base text-cocoa-600"
                        placeholder="输入作者名"
                      />
                    </div>
                    <ColorPicker
                      label="封面底色"
                      value={coverColor}
                      onChange={setCoverColor}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-cream-200">
                  <h4 className="font-display text-base text-cocoa-600 mb-3 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-lemon-500" />
                    版式模板
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["经典居中", "对角斜置", "底部横排", "顶部主图"].map((t, i) => (
                      <button
                        key={t}
                        className={cn(
                          "p-3 rounded-candy-sm border-2 transition-all",
                          i === 0
                            ? "border-coral-400 bg-coral-50"
                            : "border-cream-200 bg-white hover:border-cream-300",
                        )}
                      >
                        <div className="aspect-[3/4] bg-cream-100 rounded-lg border border-cream-200 mb-2 overflow-hidden flex flex-col p-2 gap-1">
                          {i === 0 && (
                            <>
                              <div className="flex-1 flex items-center justify-center text-2xl">🌈</div>
                              <div className="h-4 bg-cocoa-500/20 rounded-full" />
                              <div className="h-3 w-2/3 mx-auto bg-cocoa-500/15 rounded-full" />
                            </>
                          )}
                          {i === 1 && (
                            <>
                              <div className="flex-1 flex items-end justify-end text-2xl pb-4">🌸</div>
                              <div className="h-4 w-3/4 bg-cocoa-500/20 rounded-full -rotate-12 origin-left" />
                            </>
                          )}
                          {i === 2 && (
                            <>
                              <div className="flex-1 flex items-center justify-center text-3xl">🧸</div>
                              <div className="space-y-1 pb-1">
                                <div className="h-4 bg-cocoa-500/20 rounded-full" />
                                <div className="h-3 w-1/2 bg-cocoa-500/15 rounded-full" />
                              </div>
                            </>
                          )}
                          {i === 3 && (
                            <>
                              <div className="h-14 bg-gradient-to-br from-coral-300 to-lemon-300 rounded-md flex items-center justify-center text-xl">🎨</div>
                              <div className="flex-1 space-y-1 pt-2">
                                <div className="h-3 bg-cocoa-500/20 rounded-full" />
                                <div className="h-3 w-4/5 bg-cocoa-500/15 rounded-full" />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-xs font-display text-cocoa-500">{t}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {viewTab === "spread" && (
              <>
                <div>
                  <h4 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-500" />
                    跨页设置
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-cocoa-500 block mb-1.5">
                        当前跨页：第 {previewSpread + 1} / {totalSpreads} 组
                      </label>
                      <div className="flex items-center gap-2">
                        <CandyButton
                          size="sm"
                          variant="soft"
                          onClick={() => setPreviewSpread(Math.max(0, previewSpread - 1))}
                          disabled={previewSpread === 0}
                          leftIcon={<ChevronLeft size={14} />}
                        />
                        <div className="flex-1 h-2 bg-cream-200 rounded-full relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-coral-400 to-sky-400 rounded-full transition-all"
                            style={{
                              width: `${((previewSpread + 1) / totalSpreads) * 100}%`,
                            }}
                          />
                        </div>
                        <CandyButton
                          size="sm"
                          variant="soft"
                          onClick={() => setPreviewSpread(Math.min(totalSpreads - 1, previewSpread + 1))}
                          disabled={previewSpread >= totalSpreads - 1}
                          leftIcon={<ChevronRight size={14} />}
                        />
                      </div>
                    </div>
                    <Slider label="中缝宽度" value={4} min={0} max={12} showValue unit="px" onChange={() => {}} accentColor="#4ECDC4" />
                    <Slider label="装订阴影" value={60} showValue unit="%" onChange={() => {}} accentColor="#A882D8" />
                  </div>
                </div>
              </>
            )}

            {viewTab === "thumbnails" && (
              <>
                <div>
                  <h4 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5 text-lilac-500" />
                    缩略图选项
                  </h4>
                  <div className="space-y-4">
                    <Slider label="网格列数" value={3} min={2} max={6} showValue onChange={() => {}} accentColor="#FF6B6B" />
                    <Slider label="缩略图尺寸" value={120} min={80} max={200} showValue unit="px" onChange={() => {}} accentColor="#FFE66D" />
                    <div>
                      <label className="text-sm font-medium text-cocoa-500 block mb-2">显示选项</label>
                      <div className="space-y-2">
                        {[
                          { k: "页码", checked: true },
                          { k: "场景描述", checked: true },
                          { k: "元素数量", checked: false },
                          { k: "边框装饰", checked: true },
                        ].map((o, i) => (
                          <label
                            key={o.k}
                            className="flex items-center gap-2 p-2 rounded-lg bg-cream-100/60 cursor-pointer hover:bg-cream-200"
                          >
                            <div
                              className={cn(
                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                o.checked
                                  ? "bg-coral-500 border-coral-500 text-white"
                                  : "bg-white border-cream-300",
                              )}
                            >
                              {o.checked && <span>✓</span>}
                            </div>
                            <span className="text-sm text-cocoa-600">{o.k}</span>
                            {void i}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-auto scrollbar-candy p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl">
              {viewTab === "cover" && (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-end gap-10">
                    {show3D ? (
                      <div
                        className="relative transition-transform duration-500"
                        style={{ transform: `perspective(1200px) rotateY(${flipAngle}deg) rotateX(4deg)` }}
                      >
                        <div
                          className="w-[320px] h-[440px] rounded-r-candy rounded-l-sm shadow-candy-lg overflow-hidden relative"
                          style={{ background: coverColor }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.08), transparent 50%)`,
                            }}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <div className="text-7xl mb-6 animate-bounce-soft">🌈</div>
                            <h1
                              className="font-display text-4xl mb-4 leading-tight"
                              style={{
                                fontFamily: "'ZCOOL KuaiLe', cursive",
                                color: "#5D4E37",
                              }}
                            >
                              {bookTitle || "我的第一本绘本"}
                            </h1>
                            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-cocoa-500/30 to-transparent mb-4" />
                            <div className="text-lg text-cocoa-500 font-medium">
                              ✍️ {author || "亲子创作组"}
                            </div>
                          </div>
                          <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
                          <div className="absolute bottom-3 right-3 text-xs text-cocoa-500/50 font-bold">
                            彩虹绘本工坊
                          </div>
                        </div>
                        <div
                          className="absolute -right-3 top-0 bottom-0 w-4 rounded-r-sm"
                          style={{
                            background: `linear-gradient(to right, ${coverColor}cc, ${coverColor})`,
                            boxShadow: "inset 4px 0 6px rgba(0,0,0,0.08)",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-[380px] h-[520px] rounded-candy-lg shadow-candy-lg overflow-hidden relative flex flex-col items-center justify-center p-10 text-center"
                        style={{ background: coverColor }}
                      >
                        <div className="text-8xl mb-8 animate-bounce-soft">🌈</div>
                        <h1
                          className="font-display text-5xl mb-6"
                          style={{ fontFamily: "'ZCOOL KuaiLe', cursive", color: "#5D4E37" }}
                        >
                          {bookTitle || "我的第一本绘本"}
                        </h1>
                        <div className="w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-cocoa-500/40 to-transparent mb-6" />
                        <div className="text-xl text-cocoa-500">✍️ {author || "亲子创作组"}</div>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-3">
                      <span className="font-display text-cocoa-400">封底</span>
                      <div
                        className="w-[160px] h-[220px] rounded-l-candy rounded-r-sm shadow-soft overflow-hidden relative opacity-80 -skew-y-2"
                        style={{
                          background: currentTheme.palette[5],
                          boxShadow: "-4px 0 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                          <div className="text-4xl animate-float-slow">📚</div>
                          <div className="text-sm text-cocoa-500 font-display">THE END</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Slider
                      label="翻转角度"
                      value={flipAngle}
                      min={-30}
                      max={30}
                      showValue
                      unit="°"
                      onChange={setFlipAngle}
                      className="w-64"
                    />
                    <CandyButton
                      size="sm"
                      variant="secondary"
                      leftIcon={<Eye size={14} />}
                      onClick={() => setShow3D(!show3D)}
                    >
                      {show3D ? "切换 2D" : "切换 3D"}
                    </CandyButton>
                  </div>
                </div>
              )}

              {viewTab === "spread" && (
                <div className="flex flex-col items-center gap-6">
                  <h3 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
                    <MoveRight className="w-5 h-5 text-sky-500" />
                    跨页预览 · 第 {previewSpread + 1} 组
                  </h3>

                  {show3D ? (
                    <div
                      className="relative transition-transform"
                      style={{ transform: "perspective(1800px) rotateX(6deg)" }}
                    >
                      <div
                        className="flex"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className="rounded-l-candy overflow-hidden"
                          style={{
                            transform: "rotateY(20deg)",
                            transformOrigin: "right center",
                          }}
                        >
                          {renderSpread(previewSpread * 2)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    renderSpread(previewSpread * 2)
                  )}

                  <div className="flex gap-2">
                    {Array.from({ length: totalSpreads }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewSpread(i)}
                        className={cn(
                          "w-10 h-10 rounded-candy-sm font-display transition-all",
                          i === previewSpread
                            ? "bg-coral-500 text-white shadow-candy-sm scale-110"
                            : "bg-white text-cocoa-500 hover:bg-cream-200",
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {viewTab === "thumbnails" && (
                <div>
                  <h3 className="font-display text-2xl text-cocoa-600 mb-5 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-lemon-500" />
                    全绘本缩略图总览
                    <span className="ml-auto text-sm text-cocoa-400 font-normal">
                      共 {orderedPages.length} 页
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 gap-5">
                    {orderedPages.map((p, idx) => (
                      <CandyCard
                        key={p.id}
                        className={cn(
                          "p-0 overflow-hidden animate-pop cursor-pointer transition-all hover:scale-105",
                          p.id === currentPage?.id && "ring-4 ring-coral-400/60",
                        )}
                        onClick={() => setCurrentPage(p.id)}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div
                          className="aspect-[3/4] relative flex items-center justify-center"
                          style={{ background: p.background.value }}
                        >
                          <div className="absolute inset-0 canvas-bg opacity-25" />
                          <div className="text-5xl animate-bounce-soft" style={{ animationDelay: `${idx * 100}ms` }}>
                            {pageEmojis[idx % pageEmojis.length]}
                          </div>
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-cocoa-600 shadow-sm">
                              P{p.pageNumber}
                            </span>
                            {idx === 0 && (
                              <span className="bg-lemon-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                封面
                              </span>
                            )}
                          </div>
                          <button className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg text-cocoa-500 hover:text-sky-500 opacity-0 group-hover:opacity-100">
                            <Eye size={14} />
                          </button>
                        </div>
                        <div className="p-3 border-t border-cream-100">
                          <div className="text-sm font-display text-cocoa-600 truncate">
                            {p.sceneDescription || `第 ${p.pageNumber} 页`}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-cocoa-400">
                            <span>💬 {p.textBubbles.length}</span>
                            <span>🧸 {p.stickers.length}</span>
                            <span>✏️ {p.strokes.length}</span>
                          </div>
                        </div>
                      </CandyCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
