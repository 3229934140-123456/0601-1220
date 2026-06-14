import { useState } from "react";
import {
  FileText,
  Image,
  Video,
  Download,
  Share2,
  Users,
  MessageSquare,
  Eye,
  Edit3,
  Lock,
  Unlock,
  Send,
  Heart,
  Sparkles,
  Check,
  Music,
  Film,
  Mail,
} from "lucide-react";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import CandyCard from "@/components/common/CandyCard";
import CandyButton from "@/components/common/CandyButton";
import Tabs from "@/components/common/Tabs";
import Slider from "@/components/common/Slider";
import { useProjectStore } from "@/store";
import { FAMILY_MEMBERS } from "@/utils/mockData";
import { cn, uid, formatDate } from "@/utils/id";
import type { WorkspaceKey, FamilyMember } from "@/types";

type ExportTab = "pdf" | "images" | "video";
type SidePanel = "none" | "permissions" | "comments";

interface LocalComment {
  id: string;
  author: FamilyMember;
  content: string;
  page: number;
  createdAt: Date;
  likes: number;
}

export default function Share() {
  const workspaceKey: WorkspaceKey = "share";
  const { currentProject, orderedPages, family: storeFamily } = useProjectStore();
  void storeFamily;

  const [exportTab, setExportTab] = useState<ExportTab>("pdf");
  const [sidePanel, setSidePanel] = useState<SidePanel>("none");
  const [members, setMembers] = useState<FamilyMember[]>(FAMILY_MEMBERS);
  const [comments] = useState<LocalComment[]>([
    {
      id: "cm1",
      author: FAMILY_MEMBERS[0],
      content: "小明画的小兔子太可爱了！色彩搭配得很棒！",
      page: 2,
      createdAt: new Date(Date.now() - 3600000 * 2),
      likes: 3,
    },
    {
      id: "cm2",
      author: FAMILY_MEMBERS[4],
      content: "奶奶最喜欢第5页的宝箱，画得真精致，宝贝真棒！",
      page: 5,
      createdAt: new Date(Date.now() - 3600000 * 24),
      likes: 5,
    },
    {
      id: "cm3",
      author: FAMILY_MEMBERS[1],
      content: "下次可以试试给狐狸加个小帽子哦，会更神气～",
      page: 3,
      createdAt: new Date(Date.now() - 3600000 * 6),
      likes: 2,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [pdfQuality, setPdfQuality] = useState(90);
  const [imageSize, setImageSize] = useState("large");
  const [videoMusic, setVideoMusic] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState(5);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exported, setExported] = useState(false);

  const totalPages = orderedPages.length;

  const runExport = () => {
    setExported(false);
    setExportProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setExportProgress(100);
        setTimeout(() => {
          setExported(true);
          setExportProgress(null);
        }, 600);
      } else {
        setExportProgress(p);
      }
    }, 300);
  };

  const toggleMemberPerm = (id: string, key: "canComment" | "canEdit") => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: !m[key] } : m)));
  };

  const exportConfig = {
    pdf: {
      icon: <FileText size={28} />,
      title: "PDF 电子书",
      desc: "导出为标准 PDF 格式，方便打印和分享",
      color: "from-coral-400 to-peach-400",
      accent: "#FF6B6B",
    },
    images: {
      icon: <Image size={28} />,
      title: "图片集打包",
      desc: "每页导出为高清图片，ZIP 压缩下载",
      color: "from-sky-400 to-mint-400",
      accent: "#4ECDC4",
    },
    video: {
      icon: <Film size={28} />,
      title: "朗读视频",
      desc: "自动翻页 + 语音朗读 + 背景音乐，导出 MP4",
      color: "from-lilac-400 via-sky-400 to-mint-400",
      accent: "#A882D8",
    },
  };
  const cfg = exportConfig[exportTab];

  return (
    <WorkspaceLayout currentKey={workspaceKey}>
      <div className="h-full flex">
        <div className="flex-1 overflow-auto scrollbar-candy p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-candy p-6 overflow-hidden relative">
              <div
                className={`absolute inset-0 opacity-20 bg-gradient-to-br ${cfg.color}`}
              />
              <div className="relative z-10">
                <div className="flex items-start gap-5">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cfg.color} text-white shadow-candy-lg flex items-center justify-center animate-bounce-soft`}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-3xl text-cocoa-600 mb-1">
                      {cfg.title}
                    </h2>
                    <p className="text-cocoa-500 mb-4">{cfg.desc}</p>

                    <Tabs
                      tabs={[
                        { key: "pdf", label: "PDF", icon: <FileText size={14} /> },
                        { key: "images", label: "图片", icon: <Image size={14} /> },
                        { key: "video", label: "视频", icon: <Video size={14} /> },
                      ]}
                      value={exportTab}
                      onChange={(k) => setExportTab(k as ExportTab)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CandyCard
                title="⚙️ 导出设置"
                subtitle={`根据 ${cfg.title} 格式调整参数`}
                gradient={cfg.color}
              >
                <div className="p-5 pt-0 space-y-5">
                  {exportTab === "pdf" && (
                    <>
                      <Slider
                        label="图片质量"
                        value={pdfQuality}
                        showValue
                        unit="%"
                        onChange={setPdfQuality}
                        accentColor={cfg.accent}
                      />
                      <div>
                        <label className="text-sm font-medium text-cocoa-500 block mb-2">
                          页面尺寸
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { k: "A4", v: "标准" },
                            { k: "A5", v: "便携" },
                            { k: "SQR", v: "方形" },
                          ].map((o, i) => (
                            <button
                              key={o.k}
                              className={cn(
                                "p-3 rounded-candy-sm border-2 transition-all",
                                i === 0
                                  ? `border-coral-400 bg-coral-50 shadow-sm`
                                  : "border-cream-200 bg-white hover:border-cream-300",
                              )}
                            >
                              <div className="font-display text-lg text-cocoa-600">{o.k}</div>
                              <div className="text-xs text-cocoa-400">{o.v}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { k: "包含封面与封底", c: true },
                          { k: "添加页码数字", c: true },
                          { k: "添加作者水印", c: false },
                          { k: "生成书签目录", c: true },
                        ].map((o, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-candy-sm bg-cream-100/50 hover:bg-cream-100 cursor-pointer"
                          >
                            <div
                              className={cn(
                                "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                                o.c
                                  ? "bg-coral-500 border-coral-500 text-white"
                                  : "bg-white border-cream-300",
                              )}
                            >
                              {o.c && <Check size={14} />}
                            </div>
                            <span className="text-sm text-cocoa-600">{o.k}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {exportTab === "images" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-cocoa-500 block mb-2">
                          图片大小
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { k: "small", v: "1024px", d: "分享用" },
                            { k: "large", v: "2048px", d: "推荐" },
                            { k: "xl", v: "4096px", d: "高清" },
                          ].map((o) => (
                            <button
                              key={o.k}
                              onClick={() => setImageSize(o.k)}
                              className={cn(
                                "p-3 rounded-candy-sm border-2 transition-all",
                                imageSize === o.k
                                  ? "border-sky-400 bg-sky-50 shadow-sm"
                                  : "border-cream-200 bg-white hover:border-cream-300",
                              )}
                            >
                              <div className="font-display text-base text-cocoa-600">{o.v}</div>
                              <div className="text-xs text-cocoa-400">{o.d}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Slider
                        label="JPG 压缩质量"
                        value={85}
                        showValue
                        unit="%"
                        onChange={() => {}}
                        accentColor={cfg.accent}
                      />
                      <div>
                        <label className="text-sm font-medium text-cocoa-500 block mb-2">
                          图片格式
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {["JPG", "PNG", "WEBP", "AVIF"].map((f, i) => (
                            <button
                              key={f}
                              className={cn(
                                "p-2.5 rounded-candy-sm border-2 font-display text-sm transition-all",
                                i === 0
                                  ? "border-sky-400 bg-sky-50 text-sky-600"
                                  : "border-cream-200 bg-white text-cocoa-500 hover:border-cream-300",
                              )}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {exportTab === "video" && (
                    <>
                      <Slider
                        label="每页停留"
                        value={videoSpeed}
                        min={2}
                        max={15}
                        showValue
                        unit="秒"
                        onChange={setVideoSpeed}
                        accentColor={cfg.accent}
                      />
                      <div className="space-y-2">
                        <label
                          onClick={() => setVideoMusic(!videoMusic)}
                          className="flex items-center justify-between p-3 rounded-candy-sm bg-mint-50/50 hover:bg-mint-50 cursor-pointer border border-mint-200"
                        >
                          <span className="flex items-center gap-2 text-sm text-cocoa-600">
                            <Music size={16} className="text-mint-500" />
                            添加背景音乐
                          </span>
                          <div
                            className={cn(
                              "relative w-12 h-7 rounded-full transition-colors",
                              videoMusic ? "bg-mint-500" : "bg-cream-300",
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all",
                                videoMusic ? "left-[22px]" : "left-0.5",
                              )}
                            />
                          </div>
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-candy-sm bg-sky-50/50 hover:bg-sky-50 cursor-pointer border border-sky-200">
                          <span className="flex items-center gap-2 text-sm text-cocoa-600">
                            <MessageSquare size={16} className="text-sky-500" />
                            语音朗读对白
                          </span>
                          <div className="relative w-12 h-7 rounded-full bg-sky-500">
                            <div className="absolute top-0.5 left-[22px] w-6 h-6 bg-white rounded-full shadow" />
                          </div>
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-candy-sm bg-lemon-50/50 hover:bg-lemon-50 cursor-pointer border border-lemon-200">
                          <span className="flex items-center gap-2 text-sm text-cocoa-600">
                            <Sparkles size={16} className="text-lemon-500" />
                            翻页过场动画
                          </span>
                          <div className="relative w-12 h-7 rounded-full bg-lemon-500">
                            <div className="absolute top-0.5 left-[22px] w-6 h-6 bg-white rounded-full shadow" />
                          </div>
                        </label>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-cocoa-500 block mb-2">
                          分辨率
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["720P", "1080P", "4K"].map((r, i) => (
                            <button
                              key={r}
                              className={cn(
                                "p-2.5 rounded-candy-sm border-2 font-display text-base transition-all",
                                i === 1
                                  ? "border-lilac-400 bg-lilac-50 text-lilac-600 shadow-sm"
                                  : "border-cream-200 bg-white text-cocoa-500",
                              )}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CandyCard>

              <CandyCard
                title="📊 信息概览"
                subtitle={`${currentProject?.title ?? ""} · 导出内容预览`}
                gradient="from-lemon-400 via-coral-400 to-peach-400"
              >
                <div className="p-5 pt-0 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-candy bg-gradient-to-r from-cream-100 to-lemon-100/60 border border-lemon-200/50">
                    <div
                      className="w-16 h-20 rounded-candy-sm flex items-center justify-center text-4xl shrink-0 shadow-sm"
                      style={{ background: currentProject?.coverColor || "#FFE66D" }}
                    >
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-2xl text-cocoa-600 truncate">
                        {currentProject?.title ?? "未命名绘本"}
                      </div>
                      <div className="text-sm text-cocoa-500">
                        ✍️ {currentProject?.author ?? "亲子创作"} · 📄 共 {totalPages} 页
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-cocoa-400">
                        <span>💬 {orderedPages.reduce((s, p) => s + p.textBubbles.length, 0)} 对白</span>
                        <span>·</span>
                        <span>🧸 {orderedPages.reduce((s, p) => s + p.stickers.length, 0)} 贴纸</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-candy-sm bg-coral-50 text-center border border-coral-100">
                      <div className="text-3xl font-display text-coral-500">{totalPages}</div>
                      <div className="text-xs text-cocoa-500">总页数</div>
                    </div>
                    <div className="p-3 rounded-candy-sm bg-sky-50 text-center border border-sky-100">
                      <div className="text-3xl font-display text-sky-500">
                        {exportTab === "video" ? `${Math.ceil(totalPages * videoSpeed / 60)}:${String((totalPages * videoSpeed) % 60).padStart(2, "0")}` : `<20`}
                      </div>
                      <div className="text-xs text-cocoa-500">
                        {exportTab === "video" ? "时长(分:秒)" : "文件大小(MB)"}
                      </div>
                    </div>
                    <div className="p-3 rounded-candy-sm bg-lilac-50 text-center border border-lilac-100">
                      <div className="text-3xl font-display text-lilac-500">
                        {exportTab === "pdf" ? "PDF" : exportTab === "images" ? "ZIP" : "MP4"}
                      </div>
                      <div className="text-xs text-cocoa-500">文件格式</div>
                    </div>
                  </div>

                  {exportProgress !== null ? (
                    <div className="p-4 rounded-candy bg-gradient-to-r from-mint-50 to-sky-50 border border-mint-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-cocoa-600 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-lemon-500 animate-sparkle" />
                          正在生成...
                        </span>
                        <span className="font-display text-2xl rainbow-text">
                          {Math.round(exportProgress)}%
                        </span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rainbow bg-[length:200%_auto] animate-rainbow transition-all rounded-full"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : exported ? (
                    <div className="p-4 rounded-candy bg-mint-50 border-2 border-mint-300 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-mint-500 text-white flex items-center justify-center shadow-candy-sm">
                        <Check size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-xl text-mint-600">生成成功！🎉</div>
                        <div className="text-sm text-cocoa-500">文件已准备好，点击下方按钮下载</div>
                      </div>
                    </div>
                  ) : null}

                  <CandyButton
                    variant={exported ? "rainbow" : "primary"}
                    size="lg"
                    leftIcon={exported ? <Download size={18} /> : <Sparkles size={18} />}
                    className="w-full"
                    onClick={runExport}
                  >
                    {exported ? "立即下载文件" : `开始生成 ${cfg.title}`}
                  </CandyButton>
                </div>
              </CandyCard>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CandyCard
                className="cursor-pointer transition-all hover:shadow-candy-lg hover:-translate-y-1"
                onClick={() => setSidePanel(sidePanel === "permissions" ? "none" : "permissions")}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-lilac-400 text-white flex items-center justify-center shadow-candy-sm">
                    <Users size={30} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-cocoa-600">家人评论权限</h3>
                    <p className="text-sm text-cocoa-500">
                      {members.filter((m) => m.canComment).length} / {members.length} 人可以评论
                    </p>
                    <div className="flex -space-x-2 mt-2">
                      {members.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-lg shadow-sm"
                        >
                          {m.avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sky-500">
                    {sidePanel === "permissions" ? "▲" : "▼"}
                  </div>
                </div>
              </CandyCard>

              <CandyCard
                className="cursor-pointer transition-all hover:shadow-candy-lg hover:-translate-y-1"
                onClick={() => setSidePanel(sidePanel === "comments" ? "none" : "comments")}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-peach-400 to-coral-400 text-white flex items-center justify-center shadow-candy-sm">
                    <MessageSquare size={30} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-cocoa-600">家人留言互动</h3>
                    <p className="text-sm text-cocoa-500">
                      收到 {comments.length} 条暖心评论
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-coral-400 text-sm">
                      <Heart size={14} fill="currentColor" />
                      共 {comments.reduce((s, c) => s + c.likes, 0)} 个点赞
                    </div>
                  </div>
                  <div className="text-coral-500">
                    {sidePanel === "comments" ? "▲" : "▼"}
                  </div>
                </div>
              </CandyCard>
            </div>

            <div className="card-candy p-6 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-lemon-300/30 to-coral-300/30 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl text-cocoa-600 mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-coral-500" />
                  其他分享方式
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { i: "📧", t: "邮件分享", d: "发给家人" },
                    { i: "🔗", t: "生成链接", d: "7天有效" },
                    { i: "📱", t: "二维码", d: "扫码阅读" },
                    { i: "👨‍👩‍👧", t: "家庭云", d: "同步相册" },
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      className="group p-4 rounded-candy border-2 border-cream-200 bg-white hover:border-coral-300 hover:bg-coral-50 hover:-translate-y-1 hover:shadow-candy-sm transition-all text-center animate-pop"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="text-4xl mb-2 group-hover:animate-wiggle">{s.i}</div>
                      <div className="font-display text-lg text-cocoa-600">{s.t}</div>
                      <div className="text-xs text-cocoa-400">{s.d}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-l border-cream-200 bg-white/70 backdrop-blur-soft transition-all duration-300 overflow-hidden",
            sidePanel !== "none" ? "w-[400px]" : "w-0",
          )}
        >
          {sidePanel === "permissions" && (
            <div className="p-5 space-y-4 h-full overflow-auto scrollbar-candy">
              <h3 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
                <Users className="w-6 h-6 text-sky-500" />
                家人管理
              </h3>
              <p className="text-sm text-cocoa-500">
                设置每位家庭成员的评论和编辑权限
              </p>
              <div className="space-y-3">
                {members.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-candy border-2 border-cream-200 bg-white animate-pop"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl shrink-0">
                        {m.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-lg text-cocoa-600">{m.name}</div>
                        <div className="text-xs text-cocoa-400">{m.role}</div>
                      </div>
                      <Mail className="w-4 h-4 text-cocoa-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-cream-100/60">
                        <span className="flex items-center gap-2 text-sm text-cocoa-600">
                          <MessageSquare size={14} className="text-coral-500" />
                          允许评论
                        </span>
                        <button
                          onClick={() => toggleMemberPerm(m.id, "canComment")}
                          className={cn(
                            "relative w-12 h-7 rounded-full transition-colors",
                            m.canComment ? "bg-coral-500" : "bg-cream-300",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all flex items-center justify-center",
                              m.canComment ? "left-[22px]" : "left-0.5",
                            )}
                          >
                            {m.canComment ? <Unlock size={11} className="text-coral-500" /> : <Lock size={11} className="text-cocoa-400" />}
                          </div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-cream-100/60">
                        <span className="flex items-center gap-2 text-sm text-cocoa-600">
                          <Edit3 size={14} className="text-sky-500" />
                          允许编辑
                        </span>
                        <button
                          onClick={() => toggleMemberPerm(m.id, "canEdit")}
                          className={cn(
                            "relative w-12 h-7 rounded-full transition-colors",
                            m.canEdit ? "bg-sky-500" : "bg-cream-300",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all flex items-center justify-center",
                              m.canEdit ? "left-[22px]" : "left-0.5",
                            )}
                          >
                            {m.canEdit ? <Unlock size={11} className="text-sky-500" /> : <Lock size={11} className="text-cocoa-400" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full p-3 rounded-candy border-2 border-dashed border-cream-300 text-cocoa-400 hover:text-coral-500 hover:border-coral-400 hover:bg-coral-50 transition-all flex items-center justify-center gap-2">
                  <Users size={16} />
                  <span className="font-display">邀请新成员</span>
                </button>
              </div>
            </div>
          )}

          {sidePanel === "comments" && (
            <div className="h-full flex flex-col">
              <div className="p-5 border-b border-cream-200">
                <h3 className="font-display text-2xl text-cocoa-600 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-coral-500" />
                  家人留言
                </h3>
                <p className="text-sm text-cocoa-500">
                  共 {comments.length} 条温暖的话
                </p>
              </div>
              <div className="flex-1 overflow-auto scrollbar-candy p-5 space-y-4">
                {comments.map((c, idx) => (
                  <div
                    key={c.id}
                    className="animate-pop"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-cream-200 flex items-center justify-center text-2xl shrink-0 border-2 border-white shadow-sm">
                        {c.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-base text-cocoa-600">{c.author.name}</span>
                          <span className="chip !py-0 !text-[10px] !px-1.5">P{c.page}</span>
                        </div>
                        <div className="p-3 rounded-2xl rounded-tl-md bg-cream-100 text-sm text-cocoa-600 leading-relaxed">
                          {c.content}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-cocoa-400 pl-1">
                          <span>{formatDate(c.createdAt)}</span>
                          <button className="flex items-center gap-1 hover:text-coral-500 transition-colors">
                            <Heart size={12} /> {c.likes}
                          </button>
                          <button className="hover:text-sky-500 transition-colors flex items-center gap-1">
                            <Eye size={12} /> 回复
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-cream-200 bg-white/60 backdrop-blur-soft">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center text-xl shrink-0">
                    {FAMILY_MEMBERS[2].avatar}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="写点温暖的话鼓励一下..."
                      className="w-full px-4 py-2.5 pr-12 rounded-full border-2 border-cream-300 focus:border-coral-400 outline-none bg-white text-sm text-cocoa-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newComment.trim()) {
                          setNewComment("");
                        }
                      }}
                    />
                    <button
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-coral-500 text-white hover:bg-coral-400 transition-colors disabled:opacity-40"
                      disabled={!newComment.trim()}
                      onClick={() => setNewComment("")}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

void uid;
