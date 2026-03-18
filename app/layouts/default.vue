<template>
  <div class="min-h-screen flex flex-col bg-warm-50 dark:bg-olive-950">
    <AppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-warm-200 dark:border-warm-800 py-10 mt-16 bg-warm-100 dark:bg-olive-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-6">

          <!-- Copyright + AI tools -->
          <p class="text-sm text-warm-500 dark:text-warm-400 flex items-center gap-3 flex-wrap justify-center">

            <span>&copy; {{ currentYear }} {{ siteConfig.author }}</span>

            <span class="text-warm-300 dark:text-warm-600">•</span>

            <span class="flex items-center gap-2">
              <span>vibe with</span>
              <span class="inline-flex items-center space-x-1 sm:-space-x-2 sm:hover:space-x-1 transition-all duration-500 ease-in-out px-1">
                <div
                  v-for="(tool, index) in aiTools"
                  :key="tool.name"
                  class="relative transition-all duration-500 ease-in-out hover:z-50"
                  :style="{ zIndex: aiTools.length - index }"
                >
                  <UTooltip
                    :text="tool.name"
                    :popper="{ placement: 'top' }"
                  >
                    <NuxtLink
                      :to="tool.url"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="block focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-90"
                      :aria-label="tool.name"
                    >
                      <img
                        :src="tool.icon"
                        class="w-5 h-5 rounded-sm ring-2 ring-warm-100 dark:ring-warm-900 bg-white dark:bg-warm-800 object-cover"
                        :alt="tool.name"
                      />
                    </NuxtLink>
                  </UTooltip>
                </div>
              </span>
            </span>
          </p>

          <!-- Social links -->
          <div class="flex items-center gap-2">
            <UTooltip
              v-for="social in footerSocialLinks"
              :key="social.name"
              :text="social.name"
              :popper="{ placement: 'top' }"
            >
              <UButton
                :to="social.url"
                target="_blank"
                rel="noopener noreferrer nofollow"
                color="gray"
                variant="ghost"
                :icon="social.icon"
                size="sm"
                :aria-label="social.name"
                class="text-warm-400 hover:text-coral-600 dark:hover:text-coral-400 transition-colors rounded-sm"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const siteConfig = useSiteConfig()
const currentYear = new Date().getFullYear()

const aiTools = [
  {
    name: 'Gemini',
    icon: '/gemini-color.svg',
    url: '/go/gemini'
  },
  {
    name: 'Claude',
    icon: '/claude-color.svg',
    url: '/go/claude'
  }
]

const footerSocialLinks = computed(() =>
  socialLinks.filter(link => link.placement?.includes('footer'))
)
</script>
