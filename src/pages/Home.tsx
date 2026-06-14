import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Palette,
  Users,
  MessageCircle,
  Droplets,
  LayoutGrid,
  Share2,
  Plus,
  Sparkles,
  Clock,
  Edit3,
  Trash2,
} from "lucide-react";
import { useProjectStore, useUIStore } from "@/store";
import { WORKSPACES } from "@/utils/mockData";
import { formatDate, cn } from "@/utils/id";
import CandyButton from "@/components/common/CandyButton";
import CandyCard from "@/components/common/CandyCard";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  BookOpen: <BookOpen size={28} />,
  Palette: <Palette size={28} />,
  Users: <Users size={28} />,
  MessageCircle: <MessageCircle size={28} />,
  Droplets: <Droplets size={28} />,
  LayoutGrid: <LayoutGrid size={28} />,
  Share2: <Share2 size={28} />,
};

export default function Home() {
  const navigate = useNavigate();
  const { projects, currentProjectId, setCurrentProject, createProject } = useProjectStore();
  const { setActiveWorkspace } = useUIStore();
  const [showNewProject, setShowNewProject] = useState(false);

  const goWorkspace = (path: string, key: string) => {
    setActiveWorkspace(key as never);
    navigate(path);
  };

  return (
    <div className="relative w-full h-full overflow-auto scrollbar-candy">
      <div className="absolute top-4 left-12 text-5xl animate-float pointer-events-none opacity-40">☁️</div>
      <div className="absolute top-24 right-20 text-4xl animate-float-slow pointer-events-none opacity-40">☁️</div>
      <div className="absolute bottom-20 left-1/4 text-3xl animate-sparkle pointer-events-none">✨</div>
      <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce-soft pointer-events-none">⭐</div>
      <div className="absolute bottom-32 right-1/4 text-3xl animate-float pointer-events-none opacity-50">🌈</div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-20 h-20 rounded-3xl bg-rainbow flex items-center justify-center text-5xl shadow-candy-lg animate-bounce-soft">
              🌈
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-6xl mb-3">
            <span className="rainbow-text">彩虹绘本工坊</span>
          </h1>
          <p className="text-lg text-cocoa-500 font-medium">
            用 <Sparkles className="inline w-5 h-5 text-lemon-500" /> 想象力创作属于全家的专属绘本
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-lemon-500" />
                七个创作工作台
              </h2>
              <p className="text-sm text-cocoa-400 mt-1">点击进入对应工作台，按顺序创作或自由跳转到任意步骤</p>
            </div>
            <CandyButton
              size="lg"
              variant="rainbow"
              leftIcon={<Plus size={20} />}
              onClick={() => setShowNewProject(true)}
            >
              新建绘本项目
            </CandyButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WORKSPACES.map((w, idx) => (
              <button
                key={w.key}
                onClick={() => goWorkspace(w.path, w.key)}
                className={cn(
                  "group relative text-left rounded-candy-lg p-6 border-4 border-white shadow-candy transition-all duration-300",
                  "hover:-translate-y-2 hover:shadow-candy-lg animate-pop",
                  `bg-gradient-to-br ${w.gradient}`,
                )}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="absolute top-3 right-3 text-4xl opacity-80 group-hover:scale-125 group-hover:rotate-12 transition-transform">
                  {w.emoji}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center mb-4 text-cocoa-600 shadow-candy-sm group-hover:animate-wiggle">
                  {iconMap[w.icon]}
                </div>
                <div className="font-display text-2xl text-white drop-shadow-sm mb-1">{w.name}</div>
                <div className="text-sm text-white/90 font-medium leading-snug">{w.description}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cocoa-600/80 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm group-hover:bg-white transition-colors">
                  进入工作台 →
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
              <Clock className="w-6 h-6 text-coral-500" />
              我的绘本项目
            </h2>
            <div className="text-sm text-cocoa-400">共 {projects.length} 个项目</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => {
              const active = project.id === currentProjectId;
              return (
                <CandyCard
                  key={project.id}
                  hoverable
                  className={cn("animate-pop overflow-hidden", active && "ring-4 ring-coral-400/50")}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className="h-36 -m-5 mb-4 flex items-center justify-center relative overflow-hidden"
                    style={{ background: project.coverColor }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
                    <div className="text-6xl animate-bounce-soft">📖</div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.08),transparent_50%)]" />
                    {active && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-coral-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-candy-sm animate-pulse-glow">
                        ● 正在编辑
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-cocoa-600 mb-1">{project.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-cocoa-500 mb-3">
                    <span className="chip">✍️ {project.author}</span>
                    <span className="chip">📄 {project.totalPages} 页</span>
                  </div>
                  <div className="text-xs text-cocoa-400 mb-4 flex items-center gap-1">
                    <Clock size={12} />
                    更新于 {formatDate(project.updatedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CandyButton
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      leftIcon={<Edit3 size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentProject(project.id);
                        goWorkspace("/workspace/painting", "painting");
                      }}
                    >
                      继续编辑
                    </CandyButton>
                    <button
                      className="p-2 rounded-candy-sm bg-cream-200 hover:bg-red-100 hover:text-red-500 text-cocoa-500 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </CandyCard>
              );
            })}

            <button
              onClick={() => setShowNewProject(true)}
              className="rounded-candy-lg p-6 border-4 border-dashed border-cream-300 bg-cream-100/40 flex flex-col items-center justify-center gap-3 text-cocoa-400 hover:border-coral-400 hover:text-coral-500 hover:bg-coral-50 transition-all min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-candy-sm flex items-center justify-center">
                <Plus size={28} />
              </div>
              <div className="font-display text-lg">创建新的绘本</div>
              <div className="text-xs">开始一次全新的创作冒险</div>
            </button>
          </div>
        </div>

        <div className="card-candy p-6 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-coral-300/30 to-sky-300/30 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="text-7xl animate-bounce-soft">💡</div>
            <div className="flex-1">
              <h3 className="font-display text-2xl text-cocoa-600 mb-2">创作小贴士</h3>
              <ul className="space-y-1.5 text-sm text-cocoa-500">
                <li>✨ 从 <strong>故事板</strong> 开始，先梳理故事结构和页码</li>
                <li>🎨 在 <strong>绘画台</strong> 尽情创作，别忘记使用图层哦</li>
                <li>🧸 在 <strong>角色库</strong> 为每个角色设计独特的表情和服装</li>
                <li>💬 <strong>文字台</strong> 可以让文字大声朗读出来，非常有趣！</li>
                <li>🌈 用 <strong>配色台</strong> 让画面色彩更协调统一</li>
              </ul>
            </div>
            <CandyButton
              size="lg"
              leftIcon={<Sparkles size={18} />}
              onClick={() => goWorkspace("/workspace/storyboard", "storyboard")}
            >
              开始创作 →
            </CandyButton>
          </div>
        </div>
      </div>

      {showNewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/30 backdrop-blur-sm animate-pop">
          <div className="card-candy w-[480px] max-w-[90vw] p-6">
            <h3 className="font-display text-2xl text-cocoa-600 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-lemon-500" />
              创建新绘本
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cocoa-500 block mb-1.5">绘本名称</label>
                <input
                  type="text"
                  placeholder="例如：我的冒险故事"
                  className="w-full px-4 py-3 rounded-candy-sm border-2 border-cream-300 focus:border-coral-400 outline-none bg-cream-50 font-display text-lg text-cocoa-600"
                  id="newTitle"
                  defaultValue="我的第一本绘本"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-cocoa-500 block mb-1.5">创作者</label>
                <input
                  type="text"
                  placeholder="例如：小明和爸爸"
                  className="w-full px-4 py-3 rounded-candy-sm border-2 border-cream-300 focus:border-coral-400 outline-none bg-cream-50 font-medium text-cocoa-600"
                  id="newAuthor"
                  defaultValue="亲子创作"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <CandyButton variant="soft" onClick={() => setShowNewProject(false)}>
                取消
              </CandyButton>
              <CandyButton
                variant="primary"
                leftIcon={<Plus size={16} />}
                onClick={() => {
                  const t = (document.getElementById("newTitle") as HTMLInputElement)?.value || "新绘本";
                  createProject(t);
                  setShowNewProject(false);
                }}
              >
                创建绘本
              </CandyButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
