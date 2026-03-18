<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <!-- Page Header - Editorial Style -->
    <div class="mb-16">
      <div class="relative inline-block">
        <!-- Decorative accent -->
        <span class="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-16 bg-coral-500"></span>
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-warm-900 dark:text-warm-100">
          Projects
        </h1>
      </div>
      <p class="mt-6 text-xl text-warm-600 dark:text-warm-400 max-w-2xl leading-relaxed">
        Just for fun, but hey, it runs. Come see the chaos.
      </p>
    </div>

    <div v-if="pending && allProjects.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-72 rounded-none" />
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

    <div v-else class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in allProjects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Error state -->
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
          color="coral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          label="Try Again"
        />
      </div>

      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-warm-400" />
      </div>

      <div v-else-if="allProjects.length > 0" class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <span class="h-px w-8 bg-warm-300"></span>
          <span class="text-warm-500 text-sm uppercase tracking-widest">All stitched out</span>
          <span class="h-px w-8 bg-warm-300"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
