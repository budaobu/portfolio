<template>
  <section>
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
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
      <p class="text-gray-500 dark:text-gray-400">
        Most recent projects and contributions.
      </p>
    </div>
    
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 3" :key="i" class="h-64 rounded-xl" />
    </div>
    
    <UAlert 
      v-else-if="status === 'error'" 
      color="red" 
      variant="soft"
      icon="i-lucide-circle-alert"
      title="Failed to load"
      description="Failed to fetch featured projects."
      class="max-w-2xl mx-auto"
    >
      <template #footer>
        <UButton 
          color="red" 
          variant="ghost" 
          size="sm" 
          label="Retry" 
          @click="refresh" 
        />
      </template>
    </UAlert>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <HomeProjectCard 
        v-for="project in featuredProjects" 
        :key="project.id"
        :project="project"
      />
    </div>
  </section>
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

// 保持原有的数据获取逻辑
const { data: featuredProjects, status, refresh } = await useFetch<Project[]>('/api/featuredProjects', {
  lazy: true,
  retry: 3,
  retryDelay: 1000, 
  transform: (data) => data || []
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>