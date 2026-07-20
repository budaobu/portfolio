# 005 — 灯箱开场加入缩放，修复 leave 的 ease-in

- **Status**: DONE
- **Commit**: 77ff05e
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Easing & duration
- **Estimated scope**: 1 文件（`app/components/content/ImageGallery.vue`），修改 6 行 class

## Problem

灯箱（Lightbox）的进出过渡有两个问题：

1. **leave 用了 `ease-in`**（[ImageGallery.vue:30](app/components/content/ImageGallery.vue#L30)）。`ease-in` 起步慢，用户点击关闭后前几十毫秒几乎看不到变化，感觉"没响应"。关闭/退出场景应该用 `ease-out`——快速让位，不拖泥带水。

2. **纯淡入淡出，没有缩放**。灯箱从缩略图点开，却是一个全屏遮罩从无到有地淡入——视觉上"凭空出现"，没有从缩略图位置"长出来"的空间连续性。AUDIT.md 要求"never scale(0)"，但这里连 `scale(0.9)` 都没有，是完全无 transform 的纯 opacity 过渡。加一个 `scale(0.95)` → `scale(1)` 的开场缩放，配合 `transform-origin: center`（灯箱是居中全屏，center 正确，不适用 trigger-origin 规则），能让它感觉是从页面中央"展开"而不是"闪现"。

```vue
<!-- app/components/content/ImageGallery.vue:26-32 — current -->
<Transition
  enter-active-class="transition duration-200 ease-out"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition duration-150 ease-in"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
```

## Target

```vue
<!-- app/components/content/ImageGallery.vue:26-32 — target -->
<Transition
  enter-active-class="transition duration-200 ease-out"
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
  leave-active-class="transition duration-150 ease-out"
  leave-from-class="opacity-100 scale-100"
  leave-to-class="opacity-0 scale-95"
>
```

改动点：

- `enter-from-class` 加 `scale-95`：从 95% 大小开始，配合 opacity 从 0 淡入，形成"轻微放大展开"的开场。
- `enter-to-class` 加 `scale-100`：终点是原始大小。
- `leave-active-class` 的 `ease-in` 改为 `ease-out`：关闭立即响应。
- `leave-to-class` 加 `scale-95`：关闭时轻微缩小消失，与开场对称。
- `transition` 属性：Tailwind 的 `transition` 默认包含 `transform`，所以 `scale-*` class 会被正确过渡，不需要额外加 `transition-transform`。

注意：灯箱是**居中全屏**（`fixed inset-0 flex items-center justify-center`），`transform-origin` 默认就是 center，不需要显式设置——这里不适用 popover/dropdown 的"从 trigger 缩放"规则。

## Repo conventions to follow

- Vue `<Transition>` 的 class 写法参照同文件现有代码（就是上面引用的这段），只改 class 字符串，不改结构。
- 参照项目里已有的缩放过渡：[ThemeToggle.vue:12-16](app/components/ThemeToggle.vue#L12)（虽然那个 Transition 在计划 002 中被删，但 `scale-50` / `scale-100` 的写法是 Vue Transition 的标准用法）。
- `duration-200` 进入 / `duration-150` 离开保持不变——离开略快于进入，符合"关闭要干脆"的原则。

## Steps

1. 打开 `app/components/content/ImageGallery.vue`，找到第 26-32 行的 `<Transition>` 标签。
2. 把 `enter-from-class="opacity-0"` 改为 `enter-from-class="opacity-0 scale-95"`。
3. 把 `enter-to-class="opacity-100"` 改为 `enter-to-class="opacity-100 scale-100"`。
4. 把 `leave-active-class="transition duration-150 ease-in"` 改为 `leave-active-class="transition duration-150 ease-out"`。
5. 把 `leave-from-class="opacity-100"` 改为 `leave-from-class="opacity-100 scale-100"`。
6. 把 `leave-to-class="opacity-0"` 改为 `leave-to-class="opacity-0 scale-95"`。

## Boundaries

- 不要改灯箱的布局结构（`fixed inset-0`、`flex items-center justify-center`），不要加 `transform-origin`——居中场景默认 center 就是对的。
- 不要改 `duration-200`（进入）和 `duration-150`（离开）的时长——已经在合理范围内。
- 不要动灯箱内部的按钮（关闭、左右导航）的 `transition-colors`——那是 hover 反馈，与灯箱进出无关。
- 不要给灯箱加键盘导航的过渡（ArrowLeft/ArrowRight 切换图片时是瞬时替换 `currentIndex`，无过渡）——图片切换的交叉淡入淡出是另一个独立优化，不在本计划范围。
- 不要新增任何依赖。

## Verification

- **Mechanical**: `pnpm build` 通过。
- **Feel check**:
  1. 打开任意包含 `<ImageGallery>` 的博客文章，点击一张缩略图：灯箱应该从 95% 大小 + 透明状态放大淡入到 100%，200ms 内完成，感觉是从页面中央"展开"而不是"闪现"。
  2. 点击关闭按钮或遮罩空白处：灯箱应该在 150ms 内轻微缩小淡出，`ease-out` 让第一帧就有明显变化，无"点了没反应"的迟滞感。
  3. 快速连点缩略图 → 关闭 → 缩略图 → 关闭，确认过渡能正确打断接续（Vue Transition 会从当前状态反向），不会卡在半透明/半缩放状态。
  4. 在 DevTools → Animations 面板降到 10% 速度，确认缩放从 0.95 开始、到 1.0 结束（进入），或从 1.0 到 0.95（离开），不是从 0 开始。
  5. 在 Rendering 面板勾选 `prefers-reduced-motion: reduce`——灯箱过渡**不需要**额外处理：200ms 的 opacity+scale 属于"保留反馈"范畴，位移量极小（scale 不是 position），符合 reduced-motion 的"保留透明度、去掉大幅位移"原则。
- **Done when**: 灯箱进出有轻微缩放；leave 用 ease-out；无迟滞感；快速开关无中间态卡顿。
