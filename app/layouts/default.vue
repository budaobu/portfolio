<template>
  <div class="min-h-[100svh] flex flex-col bg-warm-50 dark:bg-olive-950">
    <AppHeader />

    <HomeIdentity v-if="route.path === '/'" />

    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-16 pb-12">
      <div class="max-w-[40rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-6">

          <!-- Inspiration + AI tools -->
          <div class="text-sm text-warm-500 dark:text-warm-400 flex items-center gap-3 flex-wrap justify-center">

            <span>
              Inspired by
              <NuxtLink
                to="/go/mikescv"
                target="_blank"
                class="font-medium transition-colors hover:text-coral-600 dark:hover:text-coral-400"
              >
                Mikes.cv
              </NuxtLink>.
            </span>

            <span class="text-warm-300 dark:text-warm-600">•</span>

            <span class="flex items-center gap-2">
              <span>vibe with</span>
              <span class="inline-flex items-center space-x-1 sm:-space-x-2 sm:hover:space-x-1 transition-[margin] duration-500 [transition-timing-function:var(--ease-out)] px-1">
                <div
                  v-for="(tool, index) in aiTools"
                  :key="tool.name"
                  class="relative transition-transform duration-300 [transition-timing-function:var(--ease-out)] hover:z-50"
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
          </div>

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
const route = useRoute()

const aiTools = [
  {
    name: 'Gemini 3.0 Pro',
    icon: '/gemini-color.svg',
    url: '/go/gemini'
  },
  {
    name: 'Claude 4.5~4.6 Sonnet',
    icon: '/claude-color.svg',
    url: '/go/claude'
  },
  {
    name: 'Kimi K3',
    icon: '/kimi.webp',
    url: '/go/kimi'
  },
  {
    name: 'GLM 5.3 Flash',
    icon: '/zai.svg',
    url: '/go/zhipu'
  }
]

const footerSocialLinks = computed(() =>
  socialLinks.filter(link => link.placement?.includes('footer'))
)
</script>
