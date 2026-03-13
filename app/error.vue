<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    
    <div class="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
      <!-- 404 TV 组件 -->
      <RetroTv 
        :error-code="statusCode"
        :error-message="errorMessage"
        class="mb-8"
      />

      <!-- 错误描述 -->
      <div class="space-y-6 mt-8 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {{ is404 
            ? 'The page you are looking for might be removed or unavailable. Why not take a break and watch some TV?' 
            : 'The server encountered a temporary issue. Please try again later.' 
          }}
        </p>

        <!-- 返回按钮 -->
        <div class="flex items-center justify-center gap-4">
          <UButton
            size="lg"
            color="primary"
            variant="solid"
            icon="i-heroicons-home"
            label="Back to Home"
            @click="handleError"
            class="transition-transform hover:scale-105"
          />
          <UButton
            v-if="!is404"
            size="lg"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            label="Retry"
            @click="reload"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 错误对象类型
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

// 状态判断
const is404 = computed(() => props.error.statusCode === 404)
const statusCode = computed(() => String(props.error.statusCode || '500'))
const errorMessage = computed(() => is404.value ? 'NOT FOUND' : 'ERROR')

// 错误处理函数
const handleError = () => {
  // 清除错误并重定向到首页
  clearError({ redirect: '/' })
}

const reload = () => {
  location.reload()
}

// 设置页面元数据
useHead({
  title: is404.value ? '404 - NOT FOUND' : 'ERROR',
  bodyAttrs: {
    class: 'overflow-hidden' // 防止滚动条闪烁
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
}
</style>