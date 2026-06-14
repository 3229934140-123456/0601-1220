import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Droplet,
  Paintbrush,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Layers,
  Grid3X3,
  Sticker,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyButton from "@/components/common/CandyButton";
import Panel from "@/components/common/Panel";
import ColorPicker from "@/components/common/ColorPicker";
import Slider from "@/components/common/Slider";
import Tabs from "@/components/common/Tabs";
import { useDrawingStore, useProjectStore, useUIStore } from "@/store";
import { cn, uid } from "@/utils/id";
import type {
  DrawingToolType,
  WorkspaceKey,
  DrawPoint,
  DrawStroke,
  StickerInstance,
} from "@/types";

const tools: { type: DrawingToolType; name: string; icon: typeof Pencil; color: string }[] = [
  { type: "pencil", name: "铅笔", icon: Pencil, color: "#5D4E37" },
  { type: "watercolor", name: "水彩", icon: Droplet, color: "#4ECDC4" },
  { type: "crayon", name: "蜡笔", icon: Paintbrush, color: "#FFA775" },
  { type: "marker", name: "马克笔", icon: Highlighter, color: "#A882D8" },
  { type: "eraser", name: "橡皮", icon: Eraser, color: "#CCCCCC" },
];

interface LocalSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  dragging: boolean;
}

