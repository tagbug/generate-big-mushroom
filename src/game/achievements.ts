import { Achievement } from '@/types/achievements';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_merge',
    name: 'First Step',
    description: 'Perform your first merge.',
    icon: '✨',
  },
  {
    id: 'reach_1000_score',
    name: 'Score Beginner',
    description: 'Reach a score of 1,000.',
    icon: '🎯',
  },
  {
    id: 'reach_5000_score',
    name: 'Score Master',
    description: 'Reach a score of 5,000.',
    icon: '🏆',
  },
  {
    id: 'unlock_watermelon',
    name: 'Fruit King',
    description: 'Successfully merge a Watermelon in Classic Fruits skin.',
    icon: '🍉',
  },
  {
    id: 'unlock_diamond',
    name: 'Emoji Tycoon',
    description: 'Successfully merge a Diamond in Emoji Faces skin.',
    icon: '💎',
  },
  {
    id: 'game_over_5_times',
    name: 'Persistent Player',
    description: 'Experience game over 5 times.',
    icon: '💪',
  },
  {
    id: 'play_3_skins',
    name: 'Skin Explorer',
    description: 'Play with 3 different skins.',
    icon: '🎨',
  },
  {
    id: 'unlock_red_mushroom',
    name: 'Mushroom Fan',
    description: 'You found the secret mushroom!',
    icon: '🍄',
    isSecret: true,
  },
  {
    id: '5_mushrooms',
    name: 'Mushroom Master',
    description: 'Merge 5 mushrooms in a single game.',
    icon: '🍄',
    isSecret: true,
  },
  {
    id: 'unlock_small_mushroom',
    name: 'Small Mushroom Enthusiast',
    description: 'You found the small mushroom!',
    icon: '🍄',
    isSecret: true,
  },
];
