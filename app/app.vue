<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppPwaControl />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk && titleChunk !== 'Budaobu'
      ? `${titleChunk} - Budaobu`
      : 'Budaobu'
  },
  bodyAttrs: {
    class: 'bg-warm-50 dark:bg-olive-950 text-warm-900 dark:text-warm-100 antialiased font-sans'
  }
})
</script>

<style>
body {
  transition: background-color 0.3s ease-out;
}
</style>