<template>
  <NuxtLink
    :to="article.path"
    class="block group outline-none"
  >
    <div class="-mx-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800">
      <time
        :datetime="article.date"
        class="block text-xs text-warm-500 dark:text-warm-400 tabular-nums mb-1"
      >
        {{ formattedDate }}
      </time>

      <h2 class="text-base font-serif font-medium text-warm-900 dark:text-warm-100 leading-snug group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
        {{ article.title }}
      </h2>

      <p class="mt-1 text-xs text-warm-600 dark:text-warm-400 leading-relaxed line-clamp-2">
        {{ article.description }}
      </p>
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
