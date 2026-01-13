<template>
  <NuxtLink
    :to="project.mainUrl"
    :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
    class="group block h-full focus:outline-none"
  >
    <UCard 
      class="overflow-hidden transition-all duration-300 group-hover:shadow-lg bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 group-hover:!ring-2 group-hover:!ring-primary-500/50 dark:group-hover:!ring-primary-400/50"
      :ui="{ 
        body: { padding: 'p-0' },
        base: 'h-full flex flex-col'
      }"
    >
      <div class="relative h-full p-6 flex flex-col">
        
        <div class="mb-4 transition-transform duration-300 ease-out origin-top-left group-hover:scale-60">
          <img 
            v-if="isImageIcon"
            :src="project.icon" 
            class="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700" 
            alt="icon" 
          />
          <UIcon 
            v-else-if="isIconifyIcon" 
            :name="project.icon" 
            class="w-12 h-12 text-gray-900 dark:text-white" 
          />
          <span v-else class="text-4xl">{{ project.icon }}</span>
        </div>

        <div class="flex-1 flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
            {{ project.title }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 text-sm">
            {{ project.description }}
          </p>
        </div>

        <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <span class="font-bold text-gray-900 dark:text-white text-sm">Visit</span>
          <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4 text-gray-900 dark:text-white" />
        </div>

      </div>
    </UCard>
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

const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>