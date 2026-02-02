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
          v-if="!hasImage"
          ref="dropZoneRef"
          @click="triggerFileSelect"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[baseDropClass, isDragging ? dragClass : idleClass]"
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

        <!-- 状态2: 图片预览 (DOM 实时渲染水印) -->
        <div v-else class="flex flex-col gap-4 animate-fade-in">
          <div class="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm group">
            <!-- 图片容器，图片按宽度自适应 -->
            <div ref="previewWrapRef" class="w-full flex items-center justify-center p-6">
              <div ref="previewContainerRef" class="relative overflow-hidden" :style="previewContainerStyle">
                <img 
                  ref="imgRef"
                  :src="imageSrc"
                  :alt="'Preview image'"
                  class="block max-w-full h-auto object-contain"
                  @load="onImageLoad"
                />

                <!-- 覆盖层：通过绝对定位的文本元素实现水印 -->
                <div class="absolute inset-0 pointer-events-none">
                  <!-- 平铺模式：渲染多个 text 元素 -->
                  <template v-if="config.tiled">
                    <span 
                      v-for="(p, idx) in scaledTiles"
                      :key="idx"
                      class="watermark-text absolute whitespace-nowrap font-bold leading-none"
                      :style="tileStyle(p)"
                    >{{ config.text }}</span>
                  </template>

                  <!-- 单点模式：渲染单个 text 元素 -->
                  <template v-else>
                    <span 
                      v-if="singlePos"
                      class="watermark-text absolute whitespace-nowrap font-bold leading-none"
                      :style="singleStyle"
                    >{{ config.text }}</span>
                  </template>
                </div>
              </div>
            </div>

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
        
        <!-- 离屏 Canvas 仅在下载时临时创建，不放在 DOM 中 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

// SEO
useSeoMeta({
  title: '证件照加水印',
  description: '安全免费的在线证件照加水印工具，纯浏览器本地处理，支持自定义文字、颜色、透明度和位置。',
  keywords: '证件照水印, 图片加水印, 身份证水印, 安全水印工具'
})

const toast = useToast()

// --- refs & state ---
const fileInputRef = ref<HTMLInputElement | null>(null)
const dropZoneRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const previewWrapRef = ref<HTMLElement | null>(null)
const previewContainerRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)

const imageSrc = ref('')
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const displayedWidth = ref(0)
const displayedHeight = ref(0)

// measurement canvas context for text metrics
let measureCtx: CanvasRenderingContext2D | null = null

onMounted(() => {
  const c = document.createElement('canvas')
  measureCtx = c.getContext('2d')
})

// --- 配置类型与默认值 ---
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

const resetSettings = () => {
  Object.assign(config, { ...defaultConfig })
}

