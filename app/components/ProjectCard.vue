<template>
  <div class="group relative h-full bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-6 transition-colors duration-300 hover:border-coral-500/50 dark:hover:border-coral-500/50 hover:bg-warm-100 dark:hover:bg-olive-800">
    <div class="flex items-center gap-4 mb-5">
      <div :class="iconContainerClass" class="w-14 h-14 flex items-center justify-center flex-shrink-0">
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

      <h3 class="text-xl font-serif font-medium text-warm-900 dark:text-warm-100 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
        <NuxtLink
          v-if="project.mainUrl"
          :to="project.mainUrl"
          :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
          class="focus:outline-none"
        >
          <span class="absolute inset-0"></span>
          {{ project.title }}
        </NuxtLink>
        <span v-else>{{ project.title }}</span>
      </h3>
    </div>

    <p class="text-warm-600 dark:text-warm-400 mb-5 leading-relaxed">
      {{ project.description }}
    </p>

    <div v-if="availabilityText" class="mb-4 text-xs font-medium text-coral-600 dark:text-coral-400 flex items-center gap-1">
      <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
      <span>{{ availabilityText }}</span>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-warm-200 dark:border-warm-800">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="link in projectLinks"
          :key="link.key"
          v-bind="link.props"
          :to="link.url"
          target="_blank"
          size="xs"
          class="rounded-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/app/utils/types'

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
  const base = 'flex-shrink-0 flex items-center justify-center'
  if (isGithubOnly.value) {
    return `${base} bg-warm-200 dark:bg-warm-800`
  }
  return `${base} bg-coral-100 dark:bg-coral-900/30`
})

const availabilityText = computed(() => {
  const { appStoreUrl, googlePlayUrl } = props.project
  if (appStoreUrl && googlePlayUrl) return "Available on App Store & Google Play"
  if (appStoreUrl) return "Available on App Store"
  if (googlePlayUrl) return "Available on Google Play"
  return ""
})

interface LinkDefinition {
  key: keyof Project
  props: {
    icon: string
    label: string
    variant: 'ghost' | 'soft' | 'solid' | 'outline'
    color: string
    class?: string
  }
}

const LINK_CONFIG: LinkDefinition[] = [
  {
    key: 'demoUrl',
    props: {
      label: 'Web',
      icon: 'i-lucide-arrow-up-right',
      variant: 'outline',
      color: 'gray',
      class: 'hover:border-coral-500 hover:text-coral-600'
    }
  },
  {
    key: 'appStoreUrl',
    props: {
      label: 'App Store',
      icon: 'i-simple-icons-appstore',
      variant: 'ghost',
      color: 'gray',
      class: 'hover:bg-warm-200 dark:hover:bg-warm-800'
    }
  },
  {
    key: 'googlePlayUrl',
    props: {
      label: 'Google Play',
      icon: 'i-simple-icons-googleplay',
      variant: 'ghost',
      color: 'gray',
      class: 'hover:bg-warm-200 dark:hover:bg-warm-800'
    }
  },
  {
    key: 'githubUrl',
    props: {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      variant: 'ghost',
      color: 'gray',
      class: 'hover:bg-warm-200 dark:hover:bg-warm-800'
    }
  }
]

const projectLinks = computed(() => {
  return LINK_CONFIG
    .filter(def => !!props.project[def.key])
    .map(def => ({
      key: def.key,
      url: props.project[def.key] as string,
      props: def.props
    }))
})

const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>
