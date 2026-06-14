import { create } from "zustand";
import {
  Character,
  ColorTheme,
  Costume,
  DrawStroke,
  DrawingTool,
  DrawingToolType,
  Expression,
  FamilyMember,
  ID,
  Layer,
  Page,
  Pose,
  Project,
  StickerAsset,
  StickerInstance,
  TextBubble,
  TextureAsset,
  WorkspaceKey,
} from "@/types";
import {
  COLOR_THEMES,
  createMockPages,
  createSampleProjects,
  FAMILY_MEMBERS,
  MOCK_CHARACTERS,
  STICKER_ASSETS,
  TEXTURE_ASSETS,
} from "@/utils/mockData";
import { uid } from "@/utils/id";

interface HistoryCommand {
  type: "addStroke" | "removeStroke" | "clearStrokes";
  data: unknown;
}

interface ProjectState {
  projects: Project[];
  currentProjectId: ID | null;
  pages: Page[];
  currentPageId: ID | null;
  characters: Character[];
  family: FamilyMember[];
  stickerAssets: StickerAsset[];
  textureAssets: TextureAsset[];
  themes: ColorTheme[];
  activeThemeId: ID | null;
  undoStacks: Record<ID, HistoryCommand[]>;
  redoStacks: Record<ID, HistoryCommand[]>;
  setCurrentProject: (id: ID | null) => void;
  setCurrentPage: (id: ID | null) => void;
  createProject: (title?: string) => Project;
  addPage: (afterId?: ID) => void;
  removePage: (id: ID) => void;
  reorderPages: (startIndex: number, endIndex: number) => void;
  updatePageBackground: (pageId: ID, value: string) => void;
  updatePageDescription: (pageId: ID, desc: string) => void;
  setPageTexture: (pageId: ID, texture: TextureAsset | null) => void;
  addStroke: (pageId: ID, stroke: DrawStroke) => void;
  removeStrokes: (pageId: ID, strokeIds: ID[]) => void;
  clearPageStrokes: (pageId: ID) => void;
  undo: (pageId: ID) => boolean;
  redo: (pageId: ID) => boolean;
  canUndo: (pageId: ID) => boolean;
  canRedo: (pageId: ID) => boolean;
  addCharacter: (character: Omit<Character, "id" | "projectId" | "expressions" | "costumes" | "poses">) => Character;
  updateCharacter: (characterId: ID, patch: Partial<Character>) => void;
  removeCharacter: (characterId: ID) => void;
  addExpression: (characterId: ID, expression: Omit<Expression, "id">) => void;
  updateExpression: (characterId: ID, expressionId: ID, patch: Partial<Expression>) => void;
  removeExpression: (characterId: ID, expressionId: ID) => void;
  addCostume: (characterId: ID, costume: Omit<Costume, "id">) => void;
  updateCostume: (characterId: ID, costumeId: ID, patch: Partial<Costume>) => void;
  removeCostume: (characterId: ID, costumeId: ID) => void;
  addPose: (characterId: ID, pose: Omit<Pose, "id">) => void;
  updatePose: (characterId: ID, poseId: ID, patch: Partial<Pose>) => void;
  removePose: (characterId: ID, poseId: ID) => void;
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
  const initUndoStacks: Record<ID, HistoryCommand[]> = {};
  const initRedoStacks: Record<ID, HistoryCommand[]> = {};
  initialPages.forEach((p) => {
    initUndoStacks[p.id] = [];
    initRedoStacks[p.id] = [];
  });

  const _ensurePageHistory = (pageId: ID) => {
    const s = get();
    if (!s.undoStacks[pageId]) {
      set((state) => ({
        undoStacks: { ...state.undoStacks, [pageId]: [] },
        redoStacks: { ...state.redoStacks, [pageId]: [] },
      }));
    }
  };

  const _pushHistory = (pageId: ID, cmd: HistoryCommand) => {
    _ensurePageHistory(pageId);
    set((state) => ({
      undoStacks: {
        ...state.undoStacks,
        [pageId]: [...(state.undoStacks[pageId] ?? []), cmd],
      },
      redoStacks: { ...state.redoStacks, [pageId]: [] },
    }));
  };

