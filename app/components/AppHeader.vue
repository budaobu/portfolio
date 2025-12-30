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
          <!-- 
            优化说明：
            1. 移除了 script 中的路由计算逻辑。
            2. 使用 active-class 自动处理高亮。
            3. 对于以 /projects 开头的嵌套路由，NuxtLink 默认支持部分匹配，
               如果需要精确匹配使用 exact 属性，这里列表页到详情页需要高亮，默认行为即可。
          -->
          
          <!-- Projects -->
          <UButton
            to="/projects"
            color="gray"
            variant="ghost"
            label="Projects"
            active-class="text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <!-- Mobile Icon Project -->
          <UButton
            to="/projects"
            color="gray"
            variant="ghost"
            icon="i-heroicons-rocket-launch"
            active-class="text-primary-500 dark:text-primary-400"
            class="sm:hidden"
            aria-label="Projects"
          />

          <!-- Blog -->
          <UButton
            to="/blog"
            color="gray"
            variant="ghost"
            label="Articles"
            active-class="text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <!-- Mobile Icon Blog -->
          <UButton
            to="/blog"
            color="gray"
            variant="ghost"
            icon="i-heroicons-book-open"
            active-class="text-primary-500 dark:text-primary-400"
            class="sm:hidden"
            aria-label="Articles"
          />

          <!-- Uses -->
          <UButton
            to="/uses"
            color="gray"
            variant="ghost"
            label="Uses"
            active-class="text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <!-- Mobile Icon Uses -->
          <UButton
            to="/uses"
            color="gray"
            variant="ghost"
            icon="i-heroicons-shopping-bag"
            active-class="text-primary-500 dark:text-primary-400"
            class="sm:hidden"
            aria-label="Uses"
          />

          <!-- Sponsor  -->
          <UButton
            to="/sponsor"
            color="primary"
            variant="soft"
            icon="i-heroicons-heart-solid"
            label="Sponsor"
            class="hidden sm:flex"
          />
          <UButton
            to="/sponsor"
            color="primary"
            variant="soft"
            icon="i-heroicons-heart-solid"
            class="sm:hidden"
            aria-label="Sponsor"
          />
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Script 变得非常干净
const avatarUrl = ref('/avatar.webp')  // 使用本地图片替换动态获取 /api/avatar.png

const handleImageError = () => {
  if (!avatarUrl.value.includes('github.com')) {
    console.warn('Avatar API failed, falling back to GitHub CDN')
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>