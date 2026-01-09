<template>
  <UButton
    color="gray"
    variant="ghost"
    aria-label="Toggle Theme"
    class="group"
    @click="toggleTheme"
  >
    <component :is="CurrentIconComponent" />
  </UButton>
</template>

<script setup lang="ts">
// 引入组件引用 (Nuxt 自动导入通常无需手动 import，但为了类型安全和显式逻辑，这里展示对应关系)
// 注意：确保 GhostIcon, SunIcon, MoonIcon 都在 components 目录下

const GhostIcon = resolveComponent('GhostIcon')
const SunIcon = resolveComponent('SunIcon')
const MoonIcon = resolveComponent('MoonIcon')

const colorMode = useColorMode()

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

// 计算当前应该渲染哪个组件
const CurrentIconComponent = computed(() => {
  if (colorMode.preference === 'system') return GhostIcon
  if (colorMode.preference === 'dark') return MoonIcon
  return SunIcon // light mode
})

const toggleTheme = () => {
  const currentIndex = themes.indexOf(colorMode.preference as Theme)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
}
</script>