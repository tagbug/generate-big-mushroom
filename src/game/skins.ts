import { SkinConfig } from '@/types/skins';

// 合成大蘑菇！
export const MUSHROOM_SKIN: SkinConfig = {
  id: 'mushroom',
  name: 'Mushroom Mania', // 这将被 i18n 替换
  description: 'Merge big mushrooms!', // 这将被 i18n 替换
  type: 'emoji',
  items: [
    // 🍬🍪🍩🍤🍥🏳️‍🌈🏳️‍⚧️🍄‍🟫🍄
    { label: 'candy', radius: 10, score: 1, emoji: '🍬' },
    { label: 'cookie', radius: 15, score: 2, emoji: '🍪' },
    { label: 'donut', radius: 20, score: 3, emoji: '🍩' },
    { label: 'shrimp', radius: 25, score: 4, emoji: '🍤' },
    { label: 'fish_cake', radius: 35, score: 5, emoji: '🍥' },
    { label: 'pride_flag', radius: 45, score: 6, emoji: '🏳️‍🌈' },
    { label: 'trans_flag', radius: 55, score: 7, emoji: '🏳️‍⚧️' },
    { label: 'brown_mushroom', radius: 65, score: 8, emoji: '🍄‍🟫' },
    { label: 'red_mushroom', radius: 100, score: 9, emoji: '🍄' },
  ].map(item => ({ ...item, color: "#FFFFFF" })),
};

// 水果皮肤
export const FRUITS_SKIN: SkinConfig = {
  id: 'classic-fruits',
  name: 'Classic Fruits', // 这将被 i18n 替换
  description: 'Traditional fruit merging game', // 这将被 i18n 替换
  type: 'circle',
  items: [
    { label: 'cherry', radius: 10, color: '#FF0000', score: 1 },
    { label: 'strawberry', radius: 15, color: '#FF7F00', score: 2 },
    { label: 'grape', radius: 20, color: '#FFFF00', score: 3 },
    { label: 'dekopon', radius: 25, color: '#00FF00', score: 4 },
    { label: 'persimmon', radius: 30, color: '#00FFFF', score: 5 },
    { label: 'apple', radius: 35, color: '#0000FF', score: 6 },
    { label: 'pear', radius: 40, color: '#8B00FF', score: 7 },
    { label: 'peach', radius: 45, color: '#FF00FF', score: 8 },
    { label: 'pineapple', radius: 50, color: '#FF1493', score: 9 },
    { label: 'melon', radius: 55, color: '#ADFF2F', score: 10 },
    { label: 'watermelon', radius: 60, color: '#32CD32', score: 11 },
  ],
};

// Emoji 皮肤
export const EMOJI_SKIN: SkinConfig = {
  id: 'emoji',
  name: 'Emoji Faces', // 这将被 i18n 替换
  description: 'Merge big emojis!', // 这将被 i18n 替换
  type: 'emoji',
  items: [
    { label: 'smile', radius: 10, score: 1, emoji: '😀' },
    { label: 'laugh', radius: 15, score: 2, emoji: '😂' },
    { label: 'love', radius: 20, score: 3, emoji: '😍' },
    { label: 'wink', radius: 25, score: 4, emoji: '😉' },
    { label: 'cool', radius: 30, score: 5, emoji: '😎' },
    { label: 'party', radius: 35, score: 6, emoji: '🥳' },
    { label: 'fire', radius: 40, score: 7, emoji: '🔥' },
    { label: 'star', radius: 45, score: 8, emoji: '⭐' },
    { label: 'crown', radius: 50, score: 9, emoji: '👑' },
    { label: 'rainbow', radius: 55, score: 10, emoji: '🌈' },
    { label: 'diamond', radius: 60, score: 11, emoji: '💎' },
  ].map(item => ({ ...item, color: "#FFFFFF" })),
};

// 几何形状皮肤
export const GEOMETRIC_SKIN: SkinConfig = {
  id: 'geometric',
  name: 'Geometric Shapes', // 这将被 i18n 替换
  description: 'Minimalist geometric forms', // 这将被 i18n 替换
  type: 'polygon',
  items: [
    { label: 'dot', radius: 8, color: '#FF6B6B', score: 1, sides: 3 }, // 三角形
    { label: 'circle', radius: 12, color: '#4ECDC4', score: 2, sides: 8 }, // 八边形近似圆形
    { label: 'ring', radius: 16, color: '#45B7D1', score: 3, sides: 6 }, // 六边形
    { label: 'disc', radius: 20, color: '#96CEB4', score: 4, sides: 5 }, // 五边形
    { label: 'sphere', radius: 24, color: '#FECA57', score: 5, sides: 4 }, // 正方形
    { label: 'orb', radius: 28, color: '#FF9FF3', score: 6, sides: 8 }, // 八边形
    { label: 'globe', radius: 32, color: '#54A0FF', score: 7, sides: 6 }, // 六边形
    { label: 'planet', radius: 36, color: '#5F27CD', score: 8, sides: 10 }, // 十边形
    { label: 'star', radius: 40, color: '#00D2D3', score: 9, sides: 7 }, // 七边形
    { label: 'galaxy', radius: 44, color: '#FF6348', score: 10, sides: 12 }, // 十二边形
    { label: 'universe', radius: 48, color: '#2E86AB', score: 11, sides: 16 }, // 十六边形
  ],
};

export const AVAILABLE_SKINS: SkinConfig[] = [
  MUSHROOM_SKIN,
  FRUITS_SKIN,
  EMOJI_SKIN,
  GEOMETRIC_SKIN,
];

export const getSkinById = (id: string): SkinConfig => {
  return AVAILABLE_SKINS.find(skin => skin.id === id) || MUSHROOM_SKIN;
};
