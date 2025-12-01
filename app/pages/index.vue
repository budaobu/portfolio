<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <section class="mb-20">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        你好，我是 <span class="text-primary-600 dark:text-primary-400">Budaobu</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
        一个正在学习和探索 AI 的普通人，不是开发者。我喜欢用简单清晰的方式和 AI 对话。
      </p>
    </section>

    <section>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">作品集</h2>
      
      <!-- 加载状态处理 -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
      </div>
      
      <!-- 错误处理 -->
      <div v-else-if="error" class="text-center py-10 text-red-500">
        获取作品数据失败，请稍后重试。
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projects" 
          :key="project.id"
          class="group cursor-pointer"
          @click="handleCardClick(project)"
        >
          <UCard 
            :ui="{ 
              body: { padding: 'p-6' },
              base: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
              divide: '',
              header: { padding: '' },
              footer: { padding: '' }
            }"
          >
            <div class="flex items-center gap-3 mb-4">
              <div v-if="!project.demoUrl && project.githubUrl" class="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-simple-icons-github" class="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div v-else class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:scale-110 transition-transform duration-300">
                <!-- 情况 A: 如果是 URL，渲染图片 -->
                <img 
                  v-if="project.icon.startsWith('http') || project.icon.startsWith('/')" 
                  :src="project.icon" 
                  class="w-8 h-8 object-contain rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all object-cover" 
                  alt="icon" 
                />
                <!-- 情况 B: 否则渲染 Emoji 或 Iconify (保持原有逻辑) -->
                <span v-else class="text-2xl">{{ project.icon }}</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ project.title }}
              </h3>
            </div>

            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {{ project.description }}
            </p>

            <div v-if="project.demoUrl && project.githubUrl" class="flex items-center">
              <NuxtLink
                :to="project.githubUrl"
                target="_blank"
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                @click.stop
              >
                <UIcon name="i-simple-icons-github" class="w-4 h-4" />
                <span>源码</span>
              </NuxtLink>
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 添加 SEO 配置
useSeoMeta({
  title: 'Budaobu 的个人作品集', 
  titleTemplate: null, // 关键：设置为 null 以覆盖全局的 '%s - Budaobu' 模板，防止出现 "Budaobu Portfolio - Budaobu"
  description: 'Budaobu 的个人作品集 - vibe 开发者，分享有趣的项目和 AI 探索。',
  keywords: 'Budaobu, 个人作品集, vibe coding',
  ogTitle: 'Budaobu - 作品集',
  ogDescription: '探索 Budaobu 的个人 vibe 项目，包括 AI 应用、工具类软件等。',
})

// OG 图片配置
defineOgImageComponent('NuxtSeo', {
  title: 'Budaobu Portfolio',
  description: 'AI 爱好者 / vibe 开发者',
  theme: '#3b82f6',
  colorMode: 'dark',
  siteLogo: 'https://github.com/budaobu.png'
})

// 定义项目接口 (为了类型安全，最好复用 shared types，但为了简单这里保留定义)
interface Project {
  id: number
  title: string
  description: string
  icon: string
  demoUrl?: string
  githubUrl?: string
  date?: string
}

// 使用 useFetch 从 API 获取数据
// 这样即使项目数据更新，也只需要修改 server/utils/projectData.ts，无需重新构建前端逻辑
const { data: projects, pending, error } = await useFetch<Project[]>('/api/projects')

// 辅助函数：判断是否为 URL (用于渲染 img 标签)
const isIconUrl = (iconStr: string) => {
  if (!iconStr) return false
  return /^(https?:\/\/|\/|data:image)/.test(iconStr)
}

const handleCardClick = (project: Project) => {
  const url = project.demoUrl || project.githubUrl
  if (!url) return

  // 判断是否为站内链接 (以 / 开头)
  // 如果是站内链接，使用 Nuxt 的 navigateTo 进行 SPA 路由跳转
  if (url.startsWith('/')) {
    navigateTo(url)
  } else {
    // 如果是外链 (http 开头)，则在新标签页打开
    window.open(url, '_blank')
  }
}
</script>