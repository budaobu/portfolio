<template>
  <section>
    <div class="mb-10">
      <div class="flex items-end justify-between mb-3">
        <h2 class="text-4xl md:text-5xl font-serif font-medium text-warm-900 dark:text-warm-100">
          Projects
        </h2>
        <UButton
          to="/projects"
          color="gray"
          variant="ghost"
          icon="i-lucide-arrow-right"
          trailing
          label="View All"
          class="font-medium"
        />
      </div>
      <p class="text-warm-600 dark:text-warm-400 text-lg">
        Most recent experiments and creations.
      </p>
    </div>

    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-warm-200 dark:bg-warm-800 border border-warm-200 dark:border-warm-800">
      <USkeleton v-for="i in 3" :key="i" class="h-72" />
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

    <!-- Editorial card grid with borders -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-warm-200 dark:bg-warm-800 border border-warm-200 dark:border-warm-800 animate-fade-in">
      <HomeProjectCard
        v-for="project in featuredProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </section>
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
