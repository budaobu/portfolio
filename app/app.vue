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
    class: 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased'
  }
})
</script>

<style>
body {
  transition: background-color 0.3s;
}
</style>