# 003 — 建立 easing/duration token 并替换全部 transition-all

- **Status**: DONE
- **Commit**: 77ff05e
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens / Performance
- **Estimated scope**: 11 文件，新增 2 个 token 定义 + 全局替换约 25 处 class，纯机械替换

## Problem

全站的 hover/交互过渡存在三类不一致：

1. **`transition-all` 滥用**——以下 class 出现在组件里，会监听所有可动画属性（包括未来可能被加上的 `width`/`margin` 等 layout 属性），一旦命中就触发 layout+paint+composite 全链路：

   - [BlogCard.vue:6](app/components/BlogCard.vue#L6) `transition-all duration-300`
   - [BlogCard.vue:13](app/components/BlogCard.vue#L13) `md:transition-all md:duration-300`
   - [UseCard.vue:8](app/components/UseCard.vue#L8) `transition-all duration-300`
   - [AppHeader.vue:12](app/components/AppHeader.vue#L12) `transition-all`（头像 ring 颜色）
   - [index.vue:56](app/pages/index.vue#L56) 和 [blog/index.vue:27](app/pages/blog/index.vue#L27) `transition-all duration-200`（社交图标按钮）
   - [sponsor.vue:27](app/pages/sponsor.vue#L27) 和 [sponsor.vue:59](app/pages/sponsor.vue#L59) `transition-all duration-300`
   - [meme-slicer.vue:148](app/pages/projects/meme-slicer.vue#L148)、[image-watermark.vue:359](app/pages/projects/image-watermark.vue#L359) 的 `baseDropClass`、[tinypic.vue:94](app/pages/projects/tinypic.vue#L94)、[video2gif.vue:228](app/pages/projects/video2gif.vue#L228) `transition-all duration-200`（上传区）
   - [markitdown.vue:274](app/pages/projects/markitdown.vue#L274) `transition-all duration-300 hover:shadow-2xl`（卡片阴影）
   - [blog/[...slug].vue:50](app/pages/blog/[...slug].vue#L50) `transition-all duration-300`（文章容器，静态页面无需任何 transition）
   - [HomeProjectCard.vue:49](app/components/HomeProjectCard.vue#L49) `transition-all`（箭头图标的 translate + 颜色）

2. **duration 碎片**——hover 反馈同时存在 `duration-200`、`duration-300`、`duration-500` 三种，没有依据频率或元素大小区分，纯粹是手抖。

3. **body 主题切换颜色过渡**——[app.vue:25](app/app.vue#L25) `transition: background-color 0.3s` 没有 easing 关键字，默认 `ease`，在 300ms 的跨度里起步不够利落。且 `background-color` 动画会触发 paint，但这是主题切换的合理代价，只需补上明确的 easing。

```css
/* app/app.vue:25 — current */
body {
  transition: background-color 0.3s;
}
```

## Target

1. **在 `app/assets/css/main.css` 的 `@theme` 块中追加两个 easing token**（放在现有 `--animate-fade-in` 之后、`@keyframes` 之前）：

```css
/* 交互 easing token */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

Tailwind v4 会把 `--ease-*` 映射为 `ease-out` 和 `ease-in-out` 工具类（与内置同名类冲突时，@theme 定义覆盖内置值）。

2. **全局替换 `transition-all` 为精确属性**。按元素实际会变的属性收窄：

| 位置 | 当前 | 目标 |
|---|---|---|
| BlogCard.vue:6 卡片容器 | `transition-all duration-300` | `transition-colors duration-200 ease-out` |
| BlogCard.vue:13 日期竖线 | `md:transition-all md:duration-300` | `md:transition-[border-color,padding] md:duration-200 md:ease-out` |
| UseCard.vue:8 卡片容器 | `transition-all duration-300` | `transition-colors duration-200 ease-out` |
| AppHeader.vue:12 头像 | `transition-all` | `transition-colors duration-200 ease-out` |
| index.vue:56 / blog/index.vue:27 社交按钮 | `transition-all duration-200` | `transition-colors duration-150 ease-out` |
| sponsor.vue:27 / sponsor.vue:59 卡片 | `transition-all duration-300` | `transition-colors duration-200 ease-out` |
| meme-slicer.vue:148 / image-watermark.vue:359(baseDropClass) / tinypic.vue:94 / video2gif.vue:228 上传区 | `transition-all duration-200` | `transition-colors duration-150 ease-out` |
| markitdown.vue:274 卡片 | `transition-all duration-300 hover:shadow-2xl` | `transition-shadow duration-300 ease-out hover:shadow-2xl` |
| blog/[...slug].vue:50 文章容器 | `transition-all duration-300` | 直接删除这个 class（静态页面，无 hover 态，不需要 transition） |
| HomeProjectCard.vue:49 箭头 | `transition-all` | `transition-[transform,color] duration-200 ease-out` |

3. **统一 hover 反馈时长为 150–200ms**。规则：
   - 纯颜色变化（背景、边框、文字色）→ `duration-150`
   - 含位移/缩放的 hover（箭头 translate、图标 scale）→ `duration-200`
   - 仅阴影变化 → `duration-300`（阴影渲染便宜，慢一点无感）

   具体替换（在步骤 2 的基础上进一步统一）：
   - [ImageGallery.vue:13](app/components/content/ImageGallery.vue#L13) `transition-transform duration-300` → `transition-transform duration-200 ease-out`（图片 hover 放大）
   - [ImageGallery.vue:18](app/components/content/ImageGallery.vue#L18) `transition-colors duration-300` → `transition-colors duration-150 ease-out`（遮罩淡入）
   - [ImageGallery.vue:19](app/components/content/ImageGallery.vue#L19) `transition-opacity duration-300` → `transition-opacity duration-150 ease-out`（放大镜图标淡入）
   - [UseCard.vue:18](app/components/UseCard.vue#L18) `transition-transform duration-500` → `transition-transform duration-200 ease-out`（商品图 hover 放大，500ms 太慢）
   - [tinypic.vue:100](app/pages/projects/tinypic.vue#L100) 和 [image-watermark.vue:163](app/pages/projects/image-watermark.vue#L163) `transition-transform duration-200` → `transition-transform duration-150 ease-out`（上传图标 hover 缩放）
   - [HomeProjectCard.vue:31](app/components/HomeProjectCard.vue#L31) `transition-colors` → `transition-colors duration-150 ease-out`（标题 hover 变色）
   - [BlogCard.vue:21](app/components/BlogCard.vue#L21) 和 [BlogCard.vue:29](app/components/BlogCard.vue#L29) `transition-colors` → `transition-colors duration-150 ease-out`
   - [ProjectCard.vue:2](app/components/ProjectCard.vue#L2) `transition-colors duration-300` → `transition-colors duration-200 ease-out`（卡片容器）
   - [ProjectCard.vue:19](app/components/ProjectCard.vue#L19) `transition-colors` → `transition-colors duration-150 ease-out`（标题）

4. **body 主题切换过渡补 easing**：

```css
/* app/app.vue:25 — target */
body {
  transition: background-color 0.3s ease-out;
}
```

## Repo conventions to follow

- token 一律放在 [main.css](app/assets/css/main.css) 的 `@theme` 块里，与现有 `--animate-*` 同区域，用注释分组。
- Tailwind v4 的 `transition-*` 工具类：`transition-colors` = `color, background-color, border-color, text-decoration-color, fill, stroke`；`transition-transform` = `transform`；`transition-opacity` = `opacity`；`transition-shadow` = `box-shadow`；`transition-[a,b]` = 任意属性组合。不要用 `transition-all`。
- 参照现有代码里已经写对的例子：[ProsePre.vue:12](app/components/content/ProsePre.vue#L12) `transition-opacity duration-200`（复制按钮淡入）——属性单一、时长合理，就是目标形态。

## Steps

1. 在 `app/assets/css/main.css` 的 `@theme` 块中，`--animate-fade-in: fadeIn 0.8s ease-out forwards;` 这行之后、空行和 `/* --- 关键帧定义 --- */` 注释之前，插入两个 easing token（见 Target 第 1 项）。
2. 按 Target 第 2 项的表，逐个文件替换 `transition-all`。每处替换后确认该元素上没有其他依赖 `transition-all` 才生效的动画（当前代码里没有——所有 hover 动画的属性都在 `transition-colors`/`transition-transform`/`transition-opacity`/`transition-shadow` 的覆盖范围内）。
3. 按 Target 第 3 项统一 duration。
4. 修改 `app/app.vue` 第 25 行，补 `ease-out`。
5. 全局搜索确认没有残留的 `transition-all`：`grep -rn "transition-all" app/`，结果应为空。

## Boundaries

- 不要改任何 `@keyframes` 定义、`--animate-*` token、`pageTransition` 配置。
- 不要动 [ThemeToggle.vue](app/components/ThemeToggle.vue)——它的 Transition 在计划 002 中处理。
- 不要动 [layouts/default.vue:23](app/layouts/default.vue#L23) 的 footer AI 工具图标展开动画（`transition-all duration-500 ease-in-out` 作用在 `space-x` 上，是 layout 动画，属于另一个独立问题，不在本计划范围）。
- 不要动 [tinypic.vue:194](app/pages/projects/tinypic.vue#L194) 和 [video2gif.vue:372](app/pages/projects/video2gif.vue#L372) 的进度条 `transition-all duration-300`——进度条 width 动画有独立优化方案（改 transform scaleX），不在本计划范围。
- 不要动 [connect.vue:168](app/pages/connect.vue#L168) 的 `transition-transform active:scale-[0.98]`——press feedback 已接近正确，只是缺时长，属于 LOW 抛光，不在本计划范围。
- 不要新增任何依赖；不要改模板结构。

## Verification

- **Mechanical**: `pnpm build` 通过；`grep -rn "transition-all" app/` 返回空。
- **Feel check**:
  1. 桌面端逐个 hover：首页项目卡片、博客列表卡片、uses 商品卡片、sponsor 卡片、社交图标按钮、上传区（tinypic/watermark/meme-slicer/video2gif）、图片画廊、代码块复制按钮——所有 hover 反馈应该比之前更"跟手"（150–200ms 起步快），无迟滞感。
  2. 用 DevTools → Rendering → Paint flashing 验证：hover 卡片时只有颜色区域重绘，无大面积 layout 闪烁。
  3. 切换主题，确认 body 背景色 300ms 过渡依旧平滑（补了 ease-out 后起步更利落）。
  4. 确认所有 hover 动画的属性类型没变（颜色还是颜色、位移还是位移），只是时长和 easing 统一了。
- **Done when**: 全站无 `transition-all`；hover 反馈时长统一在 150–200ms（阴影 300ms）；body 过渡有明确 easing；视觉感受更"脆"，无功能性回归。
