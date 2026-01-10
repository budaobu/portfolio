<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Hero Section -->
    <section class="mb-20">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Hi👋🏻, I'm 
        <span class="text-roll-wrapper text-primary-600 dark:text-primary-400">
          <span class="text-roll-inner">
            <span class="block">@{{ siteConfig.author }}</span>
            <span class="block">@{{ siteConfig.author }}</span>
          </span>
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
        Just building things through vibe coding. A collection of experiments and creations born from curiosity and intuition. Enjoy.
      </p>
      
      <div class="flex items-center gap-4 mt-6">
        <UButton
          to="/connect"
          color="primary"
          variant="soft"
          label="Connect"
          icon="i-lucide-mail"
          size="lg"
          class="transition-all rounded-full px-6"
          :ui="{ rounded: 'rounded-full' }"
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
              class="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 dark:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <UIcon :name="social.icon" class="w-5 h-5" />
            </NuxtLink>
          </UTooltip>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section (Componentized) -->
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
  height: 1.2em;
  line-height: 1.2em;
  overflow: hidden;
  vertical-align: bottom;
}

.text-roll-inner {
  display: block;
  animation: text-roll-anim 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
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