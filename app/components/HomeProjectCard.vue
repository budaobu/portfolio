<template>
  <NuxtLink
    :to="project.mainUrl"
    :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
    class="group flex items-center gap-3 -mx-3 px-3 py-3 rounded-lg focus:outline-none transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800"
  >
    <div
      :class="iconContainerClass"
      class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 flex items-center justify-center flex-shrink-0"
    >
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
      <div class="flex items-baseline gap-2">
        <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
          {{ project.title }}
        </h3>
        <span v-if="availabilityText" class="hidden sm:inline text-[11px] font-medium text-coral-600 dark:text-coral-400 flex-shrink-0">
          {{ availabilityText }}
        </span>
      </div>
      <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
        {{ project.description }}
      </p>
    </div>

    <UIcon
      name="i-lucide-arrow-up-right"
      class="w-4 h-4 flex-shrink-0 text-warm-400 group-hover:text-coral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[transform,color] duration-200 ease-out"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: Project
}>()

const isImageIcon = computed(() =>
  props.project.icon.startsWith('http') || props.project.icon.startsWith('/')
)

const isIconifyIcon = computed(() =>
  props.project.icon.startsWith('i-')
)

const isGithubOnly = computed(() =>
  !props.project.demoUrl && props.project.githubUrl
)

const iconContainerClass = computed(() => {
  if (isGithubOnly.value) {
    return 'bg-warm-200 dark:bg-warm-800'
  }
  return 'bg-coral-100 dark:bg-coral-900/30'
})

const availabilityText = computed(() => {
  const { appStoreUrl, googlePlayUrl } = props.project
  if (appStoreUrl && googlePlayUrl) return "App Store & Google Play"
  if (appStoreUrl) return "App Store"
  if (googlePlayUrl) return "Google Play"
  return ""
})

const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>
