<template>
  <div class="max-w-[40rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
    <!-- Page Header -->
    <SectionHeading
      large
      eyebrow="Flight Log"
      title="Blog"
      description="No Tech, just ramblings."
    >
      <div class="mt-5 flex items-center gap-2.5">
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
            class="w-10 h-10 rounded-full flex items-center justify-center bg-warm-100 dark:bg-warm-900 border border-warm-300 dark:border-warm-800 hover:border-coral-500 hover:text-coral-600 text-warm-700 dark:text-warm-300 transition-colors duration-150 [transition-timing-function:var(--ease-out)]"
          >
            <UIcon :name="social.icon" class="w-5 h-5" />
          </NuxtLink>
        </UTooltip>
      </div>
    </SectionHeading>

    <!-- Loading state -->
    <div v-if="pending" class="flex flex-col gap-1">
      <USkeleton v-for="i in 5" :key="i" class="h-16 rounded-lg" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-20">
      <div class="inline-flex justify-center items-center w-16 h-16 rounded-sm bg-red-100 dark:bg-red-900/30 mb-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-warm-500">Failed to fetch articles. Please try again later.</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!articles?.length" class="text-center py-16 animate-fade-in">
      <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-warm-400 mb-3" />
      <p class="text-sm text-warm-500">No articles yet, stay tuned.</p>
    </div>

    <!-- Articles list -->
    <div v-else class="animate-fade-in">
      <div class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
        <BlogCard
          v-for="article in articles"
          :key="article.path"
          :article="article"
        />
      </div>
      <div v-if="!allLoaded" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-refresh-cw" class="w-8 h-8 animate-spin text-warm-400" />
      </div>
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <span class="h-px w-8 bg-warm-300"></span>
          <span class="text-warm-500 text-sm uppercase tracking-widest">All rambled out</span>
          <span class="h-px w-8 bg-warm-300"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSiteSeo('blog')

const blogSocialLinks = computed(() =>
  socialLinks.filter(link => link.placement?.includes('blog'))
)

const PAGE_SIZE = 10
const loadingMore = ref(false)
const allLoaded = ref(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const { data: articles, pending, error } = await useAsyncData(
  'blog-list',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(PAGE_SIZE)
    .all(),
  {
    lazy: true,
    getCachedData(key) {
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
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
    // Silent fail
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
}
</style>
