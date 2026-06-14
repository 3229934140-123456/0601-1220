import { create } from "zustand";
import {
  Character,
  ColorTheme,
  DrawStroke,
  DrawingTool,
  DrawingToolType,
  FamilyMember,
  ID,
  Layer,
  Page,
  Project,
  StickerAsset,
  StickerInstance,
  TextBubble,
  WorkspaceKey,
} from "@/types";
import {
  COLOR_THEMES,
  createMockPages,
  createSampleProjects,
  FAMILY_MEMBERS,
  MOCK_CHARACTERS,
  STICKER_ASSETS,
} from "@/utils/mockData";
import { uid } from "@/utils/id";

interface ProjectState {
  projects: Project[];
  currentProjectId: ID | null;
  pages: Page[];
  currentPageId: ID | null;
  characters: Character[];
  family: FamilyMember[];
  stickerAssets: StickerAsset[];
  themes: ColorTheme[];
  activeThemeId: ID | null;
  setCurrentProject: (id: ID | null) => void;
  setCurrentPage: (id: ID | null) => void;
  createProject: (title?: string) => Project;
  addPage: (afterId?: ID) => void;
  removePage: (id: ID) => void;
  reorderPages: (startIndex: number, endIndex: number) => void;
  updatePageBackground: (pageId: ID, value: string) => void;
  updatePageDescription: (pageId: ID, desc: string) => void;
  addStroke: (pageId: ID, stroke: DrawStroke) => void;
  addTextBubble: (pageId: ID, bubble: Omit<TextBubble, "id" | "pageId">) => void;
  updateTextBubble: (pageId: ID, bubbleId: ID, patch: Partial<TextBubble>) => void;
  removeTextBubble: (pageId: ID, bubbleId: ID) => void;
  addSticker: (pageId: ID, sticker: Omit<StickerInstance, "id" | "pageId">) => void;
  updateSticker: (pageId: ID, stickerId: ID, patch: Partial<StickerInstance>) => void;
  removeSticker: (pageId: ID, stickerId: ID) => void;
  setActiveTheme: (themeId: ID | null) => void;
  updateProjectTitle: (title: string) => void;
  updateProjectAuthor: (author: string) => void;
  get currentProject(): Project | undefined;
  get currentPage(): Page | undefined;
  get orderedPages(): Page[];
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const sampleProjects = createSampleProjects();
  const initialPages = createMockPages("p1");
  const initialCharacters = MOCK_CHARACTERS;

