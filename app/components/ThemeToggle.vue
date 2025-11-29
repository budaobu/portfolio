<template>
  <UButton
    :icon="currentIcon"
    color="gray"
    variant="ghost"
    aria-label="主题切换"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const themes = ['system', 'light', 'dark'] as const
type Theme = typeof themes[number]

const currentIcon = computed(() => {
  if (colorMode.preference === 'system') return 'i-heroicons-computer-desktop'
  if (colorMode.preference === 'dark') return 'i-heroicons-moon'
  return 'i-heroicons-sun'
})

const toggleTheme = () => {
  const currentIndex = themes.indexOf(colorMode.preference as Theme)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
}
</script>