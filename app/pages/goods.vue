<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        好物推荐
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        工欲善其事，必先利其器。这里列出了我在工作和生活中长期使用并高度认可的物品。
        <span class="text-sm opacity-75 block mt-2">
          注：带有 <UBadge color="orange" variant="subtle" size="xs" label="AFF" /> 标记的链接为推广链接，购买时我可能会获得少量佣金，这不会增加您的购买成本。
        </span>
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-80 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-10 text-red-500">
      获取好物数据失败，请稍后重试。
    </div>

    <!-- 商品列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <a 
        v-for="item in goodsList" 
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
          <!-- 图片/图标显示区域 -->
          <!-- 增加 flex justify-center items-center 以便让无图时的 icon 居中 -->
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors flex items-center justify-center">
            
            <!-- 情况1：有 imageUrl，显示全屏封面图 -->
            <img 
              v-if="item.imageUrl"
              :src="item.imageUrl" 
              :alt="item.name"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <!-- 情况2：没有 imageUrl，根据 linkUrl 提取 Favicon -->
            <div v-else class="flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <img 
                :src="getFavicon(item.linkUrl)" 
                :alt="item.brand"
                class="w-20 h-20 rounded-2xl shadow-sm bg-white dark:bg-gray-700 p-2" 
                @error="handleIconError"
              />
            </div>

            <!-- AFF 标记 (绝对定位在右上角) -->
            <div v-if="item.isAffiliate" class="absolute top-2 right-2 z-10">
              <UBadge 
                color="orange" 
                variant="solid" 
                size="xs"
                class="shadow-sm"
              >
                AFF
              </UBadge>
            </div>

            <!-- 类别标记 (左下角) -->
            <div class="absolute bottom-2 left-2 z-10">
              <UBadge 
                color="gray" 
                variant="solid" 
                size="xs" 
                class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200"
              >
                {{ item.category }}
              </UBadge>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                {{ item.brand }}
              </span>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ item.name }}
            </h3>

            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </UCard>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Good } from '~/server/utils/goodsData'

useSeoMeta({
  title: '好物推荐',
  description: 'Budaobu 的好物推荐清单 - 分享我日常使用的数码产品、软件工具和生活好物。',
  ogTitle: '好物推荐 - Budaobu',
})

const { data: goodsList, pending, error } = await useFetch<Good[]>('/api/goods')

// 获取 Favicon 的辅助函数
const getFavicon = (url: string) => {
  if (!url) return ''
  try {
    const hostname = new URL(url).hostname
    // 使用 Google S2 服务获取高清 Favicon (sz=128)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  } catch (e) {
    return ''
  }
}

// 图标加载失败处理（可选）
const handleIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  // 失败时可以显示一个默认占位图
  img.src = '/api/avatar.png' 
}
</script>