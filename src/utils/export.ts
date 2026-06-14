import type { Page, Project } from "@/types";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function generateFilename(project: Project, suffix: string, extension: string) {
  const safeTitle = project.title.replace(/[<>:"/\\|?*]/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${safeTitle}_${suffix}_${dateStr}.${extension}`;
}

function buildPageHtml(page: Page, index: number) {
  return `
    <div style="page-break-after: always; padding: 40px; min-height: 800px; background: ${page.background.value}; position: relative;">
      <div style="position: absolute; top: 20px; right: 40px; font-family: 'Noto Sans SC', sans-serif; color: #999; font-size: 12px;">
        P ${index + 1}
      </div>
      ${page.sceneDescription ? `<div style="margin-bottom: 20px; font-family: 'Noto Sans SC', sans-serif; color: #666; font-size: 14px;">${page.sceneDescription}</div>` : ""}
      <div style="font-family: 'ZCOOL KuaiLe', cursive; font-size: 48px; text-align: center; color: #5D4E37; margin-top: 100px;">
        ${page.sceneDescription || `第 ${index + 1} 页`}
      </div>
      <div style="text-align: center; margin-top: 60px; font-size: 120px;">
        ${page.stickers.length > 0 ? "📖" : "🎨"}
      </div>
    </div>
  `;
}

export async function exportPDF(project: Project, pages: Page[], options?: { size?: "A4" | "A5" | "SQR"; includeCover?: boolean }) {
  const size = options?.size ?? "A4";
  const includeCover = options?.includeCover ?? true;

  const pageSizeCss = size === "A4" ? "width: 210mm; height: 297mm;" :
    size === "A5" ? "width: 148mm; height: 210mm;" :
    "width: 200mm; height: 200mm;";

  const contentPages = includeCover ? pages : pages.filter((_, i) => i > 0 && i < pages.length - 1);

  const pagesHtml = contentPages.map((p, i) => buildPageHtml(p, i)).join("");

  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${project.title}</title>
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: ${size}; margin: 0; }
  body { margin: 0; padding: 0; font-family: 'Noto Sans SC', sans-serif; }
  * { box-sizing: border-box; }
</style>
</head>
<body style="${pageSizeCss}">
  ${pagesHtml}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  triggerDownload(blob, generateFilename(project, "绘本电子书", "html"));

  const pdfInfo = {
    title: project.title,
    author: project.author,
    pages: contentPages.length,
    size,
    createdAt: new Date().toISOString(),
  };

  const infoBlob = new Blob([JSON.stringify(pdfInfo, null, 2)], { type: "application/json" });
  setTimeout(() => triggerDownload(infoBlob, generateFilename(project, "绘本信息", "json")), 500);

  return { filename: generateFilename(project, "绘本电子书", "html"), pages: contentPages.length };
}

export async function exportImages(project: Project, pages: Page[], options?: { quality?: number; format?: "png" | "jpeg" }) {
  const format = options?.format ?? "png";
  const quality = options?.quality ?? 0.9;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.fillStyle = page.background.value.startsWith("#") ? page.background.value : "#FFFAF0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (page.texture && page.texture.value !== "none") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = "bold 36px 'ZCOOL KuaiLe', sans-serif";
    ctx.fillStyle = "#5D4E37";
    ctx.textAlign = "center";
    ctx.fillText(page.sceneDescription || `第 ${i + 1} 页`, canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = "120px sans-serif";
    ctx.fillText(page.stickers.length > 0 ? "📖" : "🎨", canvas.width / 2, canvas.height / 2 + 80);

    ctx.font = "14px 'Noto Sans SC', sans-serif";
    ctx.fillStyle = "#999";
    ctx.textAlign = "right";
    ctx.fillText(`P ${i + 1}`, canvas.width - 40, 40);

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let j = 0; j < byteString.length; j++) ia[j] = byteString.charCodeAt(j);
    const blob = new Blob([ab], { type: mimeType });

    const pageNum = String(i + 1).padStart(3, "0");
    triggerDownload(blob, generateFilename(project, `page_${pageNum}`, format));

    await new Promise((r) => setTimeout(r, 200));
  }

  return { count: pages.length, format };
}

