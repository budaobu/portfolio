<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group">
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
            v-if="!isMobile"
            to="/sponsor"
            color="primary"
            variant="soft"
            icon="i-heroicons-heart-solid"
            label="Sponsor"
          />
          <UButton
            v-else
            to="/sponsor"
            color="primary"
            variant="soft"
            icon="i-heroicons-heart-solid"
            aria-label="Sponsor"
          />
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
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
    ? 'text-primary-500 dark:text-primary-400' 
    : ''
}

const handleImageError = () => {
  if (!avatarUrl.value.includes('github.com')) {
    console.warn('Avatar API failed, falling back to GitHub CDN')
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>