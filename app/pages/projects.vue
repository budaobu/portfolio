<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        全部作品
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        这里是我所有的项目列表，包含实验性的小工具和正式发布的应用。
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse ring-1 ring-gray-200 dark:ring-gray-800"></div>
    </div>
    
    <!-- 错误处理 -->
    <div v-else-if="error" class="text-center py-10 text-red-500">
      获取数据失败，请稍后重试。
    </div>

    <!-- 作品列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div
        v-for="project in projects" 
        :key="project.id"
        class="group relative"
      >
        <UCard 
          :ui="{ 
            body: { padding: 'p-6' },
            base: 'relative h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
            divide: '',
            header: { padding: '' },
            footer: { padding: '' }
          }"
        >
          <!-- 头部：图标 + 标题 -->
          <div class="flex items-center gap-3 mb-4">
            <div v-if="!project.demoUrl && project.githubUrl" class="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-simple-icons-github" class="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <div v-else class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:scale-110 transition-transform duration-300">
              <img 
                v-if="project.icon.startsWith('http') || project.icon.startsWith('/')" 
                :src="project.icon" 
                class="w-8 h-8 object-contain rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all object-cover" 
                alt="icon" 
              />
              <span v-else class="text-2xl">{{ project.icon }}</span>
            </div>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <NuxtLink 
                v-if="project.mainUrl"
                :to="project.mainUrl"
                :target="isExternal(project.mainUrl) ? '_blank' : '_self'"
                class="focus:outline-none"
              >
                <span class="absolute inset-0 z-0"></span>
                {{ project.title }}
              </NuxtLink>
              <span v-else>{{ project.title }}</span>
            </h3>
          </div>

          <!-- 描述 -->
          <p class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1 relative z-10">
            {{ project.description }}
          </p>

          <!-- 上架文案提示 -->
          <div v-if="getAvailabilityText(project)" class="mb-3 text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 relative z-10">
             <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4" />
             <span>{{ getAvailabilityText(project) }}</span>
          </div>

          <!-- 底部操作栏 -->
          <div class="flex items-center justify-start flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-20">
            <!-- 顺序：App Store -> Google Play -> GitHub -> Web -->

            <!-- App Store (蓝色主题色) -->
            <UButton
              v-if="project.appStoreUrl"
              :to="project.appStoreUrl"
              target="_blank"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-simple-icons-appstore"
              label="App Store"
              class="text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />

            <!-- Google Play (绿色主题色) -->
            <UButton
              v-if="project.googlePlayUrl"
              :to="project.googlePlayUrl"
              target="_blank"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-simple-icons-googleplay"
              label="Google Play"
              class="text-[#00D363] hover:bg-green-50 dark:hover:bg-green-900/20"
            />

            <!-- GitHub -->
            <UButton
              v-if="project.githubUrl"
              :to="project.githubUrl"
              target="_blank"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-simple-icons-github"
              label="GitHub"
              class="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            />

            <!-- Web (图标已修改) -->
            <UButton
              v-if="project.demoUrl"
              :to="project.demoUrl"
              target="_blank"
              size="xs"
              color="gray"
              variant="soft"
              icon="i-heroicons-arrow-up-right-solid"
              label="Web"
              class="ml-auto" 
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  icon: string
  demoUrl?: string
  githubUrl?: string
  appStoreUrl?: string
  googlePlayUrl?: string
  date?: string
  mainUrl?: string
  featured?: boolean
}

useSeoMeta({
  title: '全部作品',
  description: 'Budaobu 的所有作品列表。',
  ogTitle: '全部作品 - Budaobu',
})

const { data: projects, pending, error } = await useFetch<Project[]>('/api/projects', {
  lazy: true
})

// 文案逻辑生成函数
const getAvailabilityText = (project: Project) => {
  const hasAppStore = !!project.appStoreUrl
  const hasGooglePlay = !!project.googlePlayUrl

  if (hasAppStore && hasGooglePlay) {
    return "现已在 App Store, Google Play 上架"
  } else if (hasAppStore) {
    return "现已在 App Store 上架"
  } else if (hasGooglePlay) {
    return "现已在 Google Play 上架"
  }
  return ""
}

const isExternal = (url: string) => {
  if (!url) return false
  return url.startsWith('http')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>