<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-16 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4">

          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">

            <span>&copy; {{ currentYear }} </span>
            <!-- <span class="hidden sm:inline">·</span> -->
            
            <span class="relative flex h-2 w-2" aria-hidden="true">

              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>

              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400 opacity-85"></span>
            </span>

            
            <span>{{ siteConfig.author }} vibe with</span>
            
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
                      class="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-950 bg-white dark:bg-gray-800 object-cover" 
                      :alt="tool.name" 
                    />
                  </NuxtLink>
                </UTooltip>
              </div>
            </span>
          </p>

          <div class="flex items-center gap-3">
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
                class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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