<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

    <!-- Loading state -->
    <div v-if="pending" class="max-w-4xl mx-auto w-full">
      <div class="bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-8 md:p-12 space-y-8">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-sm bg-warm-200 dark:bg-warm-800 animate-pulse"></div>
          <div class="flex-1 space-y-4">
            <div class="h-4 bg-warm-200 dark:bg-warm-800 rounded w-32 animate-pulse"></div>
            <div class="h-8 bg-warm-200 dark:bg-warm-800 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
        <div class="h-96 bg-warm-200 dark:bg-warm-800 rounded-sm animate-pulse"></div>
      </div>
    </div>

    <!-- Error/404 state -->
    <div v-else-if="error || !doc" class="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in">
      <RetroTv
        error-code="404"
        error-message="NOT FOUND"
        class="mb-8 scale-100 md:scale-100 origin-center"
      />

      <div class="text-center space-y-6">
        <h2 class="text-2xl font-serif font-medium text-warm-900 dark:text-warm-100">
          Article not found
        </h2>
        <p class="text-warm-600 dark:text-warm-400 max-w-md mx-auto">
          The article you are looking for does not exist, or has been removed.
        </p>
        <UButton
          to="/blog"
          size="lg"
          color="coral"
          variant="solid"
          icon="i-lucide-corner-up-left"
          label="Back to Blog"
        />
      </div>
    </div>

    <!-- Article content with grid layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">

      <!-- Main article -->
      <article
        class="lg:col-span-9 bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-6 sm:p-10 md:p-12"
      >
        <!-- Header -->
        <header class="mb-10 flex flex-col gap-6">

          <!-- Mobile back button -->
          <div class="lg:hidden flex-shrink-0">
            <UButton
              to="/blog"
              icon="i-lucide-corner-up-left"
              color="gray"
              variant="ghost"
              label="Back"
              class="-ml-2 rounded-sm"
            />
          </div>

          <!-- Meta and title -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center text-sm text-warm-500 dark:text-warm-400 mb-4 h-5">
              <time :datetime="doc.date">{{ formatDate(doc.date) }}</time>
              <span v-if="doc.category" class="mx-2 text-warm-300 dark:text-warm-600">•</span>
              <span v-if="doc.category" class="text-coral-600 dark:text-coral-400 font-medium">{{ doc.category }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-serif font-medium text-warm-900 dark:text-warm-100 tracking-tight leading-tight mb-8">
              {{ doc.title }}
            </h1>

            <div v-if="doc.cover || doc.image" class="relative aspect-video w-full overflow-hidden rounded-sm bg-warm-200 dark:bg-warm-800 mb-10 border border-warm-200 dark:border-warm-700">
              <img :src="doc.cover || doc.image" :alt="doc.title" class="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <!-- MDX content -->
        <div class="prose prose-lg prose-warm dark:prose-invert prose-coral max-w-none">
          <ContentRenderer :value="doc" />
        </div>

        <!-- Footer -->
        <div class="mt-12 pt-8 border-t border-warm-200 dark:border-warm-800 flex justify-between items-center">
          <div class="text-sm text-warm-500 italic">
            Thanks for reading.
          </div>
          <UButton
            @click="shareArticle"
            variant="soft"
            color="gray"
            size="sm"
            icon="i-lucide-share-2"
            label="Share"
            class="rounded-sm"
          />
        </div>
      </article>

      <!-- Sidebar: TOC -->
      <aside class="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 h-fit pl-4">
        <!-- Back button -->
        <div class="mb-6">
          <UButton
            to="/blog"
            variant="ghost"
            color="gray"
            size="sm"
            icon="i-lucide-corner-up-left"
            label="Back to Blog"
            class="-ml-2.5 text-warm-500 hover:text-warm-900 dark:text-warm-400 dark:hover:text-warm-100 rounded-sm"
          />
        </div>

        <!-- TOC -->
        <div v-if="doc.body?.toc?.links?.length">
          <div class="font-medium text-sm text-warm-900 dark:text-warm-100 mb-4 uppercase tracking-wider flex items-center gap-2">
            <UIcon name="i-lucide-list" class="w-4 h-4" />
            <span>On this page</span>
          </div>
          <nav>
            <ul class="space-y-3 text-sm">
              <li v-for="link in doc.body.toc.links" :key="link.id">
                <a
                  :href="`#${link.id}`"
                  class="block text-warm-500 hover:text-coral-600 dark:text-warm-400 dark:hover:text-coral-400 transition-colors line-clamp-2"
                >
                  {{ link.text }}
                </a>
                <!-- Second level headings -->
                <ul v-if="link.children" class="pl-4 mt-2 space-y-2 border-l border-warm-200 dark:border-warm-700 ml-1">
                    <li v-for="child in link.children" :key="child.id">
                      <a
                      :href="`#${child.id}`"
                      class="block text-warm-400 hover:text-coral-600 dark:text-warm-500 dark:hover:text-coral-400 transition-colors line-clamp-1"
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

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: doc, pending, error } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
}, {
  lazy: true
})

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
      color: 'coral'
    })
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeInQuick 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInQuick {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

html {
  scroll-behavior: smooth;
}
</style>
