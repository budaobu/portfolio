# Animation improvement plans

Based on audit of commit `77ff05e`. Run each plan with `improve-animations execute plans/NNN-*.md`, or hand to any executor.

## Plans

| # | Title | Severity | Status |
|---|---|---|---|
| [001](plans/001-global-reduced-motion-and-hover-gating.md) | 全局 reduced-motion 与 hover 门控 | HIGH | DONE |
| [002](plans/002-theme-toggle-double-animation-and-ease.md) | 修复主题切换的双动画竞态与圆形扩散曲线 | HIGH | DONE |
| [003](plans/003-easing-duration-tokens-and-transition-all.md) | 建立 easing/duration token 并替换全部 transition-all | MEDIUM | DONE |
| [004](plans/004-global-page-transition.md) | 全局页面过渡（淡入 + 轻微上浮） | MEDIUM | DONE |
| [005](plans/005-lightbox-scale-and-ease-out.md) | 灯箱开场加入缩放，修复 leave 的 ease-in | MEDIUM | DONE |

## Recommended execution order

1. **001** — 无障碍基线，所有后续计划的 reduced-motion 媒体查询都依赖它在 main.css 建立的模式。
2. **002** — 高频交互的 feel-breaking 问题，改动小、见效快。
3. **003** — token 体系 + transition-all 清理，是后续所有动效的基础设施。
4. **004** — 全局页面过渡，依赖 003 建立的 easing 直觉（虽然它直接写字面值，不依赖 token）。
5. **005** — 灯箱微调，独立，随时可做。

## Dependencies

- 001 和 002 都涉及主题切换：001 只加媒体查询，002 改 JS easing 和删 Transition，不冲突，可并行。
- 003 替换了 005 所在文件（ImageGallery.vue）的 hover class——如果 003 和 005 都由 executor 跑，让 003 先完成，避免 005 的 Transition class 被 003 的 hover 替换波及。
- 004 与所有计划独立。
