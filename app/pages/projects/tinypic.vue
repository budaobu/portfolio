<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 头部区域 -->
    <div class="flex flex-col items-center justify-center text-center mb-12">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-12 h-12 bg-gray-900 dark:bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-md">
          <UIcon name="i-heroicons-photo" class="w-7 h-7" />
        </div>
        <h1 class="font-bold text-3xl text-gray-900 dark:text-white tracking-tight">极速图片压缩助手</h1>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        安全、免费、浏览器本地处理 | 支持 JPG, PNG, WebP, AVIF
      </p>
    </div>

    <!-- 主体工具区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      
      <!-- 左侧：设置面板 -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-900 p-6 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm sticky top-24">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5 text-primary-500" />
            压缩设置
          </h2>
          
          <!-- 压缩质量滑块 -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label for="quality" class="text-sm font-medium text-gray-600 dark:text-gray-300">压缩强度/画质</label>
              <span class="text-sm font-bold text-primary-500">{{ quality }}%</span>
            </div>
            <!-- Nuxt UI v4: 使用 USlider -->
            <USlider 
              v-model="quality" 
              :min="10" 
              :max="100" 
            />
            <p class="text-xs text-gray-400 mt-2">数值越小，体积越小，画质越低。</p>
          </div>

          <!-- 输出格式 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">输出格式</label>
            <!-- Nuxt UI v4: prop 变更为 items -->
            <USelect 
              v-model="outputFormat"
              :items="formatOptions"
              option-attribute="label"
              value-attribute="value"
              class="w-full"
            />
          </div>

          <!-- 最大宽度 -->
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">最大宽度 (像素)</label>
            <!-- Nuxt UI v4: prop 变更为 items -->
            <USelect 
              v-model="maxWidth"
              :items="widthOptions"
              option-attribute="label"
              value-attribute="value"
              class="w-full"
            />
          </div>
        </div>

        <!-- 统计面板 (仅在有文件时显示) -->
        <div v-if="filesQueue.length > 0" class="bg-gray-800 dark:bg-gray-950 text-white p-6 rounded-xl shadow-lg sticky top-[460px] animate-fade-in">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-gray-400 text-xs uppercase font-bold tracking-wider">总节省空间</p>
              <p class="text-2xl font-bold mt-1 text-primary-400">{{ totalSavedStr }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-400 text-xs">已处理</p>
              <p class="text-lg font-bold">{{ processedCount }} / {{ filesQueue.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：上传区域与列表 -->
      <div class="lg:col-span-2 flex flex-col h-full">
        <!-- 上传区域 -->
        <div 
          ref="dropZoneRef"
          @click="triggerFileSelect"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[260px] shadow-sm group',
            isDragging 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-400'
          ]"
        >
          <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-bold text-gray-700 dark:text-white mb-2">点击或拖拽图片到这里</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
            支持 JPG, PNG, WebP, AVIF, BMP 等格式<br>(单次最多 {{ MAX_FILES }} 张)
          </p>
          <UButton 
            size="lg" 
            color="black" 
            class="px-8 font-bold shadow-md hover:-translate-y-0.5 transition-transform"
            label="选择图片"
          />
          <input 
            type="file" 
            ref="fileInputRef" 
            multiple 
            accept="image/*" 
            class="hidden" 
            @change="handleFileChange"
          >
        </div>

        <!-- 文件列表区域 -->
        <div v-if="filesQueue.length > 0" class="mt-8 animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
              压缩列表
            </h3>
            
            <div class="flex gap-3">
              <UButton 
                variant="ghost" 
                color="red" 
                icon="i-heroicons-trash" 
                label="重置" 
                size="xs"
                @click="resetAll"
              />
              <UButton 
                v-if="processedCount > 0"
                color="primary" 
                icon="i-heroicons-archive-box-arrow-down" 
                label="打包下载全部" 
                size="xs"
                :loading="isZipping"
                @click="downloadAllAsZip"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="file in filesQueue" 
              :key="file.id"
              class="bg-white dark:bg-gray-900 p-4 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm flex items-center gap-4 relative overflow-hidden animate-slide-up"
            >
              <!-- 预览图 -->
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-inner">
                <img :src="file.previewUrl" class="w-full h-full object-cover" :alt="file.original.name">
              </div>

              <!-- 信息区 -->
              <div class="flex-1 min-w-0 z-10">
                <div class="flex justify-between items-start">
                  <h4 class="font-medium text-gray-800 dark:text-gray-200 truncate pr-2 text-sm" :title="file.original.name">
                    {{ file.original.name }}
                  </h4>
                  <button @click="removeFile(file.id)" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                  </button>
                </div>
                
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    {{ formatSize(file.originalSize) }}
                  </span>
                  <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 text-gray-300" />
                  <span :class="file.status === 'error' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200 font-bold'">
                    {{ file.statusMsg }}
                  </span>
                  <span 
                    v-if="file.badgeText" 
                    class="px-2 py-0.5 rounded text-[10px] font-bold border"
                    :class="file.badgeClass"
                  >
                    {{ file.badgeText }}
                  </span>
                </div>

                <!-- 进度条 -->
                <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="file.status === 'error' ? 'bg-red-500' : (file.status === 'done' ? 'bg-green-500' : 'bg-primary-500')"
                    :style="{ width: file.progress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- 下载按钮 (单独) -->
              <div v-if="file.status === 'done'" class="ml-2 z-10">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  color="gray"
                  variant="ghost"
                  class="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600"
                  @click="downloadSingleFile(file)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入 Toast
const toast = useToast()

// SEO 信息
useSeoMeta({
  title: '图片压缩助手',
  description: '免费在线图片压缩工具，支持 JPG, PNG, WebP, AVIF 格式。浏览器本地压缩，无需上传服务器，保护隐私。',
  keywords: '图片压缩, 在线压缩, PNG压缩, JPG压缩, webp转换'
})

// 动态加载外部 CDN 脚本 (保持原项目逻辑)
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/upng-js/2.1.0/UPNG.min.js', defer: true }
  ]
})

