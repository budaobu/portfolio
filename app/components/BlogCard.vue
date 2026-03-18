<template>
  <NuxtLink
    :to="article.path"
    class="block group outline-none"
  >
    <div class="h-full bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-6 sm:p-8 transition-all duration-300 hover:border-coral-500/50 hover:bg-warm-100 dark:hover:bg-olive-800">
      <div class="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10">

        <!-- Date column -->
        <div class="md:w-40 flex-shrink-0">
          <time
            :datetime="article.date"
            class="text-sm font-medium text-warm-500 dark:text-warm-400 md:border-l-2 md:border-transparent md:group-hover:border-coral-500 md:group-hover:pl-3 md:transition-all md:duration-300"
          >
            {{ formattedDate }}
          </time>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-serif font-medium text-warm-900 dark:text-warm-100 mb-3 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
            {{ article.title }}
          </h2>

          <p class="text-warm-600 dark:text-warm-400 leading-relaxed mb-6 line-clamp-3">
            {{ article.description }}
          </p>

          <div class="flex items-center text-coral-600 dark:text-coral-400 font-medium group-hover:text-coral-500 transition-colors">
            <span class="mr-1">Read More</span>
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
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
