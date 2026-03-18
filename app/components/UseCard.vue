<template>
  <a
    :href="item.linkUrl"
    target="_blank"
    rel="nofollow noopener noreferrer"
    class="group block h-full focus:outline-none"
  >
    <div class="h-full bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-4 transition-all duration-300 hover:border-coral-500/50 hover:bg-warm-100 dark:hover:bg-olive-800">
      <component :is="item.imageUrl ? 'div' : 'template'">
        <div v-if="item.imageUrl" class="relative aspect-[4/3] overflow-hidden bg-warm-200 dark:bg-warm-800 mb-4">
          <NuxtImg
            :src="item.imageUrl"
            :alt="item.name"
            loading="lazy"
            format="webp"
            quality="80"
            :placeholder="[50, 25, 75, 5]"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div class="absolute top-3 right-3">
            <UBadge v-if="item.isAffiliate" color="orange" variant="solid" size="xs">AFF</UBadge>
          </div>

          <div class="absolute bottom-3 left-3">
            <UBadge color="coral" variant="solid" size="xs" class="bg-warm-900/80 backdrop-blur-sm">
              {{ item.category }}
            </UBadge>
          </div>
        </div>
      </component>

      <div :class="item.imageUrl ? '' : 'h-full flex flex-col'">
        <div v-if="!item.imageUrl" class="flex items-start gap-3 mb-4">
          <img
            :src="getFavicon(item.linkUrl)"
            :alt="item.brand"
            class="w-10 h-10 rounded-lg bg-white dark:bg-warm-800 p-1 object-contain flex-shrink-0"
            @error="handleIconError"
          />
          <div class="flex-1 min-w-0">
            <div class="text-xs font-medium text-coral-600 dark:text-coral-400 uppercase tracking-wider mb-1">
              {{ item.brand }}
            </div>
            <h3 class="text-base font-medium text-warm-900 dark:text-warm-100 leading-tight group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
              {{ item.name }}
            </h3>
          </div>
          <UBadge v-if="item.isAffiliate" color="orange" variant="solid" size="xs" class="flex-shrink-0">AFF</UBadge>
        </div>

        <div v-if="item.imageUrl" class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-coral-600 dark:text-coral-400 uppercase tracking-wider">
            {{ item.brand }}
          </span>
          <div class="flex items-center gap-1 text-warm-500 group-hover:text-coral-500 transition-colors">
            <span class="text-xs">Visit</span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="w-3 h-3"
            />
          </div>
        </div>

        <h3 v-if="item.imageUrl" class="text-base font-medium text-warm-900 dark:text-warm-100 mb-2 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
          {{ item.name }}
        </h3>

        <p class="text-sm text-warm-600 dark:text-warm-400 leading-relaxed" :class="{ 'mb-4 flex-1': !item.imageUrl }">
          {{ item.description }}
        </p>

        <div v-if="!item.imageUrl" class="flex items-center justify-between pt-3 border-t border-warm-200 dark:border-warm-800 mt-auto">
          <UBadge color="gray" variant="subtle" size="sm">{{ item.category }}</UBadge>
          <div class="flex items-center text-xs text-warm-500 group-hover:text-coral-500 transition-colors gap-1">
            <UIcon name="i-lucide-arrow-up-right" class="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Use } from '~/server/utils/usesData'

interface Props {
  item: Use
}

defineProps<Props>()

const getFavicon = (url: string) => {
  if (!url) return ''
  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  } catch {
    return ''
  }
}

const handleIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/avatar.webp'
}
</script>
