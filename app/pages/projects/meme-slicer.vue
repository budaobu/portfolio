<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 mb-4">
        <UIcon name="i-heroicons-squares-2x2" class="w-8 h-8 text-primary-500" />
        表情包切片工具
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        上传表情包合集大图，自动按网格裁剪打包，支持 GIF 合成。
        <span class="block text-xs mt-2 opacity-75">本地安全处理，图片不会上传至服务器</span>
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <div class="lg:col-span-4 flex flex-col">
        <UCard 
          :ui="{ 
            base: 'h-full flex flex-col', 
            body: { 
              base: 'flex-1 flex flex-col', 
              padding: 'p-6' 
            } 
          }"
        >
          <template #header>
            <div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <UIcon name="i-heroicons-adjustments-horizontal" />
              网格与裁剪设置
            </div>
          </template>

          <div class="flex-1 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="列数 (宽)">
                <UInput 
                  v-model="settings.cols" 
                  type="number" 
                  :min="1" 
                  icon="i-heroicons-arrows-right-left"
                />
              </UFormField>
              <UFormField label="行数 (高)">
                <UInput 
                  v-model="settings.rows" 
                  type="number" 
                  :min="1" 
                  icon="i-heroicons-arrows-up-down"
                />
              </UFormField>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
              <div class="flex justify-between items-center mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200">去除边框 (Padding)</label>
                <UBadge color="green" variant="subtle" size="xs">{{ settings.padding }}px</UBadge>
              </div>
              
              <!-- 修复：移除不支持的 color 和 size 属性 -->
              <USlider 
                v-model="settings.padding" 
                :min="0" 
                :max="60" 
                :step="1"
              />
              
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                增加数值以向内裁剪，避开原本的分割线。
              </p>
            </div>

            <UFormField label="文件名前缀">
              <UInput v-model="settings.prefix" placeholder="例如: emoji" icon="i-heroicons-tag" />
            </UFormField>
          </div>

          <div class="mt-auto pt-8 space-y-3 border-t border-gray-100 dark:border-gray-800">
            <!-- 修复：使用 Tailwind class 强制覆盖背景色 -->
            <UButton 
              block 
              size="lg"
              color="green" 
              variant="solid"
              class="!bg-green-600 hover:!bg-green-700 text-white font-semibold shadow-lg transition-colors"
              :disabled="!hasImage || processing"
              :loading="processing && processType === 'zip'"
              @click="processAndZip"
              :label="zipButtonLabel"
              icon="i-heroicons-archive-box-arrow-down"
            />

            <div class="relative py-2">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
              <div class="relative flex justify-center"><span class="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">或生成动图</span></div>
            </div>

            <div class="flex gap-2">
              <UInput v-model="settings.gifDelay" type="number" :min="10" :step="10" class="w-24" placeholder="ms">
                <template #trailing>ms</template>
              </UInput>
              <!-- 修复：使用 Tailwind class 强制覆盖背景色 -->
              <UButton 
                block 
                class="flex-1 !bg-purple-600 hover:!bg-purple-700 text-white font-semibold shadow-lg transition-colors"
                color="purple" 
                variant="solid"
                :disabled="!hasImage || processing"
                :loading="processing && processType === 'gif'"
                @click="processAndGif"
                :label="gifButtonLabel"
                icon="i-heroicons-film"
              />
            </div>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-8 flex flex-col">
        <UCard 
          :ui="{ 
            body: { padding: 'p-0', base: 'flex-1 flex flex-col min-h-[500px]' },
            base: 'h-full flex flex-col' 
          }"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <h2 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-heroicons-eye" />
                预览确认
              </h2>
              
              <div class="flex items-center gap-2" v-if="hasImage">
                 <UButton size="xs" color="gray" variant="ghost" @click="selectAll" label="全选" icon="i-heroicons-check-circle" />
                 <UButton size="xs" color="gray" variant="ghost" @click="resetSelection" label="重置" icon="i-heroicons-x-circle" />
                 <UBadge color="gray" variant="solid">切片: {{ settings.cols * settings.rows }}</UBadge>
              </div>
            </div>
          </template>

          <div 
            class="relative flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden select-none"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <label 
              v-if="!hasImage"
              class="cursor-pointer w-full h-96 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors duration-150 ease-out group"
              :class="[
                isDragging 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <div class="upload-icon w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4 transition-transform">
                <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-primary-500" />
              </div>
              <p class="text-lg font-medium text-gray-700 dark:text-gray-200">点击或拖拽上传图片</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">支持 JPG, PNG 等常见格式</p>
              <input type="file" class="hidden" accept="image/*" @change="handleFileSelect" />
            </label>

            <div v-else class="relative shadow-2xl rounded-sm overflow-hidden" style="max-height: 700px;">
              <img ref="sourceImageRef" :src="imageUrl" class="block max-w-full h-auto max-h-[700px]" @load="onImageLoad" />
              <canvas 
                ref="gridCanvasRef" 
                class="absolute inset-0 w-full h-full cursor-pointer z-10"
                @click="handleGridClick"
              ></canvas>
            </div>
          </div>

          <template #footer>
            <div class="text-center text-xs text-gray-500 dark:text-gray-400">
               提示: <span class="text-red-500 font-bold">红色虚线</span>为网格，<span class="text-primary-500 font-bold">点击网格</span>筛选特定切片，<span class="text-green-500 font-bold">绿色</span>为选中状态。
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入类型定义
declare global {
  interface Window {
    JSZip: any;
    GIF: any;
  }
}

