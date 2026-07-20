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

<script setup lang="ts">
const GhostIcon = resolveComponent('GhostIcon')
const SunIcon = resolveComponent('SunIcon')
const MoonIcon = resolveComponent('MoonIcon')

const colorMode = useColorMode()

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

const CurrentIconComponent = computed(() => {
  if (colorMode.preference === 'system') return GhostIcon
  if (colorMode.preference === 'dark') return MoonIcon
  return SunIcon
})

const toggleTheme = (event: MouseEvent) => {
  // 1. 计算下一个主题状态
  const currentIndex = themes.indexOf(colorMode.preference as Theme)
  const nextIndex = (currentIndex + 1) % themes.length
  const nextTheme = themes[nextIndex]

  // 2. 检查浏览器是否支持 View Transitions API
  // 且用户未开启“减少动画”偏好
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    // 降级方案：直接切换
    colorMode.preference = nextTheme
    return
  }

  // 3. 获取点击位置（圆心）
  const x = event.clientX
  const y = event.clientY

  // 4. 计算覆盖整个屏幕所需的最大半径
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  // 5. 执行视图过渡
  const transition = document.startViewTransition(async () => {
    // 更新状态
    colorMode.preference = nextTheme
    // 等待 Vue DOM 更新完成，确保新视图已准备好
    await nextTick()
  })

  // 6. 自定义扩散动画
  transition.ready.then(() => {
    // 定义圆形裁剪路径：从 0px 扩散到 endRadius
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ]

    // 对新视图（::view-transition-new(root)）应用动画
    document.documentElement.animate(
      {
        clipPath: clipPath
      },
      {
        duration: 400, // 动画时长 400ms
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)', // 强 ease-out，起步快、收尾稳
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
</script>