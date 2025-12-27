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
          <!-- 作品链接 -->
          <UButton
            to="/projects"
            :color="isProjectsActive ? 'primary' : 'gray'"
            variant="ghost"
            label="Projects"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <UButton
            to="/projects"
            :color="isProjectsActive ? 'primary' : 'gray'"
            variant="ghost"
            icon="i-heroicons-rocket-launch"
            class="sm:hidden hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            aria-label="Projects"
          />

          <!-- 文章链接 -->
          <UButton
            to="/blog"
            :color="isBlogActive ? 'primary' : 'gray'"
            variant="ghost"
            label="Articles"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <UButton
            to="/blog"
            :color="isBlogActive ? 'primary' : 'gray'"
            variant="ghost"
            icon="i-heroicons-book-open"
            class="sm:hidden hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            aria-label="Articles"
          />

          <!-- 好物推荐链接 -->
          <UButton
            to="/uses"
            :color="isGoodsActive ? 'primary' : 'gray'"
            variant="ghost"
            label="Uses"
            class="hidden sm:flex hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          />
          <UButton
            to="/uses"
            :color="isGoodsActive ? 'primary' : 'gray'"
            variant="ghost"
            icon="i-heroicons-shopping-bag"
            class="sm:hidden hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            aria-label="Uses"
          />

          <!-- 赞助链接 -->
          <!-- 保持 variant="soft" 带有背景色，作为视觉重点 -->
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
const route = useRoute()
const avatarUrl = ref('/avatar.webp') // 使用本地图片替换动态获取 /api/avatar.png

// 计算属性：根据当前路径判断是否激活
const isProjectsActive = computed(() => route.path.startsWith('/projects'))
const isBlogActive = computed(() => route.path.startsWith('/blog'))
const isGoodsActive = computed(() => route.path.startsWith('/uses'))

const handleImageError = () => {
  if (!avatarUrl.value.includes('github.com')) {
    console.warn('Avatar API failed, falling back to GitHub CDN')
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>