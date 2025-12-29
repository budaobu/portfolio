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
            
            <!-- 
              修改方案 (移动端适配 + 可点击链接 + 视觉层级优化):
              1. 默认 (Mobile): space-x-1 (不堆叠)
              2. sm (Desktop): -space-x-2 (堆叠) + hover:space-x-1 (悬停展开)
              3. 新增 div 包装层：
                 - zIndex: 动态计算，实现 index 0 (第一个) 在最上层。
                 - hover:z-50: 悬停时通过高 z-index 确保当前元素浮起不被遮挡。
            -->
            <span class="inline-flex items-center space-x-1 sm:-space-x-2 sm:hover:space-x-1 transition-all duration-500 ease-in-out px-1">
              <div 
                v-for="(tool, index) in aiTools" 
                :key="tool.name" 
                class="relative transition-all duration-500 ease-in-out hover:z-50"
                :style="{ zIndex: aiTools.length - index }"
              >
                <UTooltip 
                  :text="tool.name" 
                  :popper="{ placement: 'top' }"
                >
                  <!-- 
                    NuxtLink 
                    - transition-transform: 仅负责缩放动画
                    - active:scale-90: 点击反馈
                  -->
                  <NuxtLink 
                    :to="tool.url" 
                    target="_blank" 
                    rel="nofollow"
                    class="block focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-90"
                    :aria-label="tool.name"
                  >
                    <img 
                      :src="tool.icon" 
                      class="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-950 bg-white dark:bg-gray-800 object-cover" 
                      :alt="tool.name" 
                    />
                  </NuxtLink>
                </UTooltip>
              </div>
            </span>

          </p>

          <!-- 右侧：社交媒体图标 (DOM顺序 2 -> 移动端上 / 桌面端右) -->
          <div class="flex items-center gap-3">
            <UTooltip 
              v-for="social in socialLinks" 
              :key="social.name" 
              :text="social.name"
              :popper="{ placement: 'top' }"
            >
              <UButton
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
            </UTooltip>
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

// 定义 AI 工具类型
interface AiTool {
  name: string
  icon: string
  url: string
}

// AI 工具数据
const aiTools: AiTool[] = [
  {
    name: 'Gemini 3.0 Flash',
    icon: '/gemini-color.svg',
    url: 'https://deepmind.google/technologies/gemini/'
  },
  {
    name: 'Claude 3.5 Sonnet',
    icon: '/claude-color.svg',
    url: 'https://www.anthropic.com/claude'
  }
]

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