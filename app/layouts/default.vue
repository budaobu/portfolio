<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 py-6 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
          © {{ currentYear }} Budaobu. Vibe with <UIcon name="i-heroicons-heart-solid" class="text-red-500" />
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>