// --- file / drag handlers ---
const hasImage = computed(() => !!imageSrc.value)

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFiles = (fileList: FileList | null) => {
  if (!fileList || fileList.length === 0) return
  
  const file = fileList[0]
  if (!file.type.startsWith('image/')) {
    toast.add({ title: '格式错误', description: '请上传有效的图片文件', color: 'red' })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imageSrc.value = e.target?.result as string
    // image load will set natural size via onImageLoad
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

// --- preview style classes ---
const baseDropClass = 'flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[400px] shadow-sm group'
const dragClass = 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
const idleClass = 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-400'

// --- 辅助函数 ---
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

function hexToRgba(hex: string, alpha = 1) {
  // 支持 #rrggbb 与 #rgb
  let h = hex.replace('#', '')
  if (h.length === 3) {
    h = h.split('').map(ch => ch + ch).join('')
  }
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 计算基础字号与字体度量，返回 {fontSize, textWidth}
function calcFontMetrics(nw: number, cfg: WatermarkConfig) {
  const baseFontSize = Math.max(20, nw / 20)
  const scaleFactor = 0.5 + (cfg.size / 100) * 2.5
  const fontSize = baseFontSize * scaleFactor
  if (measureCtx) {
    measureCtx.font = `bold ${fontSize}px sans-serif`
    const metrics = measureCtx.measureText(cfg.text || '')
    const textWidth = metrics.width
    return { fontSize, textWidth }
  }
  // fallback
  return { fontSize, textWidth: fontSize * (cfg.text.length || 1) * 0.6 }
}

// 旋转点 (x,y) 绕原点旋转 angle (弧度)
function rotateVec(x: number, y: number, angle: number) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  }
}

// 生成平铺模式下的文本位置，返回自然像素坐标数组 [{x,y}]
function generateTilePositions(nw: number, nh: number, cfg: WatermarkConfig) {
  const { fontSize, textWidth } = calcFontMetrics(nw, cfg)
  const angle = (cfg.rotate * Math.PI) / 180

  const gapX = textWidth + fontSize * (0.5 + (cfg.gap / 100) * 4)
  const gapY = fontSize + fontSize * (0.5 + (cfg.gap / 100) * 4)

  const diag = Math.sqrt(nw * nw + nh * nh)
  const limit = diag / 2 + Math.max(gapX, gapY)

  const centerX = nw / 2
  const centerY = nh / 2

  const positions: Array<{ x: number; y: number }> = []

  for (let x = -limit; x < limit; x += gapX) {
    for (let y = -limit; y < limit; y += gapY) {
      const offsetX = (Math.floor(y / gapY) % 2 === 0) ? 0 : gapX / 2
      const vec = rotateVec(x + offsetX, y, angle)
      const px = centerX + vec.x
      const py = centerY + vec.y
      // 过滤掉完全远离画布的点
      if (px < -fontSize || px > nw + fontSize || py < -fontSize || py > nh + fontSize) continue
      positions.push({ x: px, y: py })
    }
  }

  return { positions, fontSize, angle, textWidth }
}

// 生成单点模式下的位置
function generateSinglePosition(nw: number, nh: number, cfg: WatermarkConfig) {
  const { fontSize } = calcFontMetrics(nw, cfg)
  const angle = (cfg.rotate * Math.PI) / 180
  const px = (nw * cfg.x) / 100
  const py = (nh * cfg.y) / 100
  return { x: px, y: py, fontSize, angle }
}

// --- 预览数据 (基于自然像素计算，然后缩放到显示尺寸) ---
const tilesNatural = ref<Array<{ x: number; y: number }>>([])
const tileFontSizeNatural = ref(24)
const tileAngle = ref(0)
const singleNatural = ref<{ x: number; y: number; fontSize: number; angle: number } | null>(null)

// scaled for DOM (px)
const scaledTiles = ref<Array<{ x: number; y: number }>>([])
const singlePos = ref<{ x: number; y: number; fontSize: number; angle: number } | null>(null)
const displayScale = computed(() => {
  if (!naturalWidth.value || !displayedWidth.value) return 1
  return displayedWidth.value / naturalWidth.value
})

// container style to ensure wrapper size equals image displayed size
const previewContainerStyle = computed(() => {
  // we keep container width equal to displayedWidth; height auto
  return {
    width: displayedWidth.value ? `${displayedWidth.value}px` : 'auto',
    height: displayedHeight.value ? `${displayedHeight.value}px` : 'auto'
  }
})

// compute per-element style for tiles (DOM)
function tileStyle(p: { x: number; y: number }) {
  const fs = tileFontSizeNatural.value * displayScale.value
  const transform = `translate(-50%, -50%) rotate(${(tileAngle.value * 180 / Math.PI).toFixed(2)}deg)`
  return {
    left: `${(p.x * displayScale.value).toFixed(2)}px`,
    top: `${(p.y * displayScale.value).toFixed(2)}px`,
    fontSize: `${fs.toFixed(2)}px`,
    color: hexToRgba(config.color, 1),
    opacity: `${(config.opacity / 100).toFixed(2)}`,
    transform
  }
}

// single element style
const singleStyle = computed(() => {
  if (!singlePos.value) return {}
  const fs = singlePos.value.fontSize * displayScale.value
  const transform = `translate(-50%, -50%) rotate(${(singlePos.value.angle * 180 / Math.PI).toFixed(2)}deg)`
  return {
    left: `${(singlePos.value.x * displayScale.value).toFixed(2)}px`,
    top: `${(singlePos.value.y * displayScale.value).toFixed(2)}px`,
    fontSize: `${fs.toFixed(2)}px`,
    color: hexToRgba(config.color, 1),
    opacity: `${(config.opacity / 100).toFixed(2)}`,
    transform
  }
})

// 计算自然像素与 scaled DOM 数据，使用 rAF 节流
let rafId = 0
function recomputePositions() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    if (!naturalWidth.value || !naturalHeight.value) {
      tilesNatural.value = []
      scaledTiles.value = []
      singleNatural.value = null
      singlePos.value = null
      return
    }
    if (config.tiled) {
      const res = generateTilePositions(naturalWidth.value, naturalHeight.value, config)
      tilesNatural.value = res.positions
      tileFontSizeNatural.value = res.fontSize
      tileAngle.value = res.angle
      // scaled
      scaledTiles.value = res.positions.map(p => ({ x: p.x, y: p.y }))
      // singlePos cleared
      singleNatural.value = null
      singlePos.value = null
    } else {
      const res = generateSinglePosition(naturalWidth.value, naturalHeight.value, config)
      singleNatural.value = res
      singlePos.value = { ...res }
      // clear tiles
      tilesNatural.value = []
      scaledTiles.value = []
    }
  })
}

