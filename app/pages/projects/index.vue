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

      <!-- 新增：错误状态 UI -->
      <div v-if="loadMoreError" class="flex flex-col items-center gap-4 py-8">
        <UAlert 
          color="orange" 
          variant="soft"
          icon="i-lucide-wifi-off"
          :description="loadMoreError"
          class="max-w-md"
        />
        <UButton
          @click="retry"
          color="primary"
          variant="soft"
          icon="i-lucide-refresh-cw"
          label="Try Again"
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

useSiteSeo('projects')

const { 
  items: allProjects, 
  pending, 
  error, 
  hasMore, 
  loadMoreTrigger,
  loadMoreError,
  retry
} = await useInfiniteScroll<Project>('/api/projects', 9)
</script>