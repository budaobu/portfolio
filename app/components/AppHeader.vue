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
            由于 /blog (index.vue) 和 /blog/slug 是平级路由，active-class 无法自动识别包含关系。
            这里改用 route.path.startsWith() 手动判断高亮状态。
          -->
          
          <!-- Projects -->
          <UButton
            to="/projects"
            color="gray"
            variant="ghost"
            label="Projects"
            :class="[
              'hidden sm:flex transition-colors',
              route.path.startsWith('/projects') 
                ? 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800' 
                : 'hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          />
          <!-- Mobile Icon Project -->
          <UButton
            to="/projects"
            color="gray"
            variant="ghost"
            icon="i-heroicons-rocket-launch"
            :class="[
              'sm:hidden',
              route.path.startsWith('/projects')
                ? 'text-primary-500 dark:text-primary-400'
                : ''
            ]"
            aria-label="Projects"
          />

          <!-- Blog -->
          <UButton
            to="/blog"
            color="gray"
            variant="ghost"
            label="Articles"
            :class="[
              'hidden sm:flex transition-colors',
              route.path.startsWith('/blog') 
                ? 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800' 
                : 'hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          />
          <!-- Mobile Icon Blog -->
          <UButton
            to="/blog"
            color="gray"
            variant="ghost"
            icon="i-heroicons-book-open"
            :class="[
              'sm:hidden',
              route.path.startsWith('/blog')
                ? 'text-primary-500 dark:text-primary-400'
                : ''
            ]"
            aria-label="Articles"
          />

          <!-- Uses -->
          <UButton
            to="/uses"
            color="gray"
            variant="ghost"
            label="Uses"
            :class="[
              'hidden sm:flex transition-colors',
              route.path.startsWith('/uses') 
                ? 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800' 
                : 'hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          />
          <!-- Mobile Icon Uses -->
          <UButton
            to="/uses"
            color="gray"
            variant="ghost"
            icon="i-heroicons-shopping-bag"
            :class="[
              'sm:hidden',
              route.path.startsWith('/uses')
                ? 'text-primary-500 dark:text-primary-400'
                : ''
            ]"
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
// 引入 useRoute 用于手动判断路径高亮
const route = useRoute()
const avatarUrl = ref('/avatar.webp')

const handleImageError = () => {
  if (!avatarUrl.value.includes('github.com')) {
    console.warn('Avatar API failed, falling back to GitHub CDN')
    avatarUrl.value = 'https://github.com/budaobu.png'
  }
}
</script>