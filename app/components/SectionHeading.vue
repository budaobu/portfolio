<template>
  <div :class="wrapperClass">
    <!-- Eyebrow divider: numbered label flanked by rules, continuous-document style -->
    <div class="flex items-center gap-3 mb-3">
      <span v-if="index" class="text-xs font-medium text-coral-600 dark:text-coral-400 tabular-nums">{{ index }}</span>
      <span class="h-px w-6 bg-warm-300 dark:bg-warm-700"></span>
      <span class="text-xs font-medium text-warm-500 dark:text-warm-400 uppercase tracking-[0.2em]">{{ eyebrow }}</span>
      <span class="h-px flex-1 bg-warm-300 dark:bg-warm-700"></span>
    </div>
    <div class="flex items-end justify-between gap-4">
      <component
        :is="large ? 'h1' : 'h2'"
        :class="large ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl md:text-3xl'"
        class="font-serif font-medium text-warm-900 dark:text-warm-100"
      >
        {{ title }}
      </component>
      <UButton
        v-if="to"
        :to="to"
        color="gray"
        variant="ghost"
        icon="i-lucide-arrow-right"
        trailing
        :label="linkLabel"
        size="sm"
        class="font-medium flex-shrink-0"
      />
    </div>
    <p v-if="description" class="mt-2 text-sm text-warm-600 dark:text-warm-400 max-w-2xl leading-relaxed">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  eyebrow: string
  title: string
  index?: string
  description?: string
  to?: string
  linkLabel?: string
  large?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  linkLabel: 'View All'
})

const wrapperClass = computed(() => props.large ? 'mb-10 md:mb-12' : 'mb-8 md:mb-10')
</script>
