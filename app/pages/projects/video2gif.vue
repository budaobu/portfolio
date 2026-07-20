<script setup lang="ts">
// 引入 gif.js
useHead({
  title: '视频转 GIF 工具',
  meta: [
    { name: 'description', content: '在浏览器本地将视频转换为 GIF 动图，无需上传服务器。' }
  ],
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js',
      onload: () => isLibLoaded.value = true // 标记库加载完成
    }
  ]
})

// --- 状态管理 ---
const isLibLoaded = ref(false)
const videoFile = ref<File | null>(null)
const videoUrl = ref<string>('')
const workerBlobUrl = ref<string>('')
const isProcessing = ref(false)
const progress = ref(0)
const progressText = ref('')
const loadingText = ref('')
const resultUrl = ref('')
const resultSize = ref('')

// 设置项
const settings = reactive({
  loop: true, // 默认开启循环
  width: 480,
  fps: 10
})

// DOM 引用
const sourceVideoRef = ref<HTMLVideoElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// --- 核心逻辑 ---

// 1. 初始化 Worker
const initWorker = async () => {
  if (workerBlobUrl.value) return true
  try {
    const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
    const workerScript = await response.text()
    const blob = new Blob([workerScript], { type: 'application/javascript' })
    workerBlobUrl.value = URL.createObjectURL(blob)
    return true
  } catch (error) {
    console.error("Failed to load gif worker:", error)
    alert("初始化组件失败，请检查网络连接")
    return false
  }
}

// 2. 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('video/')) {
    alert('请上传视频文件')
    return
  }
  
  // 清理旧资源
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  if (resultUrl.value) {
    URL.revokeObjectURL(resultUrl.value)
    resultUrl.value = ''
  }

  videoFile.value = file
  videoUrl.value = URL.createObjectURL(file)
  
  // 重置状态
  progress.value = 0
  progressText.value = ''
  
  // 等待视频加载元数据
  nextTick(() => {
    if (sourceVideoRef.value) {
      sourceVideoRef.value.load()
    }
  })
}

// 3. 开始转换
const startConversion = async () => {
  if (!videoFile.value || !sourceVideoRef.value) return
  if (!workerBlobUrl.value) {
    const success = await initWorker()
    if (!success) return
  }

  // @ts-ignore
  if (typeof GIF === 'undefined') {
    alert('组件尚未加载完成，请稍候...')
    return
  }

  isProcessing.value = true
  loadingText.value = '正在初始化...'
  
  const width = settings.width
  const ratio = sourceVideoRef.value.videoHeight / sourceVideoRef.value.videoWidth
  const height = Math.round(width * ratio)
  
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  // @ts-ignore
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: width,
    height: height,
    workerScript: workerBlobUrl.value,
    repeat: settings.loop ? 0 : -1, // 关键逻辑：0 为循环，-1 为不循环
    background: '#fff'
  })

  gif.on('progress', (p: number) => {
    progress.value = Math.round(p * 100)
    progressText.value = `${progress.value}%`
    loadingText.value = '正在编码 GIF...'
  })

  gif.on('finished', (blob: Blob) => {
    resultUrl.value = URL.createObjectURL(blob)
    resultSize.value = (blob.size / 1024 / 1024).toFixed(2)
    isProcessing.value = false
    loadingText.value = ''
  })

  // 捕获帧
  loadingText.value = '正在捕获视频帧...'
  const video = sourceVideoRef.value
  const duration = video.duration
  const interval = 1 / settings.fps
  let currentTime = 0
  let frameCount = 0
  const maxFrames = 300 

  const captureFrame = async () => {
    if (frameCount >= maxFrames || currentTime >= duration) {
      loadingText.value = '开始渲染...'
      gif.render()
      return
    }

    video.currentTime = currentTime
    
    await new Promise<void>(resolve => {
      const handleSeek = () => {
        resolve()
      }
      video.addEventListener('seeked', handleSeek, { once: true })
    })

    ctx.drawImage(video, 0, 0, width, height)
    gif.addFrame(ctx, { copy: true, delay: interval * 1000 })
    
    frameCount++
    const captureProgress = Math.round((currentTime / duration) * 100)
    progressText.value = `捕获: ${captureProgress}% (${frameCount}帧)`
    
    currentTime += interval
    setTimeout(captureFrame, 0)
  }

  video.pause()
  captureFrame()
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

