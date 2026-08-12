<template>
  <a
    :href="item.linkUrl"
    target="_blank"
    rel="nofollow noopener noreferrer"
    class="group flex items-center gap-3 -mx-3 px-3 py-3 rounded-lg focus:outline-none transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800"
  >
    <NuxtImg
      v-if="item.imageUrl"
      :src="item.imageUrl"
      :alt="item.brand"
      loading="lazy"
      format="webp"
      quality="80"
      class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 object-cover flex-shrink-0"
      @error="handleIconError"
    />
    <img
      v-else
      :src="getFavicon(item.linkUrl)"
      :alt="item.brand"
      loading="lazy"
      class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 object-contain bg-white dark:bg-warm-800 p-1 flex-shrink-0"
      @error="handleIconError"
    />

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-medium text-coral-600 dark:text-coral-400 uppercase tracking-wider truncate">
          {{ item.brand }}
        </span>
        <UBadge v-if="item.isAffiliate" color="orange" variant="solid" size="xs" class="flex-shrink-0">AFF</UBadge>
      </div>
      <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
        {{ item.name }}
      </h3>
      <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
        {{ item.description }}
      </p>
    </div>

    <div class="flex flex-col items-end gap-0.5 flex-shrink-0">
      <span v-if="item.price" class="text-xs font-medium text-warm-900 dark:text-warm-100">
        {{ item.price }}
      </span>
      <span class="text-[11px] text-warm-400 dark:text-warm-500">
        {{ item.category }}
      </span>
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
