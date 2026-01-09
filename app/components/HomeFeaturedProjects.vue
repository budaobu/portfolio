<template>
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
    
    <!-- Loading State: Skeleton -->
    <!-- 使用 status === 'pending' 来判断加载状态，比单纯的 pending 变量更准确 -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 3" :key="i" class="h-64 rounded-xl" />
    </div>
    
    <!-- Error State -->
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

    <!-- Success State -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <ProjectCard 
        v-for="project in featuredProjects" 
        :key="project.id"
        :project="project"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
// 定义数据接口 (与后端保持一致)
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

// 使用 useFetch 获取数据
// 优化点：启用 retry 选项，自动处理短暂的网络错误
const { data: featuredProjects, status, refresh } = await useFetch<Project[]>('/api/featuredProjects', {
  lazy: true,
  // 关键优化：自动重试 3 次，每次间隔 1 秒
  // 这对于 Serverless 环境下的冷启动或网络抖动非常有效
  retry: 3,
  retryDelay: 1000, 
  // 确保数据不为空时才视为成功 (可选，视后端实现而定)
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