// SEO
useSeoMeta({
  title: '表情包切片工具',
  description: '免费在线九宫格切图与GIF生成工具，本地处理不上传服务器。',
})

// 引入 Toast
const toast = useToast()

// 状态
const settings = reactive({
  cols: 6,
  rows: 4,
  padding: 0,
  prefix: 'sticker',
  gifDelay: 100
})

const isDragging = ref(false)
const processing = ref(false)
const processType = ref<'' | 'zip' | 'gif'>('')
const imageUrl = ref('')
const sourceImageRef = ref<HTMLImageElement | null>(null)
const gridCanvasRef = ref<HTMLCanvasElement | null>(null)
const selectedIndices = ref<Set<number>>(new Set())

const originalSize = reactive({ width: 0, height: 0 })
const currentFile = ref<File | null>(null)
const gifWorkerBlobURL = ref<string | null>(null)

// 计算属性
const hasImage = computed(() => !!imageUrl.value)
const totalSlices = computed(() => settings.cols * settings.rows)
const selectedCount = computed(() => selectedIndices.value.size)

const zipButtonLabel = computed(() => {
  const count = selectedCount.value > 0 ? selectedCount.value : totalSlices.value
  return processing.value && processType.value === 'zip' 
    ? '打包中...' 
    : `下载 ZIP (${count})`
})

const gifButtonLabel = computed(() => {
  return processing.value && processType.value === 'gif'
    ? '渲染中...'
    : '生成 GIF'
})

// ----------------------------------------------------------------
// 依赖加载 (CDN)
// ----------------------------------------------------------------
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js', defer: true }
  ]
})

onMounted(() => {
  // 加载 GIF Worker
  const gifWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
  fetch(gifWorkerUrl)
    .then(resp => resp.ok ? resp.text() : Promise.reject('Worker fetch failed'))
    .then(text => {
      const blob = new Blob([text], { type: 'application/javascript' })
      gifWorkerBlobURL.value = URL.createObjectURL(blob)
    })
    .catch(err => console.warn('GIF Worker load failed:', err))

  // 监听窗口大小变化
  window.addEventListener('resize', drawGrid)
})

// ----------------------------------------------------------------
// 文件处理逻辑
// ----------------------------------------------------------------
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) processFile(input.files[0])
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.add({ title: '格式错误', description: '请上传图片文件', color: 'red' })
    return
  }
  currentFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const onImageLoad = () => {
  if (sourceImageRef.value) {
    originalSize.width = sourceImageRef.value.naturalWidth
    originalSize.height = sourceImageRef.value.naturalHeight
    selectedIndices.value.clear()
    setTimeout(drawGrid, 50)
  }
}

// ----------------------------------------------------------------
// Canvas 网格绘制与交互
// ----------------------------------------------------------------
watch([() => settings.cols, () => settings.rows, () => settings.padding], () => {
  if (settings.cols * settings.rows !== totalSlices.value) {
     selectedIndices.value.clear()
  }
  drawGrid()
})

const drawGrid = () => {
  if (!sourceImageRef.value || !gridCanvasRef.value) return

  const img = sourceImageRef.value
  const canvas = gridCanvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = img.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const cols = Number(settings.cols)
  const rows = Number(settings.rows)
  const cellW = canvas.width / cols
  const cellH = canvas.height / rows
  const scaleX = canvas.width / originalSize.width
  const displayPadding = settings.padding * scaleX

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c
      const x = c * cellW
      const y = r * cellH
      
      const padX = x + displayPadding
      const padY = y + displayPadding
      const padW = cellW - 2 * displayPadding
      const padH = cellH - 2 * displayPadding

      if (selectedIndices.value.has(index)) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)' 
        if (padW > 0 && padH > 0) ctx.fillRect(padX, padY, padW, padH)
        else ctx.fillRect(x, y, cellW, cellH)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✓', x + cellW/2, y + cellH/2)
      }

      if (settings.padding > 0 && padW > 0 && padH > 0) {
         ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)' 
         ctx.lineWidth = 1
         ctx.setLineDash([])
         ctx.strokeRect(padX, padY, padW, padH)
      }
    }
  }

  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)' 
  ctx.lineWidth = 1
  ctx.setLineDash([4, 2])
  ctx.beginPath()

  for (let i = 1; i < cols; i++) {
    const x = i * cellW
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
  }
  for (let j = 1; j < rows; j++) {
    const y = j * cellH
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
  }
  ctx.stroke()
}

