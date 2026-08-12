<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
    <!-- Hero Section - Editorial Style -->
    <section class="mb-14 md:mb-20">
      <div class="relative">
        <!-- Decorative geometric element -->
        <div class="absolute -top-8 -left-4 w-24 h-24 border-[3px] border-coral-500/30 rotate-12 hidden sm:block"></div>

        <h1 class="relative text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-warm-900 dark:text-warm-100 leading-[0.95] tracking-tight mb-6">
          <span class="block relative">
            <span class="relative z-10 text-roll-wrapper text-coral-600 dark:text-coral-400">
              <span class="text-roll-inner">
                <span class="block">@{{ siteConfig.author }}</span>
                <span class="block">@{{ siteConfig.author }}</span>
              </span>
            </span>
            <!-- Underline accent -->
            <span class="absolute bottom-1 left-0 w-full h-3 bg-coral-500/20 -z-0"></span>
          </span>
        </h1>
      </div>

      <div class="mt-8">
        <p class="text-base md:text-lg text-warm-700 dark:text-warm-300 leading-relaxed font-light">
          Building things through
          <span class="font-medium text-warm-900 dark:text-warm-100">vibe coding</span>.
          A collection of experiments and creations born from curiosity and intuition.
        </p>

        <div class="flex flex-wrap items-center gap-4 mt-8">
          <UButton
            to="/connect"
            color="coral"
            variant="solid"
            label="Get in touch"
            icon="i-lucide-mail"
            size="lg"
            class="font-medium rounded-none px-8 py-3"
          />

          <div class="flex items-center gap-2">
            <UTooltip
              v-for="social in homeSocialLinks"
              :key="social.name"
              :text="social.name"
              :popper="{ placement: 'top' }"
            >
              <NuxtLink
                :to="social.url"
                target="_blank"
                rel="noopener noreferrer nofollow"
                :aria-label="social.name"
                size="lg"
                class="w-11 h-11 rounded-none flex items-center justify-center bg-warm-200 dark:bg-warm-800 hover:bg-coral-500 hover:text-warm-50 text-warm-700 dark:text-warm-300 transition-colors duration-150 ease-out"
              >
                <UIcon :name="social.icon" class="w-5 h-5" />
              </NuxtLink>
            </UTooltip>
          </div>
        </div>
      </div>

    </section>

    <!-- Featured Projects Section -->
    <section>
      <SectionHeading
        index="01"
        eyebrow="Selected Works"
        title="Projects"
        description="Most recent experiments and creations."
      />
      <HomeFeaturedProjects />

      <div class="mt-4 flex justify-end">
        <UButton
          to="/projects"
          color="gray"
          variant="ghost"
          icon="i-lucide-arrow-right"
          trailing
          label="View All"
          size="sm"
          class="font-medium"
        />
      </div>
    </section>

    <!-- Recent Blog Section -->
    <section class="mt-14 md:mt-20">
      <SectionHeading
        index="02"
        eyebrow="Latest Writing"
        title="Blog"
        description="No Tech, just ramblings."
      />

      <div v-if="blogPending" class="flex flex-col gap-1">
        <USkeleton v-for="i in 3" :key="i" class="h-16 rounded-lg" />
      </div>

      <div v-else-if="recentPosts?.length" class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
        <BlogCard
          v-for="article in recentPosts"
          :key="article.path"
          :article="article"
        />
      </div>

      <p v-else class="text-sm text-warm-500">No articles yet, stay tuned.</p>

      <div class="mt-4 flex justify-end">
        <UButton
          to="/blog"
          color="gray"
          variant="ghost"
          icon="i-lucide-arrow-right"
          trailing
          label="View All"
          size="sm"
          class="font-medium"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteConfig = useSiteConfig()
useSiteSeo('home')

useHead({
  titleTemplate: '%s'
})

const homeSocialLinks = computed(() =>
  socialLinks.filter(link => link.placement?.includes('home'))
)

const { data: recentPosts, pending: blogPending } = await useAsyncData(
  'home-recent-posts',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(3)
    .all(),
  {
    lazy: true,
    getCachedData(key) {
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
)
</script>

<style scoped>
.text-roll-wrapper {
  display: inline-block;
  height: 1.1em;
  line-height: 1.1em;
  overflow: hidden;
  vertical-align: bottom;
}

.text-roll-inner {
  display: block;
  animation: text-roll-anim 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes text-roll-anim {
  0%, 45% {
    transform: translateY(0);
  }
  55%, 90% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .text-roll-inner {
    animation: none;
  }
}
</style>
