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

      <div class="relative flex items-center justify-end flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <!-- 
          优化点：
          通过 v-bind 将预计算好的属性直接绑定给 UButton，
          代码更加干净，无需手动列出 :icon, :label 等
        -->
        <UButton
          v-for="link in projectLinks"
          :key="link.key"
          v-bind="link.props"
          :to="link.url"
          target="_blank"
          size="xs"
          class="relative z-10"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/app/utils/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()

// --- 图标判断逻辑 ---
const isImageIcon = computed(() => 
  props.project.icon.startsWith('http') || props.project.icon.startsWith('/')
)

const isIconifyIcon = computed(() => 
  props.project.icon.startsWith('i-')
)

const isGithubOnly = computed(() => 
  !props.project.demoUrl && props.project.githubUrl
)

// --- 样式逻辑 ---
const iconContainerClass = computed(() => {
  const baseClass = 'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'
  
  if (isGithubOnly.value) {
    return `${baseClass} bg-gray-100 dark:bg-gray-800`
  }
  
  return `${baseClass} bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400`
})

const availabilityText = computed(() => {
  const { appStoreUrl, googlePlayUrl } = props.project
  if (appStoreUrl && googlePlayUrl) return "Available on App Store & Google Play"
  if (appStoreUrl) return "Available on App Store"
  if (googlePlayUrl) return "Available on Google Play"
  return ""
})

// --- 链接生成逻辑优化 (Configuration Pattern) ---

// 1. 定义配置接口：确保 key 必须是 Project 的属性名
interface LinkDefinition {
  key: keyof Project 
  props: {
    icon: string
    label: string
    variant: 'ghost' | 'soft' | 'solid'
    color: string
    class?: string
  }
}

// 2. 静态配置表：易于阅读和扩展
const LINK_CONFIG: LinkDefinition[] = [
  {
    key: 'demoUrl',
    props: {
      label: 'Web',
      icon: 'i-lucide-arrow-up-right',
      variant: 'soft',
      color: 'gray', // Nuxt UI color prop
      class: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
    }
  },
  {
    key: 'appStoreUrl',
    props: {
      label: 'App Store',
      icon: 'i-simple-icons-appstore',
      variant: 'ghost',
      color: 'gray',
      class: 'text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }
  },
  {
    key: 'googlePlayUrl',
    props: {
      label: 'Google Play',
      icon: 'i-simple-icons-googleplay',
      variant: 'ghost',
      color: 'gray',
      class: 'text-[#00D363] hover:bg-green-50 dark:hover:bg-green-900/20'
    }
  },
  {
    key: 'githubUrl',
    props: {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      variant: 'ghost',
      color: 'gray',
      class: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
    }
  }
]

// 3. 计算属性：基于配置生成最终数据
const projectLinks = computed(() => {
  return LINK_CONFIG
    // 过滤：只有当 Project 对象中有对应 key 的值（且不为空）时才保留
    .filter(def => !!props.project[def.key])
    // 映射：组合配置属性和实际 URL
    .map(def => ({
      key: def.key,
      url: props.project[def.key] as string,
      props: def.props
    }))
})

// 辅助函数
const isExternal = (url?: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>