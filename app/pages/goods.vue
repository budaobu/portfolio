<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        败家
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        都是我花了钱的。
        <span class="text-sm opacity-75 block mt-2">
          注：带有 <UBadge color="orange" variant="subtle" size="xs" label="AFF" /> 标记的链接为推广链接，购买时我可能会获得少量佣金，这不会增加您的购买成本。
        </span>
      </p>
    </div>

    <!-- 加载状态：初始加载时显示骨架屏 -->
    <div v-if="pending && page === 1" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-80 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse ring-1 ring-gray-200 dark:ring-gray-800"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-10 text-red-500">
      获取好物数据失败，请稍后重试。
    </div>

    <!-- 商品列表 -->
    <div v-else class="space-y-12 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a 
          v-for="item in allGoods" 
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
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
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
                  <UBadge color="gray" variant="subtle" size="xs">{{ item.category }}</UBadge>
                  <div class="flex items-center text-xs text-gray-400 group-hover:text-primary-500 transition-colors">
                    <span class="mr-1">访问</span>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3" />
                  </div>
                </div>
              </div>
            </template>

          </UCard>
        </a>
      </div>

      <!-- 加载更多按钮 -->
      <div v-if="hasMore" class="flex justify-center pt-4">
        <UButton 
          :loading="loadingMore"
          variant="soft" 
          color="gray" 
          label="加载更多" 
          icon="i-heroicons-arrow-path"
          @click="loadMore"
          class="px-8"
        />
      </div>
      <!-- 到底提示 -->
      <div v-else-if="allGoods.length > 0" class="text-center py-8 text-gray-400 text-sm italic">
        - 到底了，也没钱败了 -
      </div>
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

// 分页 API 返回结构
interface ApiResponse {
  items: Good[]
  hasMore: boolean
  total: number
}

const PAGE_SIZE = 9 // 3列布局，9个刚好填满
const page = ref(1)
const allGoods = ref<Good[]>([])
const hasMore = ref(false)
const loadingMore = ref(false)

// 1. 初始加载：使用 useFetch 获取第一页数据
const { data, pending, error } = await useFetch<ApiResponse>('/api/goods', {
  lazy: true,
  query: { 
    page: 1, 
    limit: PAGE_SIZE 
  }
})

// 监听初始数据返回，并初始化列表
watch(data, (newVal) => {
  if (newVal) {
    allGoods.value = newVal.items
    hasMore.value = newVal.hasMore
  }
}, { immediate: true })

// 2. 加载更多：使用 $fetch 发起后续请求
const loadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  
  try {
    const nextPage = page.value + 1
    const response = await $fetch<ApiResponse>('/api/goods', {
      query: { 
        page: nextPage, 
        limit: PAGE_SIZE 
      }
    })
    
    if (response) {
      // 追加新数据
      allGoods.value.push(...response.items)
      hasMore.value = response.hasMore
      page.value = nextPage
    }
  } catch (err) {
    console.error('加载更多失败:', err)
  } finally {
    loadingMore.value = false
  }
}

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