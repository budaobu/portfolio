<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <!-- Page Header -->
    <div class="mb-16">
      <div class="relative inline-block">
        <!-- Decorative accent -->
        <span class="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-16 bg-coral-500"></span>
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-warm-900 dark:text-warm-100">
          Buy List
        </h1>
      </div>
      <p class="mt-6 text-xl text-warm-600 dark:text-warm-400 max-w-2xl leading-relaxed">
        My wallet suffered for this list.
      </p>
      <p class="mt-3 text-sm text-warm-500">
        Links marked with <UBadge color="orange" variant="solid" size="xs" class="mx-1" label="AFF" /> are affiliate — I may earn a small commission at no extra cost to you.
      </p>
    </div>

    <div v-if="pending && allUses.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-80 rounded-none" />
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

    <div v-else class="space-y-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UseCard
          v-for="item in allUses"
          :key="item.id"
          :item="item"
        />
      </div>

      <div v-if="hasMore" ref="loadMoreTrigger" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-warm-400" />
      </div>

      <div v-else-if="allUses.length > 0" class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <span class="h-px w-8 bg-warm-300"></span>
          <span class="text-warm-500 text-sm uppercase tracking-widest">Budget: Zero</span>
          <span class="h-px w-8 bg-warm-300"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Use } from '~/server/utils/usesData'

useSiteSeo('uses')

const {
  items: allUses,
  pending,
  error,
  hasMore,
  loadMoreTrigger
} = await useInfiniteScroll<Use>('/api/uses', 9)
</script>