export async function exportVideo(project: Project, pages: Page[], options?: { music?: boolean }) {
  const frames: string[] = [];
  const music = options?.music ?? true;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#FFE66D");
    gradient.addColorStop(0.5, "#FF9AA2");
    gradient.addColorStop(1, "#87CEEB");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.font = "bold 32px 'ZCOOL KuaiLe', sans-serif";
    ctx.fillStyle = "#5D4E37";
    ctx.textAlign = "center";
    ctx.fillText(page.sceneDescription || `第 ${i + 1} 页`, canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = "80px sans-serif";
    ctx.fillText(page.stickers.length > 0 ? "📖" : "🎨", canvas.width / 2, canvas.height / 2 + 60);

    ctx.font = "bold 24px 'ZCOOL KuaiLe', sans-serif";
    ctx.fillStyle = "#FF6B6B";
    ctx.textAlign = "left";
    ctx.fillText(`🌈 ${project.title}`, 60, 80);

    ctx.font = "16px 'Noto Sans SC', sans-serif";
    ctx.fillStyle = "#999";
    ctx.textAlign = "right";
    ctx.fillText(`${i + 1} / ${pages.length}`, canvas.width - 60, canvas.height - 60);

    frames.push(canvas.toDataURL("image/png"));
  }

  const videoData = {
    title: project.title,
    author: project.author,
    totalPages: pages.length,
    frameCount: frames.length,
    music,
    createdAt: new Date().toISOString(),
    frames: frames.map((_, i) => `frame_${String(i + 1).padStart(3, "0")}.png`),
    narration: pages.map((p, i) => `第${i + 1}页：${p.sceneDescription || "无描述"}`).join("。"),
  };

  for (let i = 0; i < frames.length; i++) {
    const byteString = atob(frames[i].split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let j = 0; j < byteString.length; j++) ia[j] = byteString.charCodeAt(j);
    const blob = new Blob([ab], { type: "image/png" });
    const frameNum = String(i + 1).padStart(3, "0");
    triggerDownload(blob, generateFilename(project, `video_frame_${frameNum}`, "png"));
    await new Promise((r) => setTimeout(r, 100));
  }

  const jsonBlob = new Blob([JSON.stringify(videoData, null, 2)], { type: "application/json" });
  setTimeout(() => triggerDownload(jsonBlob, generateFilename(project, "朗读视频_配置", "json")), 500);

  const srtContent = pages.map((p, i) => {
    const start = String(Math.floor(i * 3 / 3600)).padStart(2, "0") + ":" +
      String(Math.floor((i * 3 % 3600) / 60)).padStart(2, "0") + ":" +
      String(i * 3 % 60).padStart(2, "0") + ",000";
    const end = String(Math.floor((i + 1) * 3 / 3600)).padStart(2, "0") + ":" +
      String(Math.floor(((i + 1) * 3 % 3600) / 60)).padStart(2, "0") + ":" +
      String((i + 1) * 3 % 60).padStart(2, "0") + ",000";
    return `${i + 1}\n${start} --> ${end}\n${p.sceneDescription || `第${i + 1}页`}\n`;
  }).join("\n");

  const srtBlob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
  setTimeout(() => triggerDownload(srtBlob, generateFilename(project, "朗读视频_字幕", "srt")), 800);

  return { frameCount: frames.length, hasMusic: music };
}

export async function exportProjectBackup(project: Project, pages: Page[]) {
  const backup = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    project,
    pages,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  triggerDownload(blob, generateFilename(project, "项目备份", "rainbowbook"));
  return { filename: generateFilename(project, "项目备份", "rainbowbook") };
}
