<template>
  <div class="group relative flex items-center gap-3 -mx-3 px-3 py-3 rounded-lg transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800">
    <div :class="iconContainerClass" class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 flex items-center justify-center flex-shrink-0">
      <img
        v-if="isImageIcon"
        :src="project.icon"
        class="w-6 h-6 object-contain"
        alt="Project icon"
      />
      <UIcon
        v-else-if="isIconifyIcon"
        :name="project.icon"
        class="w-5 h-5 text-warm-900 dark:text-warm-100"
      />
      <span v-else class="text-lg">{{ project.icon }}</span>
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex items-baseline gap-3">
        <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
          <NuxtLink
            :to="project.demoUrl"
            :target="isExternal(project.demoUrl) ? '_blank' : '_self'"
            class="focus:outline-none"
          >
            <span class="absolute inset-0"></span>
            {{ project.title }}
          </NuxtLink>
        </h3>
        <span
          v-if="status || project.date"
          class="label-tag flex-shrink-0 text-[10px]"
          :class="status === 'CURRENT' ? 'text-route-500' : 'text-warm-500 dark:text-warm-400'"
        >
          {{ status || project.date?.slice(0, 4) }}
        </span>
      </div>
      <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
        {{ project.description }}
      </p>
    </div>

    <div class="flex items-center gap-0.5 flex-shrink-0 relative z-10">
      <UButton
        :to="project.demoUrl"
        :target="isExternal(project.demoUrl) ? '_blank' : '_self'"
        icon="i-lucide-arrow-up-right"
        size="xs"
        variant="ghost"
        color="gray"
        square
        aria-label="Demo"
        class="text-warm-400 hover:text-coral-600 dark:hover:text-coral-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/app/utils/types'

interface Props {
  project: Project
  status?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: undefined
})

const isImageIcon = computed(() =>
  props.project.icon.startsWith('http') || props.project.icon.startsWith('/')
)

const isIconifyIcon = computed(() =>
  props.project.icon.startsWith('i-')
)

const iconContainerClass = computed(() => {
  const base = 'flex-shrink-0 flex items-center justify-center'
  return `${base} bg-coral-100 dark:bg-coral-900/30`
})

const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>