  return {
    projects: sampleProjects,
    currentProjectId: sampleProjects[0]?.id ?? null,
    pages: initialPages,
    currentPageId: initialPages[0]?.id ?? null,
    characters: initialCharacters,
    family: FAMILY_MEMBERS,
    stickerAssets: STICKER_ASSETS,
    textureAssets: TEXTURE_ASSETS,
    themes: COLOR_THEMES,
    activeThemeId: COLOR_THEMES[0].id,
    undoStacks: initUndoStacks,
    redoStacks: initRedoStacks,

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
        texture: null,
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
        texture: null,
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

    setPageTexture: (pageId, texture) => {
      set((state) => ({
        pages: state.pages.map((p) => (p.id === pageId ? { ...p, texture } : p)),
      }));
    },

    addStroke: (pageId, stroke) => {
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, strokes: [...p.strokes, stroke] } : p,
        ),
      }));
      _pushHistory(pageId, { type: "addStroke", data: { strokeId: stroke.id } });
    },

    removeStrokes: (pageId, strokeIds) => {
      const page = get().pages.find((p) => p.id === pageId);
      const removedStrokes = page?.strokes.filter((s) => strokeIds.includes(s.id)) ?? [];
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, strokes: p.strokes.filter((s) => !strokeIds.includes(s.id)) }
            : p,
        ),
      }));
      _pushHistory(pageId, { type: "removeStroke", data: { strokes: removedStrokes } });
    },

    clearPageStrokes: (pageId) => {
      const page = get().pages.find((p) => p.id === pageId);
      const allStrokes = page?.strokes ?? [];
      set((state) => ({
        pages: state.pages.map((p) => (p.id === pageId ? { ...p, strokes: [] } : p)),
      }));
      _pushHistory(pageId, { type: "clearStrokes", data: { strokes: allStrokes } });
    },

    undo: (pageId) => {
      _ensurePageHistory(pageId);
      const state = get();
      const stack = state.undoStacks[pageId] ?? [];
      if (stack.length === 0) return false;
      const cmd = stack[stack.length - 1];
      const newUndo = stack.slice(0, -1);
      let success = false;

      if (cmd.type === "addStroke") {
        const { strokeId } = cmd.data as { strokeId: ID };
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId ? { ...p, strokes: p.strokes.filter((st) => st.id !== strokeId) } : p,
          ),
        }));
        success = true;
      } else if (cmd.type === "removeStroke") {
        const { strokes } = cmd.data as { strokes: DrawStroke[] };
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId ? { ...p, strokes: [...p.strokes, ...strokes] } : p,
          ),
        }));
        success = true;
      } else if (cmd.type === "clearStrokes") {
        const { strokes } = cmd.data as { strokes: DrawStroke[] };
        set((s) => ({
          pages: s.pages.map((p) => (p.id === pageId ? { ...p, strokes } : p)),
        }));
        success = true;
      }

      if (success) {
        set((s) => ({
          undoStacks: { ...s.undoStacks, [pageId]: newUndo },
          redoStacks: { ...s.redoStacks, [pageId]: [...(s.redoStacks[pageId] ?? []), cmd] },
        }));
      }
      return success;
    },

    redo: (pageId) => {
      _ensurePageHistory(pageId);
      const state = get();
      const stack = state.redoStacks[pageId] ?? [];
      if (stack.length === 0) return false;
      const cmd = stack[stack.length - 1];
      const newRedo = stack.slice(0, -1);
      let success = false;

      if (cmd.type === "addStroke") {
        const { strokeId } = cmd.data as { strokeId: ID };
        const page = state.pages.find((p) => p.id === pageId);
        const stroke = page?.strokes.find((s) => s.id === strokeId);
        if (stroke) {
          set((s) => ({
            pages: s.pages.map((p) =>
              p.id === pageId ? { ...p, strokes: [...p.strokes, stroke] } : p,
            ),
          }));
          success = true;
        }
      } else if (cmd.type === "removeStroke") {
        const { strokes } = cmd.data as { strokes: DrawStroke[] };
        const ids = strokes.map((s) => s.id);
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === pageId ? { ...p, strokes: p.strokes.filter((st) => !ids.includes(st.id)) } : p,
          ),
        }));
        success = true;
      } else if (cmd.type === "clearStrokes") {
        set((s) => ({
          pages: s.pages.map((p) => (p.id === pageId ? { ...p, strokes: [] } : p)),
        }));
        success = true;
      }

      if (success) {
        set((s) => ({
          redoStacks: { ...s.redoStacks, [pageId]: newRedo },
          undoStacks: { ...s.undoStacks, [pageId]: [...(s.undoStacks[pageId] ?? []), cmd] },
        }));
      }
      return success;
    },

    canUndo: (pageId) => (get().undoStacks[pageId]?.length ?? 0) > 0,
    canRedo: (pageId) => (get().redoStacks[pageId]?.length ?? 0) > 0,

    addCharacter: (character) => {
      const state = get();
      const newChar: Character = {
        ...character,
        id: uid(),
        projectId: state.currentProjectId ?? "",
        expressions: [],
        costumes: [],
        poses: [],
      };
      set((s) => ({ characters: [...s.characters, newChar] }));
      return newChar;
    },

    updateCharacter: (characterId, patch) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId ? { ...c, ...patch } : c,
        ),
      }));
    },

    removeCharacter: (characterId) => {
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== characterId),
      }));
    },

    addExpression: (characterId, expression) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, expressions: [...c.expressions, { ...expression, id: uid() }] }
            : c,
        ),
      }));
    },

    updateExpression: (characterId, expressionId, patch) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? {
                ...c,
                expressions: c.expressions.map((e) =>
                  e.id === expressionId ? { ...e, ...patch } : e,
                ),
              }
            : c,
        ),
      }));
    },

    removeExpression: (characterId, expressionId) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, expressions: c.expressions.filter((e) => e.id !== expressionId) }
            : c,
        ),
      }));
    },

    addCostume: (characterId, costume) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, costumes: [...c.costumes, { ...costume, id: uid() }] }
            : c,
        ),
      }));
    },

    updateCostume: (characterId, costumeId, patch) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? {
                ...c,
                costumes: c.costumes.map((co) =>
                  co.id === costumeId ? { ...co, ...patch } : co,
                ),
              }
            : c,
        ),
      }));
    },

    removeCostume: (characterId, costumeId) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, costumes: c.costumes.filter((co) => co.id !== costumeId) }
            : c,
        ),
      }));
    },

    addPose: (characterId, pose) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, poses: [...c.poses, { ...pose, id: uid() }] }
            : c,
        ),
      }));
    },

    updatePose: (characterId, poseId, patch) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? {
                ...c,
                poses: c.poses.map((p) => (p.id === poseId ? { ...p, ...patch } : p)),
              }
            : c,
        ),
      }));
    },

    removePose: (characterId, poseId) => {
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId
            ? { ...c, poses: c.poses.filter((p) => p.id !== poseId) }
            : c,
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
  showTexturesPanel: boolean;
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
  toggleTexturesPanel: () => void;
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
  showTexturesPanel: false,

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
    const state = get();
    const layers = [...state.layers];
    const idx = layers.findIndex((l) => l.id === id);
    if (idx < layers.length - 1) {
      [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      layers.forEach((l, i) => (l.orderIndex = i));
      set({ layers });
    }
  },
  moveLayerDown: (id) => {
    const state = get();
    const layers = [...state.layers];
    const idx = layers.findIndex((l) => l.id === id);
    if (idx > 0) {
      [layers[idx], layers[idx - 1]] = [layers[idx - 1], layers[idx]];
      layers.forEach((l, i) => (l.orderIndex = i));
      set({ layers });
    }
  },
  addLayer: (name = "新图层") => {
    const state = get();
    const layers = [...state.layers];
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

  toggleTexturesPanel: () => set((s) => ({ showTexturesPanel: !s.showTexturesPanel })),
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
