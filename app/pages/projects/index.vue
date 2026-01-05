<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        Projects
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Just for fun, but hey, it runs. Come see the chaos.
      </p>
    </div>

    <div v-if="pending && allProjects.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-72 rounded-xl" />
    </div>
    
    <UAlert 
      v-else-if="error" 
      color="red" 
      variant="soft"
      icon="i-lucide-circle-alert"
      title="Failed to load"
      description="Failed to fetch projects data. Please try again later."
      class="max-w-2xl mx-auto"
    />

    <div v-else class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          v-for="project in allProjects" 
          :key="project.id"
          :project="project"
        />
      </div>

      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
      
      <div v-else-if="allProjects.length > 0" class="text-center py-8 text-gray-400 text-sm">
        - All stitched out. -
      </div>
    </div>
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
  date?: string
  mainUrl?: string
  featured?: boolean
}

useSeoMeta({
  title: 'Projects, The AI-Stitched Collection, Vibe Coding',
  description: 'Meet the "Stitched Ones"—a collection of projects entirely stitched together by AI. My philosophy is Vibe Coding: I don\'t care how the code looks; the most important thing is that it runs.',
  keywords: 'Projects, The Stitched Ones, AI-Stitched, Vibe Coding, Budaobu, Web Tools, Experimental Code, MVP',
  ogTitle: 'Budaobu\'s Projects - The Stitched Collection',
  ogDescription: 'Pure Vibe Coding. It might be messy under the hood, but hey, it runs. Come see the chaos.',
})

const { 
  items: allProjects, 
  pending, 
  error, 
  hasMore, 
  loadMoreTrigger 
} = await useInfiniteScroll<Project>('/api/projects', 9)
</script>