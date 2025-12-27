<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-16 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 
          核心修改：
          将 flex-col 改为 flex-col-reverse
          1. 移动端 (flex-col-reverse): 容器内的子元素反向堆叠 -> DOM中靠后的元素(社媒)会显示在上方。
          2. 桌面端 (md:flex-row): 恢复正常的行布局 -> DOM中靠前的元素(版权)在左侧，靠后的(社媒)在右侧。
        -->
        <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <!-- 左侧：版权信息 (DOM顺序 1 -> 移动端下 / 桌面端左) -->
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span>&copy; {{ currentYear }} Budaobu.</span>
            <span class="hidden sm:inline">·</span>
            <span>Vibe with</span>
            <!-- <UIcon name="i-heroicons-heart-solid" class="text-red-500 w-4 h-4" /> -->
            <!-- 
              修改方案：
              1. 动效优化: transition-all duration-500 ease-in-out 让展开更柔和
              2. 交互优化: hover:scale-110 让图标有呼吸感
              3. 功能增加: 使用 UTooltip 添加悬停提示 (自带 fade 效果)
            -->
            <span class="inline-flex items-center -space-x-2 hover:space-x-1 transition-all duration-500 ease-in-out px-1">
              <UTooltip text="Gemini 3.0 Pro" :popper="{ placement: 'top' }">
                <img 
                  src="/gemini-color.svg" 
                  class="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-950 bg-white dark:bg-gray-800 object-cover relative transition-all duration-300 hover:scale-110 hover:z-10" 
                  alt="Gemini" 
                />
              </UTooltip>
              <UTooltip text="Claude 4.5 Sonnet" :popper="{ placement: 'top' }">
                <img 
                  src="/claude-color.svg" 
                  class="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-950 bg-white dark:bg-gray-800 object-cover relative transition-all duration-300 hover:scale-110 hover:z-10" 
                  alt="Claude" 
                />
              </UTooltip>
            </span>
          </p>

          <!-- 右侧：社交媒体图标 (DOM顺序 2 -> 移动端上 / 桌面端右) -->
          <div class="flex items-center gap-3">
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
              class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              @click="handleSocialClick(social)"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

// 定义 Social Link 类型
interface SocialLink {
  name: string
  icon: string
  url: string
}

// 防爬虫点击处理逻辑
const handleSocialClick = (social: SocialLink) => {
  if (social.name === 'Email') {
    // 核心技巧：将邮箱拆分为两部分，只有在用户点击时才拼接
    // 这样爬虫在源码中找不到完整的邮箱地址
    const u = 'lizhaoshui'
    const d = 'duck.com'
    window.location.href = `mailto:${u}@${d}`
  } else if (social.url) {
    // 普通链接直接新窗口打开
    window.open(social.url, '_blank')
  }
}
</script>