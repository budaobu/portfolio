<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <!-- 添加 @error 处理，如果 API 挂了自动切回 GitHub 源 -->
          <img 
            :src="avatarUrl" 
            @error="handleImageError"
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
// 使用 ref 使其变为响应式，以便在加载失败时切换地址
const avatarUrl = ref('/api/avatar.png')

// 图片加载失败时的兜底处理
const handleImageError = () => {
  // 如果当前不是 GitHub 地址（避免死循环），则降级使用 GitHub 直链
  if (!avatarUrl.value.includes('github.com')) {
    console.warn('Avatar API failed, falling back to GitHub CDN')
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>