# 004 — 全局页面过渡（淡入 + 轻微上浮）

- **Status**: DONE
- **Commit**: 77ff05e
- **Severity**: MEDIUM
- **Category**: Missed opportunities
- **Estimated scope**: 1 文件（`app/assets/css/main.css`），新增约 20 行

## Problem

[nuxt.config.ts:124](nuxt.config.ts#L124) 配置了 `pageTransition: { name: 'page', mode: 'out-in' }`，Nuxt 会为每次路由切换生成 `.page-enter-active` / `.page-leave-active` 等 class——但全项目搜不到任何对应的 CSS 规则（`grep -rn "\.page-enter\|\.page-leave" app/` 为空）。所以当前页面切换是**生硬瞬切**：点导航链接，旧页面瞬间消失、新页面瞬间出现，没有任何缓冲。

这是全站最高频的"状态切换"——每次点击导航都发生。一个 200ms 左右的淡入+轻微上浮能显著降低跳变感，且符合这个 portfolio 的编辑风格（editorial style）审美。

```ts
// nuxt.config.ts:123-125 — current（配置已存在，但无对应 CSS）
app: {
  pageTransition: { name: 'page', mode: 'out-in' },
  layoutTransition: { name: 'layout', mode: 'out-in' },
```

另外，项目内已有多处"页面级淡入"的局部实现：[HomeFeaturedProjects.vue:68-82](app/components/HomeFeaturedProjects.vue#L68)、[error.vue:87-91](app/error.vue#L87)、[blog/index.vue:159-162](app/pages/blog/index.vue#L159) 的 `animate-fade-in`。这些局部动画在页面切换后还会再播一次（数据就绪时触发），与全局页面过渡叠加时会有"整个页面先淡入一次、内容区再淡入一次"的重复感。本计划的全局过渡时长较短（200ms），与局部 0.8s 的 `fadeIn` 错开，视觉上全局过渡先完成、局部内容随后补位，形成层次而非重复。局部 `fadeIn` 保留不动。

## Target

在 `app/assets/css/main.css` 末尾（第 163 行 `::view-transition-new(root) { z-index: ... }` 块之后）追加：

```css
/* --- 页面过渡 --- */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 减弱动画偏好：仅保留透明度 */
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.15s ease-out;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
```

设计依据：

- **duration 200ms**：页面过渡属于"偶发但高频"操作（导航点击），不能太长（>300ms 会拖慢浏览节奏），也不能太短（<150ms 感知不到缓冲）。200ms 是"存在但不碍事"的临界点。
- **translateY(8px)**：只给"轻微上浮"的空间感，不像 20px 那样有明显的滑动。进场从下方 8px 浮上来，离场向上 8px 飘走，方向一致，符合"页面向上滚动前进"的空间隐喻。
- **ease-out**：进入用 ease-out（起步快、收尾稳），离开也用 ease-out（快速让位，不拖泥带水）。
- **`mode: 'out-in'` 已配置**：旧页面完全离场后新页面才进场，避免两个页面同时可见的叠影。
- **reduced-motion**：去掉位移，只保留 150ms 的透明度淡入淡出——页面切换的状态反馈必须保留（否则用户不知道页面变了），但不需要位移。

## Repo conventions to follow

- 全局 CSS 只放 [main.css](app/assets/css/main.css)，与现有的 `::view-transition-*` 自定义（[main.css:155-163](app/assets/css/main.css#L155)）同属"全局过渡"区，用注释分隔。
- 参照项目里已有的页面级淡入写法：[HomeFeaturedProjects.vue:73-82](app/components/HomeFeaturedProjects.vue#L73) 的 `fadeIn` keyframes——本计划把它泛化为全局可用的过渡 class，但不动那个局部实现。
- 不需要改 `nuxt.config.ts`——`pageTransition` 配置已存在，只缺 CSS。

## Steps

1. 打开 `app/assets/css/main.css`，在第 163 行 `::view-transition-new(root) { z-index: 2147483646; }` 块结束后，追加 Target 中的全部 CSS（含媒体查询）。
2. 确认 `nuxt.config.ts:124` 的 `pageTransition: { name: 'page', mode: 'out-in' }` 保持不变。
3. 启动 `pnpm dev`，点击导航栏的 Projects / Articles / Uses，观察页面切换是否有 200ms 的淡入+轻微上浮。

## Boundaries

- 不要改 `nuxt.config.ts` 里的 `pageTransition` 或 `layoutTransition` 配置——name 和 mode 都已正确。
- 不要给 `layoutTransition` 写 CSS——项目只有一个 layout（`default.vue`），layout 切换不发生，写了也是死代码。
- 不要动各页面/组件里已有的 `animate-fade-in` 局部实现（HomeFeaturedProjects、error、blog/index、blog/[...slug]、tinypic、image-watermark）——它们与全局过渡时长错开，形成层次，不冲突。
- 不要动 `::view-transition-old/new(root)` 的覆盖（[main.css:155-163](app/assets/css/main.css#L155)）——那是主题切换专用的。
- 不要新增任何依赖。

## Verification

- **Mechanical**: `pnpm build` 通过。
- **Feel check**:
  1. 桌面端在导航栏点击 Projects → Articles → Uses → 返回首页，每次切换应有 200ms 的淡入+轻微上浮，无生硬瞬切。节奏应该是"旧页面快速淡出 → 新页面从下方 8px 浮入"，整个过程不超过 400ms（out 200ms + in 200ms）。
  2. 在 DevTools → Animations 面板把速度降到 10%，确认进场从 `translateY(8px)` 开始、出场到 `translateY(-8px)` 结束，方向一致。
  3. 快速连点两个导航链接（A → B → A），确认过渡能正确打断接续（CSS transition 会从当前状态反向），不会卡在半透明状态。
  4. 在 Rendering 面板勾选 `prefers-reduced-motion: reduce`，再切换页面：只有 150ms 的淡入淡出，无位移。
  5. 进入博客文章详情页（如 `/blog/xxx`），确认文章内容的局部 `animate-fade-in`（0.5s）在全局页面过渡（0.2s）之后播放，形成"页面先到位、内容再补位"的层次，而不是同时抢戏。
- **Done when**: 所有路由切换都有 200ms 的淡入+上浮过渡；reduced-motion 下无位移；无与局部 fadeIn 的视觉冲突。