  return {
    projects: sampleProjects,
    currentProjectId: sampleProjects[0]?.id ?? null,
    pages: initialPages,
    currentPageId: initialPages[0]?.id ?? null,
    characters: initialCharacters,
    family: FAMILY_MEMBERS,
    stickerAssets: STICKER_ASSETS,
    themes: COLOR_THEMES,
    activeThemeId: COLOR_THEMES[0].id,

    get currentProject() {
      const { projects, currentProjectId } = get();
      return projects.find((p) => p.id === currentProjectId);
    },

    get currentPage() {
      const { pages, currentPageId } = get();
      return pages.find((p) => p.id === currentPageId);
    },

    get orderedPages() {
      return [...get().pages].sort((a, b) => a.pageNumber - b.pageNumber);
    },

    setCurrentProject: (id) => set({ currentProjectId: id }),
    setCurrentPage: (id) => set({ currentPageId: id }),

    createProject: (title = "新绘本") => {
      const newProject: Project = {
        id: uid(),
        title,
        author: "创作者",
        coverColor: "#FFE66D",
        totalPages: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const firstPage: Page = {
        id: uid(),
        projectId: newProject.id,
        pageNumber: 1,
        background: { type: "color", value: "#FFFAF0", name: "米白" },
        sceneDescription: "",
        strokes: [],
        textBubbles: [],
        stickers: [],
        characterRelations: [],
      };
      set((state) => ({
        projects: [newProject, ...state.projects],
        currentProjectId: newProject.id,
        pages: [firstPage, ...state.pages],
        currentPageId: firstPage.id,
      }));
      return newProject;
    },

    addPage: (afterId) => {
      const state = get();
      const ordered = state.orderedPages;
      const afterIdx = afterId
        ? ordered.findIndex((p) => p.id === afterId)
        : ordered.length - 1;
      const newNumber = afterIdx + 2;
      const newPage: Page = {
        id: uid(),
        projectId: state.currentProjectId ?? "",
        pageNumber: newNumber,
        background: { type: "color", value: "#FFFAF0", name: "米白" },
        sceneDescription: "",
        strokes: [],
        textBubbles: [],
        stickers: [],
        characterRelations: [],
      };
      const updated = ordered.map((p) =>
        p.pageNumber >= newNumber ? { ...p, pageNumber: p.pageNumber + 1 } : p,
      );
      set({ pages: [newPage, ...updated], currentPageId: newPage.id });
    },

    removePage: (id) => {
      const state = get();
      const page = state.pages.find((p) => p.id === id);
      if (!page) return;
      const ordered = state.orderedPages.filter((p) => p.id !== id);
      const renumbered = ordered.map((p, i) => ({ ...p, pageNumber: i + 1 }));
      set({
        pages: renumbered,
        currentPageId: renumbered[Math.max(0, page.pageNumber - 2)]?.id ?? renumbered[0]?.id ?? null,
      });
    },

    reorderPages: (startIndex, endIndex) => {
      const ordered = [...get().orderedPages];
      const [moved] = ordered.splice(startIndex, 1);
      ordered.splice(endIndex, 0, moved);
      const renumbered = ordered.map((p, i) => ({ ...p, pageNumber: i + 1 }));
      set({ pages: renumbered });
    },

    updatePageBackground: (pageId, value) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, background: { type: "color", value, name: value } } : p,
        ),
      }));
    },

    updatePageDescription: (pageId, desc) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, sceneDescription: desc } : p,
        ),
      }));
    },

    addStroke: (pageId, stroke) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, strokes: [...p.strokes, stroke] } : p,
        ),
      }));
    },

    addTextBubble: (pageId, bubble) => {
      const id = uid();
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, textBubbles: [...p.textBubbles, { ...bubble, id, pageId }] }
            : p,
        ),
      }));
    },

    updateTextBubble: (pageId, bubbleId, patch) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                textBubbles: p.textBubbles.map((b) =>
                  b.id === bubbleId ? { ...b, ...patch } : b,
                ),
              }
            : p,
        ),
      }));
    },

    removeTextBubble: (pageId, bubbleId) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, textBubbles: p.textBubbles.filter((b) => b.id !== bubbleId) }
            : p,
        ),
      }));
    },

    addSticker: (pageId, sticker) => {
      const id = uid();
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, stickers: [...p.stickers, { ...sticker, id, pageId }] }
            : p,
        ),
      }));
    },

    updateSticker: (pageId, stickerId, patch) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                stickers: p.stickers.map((s) =>
                  s.id === stickerId ? { ...s, ...patch } : s,
                ),
              }
            : p,
        ),
      }));
    },

    removeSticker: (pageId, stickerId) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, stickers: p.stickers.filter((s) => s.id !== stickerId) }
            : p,
        ),
      }));
    },

    setActiveTheme: (themeId) => set({ activeThemeId: themeId }),
    updateProjectTitle: (title) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === state.currentProjectId ? { ...p, title, updatedAt: new Date() } : p,
        ),
      }));
    },
    updateProjectAuthor: (author) => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === state.currentProjectId ? { ...p, author, updatedAt: new Date() } : p,
        ),
      }));
    },
  };
});

interface DrawingState {
  tool: DrawingTool;
  layers: Layer[];
  activeLayerId: ID | null;
  undoStack: DrawStroke[][];
  redoStack: DrawStroke[][];
  setToolType: (type: DrawingToolType) => void;
  setToolColor: (color: string) => void;
  setToolSize: (size: number) => void;
  setToolOpacity: (opacity: number) => void;
  setActiveLayer: (id: ID | null) => void;
  toggleLayerVisible: (id: ID) => void;
  toggleLayerLocked: (id: ID) => void;
  moveLayerUp: (id: ID) => void;
  moveLayerDown: (id: ID) => void;
  addLayer: (name?: string) => void;
  removeLayer: (id: ID) => void;
  undo: () => void;
  redo: () => void;
}

const INITIAL_TOOL: DrawingTool = {
  type: "pencil",
  name: "铅笔",
  color: "#5D4E37",
  size: 4,
  opacity: 1,
};