// --- 类型定义 ---
interface FileItem {
  id: string
  original: File
  originalSize: number
  compressedBlob: Blob | null
  finalMimeType: string
  status: 'pending' | 'processing' | 'done' | 'error'
  progress: number
  statusMsg: string
  badgeText?: string
  badgeClass?: string
  previewUrl: string
}

// --- 状态变量 ---
const MAX_FILES = 20
const isDragging = ref(false)
const isZipping = ref(false)
const filesQueue = ref<FileItem[]>([])

// 设置项
const quality = ref(80)
const outputFormat = ref('original')
const maxWidth = ref(0)

const dropZoneRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// 选项配置
const formatOptions = [
  { label: '保持原图格式 (默认)', value: 'original' },
  { label: 'JPG (推荐, 兼容性好)', value: 'image/jpeg' },
  { label: 'WebP (体积最小)', value: 'image/webp' },
  { label: 'AVIF (最新格式, 高压缩)', value: 'image/avif' },
  { label: 'PNG (类似 TinyPNG)', value: 'image/png' }
]

const widthOptions = [
  { label: '保持原图尺寸', value: 0 },
  { label: '1920px (1080p)', value: 1920 },
  { label: '1280px (720p)', value: 1280 },
  { label: '800px (网页通用)', value: 800 }
]

// --- 计算属性 ---
const processedCount = computed(() => filesQueue.value.filter(f => f.status === 'done').length)

const totalSavedStr = computed(() => {
  let totalOrig = 0
  let totalComp = 0
  filesQueue.value.filter(f => f.status === 'done').forEach(f => {
    totalOrig += f.originalSize
    if (f.compressedBlob) {
      totalComp += f.compressedBlob.size
    }
  })
  const saved = Math.max(0, totalOrig - totalComp)
  return formatSize(saved)
})

// --- 方法 ---

// 触发文件选择
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// 处理文件输入变化
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
  // 清空 input，允许重复选择同一文件
  target.value = ''
}

// 处理拖放
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    addFiles(Array.from(e.dataTransfer.files))
  }
}

// 添加文件到队列
const addFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length === 0) {
    toast.add({ title: '格式错误', description: '请上传有效的图片文件', color: 'red' })
    return
  }

  if (filesQueue.value.length + imageFiles.length > MAX_FILES) {
    toast.add({ title: '数量限制', description: `一次最多只能处理 ${MAX_FILES} 张图片`, color: 'orange' })
    const remainingSlots = MAX_FILES - filesQueue.value.length
    if (remainingSlots <= 0) return
    imageFiles.splice(remainingSlots)
  }

  imageFiles.forEach(file => {
    const id = Math.random().toString(36).substr(2, 9)
    const fileItem: FileItem = reactive({
      id,
      original: file,
      originalSize: file.size,
      compressedBlob: null,
      finalMimeType: '',
      status: 'pending',
      progress: 0,
      statusMsg: '等待处理...',
      previewUrl: URL.createObjectURL(file)
    })
    
    filesQueue.value.push(fileItem)
    processImage(fileItem)
  })
}

