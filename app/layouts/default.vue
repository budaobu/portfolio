<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-16 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <!-- 左侧：版权信息 -->
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span>&copy; {{ currentYear }} Budaobu.</span>
            <span class="hidden sm:inline">·</span>
            <span>Vibe with</span>
            
            <!-- AI 工具图标组 (保留之前的优化：反向堆叠 + 独立 NuxtLink) -->
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
                  <NuxtLink 
                    :to="tool.url" 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
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

          <!-- 右侧：社交媒体图标 -->
          <!-- 更新：增加 placement 筛选逻辑 (footer) -->
          <div class="flex items-center gap-3">
            <template v-for="social in socialLinks" :key="social.name">
              <UTooltip 
                v-if="social.placement?.includes('footer')"
                :text="social.name"
                :popper="{ placement: 'top' }"
              >
                <!-- 
                  核心优化：
                  1. 动态绑定 to: 如果有 url，UButton 会自动渲染为 <a> (NuxtLink)
                  2. 动态绑定 rel: 只有链接才需要 SEO 属性
                  3. @click: 依然保留，但 JS 内部只处理 Email 逻辑
                -->
                <UButton
                  :to="social.url || undefined"
                  :target="social.url ? '_blank' : undefined"
                  :rel="social.url ? 'noopener noreferrer nofollow' : undefined"
                  color="gray"
                  variant="ghost"
                  :icon="social.icon"
                  size="sm"
                  :aria-label="social.name"
                  class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                  @click="handleSocialClick(social)"
                />
              </UTooltip>
            </template>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

interface SocialLink {
  name: string
  icon: string
  url: string
  placement?: string[]
}

interface AiTool {
  name: string
  icon: string
  url: string
}

const aiTools: AiTool[] = [
  {
    name: 'Gemini 3.0 Pro',
    icon: '/gemini-color.svg',
    url: 'https://deepmind.google/technologies/gemini/'
  },
  {
    name: 'Claude 4.5 Sonnet',
    icon: '/claude-color.svg',
    url: 'https://www.anthropic.com/claude'
  }
]

// 优化后的点击处理：仅处理 Email 防爬虫逻辑
const handleSocialClick = (social: SocialLink) => {
  if (social.name === 'Email') {
    const u = 'lizhaoshui'
    const d = 'duck.com'
    window.location.href = `mailto:${u}@${d}`
  } 
  // 其他链接由 UButton 的 `to` 属性自动处理，无需 JS 干预
}
</script>