const handleGridClick = (e: MouseEvent) => {
  if (!gridCanvasRef.value) return
  const rect = gridCanvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const cellW = rect.width / settings.cols
  const cellH = rect.height / settings.rows
  
  const col = Math.floor(x / cellW)
  const row = Math.floor(y / cellH)
  
  if (col >= 0 && col < settings.cols && row >= 0 && row < settings.rows) {
    const index = row * settings.cols + col
    if (selectedIndices.value.has(index)) {
      selectedIndices.value.delete(index)
    } else {
      selectedIndices.value.add(index)
    }
    drawGrid()
  }
}

const selectAll = () => {
  selectedIndices.value.clear()
  for (let i = 0; i < totalSlices.value; i++) {
    selectedIndices.value.add(i)
  }
  drawGrid()
}

const resetSelection = () => {
  selectedIndices.value.clear()
  drawGrid()
}

// ----------------------------------------------------------------
// 核心处理逻辑 (ZIP & GIF)
// ----------------------------------------------------------------
const iterateSlices = async (cb: (canvas: HTMLCanvasElement, index: number) => Promise<void>) => {
  if (!sourceImageRef.value) return 0
  const cols = Number(settings.cols)
  const rows = Number(settings.rows)
  const padding = Number(settings.padding)
  
  const cellW = originalSize.width / cols
  const cellH = originalSize.height / rows
  
  const hasSelection = selectedIndices.value.size > 0
  let count = 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c
      if (hasSelection && !selectedIndices.value.has(index)) continue

      const srcX = c * cellW + padding
      const srcY = r * cellH + padding
      const srcW = cellW - 2 * padding
      const srcH = cellH - 2 * padding

      if (srcW <= 0 || srcH <= 0) continue

      const canvas = document.createElement('canvas')
      canvas.width = srcW
      canvas.height = srcH
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(sourceImageRef.value, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH)
        await cb(canvas, index)
        count++
      }
    }
  }
  return count
}

const processAndZip = async () => {
  if (typeof window.JSZip === 'undefined') {
    toast.add({ title: '错误', description: 'JSZip 库加载失败，请刷新页面重试', color: 'red' })
    return
  }

  processing.value = true
  processType.value = 'zip'
  const zip = new window.JSZip()
  const prefix = settings.prefix || 'sticker'
  const folder = zip.folder(`${prefix}_pack`)

  try {
    const count = await iterateSlices(async (canvas, index) => {
      return new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            folder.file(`${prefix}_${String(index + 1).padStart(2, '0')}.png`, blob)
          }
          resolve()
        }, 'image/png')
      })
    })

    if (count === 0) throw new Error('没有可处理的切片')

    const content = await zip.generateAsync({ type: 'blob' })
    downloadBlob(content, `${prefix}_pack.zip`)
    toast.add({ title: '打包成功', description: `已下载 ${count} 张切片`, color: 'green', icon: 'i-heroicons-check-circle' })
    
  } catch (e: any) {
    toast.add({ title: '处理失败', description: e.message, color: 'red' })
  } finally {
    processing.value = false
    processType.value = ''
  }
}

const processAndGif = async () => {
  if (typeof window.GIF === 'undefined' || !gifWorkerBlobURL.value) {
    toast.add({ title: '错误', description: 'GIF 组件未就绪，请稍后或刷新页面', color: 'red' })
    return
  }

  processing.value = true
  processType.value = 'gif'
  
  try {
    const cols = Number(settings.cols)
    const padding = Number(settings.padding)
    const cellW = (originalSize.width / cols) - 2 * padding
    const rows = Number(settings.rows)
    const cellH = (originalSize.height / rows) - 2 * padding

    if (cellW <= 0 || cellH <= 0) throw new Error('切片尺寸无效')

    const gif = new window.GIF({
      workers: 2,
      quality: 10,
      width: cellW,
      height: cellH,
      workerScript: gifWorkerBlobURL.value
    })

    const slices: { index: number; canvas: HTMLCanvasElement }[] = []
    
    const count = await iterateSlices(async (canvas, index) => {
      slices.push({ index, canvas })
    })

    if (count === 0) throw new Error('没有可处理的切片')

    slices.sort((a, b) => a.index - b.index)
    slices.forEach(item => {
      gif.addFrame(item.canvas, { delay: settings.gifDelay })
    })

    gif.on('finished', (blob: Blob) => {
      downloadBlob(blob, `${settings.prefix || 'animation'}.gif`)
      processing.value = false
      processType.value = ''
      toast.add({ title: '生成成功', description: 'GIF 已下载', color: 'green', icon: 'i-heroicons-check-circle' })
    })

    gif.render()
  } catch (e: any) {
    toast.add({ title: '处理失败', description: e.message, color: 'red' })
    processing.value = false
    processType.value = ''
  }
}

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .group:hover .upload-icon { transform: scale(1.1); }
}
</style>