function createInitialLayers(): Layer[] {
  return [
    {
      id: "layer1",
      pageId: "",
      name: "背景层",
      type: "background",
      visible: true,
      locked: false,
      opacity: 1,
      orderIndex: 0,
    },
    {
      id: "layer2",
      pageId: "",
      name: "线稿层",
      type: "sketch",
      visible: true,
      locked: false,
      opacity: 1,
      orderIndex: 1,
    },
    {
      id: "layer3",
      pageId: "",
      name: "上色层",
      type: "paint",
      visible: true,
      locked: false,
      opacity: 1,
      orderIndex: 2,
    },
  ];
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  tool: INITIAL_TOOL,
  layers: createInitialLayers(),
  activeLayerId: "layer2",
  undoStack: [],
  redoStack: [],

  setToolType: (type) => {
    const names: Record<DrawingToolType, string> = {
      pencil: "铅笔",
      watercolor: "水彩",
      crayon: "蜡笔",
      marker: "马克笔",
      eraser: "橡皮",
    };
    set((state) => ({ tool: { ...state.tool, type, name: names[type] } }));
  },
  setToolColor: (color) => set((state) => ({ tool: { ...state.tool, color } })),
  setToolSize: (size) => set((state) => ({ tool: { ...state.tool, size } })),
  setToolOpacity: (opacity) => set((state) => ({ tool: { ...state.tool, opacity } })),

  setActiveLayer: (id) => set({ activeLayerId: id }),
  toggleLayerVisible: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    }));
  },
  toggleLayerLocked: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)),
    }));
  },
  moveLayerUp: (id) => {
    const layers = [...get().layers];
    const idx = layers.findIndex((l) => l.id === id);
    if (idx < layers.length - 1) {
      [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      layers.forEach((l, i) => (l.orderIndex = i));
      set({ layers });
    }
  },
  moveLayerDown: (id) => {
    const layers = [...get().layers];
    const idx = layers.findIndex((l) => l.id === id);
    if (idx > 0) {
      [layers[idx], layers[idx - 1]] = [layers[idx - 1], layers[idx]];
      layers.forEach((l, i) => (l.orderIndex = i));
      set({ layers });
    }
  },
  addLayer: (name = "新图层") => {
    const layers = [...get().layers];
    const newLayer: Layer = {
      id: uid(),
      pageId: "",
      name: `${name} ${layers.length + 1}`,
      type: "paint",
      visible: true,
      locked: false,
      opacity: 1,
      orderIndex: layers.length,
    };
    layers.push(newLayer);
    set({ layers, activeLayerId: newLayer.id });
  },
  removeLayer: (id) => {
    const state = get();
    if (state.layers.length <= 1) return;
    const layers = state.layers.filter((l) => l.id !== id);
    layers.forEach((l, i) => (l.orderIndex = i));
    set({
      layers,
      activeLayerId:
        state.activeLayerId === id ? layers[layers.length - 1].id : state.activeLayerId,
    });
  },

  undo: () => {
    // 简化：清空撤销栈以模拟
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const newUndo = [...state.undoStack];
      const strokes = newUndo.pop() ?? [];
      return { undoStack: newUndo, redoStack: [...state.redoStack, strokes] };
    });
  },
  redo: () => {
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const newRedo = [...state.redoStack];
      const strokes = newRedo.pop() ?? [];
      return { redoStack: newRedo, undoStack: [...state.undoStack, strokes] };
    });
  },
}));

interface UIState {
  activeWorkspace: WorkspaceKey;
  showProjectsPanel: boolean;
  showLayersPanel: boolean;
  showStickersPanel: boolean;
  zoom: number;
  gridVisible: boolean;
  setActiveWorkspace: (key: WorkspaceKey) => void;
  toggleProjectsPanel: () => void;
  toggleLayersPanel: () => void;
  toggleStickersPanel: () => void;
  setZoom: (zoom: number) => void;
  setGridVisible: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeWorkspace: "home",
  showProjectsPanel: false,
  showLayersPanel: true,
  showStickersPanel: false,
  zoom: 1,
  gridVisible: true,

  setActiveWorkspace: (key) => set({ activeWorkspace: key }),
  toggleProjectsPanel: () => set((s) => ({ showProjectsPanel: !s.showProjectsPanel })),
  toggleLayersPanel: () => set((s) => ({ showLayersPanel: !s.showLayersPanel })),
  toggleStickersPanel: () => set((s) => ({ showStickersPanel: !s.showStickersPanel })),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setGridVisible: (v) => set({ gridVisible: v }),
}));
