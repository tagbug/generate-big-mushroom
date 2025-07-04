# 合成大西瓜 (Generate Big Mushroom)

这是一个基于 Next.js, TypeScript, 和 Tailwind CSS 构建的网页版“合成大西瓜”游戏。项目使用 [Matter.js](https://brm.io/matter-js/) 作为 2D 物理引擎来模拟物体的碰撞和运动，并遵循了良好的软件工程实践，实现了组件化、逻辑封装和多轮次的性能与逻辑优化。

## 核心功能

- **掉落水果**: 在游戏区域内点击，即可在对应位置掉落一个随机水果。
- **合成升级**: 两个相同的水果碰撞时，会合成一个更大的新水果，并获得分数。
- **落点预览**: 在放置新水果前，可以实时看到一个半透明的水果虚像跟随鼠标移动，清晰地指示出最终的掉落位置。
- **物理模拟**: 所有水果都遵循真实的物理规律，可以滚动、堆叠和被推动。
- **游戏结束**: 当一个水果在顶部警戒线之上停止运动时，游戏结束。
- **重新开始**: 游戏结束后，可以立即重新开始新的一局。
- **多语言支持**:
    - 自动检测浏览器语言（支持中文/英文）。
    - 提供手动切换语言的按钮。
    - 完整的 UI 和水果名称本地化。
- **皮肤系统**:
    - 支持多种游戏皮肤，包括经典水果、Emoji 表情、几何形状等。
    - 每个皮肤都有独特的视觉效果和碰撞体积。
    - 皮肤设置会自动保存到本地存储。
    - 易于扩展和自定义新的皮肤。
- **UI提示**: 包含得分展示、下一个水果预览，以及明确的游戏结束线提示。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **物理引擎**: [Matter.js](https://brm.io/matter-js/)
- **国际化 (i18n)**: [react-i18next](https://react.i18next.com/), [i18next](https://www.i18next.com/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **包管理器**: [pnpm](https://pnpm.io/)
- **代码规范**: [ESLint](https://eslint.org/)

## 项目架构

项目遵循组件化的思想，将游戏的不同部分拆分为独立的 React 组件，并将核心逻辑与 UI 分离。

-   `src/app/page.tsx`: 游戏主页面，负责整合所有游戏组件。
-   `src/components/`: 存放所有 React 组件。
    -   `GameContainer.tsx`: 游戏的核心容器，负责初始化物理引擎、管理游戏画布和集成所有子组件。
    -   `Scoreboard.tsx`: 显示当前得分。
    -   `NextPreview.tsx`: 预告下一个将要掉落的水果（已实现 i18n 和皮肤支持）。
    -   `GameOverModal.tsx`: 游戏结束时显示的弹窗（已实现 i18n）。
    -   `LanguageSwitcher.tsx`: 允许用户手动切换语言的组件。
    -   `SkinSelector.tsx`: 皮肤选择器组件，支持切换不同的游戏皮肤。
-   `src/game/`: 存放核心游戏逻辑与配置。
    -   `engine.ts`: 封装 Matter.js 的物理世界、渲染器和边界创建。
    -   `fruits.ts`: 使用工厂模式的思想，定义了所有水果的属性。水果的 `label` 被用作 i18n 的翻译键。
    -   `skins.ts`: 皮肤系统配置，定义了不同皮肤的属性和物体配置。
    -   `customRenderer.ts`: 自定义渲染器，用于支持 Emoji 皮肤等特殊渲染需求。
-   `src/hooks/`: 存放自定义 React Hooks
    -   `useGameLogic.ts`: **项目逻辑核心**。此 Hook 封装了所有游戏状态和交互逻辑，并支持皮肤系统。
-   `src/contexts/`: 存放 React 上下文
    -   `SkinContext.tsx`: 皮肤上下文，管理当前皮肤状态和切换逻辑。
-   `src/i18n/`: 存放 i18n 配置文件和语言包 (`locales`)。
-   `src/types/`: 存放项目所需的 TypeScript 类型定义。
    -   `fruits.ts`: 水果和游戏物体的类型定义。
    -   `skins.ts`: 皮肤系统的类型定义。

## 皮肤系统

游戏支持多种皮肤，每个皮肤都有独特的视觉效果和游戏体验：

### 内置皮肤

1. **经典水果皮肤**
   - 传统的水果合成游戏体验
   - 从樱桃到西瓜的经典合成路线
   - 鲜艳的色彩和圆形物理体

2. **Emoji 表情皮肤**
   - 使用 Emoji 表情作为游戏物体
   - 从微笑到钻石的有趣合成路线
   - 支持旋转动画，Emoji 会根据物理碰撞进行旋转
   - 独特的 Emoji 渲染效果，避免闪烁问题

3. **几何形状皮肤**
   - 简约的几何图形设计
   - 使用真实的多边形物理体（三角形、正方形、五边形等）
   - 渐变色彩和现代化外观
   - 从点到宇宙的抽象合成路线

### 皮肤系统特性

- **精确的物理模拟**: 
  - 圆形皮肤使用圆形物理体
  - Emoji 皮肤使用圆形物理体但支持旋转效果
  - 几何皮肤使用对应的多边形物理体
  - 所有物体都有正确的碰撞检测和物理响应

- **完整的国际化支持**: 
  - 皮肤名称和描述支持多语言
  - 物体名称完全本地化
  - 使用结构化的 JSON 格式便于管理

- **高性能渲染**: 
  - 自定义渲染器避免 Emoji 闪烁
  - 多边形使用 Canvas 2D 渲染
  - 支持物体旋转动画

- **自动保存**: 用户选择的皮肤会自动保存到本地存储
- **无缝切换**: 切换皮肤时会自动重置游戏状态，确保一致性

### 技术实现

- **物理引擎集成**: 使用 Matter.js 的多边形和圆形物理体
- **自定义渲染**: 针对不同皮肤类型的专门渲染逻辑
- **类型安全**: 完整的 TypeScript 类型定义
- **性能优化**: 避免不必要的重渲染和状态更新

### 扩展皮肤

开发者可以轻松添加新的皮肤：

1. 在 `src/game/skins.ts` 中定义新的皮肤配置
2. 在翻译文件 `src/i18n/locales/` 中添加相应的皮肤和物体名称
3. 如需特殊渲染效果，可扩展 `customRenderer.ts`

```typescript
// 示例：添加新皮肤
export const CUSTOM_SKIN: SkinConfig = {
  id: 'custom',
  name: 'Custom Skin', // 将被 i18n 替换
  description: 'Your custom skin description', // 将被 i18n 替换
  type: 'polygon', // 或 'circle'、'emoji'
  items: [
    { label: 'item1', radius: 10, color: '#FF0000', score: 1, sides: 6 },
    // ... 更多物体配置
  ],
};
```

然后在翻译文件中添加：
```json
{
  "skins": [
    {
      "id": "custom",
      "name": "自定义皮肤",
      "desc": "你的自定义皮肤描述",
      "items": [
        { "label": "item1", "name": "物体1" }
      ]
    }
  ]
}
```

## 设计模式与优化实践

- **逻辑与视图分离**: 通过自定义 Hook `useGameLogic` 将所有复杂的游戏状态管理和物理事件处理从组件中抽离，使得 `GameContainer` 组件更专注于视图渲染。
- **国际化 (i18n)**: 使用 `react-i18next` 将所有面向用户的文本（包括 UI 元素和水果名称）进行抽离，实现了完整的中英文本地化支持。
- **皮肤系统架构**: 
    - 使用 React Context 模式管理全局皮肤状态。
    - 采用工厂模式设计，每个皮肤都是独立的配置对象。
    - 支持不同的渲染类型（圆形、Emoji、文本等）。
    - 自动保存用户选择的皮肤到本地存储。
    - 皮肤切换时自动重置游戏状态，确保一致性。
- **工厂模式 (Factory Pattern)**: 使用 `src/game/fruits.ts` 和 `src/game/skins.ts` 文件来集中配置和创建不同类型的游戏物体，便于管理和扩展。
- **物理引擎集成**: 
    - 不同皮肤的物体具有正确的碰撞体积和物理属性。
    - 支持自定义渲染器，为特殊皮肤（如 Emoji）提供专门的渲染逻辑。
    - 保持物理模拟的准确性和一致性。
- **精确的游戏结束判断**: 经过多次迭代，最终实现了健壮的游戏结束逻辑。
    - **监听时机**: 放弃了简陋的 `setInterval` 轮询和会影响物理体验的 `sleep` 模式，最终采用监听 Matter.js 引擎的 `afterUpdate` 事件，在每个物理帧后进行精确检查。
    - **判断条件**: 只有同时满足以下所有条件的水果，才会被判定为触发游戏结束：
        1.  **已激活**: 水果必须参与过至少一次碰撞。
        2.  **已静止**: 水果的线速度和角速度都已趋近于零。
        3.  **已过豁免期**: 水果已存在超过 1.5 秒，以防止因快速连续生成而导致的误判。
        4.  **位置超限**: 水果的最终位置高于顶部的警戒线。
- **React 性能优化**:
    -   使用 `React.memo` 对 `Scoreboard` 和 `NextPreview` 等纯展示组件进行包裹，避免不必要更新。
    -   使用 `useCallback` 来记忆化事件处理函数。
    -   在 `useEffect` 的清理函数中，妥善地停止并清理了 Matter.js 的引擎和渲染器实例，防止内存泄漏。

## 移动端适配

游戏针对移动端进行了以下适配优化：

- **触摸事件支持**：
  - 在触摸屏幕时，实时显示幽灵水果并更新其位置。
  - 触摸结束时，准确获取触点位置生成水果，并隐藏幽灵水果。
  - 使用 `changedTouches` 确保触摸结束时的坐标计算准确。

- **坐标边界限制**：
  - 对触摸或鼠标事件计算的 x 坐标进行边界限制，防止生成水果超出画布范围。

- **动态缩放**：
  - 根据屏幕宽度动态调整游戏画布的缩放比例，确保在不同设备上都能正确显示。

通过这些优化，游戏在移动端的体验更加流畅和稳定。

## 如何开始

首先，确保你已经安装了 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/installation)。

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/generate-big-mushroom.git
    cd generate-big-mushroom
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **运行开发服务器**
    ```bash
    pnpm dev
    ```

现在，在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可开始游戏。

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).