# 002 — 修复主题切换的双动画竞态与圆形扩散曲线

- **Status**: DONE
- **Commit**: 77ff05e
- **Severity**: HIGH
- **Category**: Easing & duration / Interruptibility
- **Estimated scope**: 2 文件，删除约 20 行、修改约 10 行、新增约 25 行

## Problem

主题切换当前有**两层动画叠加**，互相打架：

1. **圆形扩散**：`ThemeToggle.vue` 的 `toggleTheme` 调用 `document.startViewTransition`，并对 `::view-transition-new(root)` 播放 400ms 的 clip-path 圆形扩散（[ThemeToggle.vue:75-93](app/components/ThemeToggle.vue#L75)）。
2. **图标交换**：同一组件内的 `<Transition mode="out-in">` 在图标切换时播放 300ms 进入 + 200ms 退出的缩放旋转（[ThemeToggle.vue:9-19](app/components/ThemeToggle.vue#L9)）。

两层动画的触发源不同（VT 由路由/DOM 更新驱动，Transition 由组件 key 变化驱动），无法保证同步。用户看到的是：图标先缩放旋转淡出、再从放大状态缩回，同时圆形扩散在背后展开——视觉上出现"图标在半透明状态被圆形剪裁扫过"的叠影，像是两个动画在抢时间。这是高频操作（每次切换主题必触发），问题被放大。

另外，圆形扩散的 easing 是 `ease-in`（[ThemeToggle.vue:89](app/components/ThemeToggle.vue#L89)）。`ease-in` 开头慢，用户点击后前 100ms 几乎看不到变化，违反了"进入/退出用 ease-out"的基本原则——扩散动画本质是新视图"进入"，应该起步快、收尾稳。

```ts
// app/components/ThemeToggle.vue:82-92 — current
document.documentElement.animate(
  {
    clipPath: clipPath
  },
  {
    duration: 400, // 动画时长 400ms
    easing: 'ease-in', // 加速扩散，视觉更有冲击力
    pseudoElement: '::view-transition-new(root)'
  }
)
```

```vue
<!-- app/components/ThemeToggle.vue:9-19 — current -->
<Transition
  mode="out-in"
  enter-active-class="transition-all duration-300 ease-out"
  enter-from-class="opacity-0 scale-50 rotate-90"
  enter-to-class="opacity-100 scale-100 rotate-0"
  leave-active-class="transition-all duration-200 ease-in"
  leave-from-class="opacity-100 scale-100 rotate-0"
  leave-to-class="opacity-0 scale-50 -rotate-90"
>
  <component :is="CurrentIconComponent" :key="colorMode.preference" />
</Transition>
```

## Target

1. **删除图标交换动画**。圆形扩散本身已经提供了足够的视觉反馈，图标直接瞬时切换即可。VT 的截图机制会把旧图标和新图标分别放在旧/新视图里，圆形扫过时自然完成替换，不需要额外的缩放旋转。

2. **圆形扩散改为 ease-out**。起步快、收尾稳，符合"进入用 ease-out"原则。400ms 时长保留。

```ts
// app/components/ThemeToggle.vue:82-92 — target
document.documentElement.animate(
  {
    clipPath: clipPath
  },
  {
    duration: 400,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)', // 强 ease-out，起步快、收尾稳
    pseudoElement: '::view-transition-new(root)'
  }
)
```

```vue
<!-- app/components/ThemeToggle.vue:1-20 — target（整个 <template>） -->
<template>
  <UButton
    color="gray"
    variant="ghost"
    aria-label="Toggle Theme"
    class="group relative overflow-hidden rounded-sm"
    @click="toggleTheme"
  >
    <component :is="CurrentIconComponent" :key="colorMode.preference" />
  </UButton>
</template>
```

注意：`<component :is>` 的 `key` 属性保留——Vue 需要它来强制替换组件实例，否则相同组件类型不会重建。删掉的是包裹它的 `<Transition>` 及其全部 props，不是 key。

3. **降级路径不变**。`isAppearanceTransition` 为 false 时直接赋值 `colorMode.preference`（[ThemeToggle.vue:50-54](app/components/ThemeToggle.vue#L50)），图标瞬时切换——这本来就是降级行为，现在与支持 VT 的路径统一了。

## Repo conventions to follow

- 仓库里已有的"瞬时切换 + VT 扩散"模式：就是 `isAppearanceTransition === false` 的降级分支（[ThemeToggle.vue:50-54](app/components/ThemeToggle.vue#L50)），直接赋值、无动画。本计划让支持 VT 的路径也采用同样的图标切换策略。
- easing 值使用 AUDIT.md 中 UI 通用的强 ease-out：`cubic-bezier(0.23, 1, 0.32, 1)`。本仓库还没有 easing token（计划 003 引入），此处先内联写在 WAAPI 的 `easing` 字段里——WAAPI 不接受 CSS var()，必须写字面量。
- `UButton` 的用法参照同文件现有代码，不新增 props、不改 `class`。

## Steps

1. 在 `app/components/ThemeToggle.vue` 中，删除模板里包裹 `<component :is>` 的 `<Transition>` 标签及其全部 8 个 props（`mode`、`enter-active-class`、`enter-from-class`、`enter-to-class`、`leave-active-class`、`leave-from-class`、`leave-to-class`，以及对应的结束标签）。`<component :is="CurrentIconComponent" :key="colorMode.preference" />` 保留。
2. 在同一文件的 `toggleTheme` 函数中，把 `easing: 'ease-in'` 改为 `easing: 'cubic-bezier(0.23, 1, 0.32, 1)'`，并把行尾注释从 `// 加速扩散，视觉更有冲击力` 改为 `// 强 ease-out，起步快、收尾稳`。
3. 检查 `<script setup>` 顶部：`resolveComponent` 的导入和 `CurrentIconComponent` 的计算属性都保留，不删任何 JS 逻辑。

## Boundaries

- 不要改 `document.startViewTransition` 的调用结构、`clipPath` 数组的计算逻辑、`endRadius` 的计算方式。
- 不要动 [main.css:155-158](app/assets/css/main.css#L155) 的 `::view-transition-old/new(root) { animation: none; mix-blend-mode: normal; }` 覆盖——那是禁用 VT 默认 cross-fade 的正确配置。
- 不要给 `UButton` 加 `transition-*` class，不要改它的 `color`/`variant`/`aria-label`。
- 不要改 `isAppearanceTransition` 的检测逻辑（[ThemeToggle.vue:47-48](app/components/ThemeToggle.vue#L47)），它已正确处理 reduced-motion。
- 不要新增任何依赖。

## Verification

- **Mechanical**: `pnpm build` 通过；`pnpm dev` 启动后无 Vue 编译警告。
- **Feel check**:
  1. 桌面端点击 header 的主题切换按钮（幽灵/太阳/月亮图标），观察：圆形从点击位置扩散，图标在扩散扫过时**瞬时**替换，不再有缩放旋转的残影。整个切换应该在 400ms 内干净完成。
  2. 快速连点切换按钮 3-4 次：每次扩散都从当前状态接续（VT 会打断未完成的旧 transition），不会出现图标卡在半透明/半缩放状态的中间态。
  3. 在 DevTools → Animations 面板把播放速度降到 10%，确认扩散从第一帧就有明显的圆形边缘（ease-out 起步快），而不是前 20% 几乎看不到变化。
  4. 在 Rendering 面板勾选 `prefers-reduced-motion: reduce`，点击切换：无扩散动画，图标直接替换（降级路径）。
  5. 分别切到 light/dark/system 三个状态，确认图标显示正确（Ghost/Sun/Moon）。
- **Done when**: 主题切换只有一次圆形扩散，图标瞬时替换，无叠影、无中间态卡顿；reduced-motion 下无动画。
