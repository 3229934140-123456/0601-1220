export type ID = string;

export interface Project {
  id: ID;
  title: string;
  author: string;
  coverImage?: string;
  coverColor: string;
  totalPages: number;
  themeId?: ID;
  createdAt: Date;
  updatedAt: Date;
  currentPageId?: ID;
}

export interface BackgroundData {
  type: "color" | "gradient" | "texture" | "image";
  value: string;
  name?: string;
}

export type LayerType =
  | "sketch"
  | "paint"
  | "sticker"
  | "character"
  | "text"
  | "background";

export interface Layer {
  id: ID;
  pageId: ID;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  orderIndex: number;
}

export interface Character {
  id: ID;
  projectId: ID;
  name: string;
  color: string;
  avatar: string;
  description: string;
  expressions: Expression[];
  costumes: Costume[];
  poses: Pose[];
}

export interface Expression {
  id: ID;
  name: string;
  emoji: string;
}

export interface Costume {
  id: ID;
  name: string;
  color: string;
  icon: string;
}

export interface Pose {
  id: ID;
  name: string;
  icon: string;
}

export interface CharacterRelation {
  id: ID;
  fromId: ID;
  toId: ID;
  label: string;
  color: string;
}

export interface TextBubble {
  id: ID;
  pageId: ID;
  type: "speech" | "thought" | "narration" | "shout";
  content: string;
  font: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  characterId?: ID;
  tailDirection?: "left" | "right" | "top" | "bottom";
}

export interface StickerInstance {
  id: ID;
  pageId: ID;
  assetId: ID;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface StickerAsset {
  id: ID;
  name: string;
  category: string;
  emoji: string;
  tags: string[];
}

export interface FontAsset {
  id: ID;
  name: string;
  family: string;
  category: string;
  preview: string;
}

export type DrawingToolType =
  | "pencil"
  | "watercolor"
  | "crayon"
  | "marker"
  | "eraser";

export interface DrawingTool {
  type: DrawingToolType;
  name: string;
  color: string;
  size: number;
  opacity: number;
}

export interface ColorTheme {
  id: ID;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  palette: string[];
  background: string;
  mood: string;
}

export interface VoiceOption {
  id: ID;
  name: string;
  type: "child" | "mom" | "dad" | "grandma" | "grandpa";
  pitch: number;
  rate: number;
  previewText: string;
}

export interface FamilyMember {
  id: ID;
  name: string;
  avatar: string;
  role: string;
  canComment: boolean;
  canEdit: boolean;
}

export interface Comment {
  id: ID;
  pageId: ID;
  authorId: ID;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
}

export interface DrawPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawStroke {
  id: ID;
  tool: DrawingTool;
  points: DrawPoint[];
  layerId: ID;
}

export interface TextureAsset {
  id: ID;
  name: string;
  category: "paper" | "watercolor" | "gradient" | "pattern" | "none";
  value: string;
  preview: string;
  cssClass?: string;
}

export interface Page {
  id: ID;
  projectId: ID;
  pageNumber: number;
  background: BackgroundData;
  texture?: TextureAsset | null;
  sceneDescription: string;
  strokes: DrawStroke[];
  textBubbles: TextBubble[];
  stickers: StickerInstance[];
  characterRelations: CharacterRelation[];
}

export type WorkspaceKey =
  | "home"
  | "storyboard"
  | "painting"
  | "characters"
  | "text"
  | "color"
  | "composite"
  | "share";

export interface WorkspaceMeta {
  key: WorkspaceKey;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  path: string;
  emoji: string;
}
