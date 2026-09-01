<template>
  <div class="max-w-[40rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16">
    <!-- Page Header - Editorial Style -->
    <SectionHeading
      large
      eyebrow="Flight Plan"
      title="Projects"
      description="Every row is an experiment that left the ground."
    />

    <div v-if="!loaded && !error" class="flex flex-col gap-1">
      <USkeleton v-for="i in 6" :key="i" class="h-14 rounded-lg" />
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
      <div>
        <div class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
          <ProjectCard
            v-for="(project, index) in allProjects"
            :key="project.id"
            :project="project"
            :status="index === 0 ? 'CURRENT' : undefined"
          />
        </div>

        <!-- Archived Projects - 默认折叠，参考 nooc.me work 页 -->
        <details v-if="archivedItems.length > 0" class="group/archive mt-10">
          <summary class="flex items-center gap-3 mb-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase text-warm-500 dark:text-warm-400 bg-warm-200/70 dark:bg-warm-800 px-2 py-1 rounded-sm">
              <UIcon name="i-lucide-archive" class="w-3 h-3 flex-shrink-0" />
              Archive
            </span>
            <span class="h-px flex-1 bg-warm-300 dark:bg-warm-700"></span>
            <span class="inline-flex items-center gap-1 text-[11px] text-warm-400 dark:text-warm-500 tabular-nums">
              {{ archivedItems.length }} {{ archivedItems.length === 1 ? 'entry' : 'entries' }}
              <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5 transition-transform duration-200 group-open/archive:rotate-90" />
            </span>
          </summary>

          <div class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
            <NuxtLink
              v-for="project in archivedItems"
              :key="project.id"
              :to="project.demoUrl"
              :target="project.demoUrl.startsWith('http') ? '_blank' : '_self'"
              class="group flex items-center gap-3 -mx-3 px-3 py-2.5 rounded-lg focus:outline-none transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800"
            >
              <div class="w-8 h-8 rounded-lg border border-warm-200 dark:border-warm-800 bg-warm-200 dark:bg-warm-800 flex items-center justify-center flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                <img
                  v-if="project.icon.startsWith('http') || project.icon.startsWith('/')"
                  :src="project.icon"
                  class="w-5 h-5 object-contain"
                  alt="Project icon"
                />
                <UIcon
                  v-else-if="project.icon.startsWith('i-')"
                  :name="project.icon"
                  class="w-4 h-4 text-warm-900 dark:text-warm-100"
                />
                <span v-else class="text-sm">{{ project.icon }}</span>
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="text-xs font-medium text-warm-600 dark:text-warm-400 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
                  {{ project.title }}
                </h3>
                <p class="mt-0.5 text-[11px] text-warm-400 dark:text-warm-500 line-clamp-1">
                  {{ project.description }}
                </p>
              </div>

              <UIcon
                name="i-lucide-arrow-up-right"
                class="w-3.5 h-3.5 flex-shrink-0 text-warm-400 group-hover:text-coral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[transform,color] duration-200 ease-out"
              />
            </NuxtLink>
          </div>
        </details>
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
  error,
  loaded,
  hasMore,
  loadMoreTrigger,
  loadMoreError,
  retry
} = await useInfiniteScroll<Project>('/api/projects', 9)

// 已归档项目：SSR 直取，不进无限滚动
const { data: archivedData } = await useFetch<PaginatedResponse<Project>>('/api/projects', {
  query: { archived: 1 }
})
const archivedItems = computed(() => archivedData.value?.items ?? [])
</script>
