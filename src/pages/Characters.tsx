import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Smile,
  Shirt,
  PersonStanding,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Tabs from "@/components/common/Tabs";
import ColorPicker from "@/components/common/ColorPicker";
import { useProjectStore } from "@/store";
import { MOCK_CHARACTERS } from "@/utils/mockData";
import { cn, uid } from "@/utils/id";
import type { WorkspaceKey, Character } from "@/types";

type ViewTab = "expressions" | "costumes" | "poses";

export default function Characters() {
  const workspaceKey: WorkspaceKey = "characters";
  const storeChars = useProjectStore((s) => s.characters);
  const allChars: Character[] = storeChars.length > 0 ? storeChars : MOCK_CHARACTERS;
  const [selectedId, setSelectedId] = useState(allChars[0]?.id ?? "");
  const [viewTab, setViewTab] = useState<ViewTab>("expressions");
  const [showNewChar, setShowNewChar] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#FFB6C1");
  const [newAvatar, setNewAvatar] = useState("🐰");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  void useProjectStore;

  const selected = allChars.find((c) => c.id === selectedId);
  const avatarOptions = ["🐰", "🦊", "🐻", "🐱", "🐶", "🐼", "🐨", "🐯", "🦁", "🐸", "🦄", "🐲"];

  const viewTabConfig = {
    expressions: {
      icon: <Smile size={18} />,
      title: "表情库",
      color: "from-coral-400 to-lemon-400",
      empty: "还没有表情，点击下方按钮添加吧！",
    },
    costumes: {
      icon: <Shirt size={18} />,
      title: "服装间",
      color: "from-sky-400 to-lilac-400",
      empty: "为角色搭配不同风格的服装",
    },
    poses: {
      icon: <PersonStanding size={18} />,
      title: "姿势库",
      color: "from-mint-400 to-sky-400",
      empty: "添加角色的各种动作姿势",
    },
  };

  const createCharacter = () => {
    if (!newName.trim()) return;
    setShowNewChar(false);
    setNewName("");
  };

  const viewCfg = viewTabConfig[viewTab];
  const list =
    viewTab === "expressions"
      ? selected?.expressions ?? []
      : viewTab === "costumes"
      ? selected?.costumes ?? []
      : selected?.poses ?? [];

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex">
        <div className="w-72 shrink-0 border-r border-cream-200 bg-white/50 backdrop-blur-soft p-5 overflow-auto scrollbar-candy">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-cocoa-600 flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              角色列表
            </h3>
            <button
              onClick={() => setShowNewChar(true)}
              className="p-2 rounded-candy-sm bg-coral-500 text-white shadow-candy-sm hover:shadow-candy transition-all"
              title="新建角色"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {allChars.map((char, idx) => {
              const active = char.id === selectedId;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedId(char.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-candy border-2 transition-all animate-pop group",
                    active
                      ? "border-coral-400 bg-white shadow-candy-sm scale-[1.02]"
                      : "border-transparent bg-white/60 hover:bg-white hover:border-cream-300",
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-4 border-white shadow-candy-sm shrink-0"
                      style={{ background: char.color }}
                    >
                      {char.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-lg text-cocoa-600 truncate">{char.name}</div>
                      <div className="text-xs text-cocoa-400 truncate">{char.description}</div>
                      <div className="flex gap-1 mt-1">
                        <span className="chip !py-0 !text-[10px] !px-1.5">
                          {char.expressions.length} 表情
                        </span>
                        <span className="chip !py-0 !text-[10px] !px-1.5">
                          {char.costumes.length} 服装
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => setShowNewChar(true)}
              className="w-full p-4 rounded-candy border-2 border-dashed border-cream-300 bg-cream-100/30 flex flex-col items-center gap-1 text-cocoa-400 hover:text-coral-500 hover:border-coral-400 hover:bg-coral-50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Plus size={20} />
              </div>
              <span className="font-display">创建新角色</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="px-8 pt-8 pb-4 flex items-center gap-8 bg-gradient-to-b from-cream-100/80 to-transparent">
                <div
                  className="relative w-32 h-32 rounded-3xl flex items-center justify-center text-7xl shadow-candy-lg border-8 border-white animate-float"
                  style={{ background: selected.color }}
                >
                  {selected.avatar}
                  <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-lemon-500 animate-sparkle" />
                </div>
                <div>
                  <h2 className="font-display text-4xl text-cocoa-600 mb-1">{selected.name}</h2>
                  <p className="text-cocoa-500 mb-3">{selected.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="chip bg-coral-100 !border-coral-200 !text-coral-600">
                      <Smile size={12} /> {selected.expressions.length} 种表情
                    </span>
                    <span className="chip bg-sky-100 !border-sky-200 !text-sky-600">
                      <Shirt size={12} /> {selected.costumes.length} 套服装
                    </span>
                    <span className="chip bg-mint-100 !border-mint-400/50 !text-mint-600">
                      <PersonStanding size={12} /> {selected.poses.length} 个姿势
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8">
                <Tabs
                  tabs={(["expressions", "costumes", "poses"] as ViewTab[]).map((t) => ({
                    key: t,
                    label: viewTabConfig[t].title,
                    icon: viewTabConfig[t].icon,
                  }))}
                  value={viewTab}
                  onChange={(k) => setViewTab(k as ViewTab)}
                />
              </div>

              <div className="flex-1 overflow-auto scrollbar-candy p-8 pt-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className={`font-display text-xl text-transparent bg-clip-text bg-gradient-to-r ${viewCfg.color}`}>
                    {viewCfg.title}
                  </h3>
                  <CandyButton
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    className={`bg-gradient-to-r ${viewCfg.color} text-white`}
                    onClick={() => {
                      const key = `new_${Date.now()}`;
                      setEditing(key);
                      setEditValue("");
                    }}
                  >
                    新增{viewCfg.title.slice(0, 2)}
                  </CandyButton>
                </div>

                {list.length === 0 && !editing ? (
                  <div className="rounded-candy-lg border-2 border-dashed border-cream-300 bg-cream-100/30 p-12 text-center">
                    <div className="text-6xl mb-4 animate-bounce-soft">🎨</div>
                    <p className="text-cocoa-400 mb-4">{viewCfg.empty}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {list.map((item, idx) => {
                      const isEditing = editing === item.id;
                      return (
                        <CandyCard
                          key={item.id}
                          className={cn(
                            "p-5 animate-pop overflow-hidden",
                            isEditing && `ring-2 ring-offset-2 ring-coral-400`,
                          )}
                          gradient={viewCfg.color}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <div className="flex flex-col items-center text-center">
                            {viewTab === "expressions" ? (
                              <div className="text-6xl mb-3 animate-bounce-soft">
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && editing && editValue) {
                                        setEditing(null);
                                      }
                                    }}
                                    className="text-5xl w-24 text-center bg-cream-100 rounded-lg outline-none border-2 border-coral-300"
                                    placeholder="😀"
                                  />
                                ) : (
                                  "emoji" in item ? item.emoji : "😊"
                                )}
                              </div>
                            ) : viewTab === "costumes" ? (
                              <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3 border-4 border-white shadow-candy-sm"
                                style={{ background: "color" in item ? item.color : "#DDD" }}
                              >
                                {"icon" in item ? item.icon : "👕"}
                              </div>
                            ) : (
                              <div className="text-6xl mb-3 animate-bounce-soft" style={{ animationDelay: `${idx * 100}ms` }}>
                                {"icon" in item ? item.icon : "🧍"}
                              </div>
                            )}
                            {isEditing ? (
                              <div className="w-full flex items-center gap-1">
                                <input
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && editValue) setEditing(null);
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg text-sm border-2 border-coral-300 outline-none bg-white text-cocoa-600"
                                  placeholder="输入名称..."
                                />
                                <button
                                  onClick={() => setEditing(null)}
                                  className="p-1.5 rounded-lg bg-mint-500 text-white"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setEditing(null)}
                                  className="p-1.5 rounded-lg bg-cream-200 text-cocoa-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="font-display text-lg text-cocoa-600 mb-2">{item.name}</div>
                            )}
                            {!isEditing && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setEditing(item.id);
                                    setEditValue(item.name);
                                  }}
                                  className="p-1.5 rounded-lg bg-cream-200 text-cocoa-500 hover:bg-sky-100 hover:text-sky-500 transition-colors"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  className="p-1.5 rounded-lg bg-cream-200 text-cocoa-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        </CandyCard>
                      );
                    })}

                    {editing && !list.find((i) => i.id === editing) && (
                      <CandyCard className="p-5 ring-2 ring-offset-2 ring-coral-400" gradient={viewCfg.color}>
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="text-5xl">✨</div>
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && editValue) setEditing(null);
                            }}
                            className="w-full px-3 py-2 rounded-lg text-base border-2 border-coral-300 outline-none bg-white text-center font-display text-cocoa-600"
                            placeholder={`输入${viewCfg.title.slice(0, 2)}名称...`}
                          />
                          <div className="flex gap-2">
                            <CandyButton
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditing(null)}
                            >
                              <Check size={14} /> 保存
                            </CandyButton>
                            <CandyButton size="sm" variant="soft" onClick={() => setEditing(null)}>
                              <X size={14} /> 取消
                            </CandyButton>
                          </div>
                        </div>
                      </CandyCard>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-cocoa-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎭</div>
                <p>请选择或创建一个角色</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-700/30 backdrop-blur-sm animate-pop">
          <div className="card-candy w-[520px] max-w-[90vw] p-6">
            <h3 className="font-display text-2xl text-cocoa-600 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎭</span> 创造新角色
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-5">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center text-7xl shadow-candy-lg border-4 border-white animate-bounce-soft shrink-0"
                  style={{ background: newColor }}
                >
                  {newAvatar}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-cocoa-400 block mb-1.5">选择形象</label>
                    <div className="flex flex-wrap gap-1.5">
                      {avatarOptions.map((a) => (
                        <button
                          key={a}
                          onClick={() => setNewAvatar(a)}
                          className={cn(
                            "w-10 h-10 rounded-lg text-2xl transition-all",
                            newAvatar === a
                              ? "bg-white shadow-candy-sm border-2 border-coral-400 scale-110"
                              : "bg-cream-100 hover:bg-white",
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-cocoa-500 block mb-1.5">角色名称</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如：小熊布丁"
                  className="w-full px-4 py-3 rounded-candy-sm border-2 border-cream-300 focus:border-coral-400 outline-none bg-cream-50 font-display text-lg text-cocoa-600"
                />
              </div>

              <ColorPicker label="主题色" value={newColor} onChange={setNewColor} />
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <CandyButton variant="soft" onClick={() => setShowNewChar(false)}>
                取消
              </CandyButton>
              <CandyButton
                variant="primary"
                leftIcon={<Plus size={16} />}
                onClick={createCharacter}
                disabled={!newName.trim()}
              >
                创建角色
              </CandyButton>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}

void uid;
