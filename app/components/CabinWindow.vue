<template>
  <button
    ref="rootRef"
    type="button"
    class="cabin-window"
    :class="[sizeClass, { 'is-dragging': isDragging, 'is-ready': initialized }]"
    role="slider"
    aria-orientation="vertical"
    aria-label="Toggle cabin lights"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="ariaValue"
    :aria-valuetext="ariaText"
    @click="handleClick"
    @keydown.down.prevent="setTarget(1)"
    @keydown.right.prevent="setTarget(1)"
    @keydown.up.prevent="setTarget(0)"
    @keydown.left.prevent="setTarget(0)"
    @pointerdown="startDrag"
    @pointermove="moveDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <span ref="shadeRef" class="window-stage" :style="shadeStyle" aria-hidden="true">
      <span class="sky-clip">
        <span class="sky-day">
          <canvas ref="sceneCanvasRef" class="scene-canvas"></canvas>
          <span class="cloud-floor"></span>
        </span>

        <span class="sky-night">
          <span class="star star-1"></span>
          <span class="star star-2"></span>
          <span class="star star-3"></span>
          <span class="moon"></span>
        </span>
      </span>

      <img class="material material-back" src="/cabin/window-back.webp" alt="" draggable="false">

      <span class="glass-clip">
        <img
          class="material material-shutter"
          src="/cabin/window-shutter.webp"
          alt=""
          draggable="false"
        >
        <span class="shutter-shadow"></span>
      </span>

      <img class="material material-front" src="/cabin/window-front.webp" alt="" draggable="false">
      <span class="front-tint"></span>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  size?: 'large' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'compact'
})

const colorMode = useColorMode()
const rootRef = ref<HTMLButtonElement | null>(null)
const shadeRef = ref<HTMLElement | null>(null)
const sceneCanvasRef = ref<HTMLCanvasElement | null>(null)

const initialized = ref(false)
const progress = ref(0)
const isDragging = ref(false)
const reducedMotion = ref(false)

const dragStartY = ref(0)
const dragStartProgress = ref(0)
const activePointerId = ref<number | null>(null)
const samples = ref<Array<{ at: number, value: number }>>([])
const animationId = ref(0)

let sceneFrame = 0
let sceneReady = false
let sceneSprites: Array<{
  image: CanvasImageSource
  x: number
  y: number
  width: number
  height: number
  speed: number
  alpha: number
  phase: number
  drift: number
  blur: string
}> = []

const sizeClass = computed(() => props.size === 'large' ? 'is-large' : 'is-compact')
const isDark = computed(() => colorMode.value === 'dark')
const ariaValue = computed(() => Math.round(progress.value * 100))
const ariaText = computed(() => progress.value >= 0.5
  ? 'Cabin lights covered'
  : 'Cabin lights open')

const shadeStyle = computed(() => initialized.value
  ? { '--shade-progress': String(progress.value) }
  : undefined)

const setTheme = (target: 'light' | 'dark') => {
  if (colorMode.preference !== target) {
    colorMode.preference = target
  }
}

const syncThemeForProgress = (value: number) => {
  if (value >= 0.62) setTheme('dark')
  else if (value <= 0.34) setTheme('light')
}

const stopAnimation = () => {
  if (animationId.value) {
    window.cancelAnimationFrame(animationId.value)
    animationId.value = 0
  }
}

const stopScene = () => {
  if (sceneFrame) {
    window.cancelAnimationFrame(sceneFrame)
    sceneFrame = 0
  }
}

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.decoding = 'async'
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error(`Unable to load ${src}`))
  image.src = src
})

const random = (min: number, max: number) => min + Math.random() * (max - min)

const createSprites = (cloud: HTMLImageElement, cirrus: HTMLImageElement) => {
  const sprites: typeof sceneSprites = []

  for (let i = 0; i < 6; i++) {
    const width = random(480, 760)
    sprites.push({
      image: cirrus,
      x: random(-220, 400),
      y: random(58, 185),
      width,
      height: width * 0.42,
      speed: random(1.5, 4),
      alpha: random(0.13, 0.32),
      phase: random(0, Math.PI * 2),
      drift: random(1, 3),
      blur: 'blur(2.5px)'
    })
  }

  const groups = [
    { count: 5, y: [175, 250], width: [165, 285], speed: [8, 17], alpha: [0.24, 0.42], blur: 'blur(1.5px)' },
    { count: 4, y: [255, 340], width: [210, 360], speed: [19, 34], alpha: [0.34, 0.54], blur: 'blur(0.5px)' },
    { count: 4, y: [350, 470], width: [245, 425], speed: [42, 68], alpha: [0.5, 0.72], blur: 'none' }
  ]

  for (const group of groups) {
    for (let i = 0; i < group.count; i++) {
      const width = random(group.width[0], group.width[1])
      sprites.push({
        image: cloud,
        x: random(-260, 400),
        y: random(group.y[0], group.y[1]),
        width,
        height: width,
        speed: random(group.speed[0], group.speed[1]),
        alpha: random(group.alpha[0], group.alpha[1]),
        phase: random(0, Math.PI * 2),
        drift: random(2, 7),
        blur: group.blur
      })
    }
  }

  return sprites.sort((a, b) => (a.width + a.y) - (b.width + b.y))
}

