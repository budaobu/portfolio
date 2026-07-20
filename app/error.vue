<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-warm-50 dark:bg-olive-950 px-4 relative overflow-hidden">
    <!-- Background pattern - subtle grid -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#D4CFC212_1px,transparent_1px),linear-gradient(to_bottom,#D4CFC212_1px,transparent_1px)] bg-[size:32px_32px]"></div>

    <!-- Decorative elements -->
    <div class="absolute top-1/4 left-10 w-24 h-24 border-[2px] border-coral-500/20 rotate-12 hidden sm:block"></div>
    <div class="absolute bottom-1/4 right-10 w-32 h-32 border-[2px] border-coral-500/10 -rotate-6 hidden sm:block"></div>

    <div class="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
      <!-- 404 TV Component -->
      <RetroTv
        :error-code="statusCode"
        :error-message="errorMessage"
        class="mb-8"
      />

      <!-- Error description -->
      <div class="space-y-6 mt-8 animate-fade-in">
        <h2 class="text-3xl font-serif font-medium text-warm-900 dark:text-warm-100">
          {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h2>
        <p class="text-warm-600 dark:text-warm-400 max-w-md mx-auto leading-relaxed">
          {{ is404
            ? 'The page you are looking for might be removed or unavailable. Why not take a break and watch some TV?'
            : 'The server encountered a temporary issue. Please try again later.'
          }}
        </p>

        <!-- Action buttons -->
        <div class="flex items-center justify-center gap-4 pt-4">
          <UButton
            size="lg"
            color="coral"
            variant="solid"
            icon="i-heroicons-home"
            label="Back to Home"
            @click="handleError"
            class="rounded-sm font-medium transition-transform hover:scale-105"
          />
          <UButton
            v-if="!is404"
            size="lg"
            color="gray"
            variant="outline"
            icon="i-heroicons-arrow-path"
            label="Retry"
            @click="reload"
            class="rounded-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const is404 = computed(() => props.error.statusCode === 404)
const statusCode = computed(() => String(props.error.statusCode || '500'))
const errorMessage = computed(() => is404.value ? 'NOT FOUND' : 'ERROR')

const handleError = () => {
  clearError({ redirect: '/' })
}

const reload = () => {
  location.reload()
}

useHead({
  title: is404.value ? '404 - NOT FOUND' : 'ERROR',
  bodyAttrs: {
    class: 'overflow-hidden'
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: fadeInReduced 0.3s ease-out forwards;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
