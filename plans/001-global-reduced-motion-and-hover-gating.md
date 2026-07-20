# 001 — 全局 reduced-motion 与 hover 门控

- **Status**: DONE
- **Commit**: 77ff05e
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 5 文件，每个文件在 `<style>` 末尾追加一个媒体查询块，约 40 行新增，无删除

## Problem

全站有 11 处持续运行或位移动画，其中只有主题切换的圆形扩散（[ThemeToggle.vue:47-48](app/components/ThemeToggle.vue#L47)）检查了 `prefers-reduced-motion`。其余全部无视用户的减弱动画偏好：

- [main.css:64-122](app/assets/css/main.css#L64) — 幽灵张望（`look-around` 2.4s 位移动画）、太阳旋转呼吸（`sun-shine` 4s 旋转）、月亮摇摆（`moon-rock` 2s 旋转）、星星闪烁（`twinkle` 1.5s）、头像 ping 扩散（`ping-short` 2s 位移+缩放）。这些是 hover 触发的无限动画，对前庭敏感用户会持续播放直到移开鼠标。
- [main.css:80](app/assets/css/main.css#L80) + [HomeFeaturedProjects.vue:68-82](app/components/HomeFeaturedProjects.vue#L68) + [error.vue:87-91](app/error.vue#L87) — `fadeIn` 含 `translateY(20px)` 位移。
- [index.vue:102-114](app/pages/index.vue#L102) — 首页 hero 的 `text-roll-anim` 4 秒无限垂直滚动文字（1.1em 垂直位移），是全站最显眼的运动元素。
- [RetroTv.vue:243](app/components/RetroTv.vue#L243) 和 [RetroTv.vue:255](app/components/RetroTv.vue#L255) — `blink` 2s 无限闪烁和 `noise` 0.5s 无限噪点位移，404 页面全程持续运行。

另外，以下 hover 缩放在触屏上会在每次点按时闪现一次（false hover），[tinypic.vue:100](app/pages/projects/tinypic.vue#L100) 与 [image-watermark.vue:163](app/pages/projects/image-watermark.vue#L163) 的上传图标、以及 [meme-slicer.vue:155](app/pages/projects/meme-slicer.vue#L155) 同样如此：

```html
<!-- app/pages/projects/tinypic.vue:100 — current -->
<div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm">
```

```html
<!-- app/pages/projects/image-watermark.vue:163 — current -->
<div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm">
```

```html
<!-- app/pages/projects/meme-slicer.vue:155 — current -->
<div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
```

## Target

按"减弱 ≠ 清零"原则：去掉位移/旋转/缩放，保留透明度反馈。

1. `app/assets/css/main.css` 的 `@theme` 块结束后（第 123 行 `}` 之后）、`/* Markdown 内容排版优化 */` 注释之前，追加：

```css
/* 减弱动画偏好：去位移，留透明度反馈 */
@media (prefers-reduced-motion: reduce) {
  .animate-look-around,
  .animate-sun-shine,
  .animate-moon-rock,
  .animate-ping-short {
    animation: none !important;
  }

  /* 闪烁仅保留透明度，去掉缩放 */
  .animate-twinkle {
    animation: twinkle-reduced 2s ease-in-out infinite !important;
  }

  /* 淡入仅保留透明度，去掉 20px 位移 */
  .animate-fade-in {
    animation: fadeInReduced 0.3s ease-out forwards !important;
  }
}

@keyframes twinkle-reduced {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

注意：Tailwind v4 的 `--animate-*` token 会生成同名的 `animate-*` 工具类（如 `--animate-look-around` → `animate-look-around`），上述选择器直接覆盖这些类的 animation。这 6 个类当前没有任何地方直接在 HTML 里引用，它们全部通过 `group-hover:animate-*` 变体使用——`group-hover:` 变体在 hover 态生成 `.group:hover .group-hover\:animate-look-around` 这样的规则，特异性为 (0,2,0)，低于带 `!important` 的媒体查询覆盖，所以 `!important` 是必须的，不要省略。

2. `app/pages/index.vue` 的 `<style scoped>` 末尾（第 115 行 `}` 之后、`</style>` 之前）追加：

```css
@media (prefers-reduced-motion: reduce) {
  .text-roll-inner {
    animation: none;
  }
}
```

3. `app/components/RetroTv.vue` 的 `<style scoped>` 末尾（第 393 行响应式媒体查询块之后、`</style>` 之前）追加：

```css
@media (prefers-reduced-motion: reduce) {
  .notfound_text { animation: none; }
  .screenM { animation: none; }
}
```

4. `app/components/HomeFeaturedProjects.vue` 的 `<style scoped>` 末尾（第 82 行 `}` 之后、`</style>` 之前）追加：

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: fadeInReduced 0.3s ease-out forwards;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

5. `app/error.vue` 的 `<style scoped>` 末尾（第 91 行 `}` 之后、`</style>` 之前）追加：

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: fadeInReduced 0.3s ease-out forwards;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

6. 触屏 false-hover 门控。把三处上传图标的 hover 缩放移到 `@media (hover: hover)` 下。Tailwind v4 的 `group-hover:` 是变体，无法直接包进自定义媒体查询块，所以改用原生 CSS：

- `app/pages/projects/tinypic.vue` 第 100 行：把 class 中的 `group-hover:scale-110` 删除，改为加一个自定义类 `upload-icon`。即：

```html
<!-- target -->
<div class="upload-icon w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4 transition-transform duration-200 shadow-sm">
```

然后在该文件 `<style scoped>` 末尾追加：

```css
@media (hover: hover) and (pointer: fine) {
  .group:hover .upload-icon { transform: scale(1.1); }
}
```

- `app/pages/projects/image-watermark.vue` 第 163 行做完全相同的处理（同一类名 `upload-icon`、同一段 scoped 样式追加）。
- `app/pages/projects/meme-slicer.vue` 第 155 行同样处理：删除 `group-hover:scale-110`，加 `upload-icon` 类，追加相同的 scoped 样式块。

## Repo conventions to follow

- 本仓库的动画 token 统一放在 [main.css](app/assets/css/main.css) 的 `@theme` 块里（`--animate-*` + 配套 `@keyframes`），页面级的一次性 keyframes 则放在各自文件的 `<style scoped>`。本计划不改 `@theme` 里的任何 token，只在全局 CSS 和 scoped style 中追加媒体查询覆盖。
- `!important` 在此是必要的：要覆盖的 `group-hover:animate-*` 变体规则特异性更高，且 Tailwind 的 `--animate-*` 工具类本身对未 hover 场景不生效，不存在误伤。
- 示例参照：代码里已有的 reduced-motion 处理在 [ThemeToggle.vue:47-48](app/components/ThemeToggle.vue#L47)（JS 侧），以及 [main.css:155-158](app/assets/css/main.css#L155) 对 view-transition 伪元素的 `animation: none` 写法。

## Steps

1. 在 `app/assets/css/main.css` 第 123 行 `@theme` 块结束后，追加上文 Target 第 1 项的全局媒体查询块与两个 keyframes。
2. 在 `app/pages/index.vue` scoped style 末尾追加 Target 第 2 项的媒体查询。
3. 在 `app/components/RetroTv.vue` scoped style 末尾追加 Target 第 3 项的媒体查询。
4. 在 `app/components/HomeFeaturedProjects.vue` scoped style 末尾追加 Target 第 4 项的媒体查询与 keyframes。
5. 在 `app/error.vue` scoped style 末尾追加 Target 第 5 项的媒体查询与 keyframes。
6. 在 `app/pages/projects/tinypic.vue` 第 100 行：删 `group-hover:scale-110`，加 `upload-icon` 类；scoped style 末尾追加 Target 第 6 项的媒体查询。
7. 在 `app/pages/projects/image-watermark.vue` 第 163 行做与步骤 6 相同的改动。
8. 在 `app/pages/projects/meme-slicer.vue` 第 155 行做与步骤 6 相同的改动。

## Boundaries

- 不要改 `@theme` 里任何已有的 `--animate-*` token 定义和 keyframes——hover 图标动画在普通用户身上的表现保持不变。
- 不要动 [ThemeToggle.vue](app/components/ThemeToggle.vue)、[main.css:155-158](app/assets/css/main.css#L155) 的 view-transition 覆盖，这两处已经正确处理了 reduced-motion。
- 不要给 [app.vue:25](app/app.vue#L25) 的 `body { transition: background-color 0.3s }` 加门控——纯颜色过渡属于保留反馈，不在本计划范围（计划 002 处理它的另一处问题）。
- 不要动 [tinypic.vue:599-601](app/pages/projects/tinypic.vue#L599) 的 `slideUp` 和 [blog/[...slug].vue:207](app/pages/blog/[...slug].vue#L207) 的 `fadeInQuick`——它们位移只有 10px 且一次性播放，属于低风险，不在本计划范围。
- 不要新增任何依赖；不要改任何模板结构（除了第 6 步中给三个 div 加一个类名）。

## Verification

- **Mechanical**: `pnpm build` 通过，无 CSS 语法错误。
- **Feel check**:
  1. `pnpm dev` 启动后，打开 DevTools → Rendering 面板 → 勾选 Emulate CSS media feature `prefers-reduced-motion: reduce`。
  2. 刷新首页：hero 的 `@Budaobu` 不再滚动，静止显示；把鼠标悬停在 header 主题切换按钮上，幽灵/太阳/月亮图标保持静止，不再播放张望/旋转/摇摆动画；悬停头像，不出现 ping 扩散。
  3. 访问任意 404 地址（如 `/nonexistent`）：电视屏幕文字静止常亮，噪点层静止。
  4. 取消勾选 reduced-motion，确认以上动画全部恢复——普通用户体验不能有变化。
  5. 用手机模拟器（或真机）点按 tinypic/watermark/meme-slicer 页的上传区，确认图标不再闪现缩放；桌面端鼠标悬停时缩放依旧生效。
- **Done when**: reduced-motion 模拟下全站无持续运动、无 hover 动画播放；非 reduced-motion 下所有动画行为与改动前完全一致。
