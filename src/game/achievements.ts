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
    id: 'reach_10000_score',
    name: 'Score Legend',
    description: 'Reach a score of 10,000.',
    icon: '🌟',
  },
  {
    id: 'reach_50000_score',
    name: 'Score God',
    description: 'Reach a score of 50,000.',
    icon: '👑',
    isSecret: true,
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
    id: '8_mushrooms',
    name: 'King of Mushroom',
    description: 'Merge 8 mushrooms in a single game.',
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
  {
    id: 'unlock_octopus',
    name: 'Octopus Adventurer',
    description: 'You found the big octopus!',
    icon: '🐙',
    isSecret: true,
  },
  {
    id: 'play_mania_mode',
    name: 'Mania Mode Challenger',
    description: 'Play in Mania Mode.',
    icon: '⚡',
  },
  {
    id: '50_combos',
    name: 'Combo Enthusiast',
    description: 'Achieve 50 combos in a single game.',
    icon: '🔥',
  },
  {
    id: '100_combos',
    name: 'Combo Master',
    description: 'Achieve 100 combos in a single game.',
    icon: '💥',
  },
  {
    id: '500_combos',
    name: 'Combo Legend',
    description: 'Achieve 500 combos in a single game.',
    icon: '🌪️',
    isSecret: true,
  },
  {
    id: 'merge_biggest',
    name: 'Void',
    description: 'Merge the biggest item in the game.',
    icon: '🌌',
    isSecret: true,
  }
];
