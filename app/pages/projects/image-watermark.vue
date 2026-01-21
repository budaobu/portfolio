<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 头部区域 -->
    <div class="flex flex-col items-center justify-center text-center mb-12">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-12 h-12 bg-gray-900 dark:bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-md">
          <UIcon name="i-heroicons-identification" class="w-7 h-7" />
        </div>
        <h1 class="font-bold text-3xl text-gray-900 dark:text-white tracking-tight">证件照加水印</h1>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        安全、免费、浏览器本地处理 | 支持 JPG, PNG, WebP, AVIF
      </p>
    </div>

    <!-- 主体工具区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      
      <!-- 左侧:设置面板 -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-900 p-6 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm sticky top-24">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-primary-500" />
              水印设置
            </h2>
            <UButton 
              size="xs" 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-arrow-path" 
              label="重置"
              @click="resetSettings"
            />
          </div>
          
          <!-- 水印文字 -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">水印文字</label>
            <UInput 
              v-model="config.text" 
              placeholder="请输入水印文字" 
              icon="i-heroicons-pencil-square"
              class="w-full"
            />
          </div>

          <!-- 水印颜色 -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">文字颜色</label>
            <div class="flex gap-2">
              <input 
                type="color" 
                v-model="config.color" 
                class="h-9 w-12 rounded border border-gray-200 dark:border-gray-700 p-0.5 bg-white cursor-pointer"
              >
              <UInput v-model="config.color" class="flex-1" />
            </div>
          </div>

          <!-- 平铺开关 -->
          <div class="mb-5 flex items-center justify-between">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">平铺水印</label>
            <USwitch v-model="config.tiled" />
          </div>

          <!-- 滑块组 -->
          <div class="space-y-5">
            <!-- 透明度 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">透明度</label>
                <span class="text-sm font-bold text-primary-500">{{ config.opacity }}%</span>
              </div>
              <USlider 
                v-model="config.opacity" 
                :min="0" 
                :max="100"
              />
            </div>

            <!-- 大小 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">字体大小</label>
                <span class="text-sm font-bold text-primary-500">{{ config.size }}</span>
              </div>
              <USlider 
                v-model="config.size" 
                :min="1" 
                :max="100"
              />
            </div>

            <!-- 间距 (仅平铺模式) -->
            <div v-if="config.tiled">
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">水印间距</label>
                <span class="text-sm font-bold text-primary-500">{{ config.gap }}%</span>
              </div>
              <USlider 
                v-model="config.gap" 
                :min="0" 
                :max="100"
              />
            </div>

            <!-- 旋转角度 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">旋转角度</label>
                <span class="text-sm font-bold text-primary-500">{{ config.rotate }}°</span>
              </div>
              <USlider 
                v-model="config.rotate" 
                :min="-180" 
                :max="180"
              />
            </div>

            <!-- 位置 X (仅单点模式) -->
            <div v-if="!config.tiled">
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">水平位置 (X)</label>
                <span class="text-sm font-bold text-primary-500">{{ config.x }}%</span>
              </div>
              <USlider 
                v-model="config.x" 
                :min="0" 
                :max="100"
              />
            </div>

            <!-- 位置 Y (仅单点模式) -->
            <div v-if="!config.tiled">
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-300">垂直位置 (Y)</label>
                <span class="text-sm font-bold text-primary-500">{{ config.y }}%</span>
              </div>
              <USlider 
                v-model="config.y" 
                :min="0" 
                :max="100"
              />
            </div>
          </div>

        </div>
      </div>

      <!-- 右侧:上传与预览区域 -->
      <div class="lg:col-span-2 flex flex-col h-full">
        <!-- 状态1: 未上传图片 -->
        <div 
          v-if="!previewUrl"
          ref="dropZoneRef"
          @click="triggerFileSelect"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[400px] shadow-sm group',
            isDragging 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-400'
          ]"
        >
          <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <UIcon name="i-heroicons-photo" class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-bold text-gray-700 dark:text-white mb-2">点击或拖拽图片到这里</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
            支持 JPG, PNG, WebP, AVIF 格式<br>纯本地处理，保护证件隐私
          </p>
          <UButton 
            size="lg" 
            color="black" 
            class="px-8 font-bold shadow-md hover:-translate-y-0.5 transition-transform"
            label="选择图片"
          />
        </div>

        <!-- 状态2: 图片预览 -->
        <div v-else class="flex flex-col gap-4 animate-fade-in">
          <div class="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm group">
            <!-- Canvas 实际绘制结果预览 -->
            <img 
              :src="previewUrl" 
              class="w-full h-auto max-h-[70vh] object-contain mx-auto" 
              alt="Watermarked Preview"
            >
            
            <!-- 重新上传遮罩 -->
            <div 
              @click="triggerFileSelect"
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
            >
               <UButton 
                icon="i-heroicons-arrow-path"
                label="更换图片"
                color="white"
                variant="solid"
               />
            </div>
          </div>

          <div class="flex justify-end gap-3">
             <UButton 
                @click="downloadImage"
                size="lg" 
                color="primary" 
                icon="i-heroicons-arrow-down-tray" 
                label="下载处理后的图片"
                class="w-full sm:w-auto shadow-md"
              />
          </div>
        </div>

        <!-- 隐藏的文件输入框 -->
        <input 
          type="file" 
          ref="fileInputRef" 
          accept="image/*" 
          class="hidden" 
          @change="handleFileChange"
        >
        
        <!-- 隐藏的 Canvas 用于绘图 -->
        <canvas ref="canvasRef" class="hidden"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: '证件照加水印',
  description: '安全免费的在线证件照加水印工具，纯浏览器本地处理，支持自定义文字、颜色、透明度和位置。',
  keywords: '证件照水印, 图片加水印, 身份证水印, 安全水印工具'
})

