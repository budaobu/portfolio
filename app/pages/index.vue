<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <section class="mb-20">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Hi👋🏻, I'm 
        <!-- 文字翻滚效果容器 -->
        <span class="text-roll-wrapper text-primary-600 dark:text-primary-400">
          <span class="text-roll-inner">
            <span class="block">@Budaobu</span>
            <span class="block">@Budaobu</span>
          </span>
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
        Just a quiet non-dev vibe coding with AI. Everything here is stitched together by prompt and intuition. Enjoy.
      </p>
      
      <!-- 新增：社交媒体图标栏 -->
      <div class="flex items-center gap-4 mt-6">
        <UButton
          v-for="social in socialLinks"
          :key="social.name"
          :to="social.url"
          target="_blank"
          color="gray"
          variant="ghost"
          :icon="social.icon"
          size="sm"
          :aria-label="social.name"
          class="p-0 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          @click="handleSocialClick(social)"
        />
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <UButton to="/projects" color="gray" variant="ghost" icon="i-lucide-arrow-right" label="View All" />
      </div>
      
      <!-- 加载状态：骨架屏 -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse ring-1 ring-gray-200 dark:ring-gray-800"></div>
      </div>
      
      <!-- 错误处理 -->
      <div v-else-if="error" class="text-center py-10 text-red-500">
        Failed to fetch projects data. Please try again later.
      </div>

      <!-- 作品列表：增加淡入动画 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <div
          v-for="project in featuredProjects" 
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
              <!-- 图标容器 -->
              <div v-if="!project.demoUrl && project.githubUrl" class="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-simple-icons-github" class="w-7 h-7 text-gray-900 dark:text-white" />
              </div>
              <div v-else class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:scale-110 transition-transform duration-300">
                <img 
                  v-if="project.icon.startsWith('http') || project.icon.startsWith('/')" 
                  :src="project.icon" 
                  class="w-8 h-8 object-contain rounded-full ring-2 ring-gray-200 dark:ring-gray-800 group-hover:ring-primary-500 transition-all object-cover" 
                  alt="icon" 
                />
                <UIcon 
                  v-else-if="project.icon.startsWith('i-')" 
                  :name="project.icon" 
                  class="w-7 h-7 text-gray-900 dark:text-white" 
                />
                <span v-else class="text-2xl">{{ project.icon }}</span>
              </div>

              <!-- 标题 (带链接) -->
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

            <!-- 底部操作栏：独立按钮 -->
            <div class="flex items-center justify-start flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-20">
              
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

              <!-- Web -->
              <UButton
                v-if="project.demoUrl"
                :to="project.demoUrl"
                target="_blank"
                size="xs"
                color="gray"
                variant="soft"
                icon="i-lucide-arrow-up-right"
                label="Web"
                class="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ml-auto" 
              />

            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 引入类型定义
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

interface SocialLink {
  name: string
  icon: string
  url: string
}

useSeoMeta({
  title: 'Budaobu | AI-Stitched Personal Portfolio',
  description: 'Non-dev, just vibe coding to stitch stuff together. An introvert\'s playground where everything is built by prompt and intuition.',
  keywords: 'Budaobu, AI Stitched, Portfolio, Vibe Coding, Non-dev, Personal Website, Web Tools, Prompt Engineering',
  ogTitle: 'Budaobu | AI-Stitched Personal Portfolio',
  ogDescription: 'Non-dev, just vibe coding to stitch stuff together.',
})

useHead({
  titleTemplate: '%s'
})

defineOgImageComponent('NuxtSeo', {
  title: 'Budaobu | AI-Stitched Personal Portfolio',
  description: 'Non-dev, just vibe coding to stitch stuff together.',
  theme: '#3b82f6',
  colorMode: 'dark',
  siteLogo: 'https://github.com/budaobu.png'
})

// 修改：请求新的 API 接口 /api/featuredProjects
const { data: featuredProjects, pending, error } = await useFetch<Project[]>('/api/featuredProjects', {
  lazy: true
})

// 文案逻辑生成函数
const getAvailabilityText = (project: Project) => {
  const hasAppStore = !!project.appStoreUrl
  const hasGooglePlay = !!project.googlePlayUrl

  if (hasAppStore && hasGooglePlay) {
    return "Now available on App Store and Google Play"
  } else if (hasAppStore) {
    return "Now available on App Store"
  } else if (hasGooglePlay) {
    return "Now available on Google Play"
  }
  return ""
}

const isExternal = (url: string) => {
  if (!url) return false
  return url.startsWith('http')
}

// 防爬虫点击处理逻辑 (与 default.vue 保持一致)
const handleSocialClick = (social: SocialLink) => {
  if (social.name === 'Email') {
    const u = 'lizhaoshui'
    const d = 'duck.com'
    window.location.href = `mailto:${u}@${d}`
  } else if (social.url) {
    window.open(social.url, '_blank')
  }
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

/* 文字翻滚动画相关样式 */
.text-roll-wrapper {
  display: inline-block;
  height: 1.2em; /* 高度设为 1.2em，确保只显示一行 */
  line-height: 1.2em;
  overflow: hidden;
  vertical-align: bottom; /* 对齐底部，防止文字抖动 */
}

.text-roll-inner {
  display: block;
  /* 3秒一次循环，cubic-bezier 让滚动有弹性感 */
  animation: text-roll-anim 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes text-roll-anim {
  0%, 45% {
    transform: translateY(0);
  }
  55%, 90% {
    transform: translateY(-50%); /* 向上移动 50%，显示第二行文字 */
  }
  100% {
    transform: translateY(0); /* 瞬间回到初始位置（需要无缝衔接） */
  }
}
</style>