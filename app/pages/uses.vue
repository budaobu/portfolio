<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
    <!-- Page Header -->
    <SectionHeading
      large
      eyebrow="Gear"
      title="Buy List"
      description="My wallet suffered for this list."
    >
      <p class="mt-3 text-sm text-warm-500">
        Links marked with <UBadge color="orange" variant="solid" size="xs" class="mx-1" label="AFF" /> are affiliate — I may earn a small commission at no extra cost to you.
      </p>
    </SectionHeading>

    <div v-if="!loaded && !error" class="flex flex-col gap-1">
      <USkeleton v-for="i in 8" :key="i" class="h-14 rounded-lg" />
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
      <div class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
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
  error,
  loaded,
  hasMore,
  loadMoreTrigger
} = await useInfiniteScroll<Use>('/api/uses', 9)
</script>
