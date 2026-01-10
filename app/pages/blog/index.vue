<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- 页面头部 -->
    <div class="mb-12 md:mb-20">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        Blog
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        No Tech, just ramblings.
      </p>

      <!-- 社交媒体图标栏 -->
      <div class="flex items-center gap-4 mt-6">
        <UTooltip 
          v-for="social in blogSocialLinks" 
          :key="social.name"
          :text="social.name"
          :popper="{ placement: 'top' }"
        >
          <NuxtLink
            :to="social.url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            :aria-label="social.name"
            class="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-orange-500 dark:hover:text-orange-400 text-gray-600 dark:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <UIcon :name="social.icon" class="w-5 h-5" />
          </NuxtLink>
        </UTooltip>
      </div>
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
      <p class="text-gray-500">Failed to fetch articles. Please try again later.</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!articles?.length" class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 mb-4" />
      <p class="text-gray-500">No articles yet, stay tuned.</p>
    </div>

    <!-- 文章列表：使用新的 BlogCard 组件 -->
    <div v-else class="space-y-6 animate-fade-in">
      <BlogCard
        v-for="article in articles"
        :key="article.path"
        :article="article"
      />

      <!-- 无限滚动触发器 -->
      <div v-if="!allLoaded" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-refresh-cw" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
      <!-- 到底提示 -->
      <div v-else class="text-center py-12 text-gray-400 text-sm italic">
        - All rambled out. -
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSiteSeo('blog')

const blogSocialLinks = computed(() => 
  socialLinks.filter(link => link.placement?.includes('blog'))
)

// 分页配置
const PAGE_SIZE = 10
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)

// 🔧 核心修复：增加重试逻辑
const maxRetries = 3
let retryCount = 0

const fetchBlogList = async (): Promise<any[]> => {
  try {
    return await queryCollection('blog')
      .order('date', 'DESC')
      .limit(PAGE_SIZE)
      .all()
  } catch (error) {
    // 如果是首次加载失败且未超过重试次数，等待后重试
    if (retryCount < maxRetries) {
      retryCount++
      console.warn(`Blog data fetch failed, retrying (${retryCount}/${maxRetries})...`)
      await new Promise(resolve => setTimeout(resolve, 300 * retryCount)) // 递增延迟
      return fetchBlogList()
    }
    throw error
  }
}

const { data: articles, pending, error } = await useAsyncData(
  'blog-list', 
  fetchBlogList,
  {
    lazy: true,
    watch: false
  }
)

watch(articles, (newVal) => {
  if (newVal && newVal.length < PAGE_SIZE) {
    allLoaded.value = true
  }
}, { immediate: true })

const loadMore = async () => {
  if (loadingMore.value || allLoaded.value) return
  loadingMore.value = true
  
  try {
    const currentLength = articles.value?.length || 0
    const moreArticles = await queryCollection('blog')
      .order('date', 'DESC')
      .skip(currentLength)
      .limit(PAGE_SIZE)
      .all()
    
    if (moreArticles.length < PAGE_SIZE) {
      allLoaded.value = true
    }
    
    if (articles.value) {
      articles.value.push(...moreArticles)
    }
  } catch (err) {
    console.error('Failed to load more:', err)
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingMore.value && !allLoaded.value) {
      loadMore()
    }
  }, { rootMargin: '200px' })

  watch(loadMoreTrigger, (el) => {
    if (el) observer.observe(el)
    else observer.disconnect()
  })
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>