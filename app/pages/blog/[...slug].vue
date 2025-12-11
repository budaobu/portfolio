<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- 加载状态 -->
    <div v-if="pending" class="w-full mx-auto">
      <div class="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm p-8 md:p-12 space-y-8">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          <div class="flex-1 space-y-4">
            <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
            <div class="h-8 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
        <div class="h-96 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>

    <!-- 错误/404 状态 -->
    <div v-else-if="error || !doc" class="text-center py-20">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-gray-500 mb-8">文章未找到</p>
      <UButton to="/blog" color="primary">返回博客首页</UButton>
    </div>

    <!-- 正文内容容器 -->
    <article 
      v-else 
      class="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm p-6 sm:p-10 md:p-12 transition-all duration-300"
    >
      <!-- 头部区域：参考图样式 -->
      <header class="mb-10 flex flex-col md:flex-row gap-6 md:gap-8">
        
        <!-- 左侧：返回按钮 (圆形) -->
        <div class="flex-shrink-0 pt-1">
          <UButton 
            to="/blog" 
            icon="i-heroicons-arrow-left" 
            color="gray"
            variant="ghost"
            aria-label="返回列表"
            :ui="{ rounded: 'rounded-full' }"
            class="w-10 h-10 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:ring-primary-500 dark:hover:ring-primary-400 transition-all group"
          />
        </div>

        <!-- 右侧：元数据与标题 -->
        <div class="flex-1 min-w-0">
          <!-- 元数据行：竖线 | 日期 • 分类 -->
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4 h-5">
            <time :datetime="doc.date">{{ formatDate(doc.date) }}</time>
            <span v-if="doc.category" class="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span v-if="doc.category" class="text-primary-600 dark:text-primary-400 font-medium">{{ doc.category }}</span>
          </div>

          <!-- 标题 -->
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
            {{ doc.title }}
          </h1>

          <!-- 封面图 (如果存在) -->
          <div v-if="doc.cover || doc.image" class="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-10 ring-1 ring-gray-200 dark:ring-gray-800">
            <img :src="doc.cover || doc.image" :alt="doc.title" class="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <!-- MDX 内容渲染区 -->
      <!-- max-w-none: 移除默认宽度限制，由外层容器控制 -->
      <div class="prose prose-lg prose-gray dark:prose-invert prose-primary max-w-none pl-0 md:pl-[4.5rem]">
        <ContentRenderer :value="doc" />
      </div>

      <!-- 底部操作栏 -->
      <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center pl-0 md:pl-[4.5rem]">
        <UButton 
          to="/blog" 
          variant="ghost" 
          color="gray"
          size="sm"
          icon="i-heroicons-arrow-left" 
          label="返回列表"
        />
        <UButton 
          @click="shareArticle"
          variant="soft" 
          color="gray"
          size="sm"
          icon="i-heroicons-share" 
          label="分享本文"
        />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Nuxt Content v3 API
const { data: doc, pending, error } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

// 设置页面元数据
useSeoMeta({
  title: () => doc.value?.title || '文章不存在',
  description: () => doc.value?.description,
  ogTitle: () => doc.value?.title,
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: doc.value?.title,
      url: location.href
    }).catch(console.error)
  } else {
    navigator.clipboard.writeText(location.href)
    const toast = useToast()
    toast.add({
      title: '复制成功',
      description: '链接已复制到剪贴板',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }
}
</script>