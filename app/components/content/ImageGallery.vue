<template>
  <div class="my-8">
    <!-- 4列宫格布局 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div 
        v-for="(img, index) in images" 
        :key="index"
        class="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 group"
        @click="openLightbox(index)"
      >
        <img 
          :src="img" 
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          alt="Gallery image"
          loading="lazy"
        />
        <!-- 悬停时的遮罩 -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <UIcon name="i-heroicons-magnifying-glass-plus" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
        </div>
      </div>
    </div>

    <!-- 灯箱 (Lightbox) Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          @click.self="closeLightbox"
          @keydown.esc="closeLightbox"
        >
          <!-- 关闭按钮 -->
          <button 
            @click="closeLightbox"
            class="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
          </button>

          <!-- 导航按钮 - 左 -->
          <button 
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-8 h-8" />
          </button>

          <!-- 图片主体 -->
          <div class="relative max-w-7xl max-h-[90vh] w-full flex justify-center items-center">
            <img 
              :src="images[currentIndex]" 
              class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none"
              @click.stop
              alt="Lightbox view"
            />
             <!-- 计数器 -->
            <div class="absolute bottom-[-3rem] text-white/80 font-mono text-sm">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>

          <!-- 导航按钮 - 右 -->
          <button 
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-8 h-8" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  images: string[]
}

const props = defineProps<Props>()

const isOpen = ref(false)
const currentIndex = ref(0)

const openLightbox = (index: number) => {
  currentIndex.value = index
  isOpen.value = true
  document.body.style.overflow = 'hidden' // 禁止背景滚动
  window.addEventListener('keydown', handleKeydown)
}

const closeLightbox = () => {
  isOpen.value = false
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}
</script>