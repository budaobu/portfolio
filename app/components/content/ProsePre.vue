<template>
  <div class="relative group my-6">
    <!-- 语言标识 (左上角) -->
    <span 
      v-if="language" 
      class="absolute top-0 left-4 px-2 py-1 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-b-md select-none border border-t-0 border-gray-200 dark:border-gray-700"
    >
      {{ language }}
    </span>

    <!-- 复制按钮 (右上角) -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      <UButton
        size="xs"
        :color="copied ? 'green' : 'gray'"
        variant="soft"
        :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
        @click="copyCode"
        :label="copied ? '已复制' : ''"
      />
    </div>

    <!-- 代码内容 -->
    <!-- whitespace-pre-wrap: 实现代码溢出换行 -->
    <!-- break-words: 防止长字符串撑破容器 -->
    <pre 
      class="prose-pre bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 pt-10 overflow-x-hidden whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
      :class="$props.class"
    ><slot /></pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style>
/* 覆盖 Shiki 默认背景，使用我们自己的容器背景 */
.prose-pre code {
  background-color: transparent !important;
  color: inherit !important;
  display: inline; /* 配合 whitespace-pre-wrap 工作 */
}
</style>