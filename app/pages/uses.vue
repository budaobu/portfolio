<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        Buy List
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        My wallet suffered for this list.
        <span class="text-sm opacity-75 block mt-2">
          Note: Links marked with <UBadge color="orange" variant="subtle" size="xs" label="AFF" /> are affiliate links; I may earn a small commission at no extra cost to you.
        </span>
      </p>
    </div>

    <div v-if="pending && allUses.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-80 rounded-lg" />
    </div>

    <UAlert 
      v-else-if="error" 
      color="red" 
      variant="soft"
      icon="i-lucide-circle-alert"
      title="Failed to load"
      description="Failed to fetch products data. Please try again later."
      class="max-w-2xl mx-auto"
    />

    <div v-else class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UseCard 
          v-for="item in allUses" 
          :key="item.id"
          :item="item"
        />
      </div>

      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
      
      <div v-else-if="allUses.length > 0" class="text-center py-8 text-gray-400 text-sm">
        - Budget: Zero. -
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Use } from '~/server/utils/usesData'

useSeoMeta({
  title: 'Uses, Goods, Stuff I Paid For',
  description: 'Everything here is something I actually paid for. Welcome to my personal \'Buy\' list. Note: Links marked with AFF are affiliate links; I may earn a small commission at no extra cost to you.',
  keywords: 'Uses, Goods, Shopping List, Budaobu, Tech Gear, Affiliate, My Buy List',
  ogTitle: 'Budaobu\'s \'Buy\' List - Stuff I Paid For',
  ogDescription: 'My wallet suffered for this list. A collection of things I actually spent money on. (AFF links included at no extra cost)',
})

const { 
  items: allUses, 
  pending, 
  error, 
  hasMore, 
  loadMoreTrigger 
} = await useInfiniteScroll<Use>('/api/uses', 9)
</script>