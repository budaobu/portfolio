<template>
  <UButton
    color="gray"
    variant="ghost"
    aria-label="Toggle Theme"
    class="group relative overflow-hidden"
    @click="toggleTheme"
  >
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

const toggleTheme = () => {
  const currentIndex = themes.indexOf(colorMode.preference as Theme)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
  
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}
</script>