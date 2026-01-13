<template>
  <NuxtLink
    :to="article.path"
    class="block group outline-none"
  >
    <UCard
      class="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-primary-500/50 dark:hover:ring-primary-400/50"
      :ui="{
        body: { padding: 'p-6 sm:p-8' },
        // base: 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-primary-500/20 dark:hover:ring-primary-400/20',
        rounded: 'rounded-xl',
        shadow: 'shadow-sm',
        divide: '',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
      }"
    >
      <div class="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10">
        
        <!-- 日期列 -->
        <div class="md:w-40 flex-shrink-0">
          <time 
            :datetime="article.date" 
            class="text-sm font-medium text-gray-500 dark:text-gray-400 md:border-l-2 md:border-transparent md:group-hover:border-primary-500 md:group-hover:pl-3 md:transition-all md:duration-300"
          >
            {{ formattedDate }}
          </time>
        </div>

        <!-- 内容主体 -->
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ article.title }}
          </h2>
          
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
            {{ article.description }}
          </p>

          <div class="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
            <span class="mr-1">Read More</span>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
// 定义 Props 接口，确保类型安全
export interface Article {
  title: string
  path: string
  date: string
  description: string
  category?: string
  [key: string]: any
}

const props = defineProps<{
  article: Article
}>()

// 将 formatDate 逻辑移入组件内部计算属性
const formattedDate = computed(() => {
  if (!props.article.date) return ''
  const date = new Date(props.article.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})
</script>