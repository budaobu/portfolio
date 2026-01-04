<template>
  <!-- 核心修改 1：容器宽度从 max-w-4xl 改为 max-w-7xl，适应宽屏布局 -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    
    <!-- 加载状态：保持 max-w-4xl 居中显示，避免骨架屏过宽 -->
    <div v-if="pending" class="max-w-4xl mx-auto w-full">
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
    <div v-else-if="error || !doc" class="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in">
      <RetroTv 
        error-code="404" 
        error-message="NOT FOUND" 
        class="mb-8 scale-100 md:scale-100 origin-center"
      />
      
      <div class="text-center space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Article not found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The article you are looking for does not exist, or has been removed.
        </p>
        <UButton 
          to="/blog" 
          size="lg" 
          color="primary" 
          variant="solid"
          icon="i-lucide-corner-up-left" 
          label="Back to Blog"
        />
      </div>
    </div> 

    <!-- 核心修改 2：使用 Grid 布局，分为左侧 TOC 和右侧文章 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      <!-- 左侧 TOC 侧边栏：仅在 LG 屏幕显示，固定定位 -->
      <aside class="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 h-fit pr-4">
        <!-- 返回按钮：移到侧边栏顶部，操作更顺手 -->
        <div class="mb-6">
          <UButton 
            to="/blog" 
            variant="ghost" 
            color="gray"
            size="sm"
            icon="i-lucide-corner-up-left" 
            label="Back to Blog"
            class="-ml-2.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          />
        </div>

        <!-- TOC 目录 -->
        <div v-if="doc.body?.toc?.links?.length">
          <div class="font-semibold text-sm text-gray-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <UIcon name="i-lucide-list" class="w-4 h-4" />
            <span>On this page</span>
          </div>
          <nav>
            <ul class="space-y-3 text-sm">
              <li v-for="link in doc.body.toc.links" :key="link.id">
                <a 
                  :href="`#${link.id}`" 
                  class="block text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors line-clamp-2"
                >
                  {{ link.text }}
                </a>
                <!-- 二级标题 (H3) -->
                <ul v-if="link.children" class="pl-4 mt-2 space-y-2 border-l border-gray-200 dark:border-gray-800 ml-1">
                   <li v-for="child in link.children" :key="child.id">
                     <a 
                      :href="`#${child.id}`" 
                      class="block text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors line-clamp-1"
                    >
                       {{ child.text }}
                     </a>
                   </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 右侧正文内容容器 -->
      <article 
        class="lg:col-span-9 bg-white dark:bg-gray-900 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm p-6 sm:p-10 md:p-12 transition-all duration-300"
      >
        <!-- 头部区域 -->
        <header class="mb-10 flex flex-col gap-6">
          
          <!-- 移动端返回按钮 (LG以下显示) -->
          <div class="lg:hidden flex-shrink-0">
            <UButton 
              to="/blog" 
              icon="i-lucide-corner-up-left" 
              color="gray"
              variant="ghost"
              label="Back"
              class="-ml-2"
            />
          </div>

          <!-- 元数据与标题 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 h-5">
              <time :datetime="doc.date">{{ formatDate(doc.date) }}</time>
              <span v-if="doc.category" class="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span v-if="doc.category" class="text-primary-600 dark:text-primary-400 font-medium">{{ doc.category }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
              {{ doc.title }}
            </h1>

            <div v-if="doc.cover || doc.image" class="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-10 ring-1 ring-gray-200 dark:ring-gray-800">
              <img :src="doc.cover || doc.image" :alt="doc.title" class="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <!-- MDX 内容渲染区 -->
        <div class="prose prose-lg prose-gray dark:prose-invert prose-primary max-w-none">
          <ContentRenderer :value="doc" />
        </div>

        <!-- 底部操作栏 -->
        <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div class="text-sm text-gray-500 italic">
            Thanks for reading.
          </div>
          <UButton 
            @click="shareArticle"
            variant="soft" 
            color="gray"
            size="sm"
            icon="i-lucide-share-2" 
            label="Share"
          />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 核心优化：增加 { lazy: true } 选项
// 这样路由跳转不会被阻塞，而是先跳转显示 loading 状态，再渲染数据
const { data: doc, pending, error } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
}, {
  lazy: true 
})

// 设置页面元数据
// 注意：因为是 lazy loading，doc 可能初始为 null，需要使用 getter 函数并做空值保护
useSeoMeta({
  title: () => doc.value?.title || 'Loading...',
  description: () => doc.value?.description,
  ogTitle: () => doc.value?.title,
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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
      title: 'Copied to Clipboard',
      description: 'Article URL has been copied to clipboard.',
      icon: 'i-lucide-check-circle',
      color: 'green'
    })
  }
}
</script>

<style scoped>
/* 简单的淡入动画，让内容出现时更平滑 */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 添加平滑滚动效果，使得点击 TOC 跳转时更顺滑 */
html {
  scroll-behavior: smooth;
}
</style>