<template>
  <div class="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
    <main class="mx-auto flex w-full max-w-[35rem] flex-col">
      <section class="flex w-full flex-col items-center text-center">
        <div class="item-reveal flex items-center justify-center">
          <CabinWindow size="large" />
        </div>

        <div class="mt-8 max-w-[26rem] item-reveal" style="--reveal-delay: 60ms">
          <p class="text-base font-medium leading-[1.8] text-warm-900 dark:text-warm-100">
            Building things through <span class="whitespace-nowrap">vibe coding</span>.
          </p>
          <p class="mt-2 text-base leading-[1.7] text-warm-700 dark:text-warm-300">
            Each project and note is an experimental voyage.
          </p>
        </div>
      </section>

      <FlightTimeline :items="flightItems" />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { PaginatedResponse, Project } from '~/app/utils/types'
import type { FlightItem } from '~/app/components/FlightTimeline.vue'

useSiteSeo('home')

useHead({
  titleTemplate: '%s'
})

const { data: projectData } = await useFetch<PaginatedResponse<Project>>('/api/projects', {
  query: { limit: 100 },
  default: () => ({ items: [], total: 0, hasMore: false })
})

const { data: recentPosts } = await useAsyncData(
  'home-flight-posts',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(20)
    .all(),
  {
    getCachedData(key) {
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
)

const formatLabel = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value.slice(0, 4)
    : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

const flightItems = computed<FlightItem[]>(() => {
  const projectItems = (projectData.value?.items ?? []).map<FlightItem>(project => ({
    id: `project-${project.id}`,
    kind: 'project',
    title: project.title,
    description: project.description,
    href: project.demoUrl,
    date: project.date || '',
    label: formatLabel(project.date || ''),
    icon: project.icon
  }))

  const blogItems = (recentPosts.value ?? []).map<FlightItem>(article => ({
    id: `blog-${article.path}`,
    kind: 'blog',
    title: article.title,
    description: article.description,
    href: article.path,
    date: article.date,
    label: formatLabel(article.date),
    icon: 'i-lucide-book-open'
  }))

  return [...projectItems, ...blogItems]
    .filter(item => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
</script>
