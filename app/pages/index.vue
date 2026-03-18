<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <!-- Hero Section - Editorial Style -->
    <section class="mb-24 md:mb-32">
      <div class="relative">
        <!-- Decorative geometric element -->
        <div class="absolute -top-8 -left-4 w-24 h-24 border-[3px] border-coral-500/30 rotate-12 hidden sm:block"></div>

        <h1 class="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium text-warm-900 dark:text-warm-100 leading-[0.95] tracking-tight mb-8">
          <span class="block">Hi<span class="text-coral-500">👋</span>,</span>
          <span class="block ml-0 md:ml-16">I'm</span>
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

      <div class="mt-10 max-w-2xl ml-auto">
        <p class="text-xl md:text-2xl text-warm-700 dark:text-warm-300 leading-relaxed font-light">
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
                class="w-11 h-11 rounded-none flex items-center justify-center bg-warm-200 dark:bg-warm-800 hover:bg-coral-500 hover:text-warm-50 text-warm-700 dark:text-warm-300 transition-all duration-200"
              >
                <UIcon :name="social.icon" class="w-5 h-5" />
              </NuxtLink>
            </UTooltip>
          </div>
        </div>
      </div>

      <!-- Geometric accent -->
      <div class="mt-16 flex items-center gap-4">
        <div class="h-px bg-warm-300 dark:bg-warm-700 flex-1 max-w-xs"></div>
        <span class="text-sm font-medium text-warm-500 uppercase tracking-widest">Portfolio</span>
        <div class="h-px bg-warm-300 dark:bg-warm-700 flex-1"></div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <HomeFeaturedProjects />
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
</style>
