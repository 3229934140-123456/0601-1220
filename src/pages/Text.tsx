import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MessageCircle,
  Cloud,
  Megaphone,
  HelpCircle,
  Volume2,
  VolumeX,
  Type,
  AlignLeft,
  Sparkles,
  Pause,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Tabs from "@/components/common/Tabs";
import ColorPicker from "@/components/common/ColorPicker";
import Slider from "@/components/common/Slider";
import Panel from "@/components/common/Panel";
import { useProjectStore } from "@/store";
import { FONT_ASSETS, VOICE_OPTIONS, MOCK_CHARACTERS } from "@/utils/mockData";
import { cn, uid } from "@/utils/id";
import type { WorkspaceKey, TextBubble as TB } from "@/types";

type BubbleTab = "speech" | "thought" | "narration" | "shout";

const bubbleMeta: Record<BubbleTab, { name: string; icon: typeof MessageCircle; color: string }> = {
  speech: { name: "对话气泡", icon: MessageCircle, color: "#FF6B6B" },
  thought: { name: "思考泡泡", icon: Cloud, color: "#4ECDC4" },
  narration: { name: "旁白文字", icon: AlignLeft, color: "#A882D8" },
  shout: { name: "呼喊气泡", icon: Megaphone, color: "#FFA775" },
};

interface LocalBubble extends TB {
  dragging: boolean;
  resizing: boolean;
}

