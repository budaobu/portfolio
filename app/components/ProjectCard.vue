<template>
  <div class="group relative h-full">
    <UCard 
      :ui="{ 
        body: { padding: 'p-6' },
        base: 'h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1'
      }"
    >
      <div class="flex items-center gap-3 mb-4">
        <div :class="iconContainerClass">
          <img 
            v-if="isImageIcon"
            :src="project.icon" 
            class="w-8 h-8 object-contain rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all" 
            alt="Project icon" 
          />
          <UIcon 
            v-else-if="isIconifyIcon" 
            :name="project.icon" 
            class="w-7 h-7 text-gray-900 dark:text-white" 
          />
          <span v-else class="text-2xl">{{ project.icon }}</span>
        </div>

        <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          <NuxtLink 
            v-if="project.mainUrl"
            :to="project.mainUrl"
            :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
            class="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            <span class="absolute inset-0"></span>
            {{ project.title }}
          </NuxtLink>
          <span v-else>{{ project.title }}</span>
        </h3>
      </div>

      <p class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
        {{ project.description }}
      </p>

      <div v-if="availabilityText" class="mb-3 text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
        <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
        <span>{{ availabilityText }}</span>
      </div>

      <div class="relative flex items-center flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <UButton
          v-for="link in projectLinks"
          :key="link.type"
          :to="link.url"
          target="_blank"
          size="xs"
          color="gray"
          :variant="link.variant"
          :icon="link.icon"
          :label="link.label"
          :class="link.customClass"
          class="relative z-10"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  project: Project
}

const props = defineProps<Props>()

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
  const baseClass = 'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'
  
  if (isGithubOnly.value) {
    return `${baseClass} bg-gray-100 dark:bg-gray-800`
  }
  
  return `${baseClass} bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400`
})

const availabilityText = computed(() => {
  const hasAppStore = !!props.project.appStoreUrl
  const hasGooglePlay = !!props.project.googlePlayUrl

  if (hasAppStore && hasGooglePlay) {
    return "Now available on App Store and Google Play"
  }
  if (hasAppStore) {
    return "Now available on App Store"
  }
  if (hasGooglePlay) {
    return "Now available on Google Play"
  }
  return ""
})

interface ProjectLink {
  type: string
  url: string
  icon: string
  label: string
  variant: 'ghost' | 'soft'
  customClass: string
}

const projectLinks = computed(() => {
  const links: ProjectLink[] = []
  
  if (props.project.appStoreUrl) {
    links.push({
      type: 'appStore',
      url: props.project.appStoreUrl,
      icon: 'i-simple-icons-appstore',
      label: 'App Store',
      variant: 'ghost',
      customClass: 'text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-900/20'
    })
  }
  
  if (props.project.googlePlayUrl) {
    links.push({
      type: 'googlePlay',
      url: props.project.googlePlayUrl,
      icon: 'i-simple-icons-googleplay',
      label: 'Google Play',
      variant: 'ghost',
      customClass: 'text-[#00D363] hover:bg-green-50 dark:hover:bg-green-900/20'
    })
  }
  
  if (props.project.githubUrl) {
    links.push({
      type: 'github',
      url: props.project.githubUrl,
      icon: 'i-simple-icons-github',
      label: 'GitHub',
      variant: 'ghost',
      customClass: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
    })
  }
  
  if (props.project.demoUrl) {
    links.push({
      type: 'demo',
      url: props.project.demoUrl,
      icon: 'i-lucide-arrow-up-right',
      label: 'Web',
      variant: 'soft',
      customClass: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ml-auto'
    })
  }
  
  return links
})

const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>