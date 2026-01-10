<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- PWA 控制组件 (Toast) -->
    <AppPwaControl />
  </UApp>
</template>

<script setup lang="ts">
// 在根组件设置默认的 Title Template
// 这样所有页面默认都会带有 " - Budaobu" 后缀
useHead({
  titleTemplate: '%s - Budaobu',
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