export default function TextWorkspace() {
  const workspaceKey: WorkspaceKey = "text";
  const { currentPage, addTextBubble, updateTextBubble, removeTextBubble, characters } =
    useProjectStore();
  const [bubbleTab, setBubbleTab] = useState<BubbleTab>("speech");
  const [bubbles, setBubbles] = useState<LocalBubble[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [fontTab, setFontTab] = useState("all");
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [voiceId, setVoiceId] = useState(VOICE_OPTIONS[0].id);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasW = 800;
  const canvasH = 560;

  useEffect(() => {
    if (currentPage?.textBubbles?.length) {
      setBubbles(currentPage.textBubbles.map((b) => ({ ...b, dragging: false, resizing: false })));
    } else {
      setBubbles([]);
    }
  }, [currentPage?.id]);

  const allChars = characters.length > 0 ? characters : MOCK_CHARACTERS;
  const selected = bubbles.find((b) => b.id === selectedId);
  const currentVoice = VOICE_OPTIONS.find((v) => v.id === voiceId);

  const addNewBubble = () => {
    const defaults: Record<BubbleTab, Partial<TB>> = {
      speech: { type: "speech", width: 260, height: 90, fontSize: 22 },
      thought: { type: "thought", width: 240, height: 90, fontSize: 20 },
      narration: { type: "narration", width: 500, height: 80, fontSize: 26 },
      shout: { type: "shout", width: 280, height: 100, fontSize: 28 },
    };
    const def = defaults[bubbleTab];
    const newBubble: LocalBubble = {
      id: uid(),
      pageId: currentPage?.id ?? "",
      type: bubbleTab,
      content:
        bubbleTab === "narration"
          ? "在这里输入旁白..."
          : bubbleTab === "shout"
          ? "哇！！！"
          : bubbleTab === "thought"
          ? "我在想..."
          : "你好呀！",
      font: "'ZCOOL KuaiLe', cursive",
      fontSize: def.fontSize!,
      color: "#5D4E37",
      x: canvasW / 2,
      y: 150 + Math.random() * 200,
      width: def.width!,
      height: def.height!,
      tailDirection: "bottom",
      dragging: false,
      resizing: false,
    };
    setBubbles((prev) => [...prev, newBubble]);
    setSelectedId(newBubble.id);
    if (currentPage) {
      const { dragging: _d, resizing: _r, ...rest } = newBubble;
      void _d; void _r;
      addTextBubble(currentPage.id, rest);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragId) return;
    const container = document.getElementById("bubble-canvas");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasW;
    const y = ((e.clientY - rect.top) / rect.height) * canvasH;
    setBubbles((prev) => {
      const next = prev.map((b) => (b.id === dragId ? { ...b, x, y } : b));
      return next;
    });
  };

  const handleMouseUp = () => {
    if (dragId && currentPage) {
      const b = bubbles.find((x) => x.id === dragId);
      if (b) updateTextBubble(currentPage.id, dragId, { x: b.x, y: b.y });
    }
    setDragId(null);
  };

  const updateSelected = (patch: Partial<TB>) => {
    if (!selectedId) return;
    setBubbles((prev) => prev.map((b) => (b.id === selectedId ? { ...b, ...patch } : b)));
    if (currentPage) updateTextBubble(currentPage.id, selectedId, patch);
  };

  const deleteSelected = () => {
    if (!selectedId || !currentPage) return;
    removeTextBubble(currentPage.id, selectedId);
    setBubbles((prev) => prev.filter((b) => b.id !== selectedId));
    setSelectedId(null);
  };

  const playRead = () => {
    if (!selected || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(selected.content);
    u.rate = speed;
    u.pitch = pitch;
    u.lang = "zh-CN";
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const stopRead = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const renderBubble = (b: LocalBubble) => {
    const sel = b.id === selectedId;
    const style: React.CSSProperties = {
      left: b.x,
      top: b.y,
      width: b.width,
      minHeight: b.height,
      transform: "translate(-50%, -50%)",
    };

    const baseWrap =
      "absolute z-20 select-none transition-shadow cursor-move p-4 animate-pop";
    const bubbleClass = {
      speech: "rounded-[32px] rounded-bl-md bg-white shadow-candy-sm border-4 border-coral-300",
      thought: "rounded-full bg-white/95 shadow-candy-sm border-4 border-sky-300",
      narration: "rounded-2xl bg-lemon-400/20 border-2 border-lemon-400/50 border-dashed",
      shout: "rounded-2xl bg-lemon-400 shadow-candy-sm border-4 border-coral-500 rotate-[-2deg]",
    }[b.type];

    return (
      <div
        key={b.id}
        className={cn(
          baseWrap,
          bubbleClass,
          sel && "ring-4 ring-sky-400/70 shadow-candy-lg",
          dragId === b.id && "scale-105 z-30 opacity-90",
        )}
        style={style}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSelectedId(b.id);
          setDragId(b.id);
        }}
      >
        {b.type === "speech" && (
          <div className="absolute -bottom-3 left-5 w-6 h-6 rotate-45 bg-white border-r-4 border-b-4 border-coral-300" />
        )}
        {b.type === "thought" && (
          <>
            <div className="absolute -bottom-4 left-8 w-5 h-5 rounded-full bg-white/95 border-4 border-sky-300" />
            <div className="absolute -bottom-8 left-5 w-3 h-3 rounded-full bg-white/95 border-2 border-sky-300" />
          </>
        )}
        {b.type === "shout" && (
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center text-white shadow-candy-sm animate-sparkle">
            <HelpCircle size={16} />
          </div>
        )}
        <div
          style={{
            fontFamily: b.font,
            fontSize: b.fontSize,
            color: b.color,
            lineHeight: 1.35,
          }}
        >
          {b.content}
        </div>
      </div>
    );
  };

  const fontCategories = [...new Set(FONT_ASSETS.map((f) => f.category))];

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-cream-200 bg-white/50 backdrop-blur-soft">
          <Tabs
            tabs={(Object.keys(bubbleMeta) as BubbleTab[]).map((k) => {
              const IconComp = bubbleMeta[k].icon;
              return {
                key: k,
                label: bubbleMeta[k].name,
                icon: <IconComp size={16} />,
              };
            })}
            value={bubbleTab}
            onChange={(k) => setBubbleTab(k as BubbleTab)}
          />
          <div className="flex items-center gap-2">
            <CandyButton
              size="sm"
              variant="soft"
              leftIcon={<Type size={14} />}
              onClick={() => setSelectedId(null)}
            >
              取消选中
            </CandyButton>
            <CandyButton
              size="sm"
              leftIcon={<Volume2 size={14} />}
              variant="secondary"
              onClick={() => setShowVoicePanel(true)}
            >
              朗读设置
            </CandyButton>
            <CandyButton
              size="sm"
              variant="primary"
              leftIcon={<Plus size={14} />}
              onClick={addNewBubble}
            >
              添加{bubbleMeta[bubbleTab].name.slice(0, 2)}
            </CandyButton>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 shrink-0 border-r border-cream-200 bg-white/50 backdrop-blur-soft p-5 overflow-auto scrollbar-candy space-y-6">
            <div>
              <h4 className="font-display text-lg text-cocoa-600 mb-3 flex items-center gap-2">
                <span className="text-xl">🔤</span> 字体库
              </h4>
              <Tabs
                tabs={[
                  { key: "all", label: "全部" },
                  ...fontCategories.map((c) => ({ key: c, label: c })),
                ]}
                value={fontTab}
                onChange={setFontTab}
                size="sm"
                variant="underline"
                className="w-full mb-3"
              />
              <div className="space-y-2">
                {FONT_ASSETS.filter((f) => fontTab === "all" || f.category === fontTab).map(
                  (f) => (
                    <button
                      key={f.id}
                      onClick={() => selected && updateSelected({ font: f.family })}
                      className={cn(
                        "w-full text-left p-3 rounded-candy-sm border-2 transition-all",
                        selected?.font === f.family
                          ? "border-coral-400 bg-coral-50 shadow-candy-sm"
                          : "border-cream-200 bg-white hover:border-coral-300",
                      )}
                    >
                      <div
                        className="text-2xl text-cocoa-600 truncate"
                        style={{ fontFamily: f.family }}
                      >
                        {f.preview}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-cocoa-500 font-display">{f.name}</span>
                        <span className="text-[10px] text-cocoa-400 chip !py-0 !px-1.5">
                          {f.category}
                        </span>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto scrollbar-candy flex items-center justify-center p-8">
            <div
              id="bubble-canvas"
              className="relative rounded-candy-lg shadow-candy-lg overflow-hidden"
              style={{
                width: canvasW,
                height: canvasH,
                background: currentPage?.background.value || "#FFFAF0",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedId(null)}
            >
              <div className="absolute inset-0 canvas-bg opacity-40 pointer-events-none" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-cocoa-400/60 bg-white/60 backdrop-blur px-3 py-1 rounded-full pointer-events-none">
                画布 {canvasW} × {canvasH} · 拖拽气泡调整位置
              </div>

              {bubbles.map(renderBubble)}

              {bubbles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-7xl mb-4 animate-bounce-soft">💬</div>
                    <div className="font-display text-2xl text-cocoa-400">
                      从上方点击按钮添加文字气泡
                    </div>
                    <p className="text-sm text-cocoa-400 mt-2">
                      支持对话、思考、旁白、呼喊 四种文字类型
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-80 shrink-0 border-l border-cream-200 bg-white/50 backdrop-blur-soft p-5 overflow-auto scrollbar-candy space-y-6">
            {selected ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg text-cocoa-600 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-lemon-500" />
                    气泡属性
                  </h4>
                  <button
                    onClick={deleteSelected}
                    className="p-2 rounded-lg hover:bg-red-100 text-cocoa-400 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-cocoa-500 block mb-1.5">文字内容</label>
                  <textarea
                    value={selected.content}
                    onChange={(e) => updateSelected({ content: e.target.value })}
                    rows={4}
                    className="w-full resize-none p-3 rounded-candy-sm border-2 border-cream-300 focus:border-coral-400 outline-none bg-cream-50 text-cocoa-600"
                    style={{ fontFamily: selected.font, fontSize: 16 }}
                  />
                </div>

                <ColorPicker
                  label="文字颜色"
                  value={selected.color}
                  onChange={(c) => updateSelected({ color: c })}
                />

                <Slider
                  label="字号"
                  value={selected.fontSize}
                  min={12}
                  max={72}
                  showValue
                  unit="px"
                  onChange={(v) => updateSelected({ fontSize: v })}
                  accentColor={bubbleMeta[selected.type].color}
                />

                <Slider
                  label="气泡宽度"
                  value={selected.width}
                  min={120}
                  max={600}
                  showValue
                  unit="px"
                  onChange={(v) => updateSelected({ width: v })}
                  accentColor={bubbleMeta[selected.type].color}
                />

                <div className="flex items-center gap-2 p-3 rounded-candy bg-gradient-to-r from-mint-50 to-sky-50 border border-mint-200">
                  <button
                    onClick={isPlaying ? stopRead : playRead}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center shadow-candy transition-all shrink-0",
                      isPlaying
                        ? "bg-coral-500 text-white animate-pulse-glow"
                        : "bg-white text-sky-500 hover:bg-sky-500 hover:text-white",
                    )}
                  >
                    {isPlaying ? <Pause size={28} /> : <Volume2 size={28} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base text-cocoa-600">
                      {isPlaying ? "朗读中..." : "试听朗读效果"}
                    </div>
                    <div className="text-xs text-cocoa-400 truncate">
                      {currentVoice?.name} · 语速 {speed.toFixed(1)}x
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4 opacity-40">👆</div>
                <p className="text-cocoa-400 font-display">点击画布上的气泡</p>
                <p className="text-sm text-cocoa-400">编辑属性和试听效果</p>
              </div>
            )}

            <div className="pt-4 border-t border-cream-200">
              <h5 className="font-display text-base text-cocoa-600 mb-3 flex items-center gap-2">
                <span>🧸</span> 角色快速添加
              </h5>
              <div className="space-y-2">
                {allChars.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setBubbleTab("speech");
                      setTimeout(() => {
                        addNewBubble();
                        setBubbles((prev) =>
                          prev.map((b, i) =>
                            i === prev.length - 1
                              ? { ...b, content: `${c.name}说：...`, color: c.color }
                              : b,
                          ),
                        );
                      }, 0);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-candy-sm bg-white hover:bg-coral-50 border-2 border-transparent hover:border-coral-300 transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-sm"
                      style={{ background: c.color }}
                    >
                      {c.avatar}
                    </div>
                    <span className="font-display text-cocoa-600">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Panel open={showVoicePanel} onClose={() => setShowVoicePanel(false)} title="🔊 朗读预览设置">
        <div className="space-y-5">
          <div>
            <div className="text-sm font-medium text-cocoa-500 mb-2">选择朗读者</div>
            <div className="space-y-2">
              {VOICE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoiceId(v.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-candy-sm border-2 transition-all flex items-center gap-3",
                    v.id === voiceId
                      ? "border-mint-400 bg-mint-50 shadow-candy-sm"
                      : "border-cream-200 bg-white hover:border-mint-300",
                  )}
                >
                  <div className="text-3xl">
                    {v.type === "child" && "👦"}
                    {v.type === "mom" && "👩"}
                    {v.type === "dad" && "👨"}
                    {v.type === "grandma" && "👵"}
                    {v.type === "grandpa" && "👴"}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-cocoa-600">{v.name}</div>
                    <div className="text-xs text-cocoa-400">「{v.previewText}」</div>
                  </div>
                  {v.id === voiceId && <Volume2 className="text-mint-500" size={18} />}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="语速"
            value={Math.round(speed * 100)}
            min={50}
            max={200}
            showValue
            unit="%"
            onChange={(v) => setSpeed(v / 100)}
            accentColor="#7ED47E"
          />

          <Slider
            label="音调"
            value={Math.round(pitch * 100)}
            min={50}
            max={200}
            showValue
            unit="%"
            onChange={(v) => setPitch(v / 100)}
            accentColor="#A882D8"
          />

          <div className="flex items-center gap-2 p-4 rounded-candy bg-gradient-to-r from-mint-50 via-sky-50 to-lilac-50 border border-mint-200">
            <CandyButton
              variant="secondary"
              leftIcon={isPlaying ? <Pause size={16} /> : <Volume2 size={16} />}
              onClick={isPlaying ? stopRead : () => {
                if (!("speechSynthesis" in window)) return;
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(currentVoice?.previewText ?? "");
                u.rate = speed;
                u.pitch = pitch;
                u.lang = "zh-CN";
                u.onstart = () => setIsPlaying(true);
                u.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(u);
              }}
              className="flex-1"
            >
              {isPlaying ? "停止试听" : "试听朗读者"}
            </CandyButton>
            <button
              onClick={stopRead}
              className="p-3 rounded-candy-sm bg-white shadow-candy-sm text-cocoa-500 hover:text-coral-500 transition-colors"
            >
              <VolumeX size={18} />
            </button>
          </div>
        </div>
      </Panel>
    </WorkspaceLayout>
  );
}
