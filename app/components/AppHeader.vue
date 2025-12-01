<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <!-- 使用绑定的常量，确保万无一失 -->
          <img 
            :src="avatarUrl" 
            alt="Budaobu" 
            class="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all object-cover"
          />
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
// 将 URL 定义为常量，避免模板直接解析可能带来的边缘问题
// 同时也确保了文件内容发生实质变更，强迫 Git 识别更新
const avatarUrl = '/api/avatar.png'
</script>