<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img 
            v-if="avatar" 
            :src="avatar" 
            alt="Logo" 
            class="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all"
          />
          <div v-else class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        </NuxtLink>
        
        <div class="flex items-center gap-3">
          <UButton
            to="/sponsor"
            color="primary"
            variant="soft"
            icon="i-heroicons-heart"
            label="赞助"
          />
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { data: githubData } = await useFetch('/api/github-avatar')
const avatar = computed(() => githubData.value?.avatar_url)

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: avatar.value || '/favicon.ico'
    }
  ]
})
</script>