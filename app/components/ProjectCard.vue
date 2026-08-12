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
      <div class="flex items-baseline gap-2">
        <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
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
        <span v-if="availabilityText" class="hidden sm:inline text-[11px] font-medium text-coral-600 dark:text-coral-400 flex-shrink-0">
          {{ availabilityText }}
        </span>
      </div>
      <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
        {{ project.description }}
      </p>
    </div>

    <div class="flex items-center gap-0.5 flex-shrink-0 relative z-10">
      <UButton
        v-for="link in projectLinks"
        :key="link.key"
        v-bind="link.props"
        :to="link.url"
        target="_blank"
        size="xs"
        variant="ghost"
        color="gray"
        square
        :aria-label="link.props.label"
        class="text-warm-400 hover:text-coral-600 dark:hover:text-coral-400"
      />
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
  if (appStoreUrl && googlePlayUrl) return "App Store & Google Play"
  if (appStoreUrl) return "App Store"
  if (googlePlayUrl) return "Google Play"
  return ""
})

interface LinkDefinition {
  key: keyof Project
  props: {
    icon: string
    label: string
  }
}

const LINK_CONFIG: LinkDefinition[] = [
  {
    key: 'demoUrl',
    props: {
      label: 'Web',
      icon: 'i-lucide-arrow-up-right'
    }
  },
  {
    key: 'appStoreUrl',
    props: {
      label: 'App Store',
      icon: 'i-simple-icons-appstore'
    }
  },
  {
    key: 'googlePlayUrl',
    props: {
      label: 'Google Play',
      icon: 'i-simple-icons-googleplay'
    }
  },
  {
    key: 'githubUrl',
    props: {
      label: 'GitHub',
      icon: 'i-simple-icons-github'
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
