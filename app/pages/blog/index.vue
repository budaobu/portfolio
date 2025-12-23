<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- 页面头部 -->
    <div class="mb-12 md:mb-20">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        瞎扯
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        没有技术，都是瞎扯。
      </p>
    </div>

    <!-- 加载状态：骨架屏 -->
    <div v-if="pending" class="space-y-6">
      <div v-for="i in 3" :key="i">
        <UCard :ui="{ body: { padding: 'p-6 sm:p-8' } }">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-40 h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
            <div class="flex-1 space-y-4">
              <div class="h-8 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
              <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-20">
      <div class="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-gray-500">加载文章列表失败</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!articles?.length" class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 mb-4" />
      <p class="text-gray-500">暂无文章，敬请期待。</p>
    </div>

    <!-- 文章列表：增加淡入动画 -->
    <div v-else class="space-y-6 animate-fade-in">
      <NuxtLink
        v-for="article in articles"
        :key="article.path"
        :to="article.path"
        class="block group outline-none"
      >
        <UCard
          :ui="{
            body: { padding: 'p-6 sm:p-8' },
            base: 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-primary-500/20 dark:hover:ring-primary-400/20',
            rounded: 'rounded-xl',
            shadow: 'shadow-sm',
            divide: '',
            ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
          }"
        >
          <div class="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10">
            
            <div class="md:w-40 flex-shrink-0">
              <time 
                :datetime="article.date" 
                class="text-sm font-medium text-gray-500 dark:text-gray-400 md:border-l-2 md:border-transparent md:group-hover:border-primary-500 md:group-hover:pl-3 md:transition-all md:duration-300"
              >
                {{ formatDate(article.date) }}
              </time>
            </div>

            <div class="flex-1 min-w-0">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ article.title }}
              </h2>
              
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                {{ article.description }}
              </p>

              <div class="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                <span class="mr-1">阅读全文</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

          </div>
        </UCard>
      </NuxtLink>

      <!-- 新增：加载更多按钮 -->
      <div v-if="!allLoaded" class="flex justify-center pt-8 pb-4">
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
      <!-- 新增：到底提示 -->
      <div v-else class="text-center py-12 text-gray-400 text-sm italic">
        - 到底了，也没啥好扯的了 -
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '博客',
  description: '分享我的技术思考、开发日志和生活随笔。',
  ogTitle: '博客 - Budaobu',
})

// 分页配置
const PAGE_SIZE = 10
const loadingMore = ref(false)
const allLoaded = ref(false)

// 优化：开启 lazy 懒加载 + 分页限制 (Limit 10)
const { data: articles, pending, error } = await useAsyncData('blog-list', async () => {
  const data = await queryCollection('blog')
    .order('date', 'DESC')
    .limit(PAGE_SIZE)
    .all()
  return data
}, {
  lazy: true
})

// 监听初始数据，判断是否不够一页（直接显示到底）
watch(articles, (newVal) => {
  if (newVal && newVal.length < PAGE_SIZE) {
    allLoaded.value = true
  }
}, { immediate: true })

// 加载更多逻辑
const loadMore = async () => {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  
  try {
    const currentLength = articles.value?.length || 0
    // 跳过已有的数量，再取下一页
    const moreArticles = await queryCollection('blog')
      .order('date', 'DESC')
      .skip(currentLength)
      .limit(PAGE_SIZE)
      .all()
    
    // 如果取回来的数据少于 PAGE_SIZE，说明取完了
    if (moreArticles.length < PAGE_SIZE) {
      allLoaded.value = true
    }
    
    // 将新数据追加到列表末尾
    if (articles.value) {
      articles.value.push(...moreArticles)
    }
  } catch (err) {
    console.error('Failed to load more:', err)
  } finally {
    loadingMore.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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