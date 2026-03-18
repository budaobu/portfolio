<template>
  <NuxtLink
    :to="project.mainUrl"
    :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
    class="group block h-full bg-warm-50 dark:bg-olive-900 p-6 sm:p-8 focus:outline-none transition-colors duration-300 hover:bg-warm-100 dark:hover:bg-olive-800"
  >
    <div class="h-full flex flex-col">
      <!-- Icon area -->
      <div class="mb-6">
        <div
          :class="iconContainerClass"
          class="w-14 h-14 flex items-center justify-center"
        >
          <img
            v-if="isImageIcon"
            :src="project.icon"
            class="w-10 h-10 object-contain"
            alt="Project icon"
          />
          <UIcon
            v-else-if="isIconifyIcon"
            :name="project.icon"
            class="w-8 h-8 text-warm-900 dark:text-warm-100"
          />
          <span v-else class="text-3xl">{{ project.icon }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h3 class="text-xl font-serif font-medium text-warm-900 dark:text-warm-100 mb-3 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
          {{ project.title }}
        </h3>
        <p class="text-warm-600 dark:text-warm-400 leading-relaxed line-clamp-3 text-sm">
          {{ project.description }}
        </p>
      </div>

      <!-- Arrow accent -->
      <div class="mt-6 flex items-center justify-between">
        <span v-if="availabilityText" class="text-xs font-medium text-coral-600 dark:text-coral-400">
          {{ availabilityText }}
        </span>
        <span v-else class="text-sm font-medium text-warm-500 group-hover:text-coral-500 transition-colors">
          Explore
        </span>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="w-5 h-5 text-warm-400 group-hover:text-coral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>
    </div>
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