const toast = useToast()

// --- 状态定义 ---
const fileInputRef = ref<HTMLInputElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDragging = ref(false)

// 原始图片对象
const originalImage = ref<HTMLImageElement | null>(null)
// 预览图 URL
const previewUrl = ref('')

// 配置项 - 明确类型
interface WatermarkConfig {
  text: string
  color: string
  opacity: number
  size: number
  rotate: number
  x: number
  y: number
  tiled: boolean
  gap: number
}

const defaultConfig: WatermarkConfig = {
  text: '仅供 xxx 验证使用',
  color: '#000000',
  opacity: 50,
  size: 50,
  rotate: 0,
  x: 50,
  y: 50,
  tiled: false,
  gap: 50
}

const config = reactive<WatermarkConfig>({ ...defaultConfig })

// --- 方法 ---

// 重置设置
const resetSettings = () => {
  Object.assign(config, { ...defaultConfig })
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// 处理文件上传
const handleFiles = (fileList: FileList | null) => {
  if (!fileList || fileList.length === 0) return
  
  const file = fileList[0]
  if (!file.type.startsWith('image/')) {
    toast.add({ title: '格式错误', description: '请上传有效的图片文件', color: 'red' })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      drawWatermark()
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
  target.value = ''
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files || null)
}

// 核心:绘制水印
const drawWatermark = () => {
  if (!originalImage.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = originalImage.value
  
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0)

  ctx.save()

  const baseFontSize = Math.max(20, img.naturalWidth / 20)
  const scaleFactor = 0.5 + (config.size / 100) * 2.5
  const fontSize = baseFontSize * scaleFactor

  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.fillStyle = config.color
  ctx.globalAlpha = config.opacity / 100
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  if (config.tiled) {
    const angle = (config.rotate * Math.PI) / 180
    
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angle)

    const textMetrics = ctx.measureText(config.text)
    const textWidth = textMetrics.width
    
    const gapX = textWidth + fontSize * (0.5 + (config.gap / 100) * 4)
    const gapY = fontSize + fontSize * (0.5 + (config.gap / 100) * 4)

    const diag = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2))
    const limit = diag / 2 + Math.max(gapX, gapY)

    for (let x = -limit; x < limit; x += gapX) {
      for (let y = -limit; y < limit; y += gapY) {
        const offsetX = (Math.floor(y / gapY) % 2 === 0) ? 0 : gapX / 2
        ctx.fillText(config.text, x + offsetX, y)
      }
    }
  } else {
    const posX = (img.naturalWidth * config.x) / 100
    const posY = (img.naturalHeight * config.y) / 100

    ctx.translate(posX, posY)
    ctx.rotate((config.rotate * Math.PI) / 180)

    ctx.fillText(config.text, 0, 0)
  }

  ctx.restore()

  previewUrl.value = canvas.toDataURL('image/jpeg', 0.95)
}

// 下载图片
const downloadImage = () => {
  if (!previewUrl.value) return
  
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = `watermarked_${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.add({ title: '下载成功', description: '图片已保存到本地', color: 'green' })
}

// 监听配置变化，实时重绘
watch(config, () => {
  if (originalImage.value) {
    requestAnimationFrame(drawWatermark)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