onMounted(() => {
  initWorker()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
    <!-- Header -->
    <div class="max-w-3xl mx-auto text-center mb-12">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
        <UIcon name="i-heroicons-film" class="text-3xl" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">视频转 GIF 工具</h1>
      <p class="text-gray-500 dark:text-gray-400">
        纯前端处理，视频不上传服务器，保护隐私更安全。
      </p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Left Column: Input & Settings -->
      <div class="flex flex-col gap-6">
        
        <!-- 1. Upload Area -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <UIcon name="i-heroicons-arrow-up-tray" class="text-primary-500" /> 
              1. 上传视频
            </h2>
          </template>

          <div 
            class="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors duration-150 ease-out cursor-pointer group"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input 
              type="file" 
              ref="fileInputRef" 
              accept="video/*" 
              class="hidden" 
              @change="handleFileChange"
            >
            
            <div v-if="!videoFile">
              <UIcon name="i-heroicons-video-camera" class="text-4xl text-gray-400 group-hover:text-primary-500 mb-3 transition-colors" />
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">点击或拖拽视频文件到此处</p>
              <p class="text-xs text-gray-400 mt-1">支持 MP4, WebM, MOV</p>
            </div>

            <div v-else class="text-left flex items-center gap-4">
              <UIcon name="i-heroicons-check-circle" class="text-3xl text-primary-500 shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ videoFile.name }}</p>
                <p class="text-xs text-gray-500">{{ (videoFile.size / 1024 / 1024).toFixed(1) }} MB</p>
              </div>
              <UButton size="xs" color="gray" variant="soft" @click.stop="triggerFileInput">更换</UButton>
            </div>
          </div>

          <!-- Video Preview -->
          <video 
            ref="sourceVideoRef" 
            class="mt-4 w-full rounded-lg bg-black aspect-video object-contain" 
            :class="{ 'hidden': !videoUrl }"
            :src="videoUrl" 
            controls 
            playsinline 
            muted
          ></video>

          <!-- Large File Warning -->
          <div v-if="videoFile && videoFile.size > 50 * 1024 * 1024" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex gap-2 items-start">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-lg shrink-0" />
            <span>视频文件较大 (>50MB)，转换可能导致浏览器崩溃，建议先剪辑。</span>
          </div>
        </UCard>

        <!-- 2. Settings Area -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <UIcon name="i-heroicons-adjustments-horizontal" class="text-primary-500" />
              2. 转换设置
            </h2>
          </template>

          <div class="space-y-6">
            <!-- Loop Toggle -->
            <!-- 修复：使用手动构建的 Toggle 替代 UToggle，确保在任何环境下都能显示 -->
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" @click="settings.loop = !settings.loop">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-8 h-8 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-primary-500">
                  <UIcon name="i-heroicons-arrow-path" class="text-xl" />
                </div>
                <div>
                  <span class="block font-medium text-gray-700 dark:text-gray-200 text-sm">循环播放</span>
                  <span class="block text-xs text-gray-500">GIF 播放完毕后是否重新开始</span>
                </div>
              </div>
              
              <!-- 手写 Toggle 开关 -->
              <div 
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.loop ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span 
                  aria-hidden="true" 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settings.loop ? 'translate-x-5' : 'translate-x-0'"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase">宽度 (px)</label>
                <UInput v-model="settings.width" type="number" placeholder="480" />
                <p class="text-[10px] text-gray-400">建议 300-600</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase">帧率 (FPS)</label>
                <UInput v-model="settings.fps" type="number" max="24" min="1" placeholder="10" />
                <p class="text-[10px] text-gray-400">建议 5-15</p>
              </div>
            </div>

            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg border border-yellow-100 dark:border-yellow-900/30 flex gap-2">
              <UIcon name="i-heroicons-information-circle" class="text-lg shrink-0" />
              <span>提示：如果视频较长，请减少帧率或宽度。浏览器内存有限，转换长视频可能失败。</span>
            </div>

            <UButton 
              block 
              size="xl" 
              :color="isProcessing ? 'gray' : 'primary'"
              :loading="isProcessing"
              :disabled="!videoFile || isProcessing"
              @click="startConversion"
            >
              <template #leading>
                <UIcon name="i-heroicons-sparkles" />
              </template>
              {{ isProcessing ? '转换中...' : '开始转换' }}
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Right Column: Result -->
      <div class="flex flex-col h-full">
        <UCard class="h-full flex flex-col" :ui="{ body: { base: 'flex-1 flex flex-col' } }">
          <template #header>
            <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <UIcon name="i-heroicons-photo" class="text-primary-500" />
              3. 结果预览
            </h2>
          </template>

          <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-4 relative overflow-hidden min-h-[300px]">
            
            <!-- Empty State -->
            <div v-if="!isProcessing && !resultUrl" class="text-center">
              <UIcon name="i-heroicons-film" class="text-5xl text-gray-300 dark:text-gray-600 mb-3" />
              <p class="text-gray-400 dark:text-gray-500">生成的 GIF 将显示在这里</p>
            </div>

            <!-- Loading State -->
            <div v-if="isProcessing" class="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-20 flex flex-col items-center justify-center p-8">
              <UIcon name="i-heroicons-arrow-path" class="text-4xl text-primary-500 animate-spin mb-4" />
              <h3 class="text-lg font-bold text-gray-700 dark:text-white mb-1">正在处理</h3>
              <p class="text-sm text-gray-500 mb-4">{{ loadingText }}</p>
              
              <!-- Progress Bar -->
              <div class="w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
              </div>
              <p class="text-xs text-gray-400 mt-2">{{ progressText }}</p>
            </div>

            <!-- Result -->
            <img 
              v-if="resultUrl" 
              :src="resultUrl" 
              class="max-w-full max-h-[500px] object-contain shadow-lg rounded-md bg-white" 
              alt="Generated GIF" 
            />
          </div>

          <div v-if="resultUrl" class="mt-6 grid grid-cols-2 gap-4">
            <div class="flex flex-col justify-center">
              <span class="text-sm text-gray-500">大小: {{ resultSize }} MB</span>
            </div>
            <UButton
              :to="resultUrl"
              download="converted.gif"
              color="primary"
              block
              icon="i-heroicons-arrow-down-tray"
            >
              下载 GIF
            </UButton>
          </div>
        </UCard>
      </div>

    </div>
  </div>
</template>