<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        Buy List
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        My wallet suffered for this list.
        <span class="text-sm opacity-75 block mt-2">
          Note: Links marked with <UBadge color="orange" variant="subtle" size="xs" label="AFF" /> are affiliate links; I may earn a small commission at no extra cost to you.
        </span>
      </p>
    </div>

    <!-- 加载状态：初始加载时显示骨架屏 -->
    <div v-if="pending && page === 1" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-80 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse ring-1 ring-gray-200 dark:ring-gray-800"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-10 text-red-500">
      Failed to fetch projects data. Please try again later.
    </div>

    <!-- 商品列表 -->
    <div v-else class="space-y-12 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a 
          v-for="item in allUses" 
          :key="item.id"
          :href="item.linkUrl"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group block h-full focus:outline-none"
        >
          <UCard
            :ui="{
              base: 'h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden',
              body: { padding: 'p-0', base: 'flex-1 flex flex-col' },
              header: { padding: '' },
              footer: { padding: '' }
            }"
          >
            <!-- 方案区分：根据是否有 imageUrl 渲染不同结构 -->
            
            <!-- 样式 A：有封面图模式 (传统电商卡片) -->
            <template v-if="item.imageUrl">
              <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  :src="item.imageUrl" 
                  :alt="item.name"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <!-- 标签绝对定位 -->
                <div v-if="item.isAffiliate" class="absolute top-2 right-2 z-10">
                  <UBadge color="orange" variant="solid" size="xs" class="shadow-sm">AFF</UBadge>
                </div>
                <div class="absolute bottom-2 left-2 z-10">
                  <UBadge color="gray" variant="solid" size="xs" class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">{{ item.category }}</UBadge>
                </div>
              </div>

              <!-- 下方内容区 -->
              <div class="p-5 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">{{ item.brand }}</span>
                  <UIcon name="i-lucide-circle-arrow-out-up-right" class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{{ item.description }}</p>
              </div>
            </template>

            <!-- 样式 B：无图模式 (纯内容/工具卡片) -->
            <template v-else>
              <div class="p-6 h-full flex flex-col relative">
                <!-- AFF 标记：改为右上角绝对定位 -->
                <div v-if="item.isAffiliate" class="absolute top-4 right-4">
                  <UBadge color="orange" variant="solid" size="xs">AFF</UBadge>
                </div>

                <!-- 头部：Icon + 标题 -->
                <div class="flex items-start gap-4 mb-4">
                  <div class="flex-shrink-0">
                     <img 
                      :src="getFavicon(item.linkUrl)" 
                      :alt="item.brand"
                      class="w-12 h-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 object-contain" 
                      @error="handleIconError"
                    />
                  </div>
                  <div class="pt-1 pr-8"> <!-- pr-8 避让 AFF 标签 -->
                    <div class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">{{ item.brand }}</div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{{ item.name }}</h3>
                  </div>
                </div>

                <!-- 描述 -->
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {{ item.description }}
                </p>

                <!-- 底部：分类 + 跳转图标 -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <UBadge color="gray" variant="subtle" size="sm">{{ item.category }}</UBadge>
                  <div class="flex items-center text-xs text-gray-400 group-hover:text-primary-500 transition-colors">
                    <span class="mr-1">View</span>
                    <UIcon name="i-lucide-circle-arrow-out-up-right" class="w-3 h-3" />
                  </div>
                </div>
              </div>
            </template>

          </UCard>
        </a>
      </div>

      <!-- 无限滚动触发器 -->
      <!-- 关键修改：绑定 ref="loadMoreTrigger" -->
      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-refresh-cw" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
      
      <!-- 到底提示 -->
      <div v-else-if="allUses.length > 0" class="text-center py-8 text-gray-400 text-sm italic">
        - Budget: Zero. -
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Use } from '~/server/utils/usesData'

useSeoMeta({
  title: 'Uses, Goods, Stuff I Paid For',
  description: 'Everything here is something I actually paid for. Welcome to my personal \'Buy\' list. Note: Links marked with AFF are affiliate links; I may earn a small commission at no extra cost to you.',
  keywords: 'Uses, Goods, Shopping List, Budaobu, Tech Gear, Affiliate, My Buy List',
  ogTitle: 'Budaobu\'s \'Buy\' List - Stuff I Paid For',
  ogDescription: 'My wallet suffered for this list. A collection of things I actually spent money on. (AFF links included at no extra cost)',
})

// 核心修改：使用 useInfiniteScroll
const { 
  items: allUses, 
  pending, 
  error, 
  hasMore, 
  loadMoreTrigger 
} = await useInfiniteScroll<Use>('/api/uses', 9)

const getFavicon = (url: string) => {
  if (!url) return ''
  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  } catch (e) {
    return ''
  }
}

const handleIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/avatar.webp' // 替换为本地默认图标
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>