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
    -   `NextPreview.tsx`: 预告下一个将要掉落的水果（已实现 i18n）。
    -   `GameOverModal.tsx`: 游戏结束时显示的弹窗（已实现 i18n）。
    -   `LanguageSwitcher.tsx`: 允许用户手动切换语言的组件。
-   `src/game/`: 存放核心游戏逻辑与配置。
    -   `engine.ts`: 封装 Matter.js 的物理世界、渲染器和边界创建。
    -   `fruits.ts`: 使用工厂模式的思想，定义了所有水果的属性。水果的 `label` 被用作 i18n 的翻译键。
-   `src/hooks/`: 存放自定义 React Hooks
    -   `useGameLogic.ts`: **项目逻辑核心**。此 Hook 封装了所有游戏状态和交互逻辑。
-   `src/i18n/`: 存放 i18n 配置文件和语言包 (`locales`)。
-   `src/types/`: 存放项目所需的 TypeScript 类型定义。

## 设计模式与优化实践

- **逻辑与视图分离**: 通过自定义 Hook `useGameLogic` 将所有复杂的游戏状态管理和物理事件处理从组件中抽离，使得 `GameContainer` 组件更专注于视图渲染。
- **国际化 (i18n)**: 使用 `react-i18next` 将所有面向用户的文本（包括 UI 元素和水果名称）进行抽离，实现了完整的中英文本地化支持。
- **工厂模式 (Factory Pattern)**: 使用 `src/game/fruits.ts` 文件来集中配置和创建不同类型的水果对象，便于管理和扩展。
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