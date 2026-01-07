<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
    <UContainer class="h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="Back to Home">
        <img 
          :src="avatarUrl" 
          @error="handleImageError"
          alt="Budaobu" 
          class="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all object-cover"
        />
      </NuxtLink>
      
      <div class="flex items-center gap-2 sm:gap-4">
        <template v-for="item in navItems" :key="item.path">
          <UButton
            v-if="!isMobile"
            :to="item.path"
            color="gray"
            variant="ghost"
            :label="item.label"
            :class="getNavClass(item.path)"
          />
          <UButton
            v-else
            :to="item.path"
            color="gray"
            variant="ghost"
            :icon="item.icon"
            :class="getMobileNavClass(item.path)"
            :aria-label="item.label"
          />
        </template>

        <UButton
          to="/sponsor"
          color="primary"
          variant="soft"
          icon="i-heroicons-heart-solid"
          :label="isMobile ? undefined : 'Sponsor'"
          :aria-label="isMobile ? 'Sponsor' : undefined"
        />
        
        <ThemeToggle />
      </div>
    </UContainer>
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

const isMobile = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

const getNavClass = (path: string) => {
  const isActive = route.path.startsWith(path)
  return [
    'transition-colors',
    isActive 
      ? 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800' 
      : 'hover:text-primary-500 dark:hover:text-primary-400'
  ]
}

const getMobileNavClass = (path: string) => {
  return route.path.startsWith(path) 
    ? 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800' 
    : ''
}

const handleImageError = () => {
  if (avatarUrl.value === '/avatar.webp') {
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>