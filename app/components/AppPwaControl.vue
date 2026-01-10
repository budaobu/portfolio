<template>
  <ClientOnly>
    <!-- 仅在检测到需要刷新时显示 -->
    <div
      v-if="$pwa?.needRefresh"
      class="fixed bottom-6 right-6 z-[100] animate-bounce-in"
    >
      <UCard
        :ui="{
          body: { padding: 'p-3' },
          ring: 'ring-1 ring-primary-500/50',
          shadow: 'shadow-2xl'
        }"
        class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
      >
        <div class="flex items-center gap-3">
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900 dark:text-white">New content available</span>
            <span class="text-xs text-gray-500">Click to update</span>
          </div>
          
          <div class="flex gap-2">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="$pwa.cancelPrompt()"
            />
            <UButton
              size="xs"
              color="primary"
              variant="solid"
              icon="i-heroicons-arrow-path"
              label="Reload"
              @click="$pwa.updateServiceWorker()"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 可选：自定义安装按钮逻辑（如果需要显式安装按钮，可在此扩展） -->
  </ClientOnly>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp()

// 这里可以监听 beforeinstallprompt 事件，如果你想做一个自定义的安装按钮
</script>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>