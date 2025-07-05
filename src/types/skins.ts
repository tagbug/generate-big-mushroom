export interface SkinItem {
  label: string;
  radius: number;
  color: string;
  score: number;
  emoji?: string; // 用于 Emoji 皮肤
  text?: string; // 用于文本显示
  sides?: number; // 用于多边形皮肤
}

export interface SkinConfig {
  id: string;
  name: string;
  description: string;
  items: SkinItem[];
  type: 'circle' | 'emoji' | 'text' | 'polygon';
}

export interface SkinContextType {
  currentSkin: SkinConfig;
  availableSkins: SkinConfig[];
  changeSkin: (skinId: string) => void;
  maniaMode: boolean;
  toggleManiaMode: () => void;
}
