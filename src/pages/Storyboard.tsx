import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Link2,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Panel from "@/components/common/Panel";
import ColorPicker from "@/components/common/ColorPicker";
import { useProjectStore, useUIStore } from "@/store";
import { cn } from "@/utils/id";
import { MOCK_CHARACTERS } from "@/utils/mockData";
import type { WorkspaceKey } from "@/types";

export default function Storyboard() {
  const workspaceKey: WorkspaceKey = "storyboard";
  const {
    orderedPages,
    currentPage,
    setCurrentPage,
    addPage,
    removePage,
    updatePageBackground,
    updatePageDescription,
    stickerAssets,
    characters,
  } = useProjectStore();
  const { toggleProjectsPanel, showProjectsPanel } = useUIStore();
  const [showBgPanel, setShowBgPanel] = useState(false);

  const allCharacters = characters.length > 0 ? characters : MOCK_CHARACTERS;

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto scrollbar-candy p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-coral-500" />
                  故事板 · 全景视图
                </h2>
                <div className="flex items-center gap-2">
                  <CandyButton
                    size="sm"
                    variant="soft"
                    onClick={toggleProjectsPanel}
                  >
                    项目列表
                  </CandyButton>
                  <CandyButton
                    size="sm"
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={() => addPage(currentPage?.id)}
                  >
                    新增页码
                  </CandyButton>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {orderedPages.map((page, idx) => {
                  const active = page.id === currentPage?.id;
                  return (
                    <CandyCard
                      key={page.id}
                      hoverable
                      className={cn(
                        "animate-pop overflow-hidden cursor-pointer group",
                        active && "ring-4 ring-coral-400/60",
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <div
                        onClick={() => setCurrentPage(page.id)}
                        className="p-5 -m-5 mb-4 cursor-pointer"
                        style={{ background: page.background.value }}
                      >
                        <div className="h-36 relative flex items-center justify-center rounded-t-candy-lg overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-cocoa-600 shadow-candy-sm">
                              P{page.pageNumber}
                            </span>
                            {idx === 0 && (
                              <span className="bg-lemon-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-candy-sm">
                                封面
                              </span>
                            )}
                            {idx === orderedPages.length - 1 && idx > 0 && (
                              <span className="bg-sky-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-candy-sm">
                                封底
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-1 p-4 z-10">
                            {page.stickers.slice(0, 6).map((st) => {
                              const asset = stickerAssets.find((a) => a.id === st.assetId);
                              return asset ? (
                                <span
                                  key={st.id}
                                  className="animate-bounce-soft"
                                  style={{
                                    fontSize: `${20 * st.scale}px`,
                                    animationDelay: `${Math.random() * 1000}ms`,
                                  }}
                                >
                                  {asset.emoji}
                                </span>
                              ) : null;
                            })}
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentPage(page.id);
                                setShowBgPanel(true);
                              }}
                              className="p-1.5 bg-white/90 rounded-lg shadow-candy-sm hover:bg-lemon-400 text-cocoa-500 hover:text-white transition-colors"
                              title="设置背景"
                            >
                              <ImageIcon size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (orderedPages.length > 1) removePage(page.id);
                              }}
                              className="p-1.5 bg-white/90 rounded-lg shadow-candy-sm hover:bg-red-500 text-cocoa-500 hover:text-white transition-colors"
                              title="删除页"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="absolute bottom-3 left-3 opacity-50">
                            <GripVertical size={18} className="text-cocoa-500" />
                          </div>
                        </div>
                      </div>

                      <h3 className="font-display text-base text-cocoa-600 mb-1">
                        第{page.pageNumber}页
                      </h3>
                      <textarea
                        value={page.sceneDescription}
                        onChange={(e) => updatePageDescription(page.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="描述这一页的场景..."
                        className="w-full resize-none h-20 px-3 py-2 rounded-candy-sm bg-cream-100 border-2 border-transparent focus:border-coral-300 focus:bg-white outline-none text-sm text-cocoa-600 transition-all"
                      />
                      <div className="mt-2 flex items-center justify-between text-xs text-cocoa-400">
                        <span>{page.textBubbles.length} 对白 · {page.stickers.length} 贴纸</span>
                        <button className="flex items-center gap-1 hover:text-coral-500 transition-colors">
                          <GripVertical size={12} />
                          拖拽排序
                        </button>
                      </div>
                    </CandyCard>
                  );
                })}

                <button
                  onClick={() => addPage(currentPage?.id)}
                  className="min-h-[320px] rounded-candy-lg p-6 border-4 border-dashed border-cream-300 bg-cream-100/40 flex flex-col items-center justify-center gap-3 text-cocoa-400 hover:border-coral-400 hover:text-coral-500 hover:bg-coral-50 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-candy-sm flex items-center justify-center animate-bounce-soft">
                    <Plus size={28} />
                  </div>
                  <div className="font-display text-lg">添加新页码</div>
                  <div className="text-xs">继续展开你的故事</div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-cream-200 bg-white/60 backdrop-blur-soft p-5">
            <div className="max-w-6xl mx-auto">
              <h3 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-lilac-500" />
                角色关系图谱
                <span className="ml-auto text-xs text-cocoa-400 font-normal">
                  点击角色节点查看详情，拖拽连接角色创建关系
                </span>
              </h3>
              <div className="relative h-48 bg-cream-50 rounded-candy border-2 border-dashed border-cream-300 overflow-hidden">
                <div className="absolute inset-0 canvas-bg opacity-40" />
                {allCharacters.map((char, idx) => {
                  const positions = [
                    { left: "12%", top: "50%" },
                    { left: "45%", top: "30%" },
                    { left: "78%", top: "50%" },
                    { left: "30%", top: "75%" },
                    { left: "60%", top: "75%" },
                  ];
                  const pos = positions[idx % positions.length];
                  return (
                    <div
                      key={char.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ left: pos.left, top: pos.top }}
                    >
                      <div
                        className="relative w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-candy-sm border-4 border-white transition-all group-hover:scale-110 group-hover:shadow-candy animate-float"
                        style={{ background: char.color, animationDelay: `${idx * 400}ms` }}
                      >
                        {char.avatar}
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-lemon-500 animate-sparkle" />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="inline-block px-3 py-1 rounded-full bg-white shadow-candy-sm text-sm font-display text-cocoa-600 -rotate-1">
                          {char.name}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="relGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#FFE66D" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 12% 50% Q 28% 35% 45% 30%"
                    fill="none"
                    stroke="url(#relGrad)"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                  />
                  <path
                    d="M 45% 30% Q 62% 40% 78% 50%"
                    fill="none"
                    stroke="url(#relGrad)"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                  />
                </svg>

                <div className="absolute left-[28%] top-[35%] px-3 py-1 rounded-full bg-white shadow-candy-sm text-xs font-bold text-coral-500 animate-pop">
                  好朋友
                </div>
                <div className="absolute left-[58%] top-[35%] px-3 py-1 rounded-full bg-white shadow-candy-sm text-xs font-bold text-sky-500 animate-pop" style={{ animationDelay: "200ms" }}>
                  忘年交
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Panel
        open={showProjectsPanel}
        onClose={toggleProjectsPanel}
        title="📚 项目列表"
        side="left"
      >
        <div className="space-y-3">
          {useProjectStore.getState().projects.map((p) => (
            <div
              key={p.id}
              className={cn(
                "p-3 rounded-candy-sm border-2 transition-all cursor-pointer",
                p.id === useProjectStore.getState().currentProjectId
                  ? "border-coral-400 bg-coral-50"
                  : "border-cream-200 bg-white hover:border-coral-300",
              )}
              onClick={() => {
                useProjectStore.getState().setCurrentProject(p.id);
                toggleProjectsPanel();
              }}
            >
              <div
                className="h-16 rounded-lg mb-2 flex items-center justify-center text-3xl"
                style={{ background: p.coverColor }}
              >
                📖
              </div>
              <div className="font-display text-cocoa-600">{p.title}</div>
              <div className="text-xs text-cocoa-400">{p.totalPages} 页 · {p.author}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        open={showBgPanel}
        onClose={() => setShowBgPanel(false)}
        title="🎨 页面背景设置"
        side="right"
      >
        {currentPage && (
          <div className="space-y-5">
            <ColorPicker
              label="背景颜色"
              value={currentPage.background.value}
              onChange={(v) => updatePageBackground(currentPage.id, v)}
            />
            <div>
              <div className="text-sm font-medium text-cocoa-500 mb-2">预设背景</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "羊皮纸", v: "#FFF8E7" },
                  { name: "薄荷绿", v: "#F0FFF0" },
                  { name: "天空蓝", v: "#E0F7FA" },
                  { name: "粉樱色", v: "#FFF5F8" },
                  { name: "柠檬黄", v: "#FFFACD" },
                  { name: "梦幻紫", v: "#FAF5FF" },
                  { name: "蜜桃色", v: "#FFF1E0" },
                  { name: "深海蓝", v: "#E3F2FD" },
                  { name: "嫩芽绿", v: "#F1F8E9" },
                ].map((c) => (
                  <button
                    key={c.v}
                    onClick={() => updatePageBackground(currentPage.id, c.v)}
                    className={cn(
                      "h-14 rounded-candy-sm border-2 text-xs font-bold transition-all hover:scale-105",
                      currentPage.background.value === c.v
                        ? "border-coral-500 shadow-candy-sm"
                        : "border-white",
                    )}
                    style={{ background: c.v, color: "#5D4E37" }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Panel>
    </WorkspaceLayout>
  );
}
