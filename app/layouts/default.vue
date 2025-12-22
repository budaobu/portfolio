<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-16 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- 左侧：版权信息 -->
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span>&copy; {{ currentYear }} Budaobu.</span>
            <span class="hidden sm:inline">·</span>
            <span>Vibe with</span>
            <UIcon name="i-heroicons-heart-solid" class="text-red-500 w-4 h-4" />
          </p>

          <!-- 右侧：社交媒体图标 -->
          <!-- <div class="flex items-center gap-3">
            <UButton
              v-for="social in socialLinks"
              :key="social.name"
              :to="social.url"
              target="_blank"
              color="gray"
              variant="ghost"
              :icon="social.icon"
              size="sm"
              :aria-label="social.name"
              class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            />
          </div> -->
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>