<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <section class="mb-20">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Hi👋🏻, I'm 
        <span class="text-roll-wrapper text-primary-600 dark:text-primary-400">
          <span class="text-roll-inner">
            <span class="block">@Budaobu</span>
            <span class="block">@Budaobu</span>
          </span>
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
        Just a quiet non-dev vibe coding with AI. Everything here is stitched together by prompt and intuition. Enjoy.
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

    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <UButton 
          to="/projects" 
          color="gray" 
          variant="ghost" 
          icon="i-lucide-arrow-right" 
          trailing
          label="View All" 
        />
      </div>
      
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton v-for="i in 3" :key="i" class="h-64 rounded-xl" />
      </div>
      
      <UAlert 
        v-else-if="error" 
        color="red" 
        variant="soft"
        icon="i-lucide-circle-alert"
        title="Failed to load"
        description="Failed to fetch featured projects. Please try again later."
        class="max-w-2xl mx-auto"
      />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          v-for="project in featuredProjects" 
          :key="project.id"
          :project="project"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  icon: string
  demoUrl?: string
  githubUrl?: string
  appStoreUrl?: string
  googlePlayUrl?: string
  mainUrl?: string
  featured?: boolean
}

useSeoMeta({
  title: 'Budaobu | AI-Stitched Personal Portfolio',
  description: 'Non-dev, just vibe coding to stitch stuff together. An introvert\'s playground where everything is built by prompt and intuition.',
  keywords: 'Budaobu, AI Stitched, Portfolio, Vibe Coding, Non-dev, Personal Website, Web Tools, Prompt Engineering',
  ogTitle: 'Budaobu | AI-Stitched Personal Portfolio',
  ogDescription: 'Non-dev, just vibe coding to stitch stuff together.',
})

useHead({
  titleTemplate: '%s'
})

defineOgImageComponent('NuxtSeo', {
  title: 'Budaobu | AI-Stitched Personal Portfolio',
  description: 'Non-dev, just vibe coding to stitch stuff together.',
  theme: '#3b82f6',
  colorMode: 'dark',
  siteLogo: 'https://github.com/budaobu.png'
})

const { data: featuredProjects, pending, error } = await useFetch<Project[]>('/api/featuredProjects', {
  lazy: true
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