// watch configuration and image natural size
watch([() => config.text, () => config.color, () => config.opacity, () => config.size, () => config.rotate, () => config.x, () => config.y, () => config.tiled, () => config.gap, () => naturalWidth.value, () => naturalHeight.value], () => {
  recomputePositions()
}, { deep: true })

// image load handler to capture natural size and displayed size
function onImageLoad() {
  const img = imgRef.value
  if (!img) return
  naturalWidth.value = img.naturalWidth
  naturalHeight.value = img.naturalHeight

  // measure displayed size via client bounding
  nextTick(() => {
    updateDisplayedSize()
    // attach ResizeObserver to respond to layout changes
    attachResizeObserver()
    recomputePositions()
  })
}

// get displayed size
function updateDisplayedSize() {
  const img = imgRef.value
  if (!img) return
  displayedWidth.value = img.clientWidth
  displayedHeight.value = img.clientHeight
}

// ResizeObserver to handle responsive layout
let ro: ResizeObserver | null = null
function attachResizeObserver() {
  if (!imgRef.value) return
  if (ro) {
    ro.disconnect()
    ro = null
  }
  ro = new ResizeObserver(() => {
    updateDisplayedSize()
  })
  ro.observe(imgRef.value)
}

onBeforeUnmount(() => {
  if (ro) {
    ro.disconnect()
    ro = null
  }
  cancelAnimationFrame(rafId)
})

// --- 下载：在离屏 Canvas 上绘制，与 DOM 计算使用同一套算法，保证 1:1 对齐 ---
async function downloadImage() {
  if (!naturalWidth.value || !naturalHeight.value || !imgRef.value) {
    toast.add({ title: '错误', description: '请先上传图片', color: 'red' })
    return
  }

  // 创建离屏 canvas
  const canvas = document.createElement('canvas')
  canvas.width = naturalWidth.value
  canvas.height = naturalHeight.value
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    toast.add({ title: '错误', description: 'Canvas 初始化失败', color: 'red' })
    return
  }

  // draw original image at natural size
  // 如果 imageSrc 是 dataURL，直接用 imgRef 的 natural size
  await new Promise<void>((resolve) => {
    // 如果图片已经加载完毕，直接 drawImage
    if (imgRef.value && imgRef.value.complete) {
      ctx.drawImage(imgRef.value, 0, 0, naturalWidth.value, naturalHeight.value)
      resolve()
    } else {
      // precaution
      const tmp = new Image()
      tmp.onload = () => {
        ctx.drawImage(tmp, 0, 0, naturalWidth.value, naturalHeight.value)
        resolve()
      }
      tmp.src = imageSrc.value
    }
  })

  // 绘制文本的共同设置
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillStyle = hexToRgba(config.color, config.opacity / 100)

  if (config.tiled) {
    // reuse generation on natural sizes
    const { positions, fontSize, angle } = (() => {
      const { positions, fontSize, angle } = (() => {
        const res = generateTilePositions(naturalWidth.value, naturalHeight.value, config)
        return { positions: res.positions, fontSize: res.fontSize, angle: res.angle }
      })()
      return { positions, fontSize, angle }
    })()

    ctx.save()
    // for each position, translate to px and rotate before drawing
    positions.forEach(p => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(angle)
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.fillText(config.text, 0, 0)
      ctx.restore()
    })
    ctx.restore()
  } else {
    const single = generateSinglePosition(naturalWidth.value, naturalHeight.value, config)
    ctx.save()
    ctx.translate(single.x, single.y)
    ctx.rotate(single.angle)
    ctx.font = `bold ${single.fontSize}px sans-serif`
    ctx.fillText(config.text, 0, 0)
    ctx.restore()
  }

  // 导出为 blob，触发下载
  canvas.toBlob((blob) => {
    if (!blob) {
      toast.add({ title: '错误', description: '图片导出失败', color: 'red' })
      return
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `watermarked_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.add({ title: '下载成功', description: '图片已保存到本地', color: 'green' })
  }, 'image/png')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 水印文本样式，所有变换在内联 style 中控制 */
.watermark-text {
  pointer-events: none;
  user-select: none;
  transform-origin: center center;
  white-space: nowrap;
}

/* 让文字更清晰（避免子像素模糊），在需要时可调整 */
.watermark-text {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