// 核心：图片处理逻辑
const processImage = async (fileItem: FileItem) => {
  fileItem.status = 'processing'
  fileItem.progress = 10
  fileItem.statusMsg = '读取中...'

  // 获取设置值
  const qualityVal = quality.value / 100
  let targetFormat = outputFormat.value
  const targetWidth = Number(maxWidth.value)

  if (targetFormat === 'original') {
    targetFormat = fileItem.original.type || 'image/jpeg'
  }

  try {
    const img = new Image()
    img.src = fileItem.previewUrl
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    fileItem.progress = 40
    fileItem.statusMsg = '压缩中...'

    // 尺寸计算
    let w = img.naturalWidth
    let h = img.naturalHeight
    let isResized = false

    if (targetWidth > 0 && w > targetWidth) {
      h = (h * targetWidth) / w
      w = targetWidth
      isResized = true
    }

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Canvas Context Failed')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // 处理背景：JPG需要白底
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, w, h)
    }

    ctx.drawImage(img, 0, 0, w, h)

    // 处理逻辑分支
    const finishProcessing = (blob: Blob) => {
      // 检查是否变大 (如果格式相同且未调整尺寸，结果却变大，则使用原图)
      const isSameFormat = fileItem.original.type === blob.type
      let finalBlob = blob
      let isReverted = false

      if (blob.size > fileItem.originalSize && isSameFormat && !isResized) {
        finalBlob = fileItem.original
        isReverted = true
      }

      fileItem.compressedBlob = finalBlob
      fileItem.finalMimeType = finalBlob.type
      fileItem.status = 'done'
      fileItem.progress = 100
      fileItem.statusMsg = formatSize(finalBlob.size)

      // 徽标状态
      const reduction = ((fileItem.originalSize - finalBlob.size) / fileItem.originalSize * 100).toFixed(0)
      const isLarger = finalBlob.size > fileItem.originalSize

      if (isReverted) {
        fileItem.badgeText = '未压缩'
        fileItem.badgeClass = 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
      } else if (!isLarger) {
        fileItem.badgeText = `-${reduction}%`
        fileItem.badgeClass = 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
      } else {
        fileItem.badgeText = '变大'
        fileItem.badgeClass = 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      }
    }

    // 1. 特殊处理 PNG (使用 UPNG.js)
    if (targetFormat === 'image/png') {
      // 确保 UPNG 已加载
      if (typeof (window as any).UPNG === 'undefined') {
        throw new Error('UPNG.js 尚未加载完成，请刷新页面')
      }

      const d = ctx.getImageData(0, 0, w, h).data
      // UPNG 质量参数转换
      let cnum = Math.floor(quality.value * 2.56)
      if (cnum < 16) cnum = 16
      if (cnum > 256) cnum = 256

      // 使用 setTimeout 让出主线程，避免 UI 卡死
      setTimeout(() => {
        try {
          const UPNG = (window as any).UPNG
          const pngBuffer = UPNG.encode([d.buffer], w, h, cnum)
          const pngBlob = new Blob([pngBuffer], { type: 'image/png' })
          finishProcessing(pngBlob)
        } catch (e) {
          console.error(e)
          handleError(fileItem, '编码失败')
        }
      }, 50)
    } 
    // 2. 标准 Canvas 处理 (JPG, WebP)
    else {
      canvas.toBlob((blob) => {
        if (!blob) {
          handleError(fileItem, '生成失败')
          return
        }
        finishProcessing(blob)
      }, targetFormat, qualityVal)
    }

  } catch (err) {
    console.error(err)
    handleError(fileItem, '格式错误')
  }
}

const handleError = (fileItem: FileItem, msg: string) => {
  fileItem.status = 'error'
  fileItem.statusMsg = msg
  fileItem.progress = 100
}

const removeFile = (id: string) => {
  const index = filesQueue.value.findIndex(f => f.id === id)
  if (index > -1) {
    URL.revokeObjectURL(filesQueue.value[index].previewUrl)
    filesQueue.value.splice(index, 1)
  }
}

const resetAll = () => {
  filesQueue.value.forEach(f => URL.revokeObjectURL(f.previewUrl))
  filesQueue.value = []
  if (fileInputRef.value) fileInputRef.value.value = ''
  toast.add({ title: '已重置', description: '所有文件已清空', color: 'gray' })
}

// 下载单个文件
const downloadSingleFile = (file: FileItem) => {
  if (!file.compressedBlob) return
  const url = URL.createObjectURL(file.compressedBlob)
  const link = document.createElement('a')
  link.href = url
  
  const ext = getExtensionFromMime(file.finalMimeType)
  const originalName = file.original.name
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))
  link.download = `${nameWithoutExt}_min.${ext}`
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 打包下载
const downloadAllAsZip = async () => {
  const doneFiles = filesQueue.value.filter(f => f.status === 'done')
  if (doneFiles.length === 0) return
  
  if (typeof (window as any).JSZip === 'undefined') {
    toast.add({ title: '组件未加载', description: 'JSZip 尚未加载，请稍后重试', color: 'red' })
    return
  }

  isZipping.value = true
  try {
    const JSZip = (window as any).JSZip
    const zip = new JSZip()
    const folder = zip.folder("compressed_images")
    
    doneFiles.forEach(f => {
      if (f.compressedBlob) {
        const ext = getExtensionFromMime(f.finalMimeType)
        const nameWithoutExt = f.original.name.substring(0, f.original.name.lastIndexOf('.'))
        folder.file(`${nameWithoutExt}_min.${ext}`, f.compressedBlob)
      }
    })

    const content = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = "images_compressed.zip"
    link.click()
    URL.revokeObjectURL(url)
    
    toast.add({ title: '下载开始', description: '压缩包已生成', color: 'green' })
  } catch (e) {
    console.error(e)
    toast.add({ title: '打包失败', description: '生成压缩包时出错', color: 'red' })
  } finally {
    isZipping.value = false
  }
}

// 工具函数
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getExtensionFromMime = (mimeType: string) => {
  switch(mimeType) {
    case 'image/jpeg': return 'jpg'
    case 'image/png': return 'png'
    case 'image/webp': return 'webp'
    case 'image/avif': return 'avif'
    case 'image/bmp': return 'bmp'
    default: return 'jpg'
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>