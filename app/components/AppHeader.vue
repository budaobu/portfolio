<template>
  <header class="sticky top-0 z-50 border-b border-warm-200 dark:border-warm-800 bg-warm-50/90 dark:bg-olive-950/90 backdrop-blur-md">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="Back to Home">
        <div class="relative flex items-center justify-center">
          <span class="absolute inset-0 rounded-sm bg-coral-500/20 z-0 opacity-0 group-hover:opacity-100 group-hover:animate-ping-short" aria-hidden="true"></span>

          <img
            :src="avatarUrl"
            @error="handleImageError"
            alt="Budaobu"
            class="relative z-10 w-9 h-9 rounded-sm ring-2 ring-warm-300 dark:ring-warm-700 group-hover:ring-coral-500 transition-colors duration-200 ease-out object-cover bg-white dark:bg-warm-950"
          />
        </div>
        <span class="font-serif font-medium text-warm-900 dark:text-warm-100 hidden sm:block">Budaobu</span>
      </NuxtLink>

      <div class="flex items-center gap-1 sm:gap-2">
        <UButton
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          color="gray"
          variant="ghost"
          :icon="item.icon"
          :label="item.label"
          :class="getNavClass(item.path)"
          class="rounded-sm nav-btn"
        />

        <UButton
          to="/sponsor"
          color="coral"
          variant="ghost"
          icon="i-heroicons-heart-solid"
          label="Sponsor"
          class="rounded-sm nav-btn"
        />

        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const avatarUrl = ref('/avatar.webp')

const navItems = [
  { path: '/projects', label: 'Projects', icon: 'i-heroicons-rocket-launch' },
  { path: '/blog', label: 'Articles', icon: 'i-heroicons-book-open' },
  { path: '/uses', label: 'Uses', icon: 'i-heroicons-shopping-bag' }
]

const getNavClass = (path: string) => {
  const isActive = route.path.startsWith(path)
  return [
    'transition-colors rounded-sm',
    isActive
      ? 'text-coral-600 dark:text-coral-400 bg-warm-200 dark:bg-warm-800'
      : 'hover:text-coral-600 dark:hover:text-coral-400'
  ]
}

const handleImageError = () => {
  if (avatarUrl.value === '/avatar.webp') {
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>

<style scoped>
/* 移动端隐藏 label，只显示 icon */
@media (max-width: 639px) {
  .nav-btn :deep([data-slot="label"]) {
    display: none;
  }
}
</style>