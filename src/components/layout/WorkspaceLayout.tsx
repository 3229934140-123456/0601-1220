import type { ReactNode } from "react";
import {
  Home,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Palette,
  Users,
  MessageCircle,
  Droplets,
  LayoutGrid,
  Share2,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUIStore, useProjectStore } from "@/store";
import { WORKSPACES } from "@/utils/mockData";
import { cn } from "@/utils/id";
import type { WorkspaceKey } from "@/types";

const iconMap: Record<string, ReactNode> = {
  BookOpen: <BookOpen size={22} />,
  Palette: <Palette size={22} />,
  Users: <Users size={22} />,
  MessageCircle: <MessageCircle size={22} />,
  Droplets: <Droplets size={22} />,
  LayoutGrid: <LayoutGrid size={22} />,
  Share2: <Share2 size={22} />,
};

interface WorkspaceLayoutProps {
  children: ReactNode;
  currentKey: WorkspaceKey;
}

export default function WorkspaceLayout({ children, currentKey }: WorkspaceLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkspace, setActiveWorkspace, toggleProjectsPanel } = useUIStore();
  const { currentProject, orderedPages, setCurrentPage, currentPage } = useProjectStore();
  const currentMeta = WORKSPACES.find((w) => w.key === currentKey);

  const prevIdx = Math.max(0, WORKSPACES.findIndex((w) => w.key === currentKey) - 1);
  const nextIdx = Math.min(
    WORKSPACES.length - 1,
    WORKSPACES.findIndex((w) => w.key === currentKey) + 1,
  );
  const prev = WORKSPACES[prevIdx];
  const next = WORKSPACES[nextIdx];

  const goHome = () => {
    setActiveWorkspace("home");
    navigate("/");
  };

  void location;
  void activeWorkspace;

  return (
    <div className="workspace-layout">
      <div className="absolute top-3 left-3 text-3xl animate-float-slow pointer-events-none opacity-60 z-0">☁️</div>
      <div className="absolute top-8 right-32 text-2xl animate-sparkle pointer-events-none z-0">✨</div>
      <div className="absolute bottom-40 left-1/3 text-2xl animate-float pointer-events-none opacity-50 z-0">🌟</div>

      <header className="relative z-10 flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-soft border-b border-cream-200">
        <div className="flex items-center gap-4">
          <button
            onClick={goHome}
            className="group flex items-center gap-2 p-2 rounded-candy-sm hover:bg-cream-200 transition-colors"
            title="返回首页"
          >
            <div className="w-11 h-11 rounded-candy-sm bg-rainbow flex items-center justify-center text-white text-2xl shadow-candy-sm group-hover:animate-wiggle">
              🌈
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-display text-xl text-cocoa-600 leading-tight">彩虹绘本工坊</div>
              <div className="text-xs text-cocoa-400">亲子创意设计平台</div>
            </div>
          </button>

          <div className="w-px h-10 bg-cream-300 mx-2" />

          <button
            onClick={toggleProjectsPanel}
            className="flex items-center gap-2 px-4 py-2 rounded-candy-sm bg-white shadow-candy-sm hover:shadow-candy transition-all"
          >
            <FolderKanban size={18} className="text-coral-500" />
            <div className="text-left">
              <div className="font-display text-sm text-cocoa-600 leading-tight">
                {currentProject?.title ?? "未命名"}
              </div>
              <div className="text-xs text-cocoa-400">
                {orderedPages.length} 页 · {currentProject?.author}
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-2 py-1.5 bg-cream-200/80 rounded-candy-sm">
            {WORKSPACES.map((w) => {
              const active = w.key === currentKey;
              return (
                <button
                  key={w.key}
                  onClick={() => {
                    setActiveWorkspace(w.key);
                    navigate(w.path);
                  }}
                  title={`${w.emoji} ${w.name}`}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all",
                    active
                      ? "bg-white shadow-candy-sm scale-105"
                      : "hover:bg-white/60",
                  )}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <span
                    className={cn(
                      "text-[10px] font-display mt-0.5 transition-colors",
                      active ? "text-cocoa-600" : "text-cocoa-400",
                    )}
                  >
                    {w.name}
                  </span>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-coral-400 to-sky-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveWorkspace(prev.key);
              navigate(prev.path);
            }}
            className="p-2.5 rounded-candy-sm bg-white shadow-candy-sm hover:shadow-candy hover:-translate-y-0.5 transition-all disabled:opacity-40"
            disabled={WORKSPACES[0].key === currentKey}
            title={prev.name}
          >
            <ChevronLeft size={20} className="text-cocoa-500" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-candy bg-white shadow-candy-sm min-w-[140px] justify-center">
            {currentMeta && iconMap[currentMeta.icon]}
            <span className="font-display text-lg text-cocoa-600">{currentMeta?.name}</span>
            <Sparkles size={16} className="text-lemon-500" />
          </div>
          <button
            onClick={() => {
              setActiveWorkspace(next.key);
              navigate(next.path);
            }}
            className="p-2.5 rounded-candy-sm bg-white shadow-candy-sm hover:shadow-candy hover:-translate-y-0.5 transition-all disabled:opacity-40"
            disabled={WORKSPACES[WORKSPACES.length - 1].key === currentKey}
            title={next.name}
          >
            <ChevronRight size={20} className="text-cocoa-500" />
          </button>
        </div>
      </header>

      {orderedPages.length > 0 && (
        <div className="relative z-10 flex items-center gap-2 px-6 py-2 bg-white/40 backdrop-blur-soft border-b border-cream-200 overflow-x-auto scrollbar-candy">
          <span className="text-xs text-cocoa-400 font-display shrink-0">页码：</span>
          {orderedPages.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentPage(p.id)}
              className={cn(
                "shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-candy-sm transition-all",
                currentPage?.id === p.id
                  ? "bg-coral-500 text-white shadow-candy-sm scale-105"
                  : "bg-white hover:bg-cream-200 text-cocoa-500",
              )}
            >
              <span className="text-xs opacity-60">P{p.pageNumber}</span>
              <span className="text-xs font-display truncate max-w-[100px]">
                {p.sceneDescription || "空白页"}
              </span>
            </button>
          ))}
        </div>
      )}

      <main className="relative z-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
