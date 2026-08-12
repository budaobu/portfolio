<template>
  <div>
    <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
      <USkeleton v-for="i in 4" :key="i" class="h-14 rounded-lg" />
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

    <!-- 2x2 project grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 animate-fade-in">
      <HomeProjectCard
        v-for="project in featuredProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: fadeInReduced 0.3s ease-out forwards;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