const drawScene = (elapsed: number) => {
  const canvas = sceneCanvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context || !sceneReady) return

  context.clearRect(0, 0, 400, 600)

  for (const sprite of sceneSprites) {
    const y = sprite.y + Math.sin(elapsed * 0.24 + sprite.phase) * sprite.drift
    context.save()
    context.globalAlpha = sprite.alpha
    if (sprite.blur !== 'none') context.filter = sprite.blur
    context.drawImage(sprite.image, sprite.x, y, sprite.width, sprite.height)
    context.restore()

    sprite.x -= sprite.speed * elapsed
    if (sprite.x + sprite.width < -40) {
      sprite.x = 400 + random(30, 190)
      sprite.y = Math.max(42, sprite.y + random(-32, 32))
    }
  }
}

const startScene = async () => {
  const canvas = sceneCanvasRef.value
  if (!canvas) return

  try {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = 400 * dpr
    canvas.height = 600 * dpr
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
    const [cloud, cirrus] = await Promise.all([
      loadImage('/cabin/cloud.png'),
      loadImage('/cabin/CirrusCloud.png')
    ])
    sceneSprites = createSprites(cloud, cirrus)
    sceneReady = true

    const shouldAnimate = props.size === 'large'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!shouldAnimate) {
      drawScene(2.8)
      return
    }

    let previous = performance.now()
    const loop = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000, 1 / 30)
      previous = now
      drawScene(elapsed)
      sceneFrame = window.requestAnimationFrame(loop)
    }
    sceneFrame = window.requestAnimationFrame(loop)
  } catch {
    sceneReady = false
  }
}

const animateTo = (target: 0 | 1, initialVelocity = 0) => {
  stopAnimation()
  setTheme(target === 1 ? 'dark' : 'light')

  if (reducedMotion.value) {
    progress.value = target
    return
  }

  let current = progress.value
  let velocity = initialVelocity
  let previous = performance.now()

  const step = (now: number) => {
    const elapsed = Math.min((now - previous) / 1000, 1 / 30)
    previous = now
    const acceleration = 190 * (target - current) - 26 * velocity
    velocity += acceleration * elapsed
    current += velocity * elapsed

    if (Math.abs(velocity) < 0.002 && Math.abs(target - current) < 0.001) {
      progress.value = target
      animationId.value = 0
      return
    }

    progress.value = Math.max(0, Math.min(1, current))
    animationId.value = window.requestAnimationFrame(step)
  }

  animationId.value = window.requestAnimationFrame(step)
}

const setTarget = (target: 0 | 1) => {
  isDragging.value = false
  animateTo(target)
}

const toggleTheme = () => {
  setTarget(isDark.value ? 0 : 1)
}

const handleClick = (event: MouseEvent) => {
  if (props.size === 'large' && event.detail > 0 && !reducedMotion.value) return
  toggleTheme()
}

const releasePointer = () => {
  if (activePointerId.value === null || !rootRef.value) return
  const pointerId = activePointerId.value
  if (rootRef.value.hasPointerCapture(pointerId)) {
    rootRef.value.releasePointerCapture(pointerId)
  }
  activePointerId.value = null
}

const currentVelocity = (now: number) => {
  const recent = samples.value.filter(sample => now - sample.at < 100)
  const first = recent[0] ?? { at: now - 1, value: progress.value }
  const elapsed = Math.max(16, now - first.at)
  return (progress.value - first.value) / elapsed
}

const settleDrag = (target: 0 | 1, velocity = 0) => {
  if (!isDragging.value) return

  isDragging.value = false
  releasePointer()
  animateTo(target, velocity)
}

const startDrag = (event: PointerEvent) => {
  if (props.size !== 'large' || reducedMotion.value || event.button !== 0) return
  if (!shadeRef.value || activePointerId.value !== null) return

  const shadeRect = shadeRef.value.getBoundingClientRect()
  const pointerInShade = event.clientX >= shadeRect.left
    && event.clientX <= shadeRect.right
    && event.clientY >= shadeRect.top
    && event.clientY <= shadeRect.bottom
  if (!pointerInShade) return

  stopAnimation()
  activePointerId.value = event.pointerId
  event.currentTarget.setPointerCapture(event.pointerId)

  dragStartY.value = event.clientY
  dragStartProgress.value = progress.value
  progress.value = dragStartProgress.value
  isDragging.value = true
  samples.value = [{ at: performance.now(), value: dragStartProgress.value }]
}