export default function Painting() {
  const workspaceKey: WorkspaceKey = "painting";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<DrawPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickers, setStickers] = useState<LocalSticker[]>([]);
  const [dragStickerId, setDragStickerId] = useState<string | null>(null);
  const [stickerTab, setStickerTab] = useState("动物");

  const {
    tool,
    layers,
    activeLayerId,
    setToolType,
    setToolColor,
    setToolSize,
    setToolOpacity,
    setActiveLayer,
    toggleLayerVisible,
    toggleLayerLocked,
    moveLayerUp,
    moveLayerDown,
    addLayer,
    removeLayer,
    undo,
    redo,
  } = useDrawingStore();
  const { currentPage, stickerAssets, addSticker } = useProjectStore();
  const {
    showLayersPanel,
    toggleLayersPanel,
    showStickersPanel,
    toggleStickersPanel,
    zoom,
    setZoom,
    gridVisible,
    setGridVisible,
  } = useUIStore();

  const canvasSize = { w: 800, h: 560 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.w * dpr;
    canvas.height = canvasSize.h * dpr;
    canvas.style.width = `${canvasSize.w}px`;
    canvas.style.height = `${canvasSize.h}px`;
    ctx.scale(dpr, dpr);

    const initBg = currentPage?.background.value || "#FFFAF0";
    ctx.fillStyle = initBg;
    ctx.fillRect(0, 0, canvasSize.w, canvasSize.h);

    if (currentPage?.stickers?.length && stickers.length === 0) {
      setStickers(
        currentPage.stickers.map((s: StickerInstance) => {
          const asset = stickerAssets.find((a) => a.id === s.assetId);
          return {
            id: s.id,
            emoji: asset?.emoji || "✨",
            x: s.x,
            y: s.y,
            scale: s.scale,
            rotation: s.rotation,
            dragging: false,
          };
        }),
      );
    }
  }, [currentPage?.id]);

  const getCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvasSize.w / rect.width),
      y: (clientY - rect.top) * (canvasSize.h / rect.height),
    };
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, pts: DrawPoint[]) => {
    if (pts.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = tool.opacity;
    ctx.strokeStyle = tool.type === "eraser" ? currentPage?.background.value || "#FFFFFF" : tool.color;
    ctx.lineWidth = tool.size;

    if (tool.type === "watercolor") {
      ctx.globalAlpha = tool.opacity * 0.5;
      ctx.shadowColor = tool.color;
      ctx.shadowBlur = 8;
    } else if (tool.type === "crayon") {
      ctx.globalAlpha = tool.opacity * 0.85;
    } else if (tool.type === "marker") {
      ctx.globalAlpha = tool.opacity * 0.75;
      ctx.lineWidth = tool.size * 1.2;
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const xc = (pts[i].x + pts[i - 1].x) / 2;
      const yc = (pts[i].y + pts[i - 1].y) / 2;
      ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc);
    }
    ctx.stroke();
    ctx.restore();
  };

  const startDraw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawingRef.current = true;
    setIsDrawing(true);
    pointsRef.current = [{ x, y }];
  };

  const moveDraw = (x: number, y: number) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pts = [...pointsRef.current, { x, y }];
    const last = pointsRef.current;
    drawStroke(ctx, [...last.slice(-2), { x, y }]);
    pointsRef.current = pts;
    void pts;
  };

  const endDraw = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setIsDrawing(false);
    if (pointsRef.current.length > 1 && currentPage) {
      const stroke: DrawStroke = {
        id: uid(),
        tool: { ...tool },
        points: [...pointsRef.current],
        layerId: activeLayerId || "",
      };
      useProjectStore.getState().addStroke(currentPage.id, stroke);
    }
    pointsRef.current = [];
  };

  const handleStickerMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDragStickerId(id);
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, dragging: true } : s)));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (dragStickerId) {
      const pos = getCanvasPos(e.clientX, e.clientY);
      setStickers((prev) =>
        prev.map((s) =>
          s.id === dragStickerId ? { ...s, x: pos.x, y: pos.y } : s,
        ),
      );
    } else if (!isDrawing) {
      const pos = getCanvasPos(e.clientX, e.clientY);
      startDraw(pos.x, pos.y);
    } else {
      const pos = getCanvasPos(e.clientX, e.clientY);
      moveDraw(pos.x, pos.y);
    }
  };

  const handleCanvasMouseUp = () => {
    if (dragStickerId) {
      setStickers((prev) =>
        prev.map((s) => (s.id === dragStickerId ? { ...s, dragging: false } : s)),
      );
      const s = stickers.find((x) => x.id === dragStickerId);
      if (s && currentPage) {
        const asset = stickerAssets.find((a) => a.emoji === s.emoji);
        if (asset) {
          useProjectStore.getState().updateSticker(currentPage.id, s.id, {
            x: s.x,
            y: s.y,
          });
        }
      }
      setDragStickerId(null);
    } else {
      endDraw();
    }
  };

  const addStickerToCanvas = (emoji: string, assetId: string) => {
    const x = canvasSize.w / 2 + (Math.random() - 0.5) * 200;
    const y = canvasSize.h / 2 + (Math.random() - 0.5) * 150;
    const scale = 1.5 + Math.random();
    const newSticker: LocalSticker = {
      id: uid(),
      emoji,
      x,
      y,
      scale,
      rotation: 0,
      dragging: false,
    };
    setStickers((prev) => [...prev, newSticker]);
    if (currentPage) {
      addSticker(currentPage.id, {
        assetId,
        x,
        y,
        scale,
        rotation: 0,
      });
    }
  };

  const categories = [...new Set(stickerAssets.map((s) => s.category))];

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-cream-200 bg-white/50 backdrop-blur-soft">
          <div className="flex items-center gap-1.5 p-1.5 bg-cream-200 rounded-candy-sm">
            {tools.map((t) => {
              const Icon = t.icon;
              const active = tool.type === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => setToolType(t.type)}
                  title={t.name}
                  className={cn(
                    "group relative flex flex-col items-center p-2.5 rounded-candy-sm transition-all w-14",
                    active
                      ? "bg-white shadow-candy-sm scale-105"
                      : "hover:bg-white/60",
                  )}
                >
                  <Icon
                    size={22}
                    style={{ color: active ? t.color : "#8B7B65" }}
                    className={active ? "animate-wiggle" : ""}
                  />
                  <span
                    className={cn(
                      "text-[10px] mt-0.5 font-display transition-colors",
                      active ? "text-cocoa-600" : "text-cocoa-400",
                    )}
                  >
                    {t.name}
                  </span>
                  {active && (
                    <span
                      className="absolute -bottom-1 w-6 h-1 rounded-full"
                      style={{ background: t.color }}
                    />
                  )}
                </button>
              );
            })}

            <div className="w-px h-10 bg-cream-300 mx-1" />

            <button
              onClick={undo}
              title="撤销"
              className="p-2.5 rounded-candy-sm hover:bg-white/80 text-cocoa-500 transition-colors"
            >
              <Undo2 size={20} />
            </button>
            <button
              onClick={redo}
              title="重做"
              className="p-2.5 rounded-candy-sm hover:bg-white/80 text-cocoa-500 transition-colors"
            >
              <Redo2 size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleStickersPanel}
              className={cn(
                "btn-candy-sm inline-flex items-center gap-1.5",
                showStickersPanel
                  ? "bg-lemon-500 text-white"
                  : "bg-white text-cocoa-600",
              )}
            >
              <Sticker size={16} />
              贴纸
            </button>
            <button
              onClick={toggleLayersPanel}
              className={cn(
                "btn-candy-sm inline-flex items-center gap-1.5",
                showLayersPanel
                  ? "bg-sky-500 text-white"
                  : "bg-white text-cocoa-600",
              )}
            >
              <Layers size={16} />
              图层
            </button>
            <button
              onClick={() => setGridVisible(!gridVisible)}
              className={cn(
                "btn-candy-sm inline-flex items-center gap-1.5",
                gridVisible
                  ? "bg-lilac-500 text-white"
                  : "bg-white text-cocoa-600",
              )}
            >
              <Grid3X3 size={16} />
              网格
            </button>

            <div className="w-px h-8 bg-cream-300 mx-1" />

            <div className="flex items-center gap-1 bg-white rounded-candy-sm shadow-candy-sm p-1">
              <button
                onClick={() => setZoom(zoom - 0.1)}
                className="p-1.5 rounded-lg hover:bg-cream-200 text-cocoa-500"
              >
                <ZoomOut size={16} />
              </button>
              <span className="w-12 text-center font-display text-sm text-cocoa-600">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(zoom + 0.1)}
                className="p-1.5 rounded-lg hover:bg-cream-200 text-cocoa-500"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-72 shrink-0 border-r border-cream-200 bg-white/50 backdrop-blur-soft p-5 space-y-6 overflow-auto scrollbar-candy">
            <div>
              <h4 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                <span className="text-xl">🎨</span> 画笔属性
              </h4>
              <div className="space-y-5">
                <ColorPicker
                  label="画笔颜色"
                  value={tool.color}
                  onChange={setToolColor}
                />
                <Slider
                  label="笔刷大小"
                  value={tool.size}
                  min={1}
                  max={60}
                  showValue
                  unit="px"
                  onChange={setToolSize}
                  accentColor={tool.color}
                />
                <Slider
                  label="不透明度"
                  value={Math.round(tool.opacity * 100)}
                  min={10}
                  max={100}
                  showValue
                  unit="%"
                  onChange={(v) => setToolOpacity(v / 100)}
                  accentColor={tool.color}
                />

                <div className="pt-2">
                  <div className="text-sm font-medium text-cocoa-500 mb-2">笔刷预览</div>
                  <div
                    className="h-20 rounded-candy bg-cream-100 border-2 border-cream-200 p-4 flex items-center justify-center relative overflow-hidden"
                  >
                    <canvas
                      width={200}
                      height={60}
                      ref={(c) => {
                        if (!c) return;
                        const ctx = c.getContext("2d");
                        if (!ctx) return;
                        ctx.clearRect(0, 0, 200, 60);
                        ctx.save();
                        ctx.strokeStyle = tool.type === "eraser" ? "#DDD" : tool.color;
                        ctx.lineWidth = tool.size;
                        ctx.lineCap = "round";
                        ctx.globalAlpha = tool.opacity;
                        ctx.beginPath();
                        ctx.moveTo(10, 30);
                        ctx.bezierCurveTo(50, 10, 100, 50, 190, 30);
                        ctx.stroke();
                        ctx.restore();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto scrollbar-candy flex items-center justify-center p-8"
            ref={containerRef}
          >
            <div
              className="relative rounded-candy-lg shadow-candy-lg overflow-hidden transition-transform"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none z-20 transition-opacity",
                  gridVisible ? "opacity-50" : "opacity-0",
                )}
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(93,78,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(93,78,55,0.1) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  width: canvasSize.w,
                  height: canvasSize.h,
                }}
              />
              <canvas
                ref={canvasRef}
                className="touch-none z-10 relative cursor-crosshair"
                style={{ width: canvasSize.w, height: canvasSize.h }}
                onMouseDown={handleCanvasMouseMove}
                onMouseMove={(e) => {
                  if (isDrawing || dragStickerId) handleCanvasMouseMove(e);
                }}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
              {stickers.map((s) => (
                <div
                  key={s.id}
                  onMouseDown={(e) => handleStickerMouseDown(e, s.id)}
                  className={cn(
                    "absolute z-30 select-none cursor-move transition-transform",
                    s.dragging ? "scale-110 z-40" : "hover:scale-105",
                  )}
                  style={{
                    left: s.x,
                    top: s.y,
                    transform: `translate(-50%, -50%) scale(${s.scale}) rotate(${s.rotation}deg)`,
                    fontSize: "40px",
                  }}
                >
                  {s.emoji}
                </div>
              ))}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-cocoa-500 shadow-candy-sm z-30">
                {canvasSize.w} × {canvasSize.h}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Panel open={showLayersPanel} onClose={toggleLayersPanel} title="🗂 图层管理" side="right" width="w-80">
        <div className="space-y-4">
          <CandyButton
            size="sm"
            variant="soft"
            leftIcon={<Plus size={14} />}
            className="w-full"
            onClick={() => addLayer("图层")}
          >
            新建图层
          </CandyButton>
          <div className="space-y-2">
            {[...layers].reverse().map((layer) => {
              const active = layer.id === activeLayerId;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={cn(
                    "p-3 rounded-candy-sm border-2 transition-all cursor-pointer",
                    active
                      ? "border-sky-400 bg-sky-50 shadow-candy-sm"
                      : "border-cream-200 bg-white hover:border-sky-200",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0",
                        active ? "bg-sky-500 text-white" : "bg-cream-200",
                      )}
                    >
                      {layer.type === "background" && "🖼"}
                      {layer.type === "sketch" && "✏️"}
                      {layer.type === "paint" && "🎨"}
                      {layer.type === "sticker" && "🧸"}
                      {layer.type === "character" && "👤"}
                      {layer.type === "text" && "💬"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-cocoa-600 truncate">{layer.name}</div>
                      <div className="text-[11px] text-cocoa-400">
                        不透明度 {Math.round(layer.opacity * 100)}%
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayerUp(layer.id);
                        }}
                        className="p-1 rounded hover:bg-cream-200 text-cocoa-400"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayerDown(layer.id);
                        }}
                        className="p-1 rounded hover:bg-cream-200 text-cocoa-400"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-cream-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisible(layer.id);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        layer.visible
                          ? "text-coral-500 bg-coral-50"
                          : "text-cocoa-400 hover:bg-cream-200",
                      )}
                    >
                      {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerLocked(layer.id);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        layer.locked
                          ? "text-amber-500 bg-amber-50"
                          : "text-cocoa-400 hover:bg-cream-200",
                      )}
                    >
                      {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      className="p-1.5 rounded-lg text-cocoa-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel open={showStickersPanel} onClose={toggleStickersPanel} title="🧸 贴纸素材库" side="right" width="w-80">
        <Tabs
          tabs={categories.map((c) => ({ key: c, label: c }))}
          value={stickerTab}
          onChange={setStickerTab}
          size="sm"
        />
        <div className="grid grid-cols-5 gap-2 mt-4">
          {stickerAssets
            .filter((s) => s.category === stickerTab)
            .map((s, idx) => (
              <button
                key={s.id}
                onClick={() => addStickerToCanvas(s.emoji, s.id)}
                className="aspect-square rounded-candy-sm bg-white border-2 border-cream-200 hover:border-lemon-400 hover:bg-lemon-50 hover:shadow-candy-sm transition-all flex items-center justify-center text-3xl group animate-pop"
                style={{ animationDelay: `${idx * 20}ms` }}
                title={s.name}
              >
                <span className="group-hover:scale-125 transition-transform">{s.emoji}</span>
              </button>
            ))}
        </div>
        <div className="mt-6 pt-4 border-t border-cream-200">
          <div className="text-sm font-medium text-cocoa-500 mb-2">💡 小技巧</div>
          <p className="text-xs text-cocoa-400 leading-relaxed">
            点击贴纸即可添加到画布中央。拖拽可以移动位置，下次创作时会智能保存上次的位置哦！
          </p>
        </div>
      </Panel>
    </WorkspaceLayout>
  );
}
