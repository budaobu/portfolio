<template>
  <a 
    :href="item.linkUrl"
    target="_blank"
    rel="nofollow noopener noreferrer"
    class="group block h-full focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-all"
  >
    <UCard
      class="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 group-hover:!ring-2 group-hover:!ring-primary-500/50 dark:group-hover:!ring-primary-400/50"
      :ui="{
        base: 'h-full flex flex-col',
        body: { padding: 'p-0', base: 'flex-1 flex flex-col' }
      }"
    >
      <component :is="item.imageUrl ? 'div' : 'template'">
        <div v-if="item.imageUrl" class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <NuxtImg 
            :src="item.imageUrl" 
            :alt="item.name"
            loading="lazy"
            format="webp"
            quality="80"
            :placeholder="[50, 25, 75, 5]"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div class="absolute inset-0 flex flex-col justify-between p-3">
            <div class="flex justify-end">
              <UBadge v-if="item.isAffiliate" color="orange" variant="solid" size="xs" class="shadow-md">AFF</UBadge>
            </div>
            <div class="flex justify-start">
              <UBadge color="gray" variant="solid" size="xs" class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md">
                {{ item.category }}
              </UBadge>
            </div>
          </div>
        </div>
      </component>

      <div :class="item.imageUrl ? 'p-2' : 'p-3 h-full'">
        <div v-if="!item.imageUrl" class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <img 
              :src="getFavicon(item.linkUrl)" 
              :alt="item.brand"
              class="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 p-1 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" 
              @error="handleIconError"
            />
            <div class="flex-1 min-w-0">
              <div class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                {{ item.brand }}
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                {{ item.name }}
              </h3>
            </div>
          </div>
          <UBadge v-if="item.isAffiliate" color="orange" variant="solid" size="xs" class="flex-shrink-0">AFF</UBadge>
        </div>

        <div v-else class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            {{ item.brand }}
          </span>
          <UIcon 
            name="i-lucide-circle-arrow-out-up-right" 
            class="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" 
          />
        </div>

        <h3 v-if="item.imageUrl" class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
          {{ item.name }}
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed" :class="{ 'mb-4 flex-1': !item.imageUrl }">
          {{ item.description }}
        </p>

        <div v-if="!item.imageUrl" class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <UBadge color="gray" variant="subtle" size="sm">{{ item.category }}</UBadge>
          <div class="flex items-center text-xs text-gray-400 group-hover:text-primary-500 transition-colors gap-1">
            <span>View</span>
            <UIcon name="i-lucide-circle-arrow-out-up-right" class="w-3 h-3" />
          </div>
        </div>
      </div>
    </UCard>
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

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-product.webp'
}

const handleIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/avatar.webp'
}
</script>