const moveDrag = (event: PointerEvent) => {
  if (!isDragging.value || event.pointerId !== activePointerId.value || !shadeRef.value) return

  const travel = 171
  const next = Math.max(0, Math.min(1,
    dragStartProgress.value + ((event.clientY - dragStartY.value) / travel)
  ))
  const now = performance.now()
  progress.value = next
  syncThemeForProgress(progress.value)

  samples.value.push({ at: now, value: progress.value })
  samples.value = samples.value.filter(sample => now - sample.at < 100)

  const crossedToDark = dragStartProgress.value < 0.5 && next >= 0.5
  const crossedToLight = dragStartProgress.value > 0.5 && next <= 0.5

  if (crossedToDark) settleDrag(1, currentVelocity(now))
  else if (crossedToLight) settleDrag(0, currentVelocity(now))
}

const endDrag = (event: PointerEvent) => {
  if (!isDragging.value || event.pointerId !== activePointerId.value) return
  settleDrag(progress.value >= 0.5 ? 1 : 0, currentVelocity(performance.now()))
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  progress.value = isDark.value ? 1 : 0
  initialized.value = true
  void startScene()
})

onBeforeUnmount(() => {
  stopAnimation()
  stopScene()
  if (activePointerId.value !== null) {
    rootRef.value?.releasePointerCapture(activePointerId.value)
    activePointerId.value = null
  }
})
</script>

<style scoped>
.cabin-window {
  --shade-progress: var(--cabin-initial, 0);
  position: relative;
  display: block;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: grab;
  isolation: isolate;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.cabin-window.is-large {
  width: 200px;
  height: 300px;
}

.cabin-window.is-compact {
  width: 28px;
  height: 42px;
  cursor: pointer;
  touch-action: manipulation;
}

.window-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 300px;
  transform-origin: top left;
  pointer-events: none;
}

.cabin-window.is-compact .window-stage {
  transform: scale(0.14);
}

.cabin-window.is-dragging {
  cursor: grabbing;
}

.sky-clip,
.glass-clip {
  position: absolute;
  overflow: hidden;
  pointer-events: none;
}

.sky-clip {
  inset: 19.667% 19.5% 27.222% 19.333%;
  clip-path: inset(0 round 50.667px);
  background: linear-gradient(to bottom, #5cadf4 0%, #94ccfb 33%, #c8e6fb 45%, #ffffff 50%);
}

.scene-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cloud-floor {
  position: absolute;
  inset: 64% 0 0;
  background: linear-gradient(to bottom, rgb(255 255 255 / 0) 0%, #ffffff 70%);
}

.sky-night {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(40% 24% at 68% 64%, #33353b 0%, transparent 68%),
    linear-gradient(180deg, #101521 0%, #1b2028 58%, #232527 100%);
  opacity: calc(var(--shade-progress, 0) * 0.92);
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #fffdfb;
  opacity: 0.72;
  box-shadow: 0 0 3px #fffdfb;
}

.star-1 { left: 24%; top: 20%; }
.star-2 { left: 60%; top: 13%; width: 1px; height: 1px; }
.star-3 { left: 44%; top: 32%; width: 1px; height: 1px; opacity: 0.48; }

.moon {
  position: absolute;
  right: 22%;
  top: 14%;
  width: 14%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 34%, #fffdfb 0%, #e4ded8 68%);
  opacity: 0.76;
}

.material {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.material-back {
  filter: brightness(calc(1 - var(--shade-progress, 0) * 0.86));
}

.material-shutter {
  filter: brightness(calc(1 - var(--shade-progress, 0) * 0.82));
  transform: translate3d(0, calc((1 - var(--shade-progress, 0)) * -57%), 0);
  will-change: transform;
}

.material-front {
  filter: brightness(calc(1 - var(--shade-progress, 0) * 0.8));
}

.glass-clip {
  inset: 0;
  clip-path: inset(14% 12.333% 19.778% 12.167% round 58.667px);
}

.shutter-shadow {
  position: absolute;
  top: 44px;
  left: 26.333px;
  width: 147px;
  height: 195px;
  border-radius: 56.667px;
  pointer-events: none;
  box-shadow:
    inset 0 0 11px rgb(28 25 22 / 0.42),
    inset 0 0 3px rgb(28 25 22 / 0.3);
  mask-image: url('/cabin/window-shutter.webp');
  mask-size: 200px 300px;
  mask-repeat: no-repeat;
  mask-position: -26.333px calc(-44px - (1 - var(--shade-progress, 0)) * 171px);
  -webkit-mask-image: url('/cabin/window-shutter.webp');
  -webkit-mask-size: 200px 300px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: -26.333px calc(-44px - (1 - var(--shade-progress, 0)) * 171px);
}

.front-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #6a6e78 0%, #878b95 38%, #a2a7ae 100%);
  mask-image: url('/cabin/window-front.webp');
  mask-size: cover;
  mask-repeat: no-repeat;
  -webkit-mask-image: url('/cabin/window-front.webp');
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  mix-blend-mode: multiply;
  opacity: calc(var(--shade-progress, 0) * 0.55);
  pointer-events: none;
}

.cabin-window:focus-visible {
  outline: 2px solid #3a53ed;
  outline-offset: 3px;
  border-radius: 24px;
}

@media (prefers-reduced-motion: reduce) {
  .cabin-window,
  .material-shutter,
  .scene-canvas {
    transition: none !important;
    animation: none !important;
  }
}
</style>
