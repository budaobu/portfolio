<template>
  <div ref="trackRef" class="flight-track">
    <div class="plan-head" aria-hidden="true">
      <span class="plan-label">Flight plan</span>
      <svg class="plan-plane" viewBox="0 0 16 15" fill="none">
        <path
          d="M8 0c.73 0 1.32 1.05 1.32 2.35v2.2l6.13 3.54c.25.14.4.4.4.69v1.1a.44.44 0 0 1-.56.42L9.32 8.5v3.06l1.9 1.33c.15.11.24.28.24.47v.79a.44.44 0 0 1-.56.42L8 13.79l-2.9.78a.44.44 0 0 1-.56-.42v-.79c0-.19.09-.36.24-.47l1.9-1.33V8.5L.71 10.3a.44.44 0 0 1-.56-.42v-1.1c0-.29.15-.55.4-.69l6.13-3.54v-2.2C6.68 1.05 7.27 0 8 0Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div ref="pathRef" class="flight-path" aria-hidden="true">
      <svg ref="curveSvgRef" class="path-curve" viewBox="0 0 44 110" fill="none">
        <path
          ref="dotsCurveRef"
          class="pc-dots"
          d="M43 0V7.3A39 39 0 0 1 21.71 42.05A39 39 0 0 0 0.5 76.75V110"
        />
        <path
          ref="litCurveRef"
          class="pc-lit"
          d="M43 0V7.3A39 39 0 0 1 21.71 42.05A39 39 0 0 0 0.5 76.75V110"
          pathLength="1"
        />
      </svg>

      <div class="path-rail">
        <div class="path-lit"></div>
      </div>

      <svg class="path-tip" viewBox="0 0 7 3" fill="none">
        <path d="M0.5 0.5 3.5 2.5 6.5 0.5" />
      </svg>
    </div>

    <ol class="flight-list">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="tl-entry item-reveal"
        :style="{ '--reveal-delay': `${Math.min(index * 60, 360)}ms` }"
      >
        <span class="tl-dot" aria-hidden="true"></span>

        <NuxtLink
          v-if="item.kind === 'blog'"
          :to="item.href"
          class="flight-item"
        >
          <span class="flight-icon">
            <UIcon name="i-lucide-book-open" class="h-4 w-4" />
          </span>
          <span class="flight-copy">
            <span class="flight-title-row">
              <h3 class="flight-title">{{ item.title }}</h3>
              <span class="flight-date">{{ item.label }}</span>
            </span>
            <span class="flight-desc">{{ item.description }}</span>
          </span>
        </NuxtLink>

        <NuxtLink
          v-else
          :to="item.href"
          :target="isExternal(item.href) ? '_blank' : undefined"
          :rel="isExternal(item.href) ? 'noopener noreferrer' : undefined"
          class="flight-item"
        >
          <span class="flight-icon">
            <img v-if="isImageIcon(item.icon)" :src="item.icon" alt="">
            <UIcon v-else-if="isIconifyIcon(item.icon)" :name="item.icon" class="h-4 w-4" />
            <span v-else class="text-base leading-none">{{ item.icon }}</span>
          </span>
          <span class="flight-copy">
            <span class="flight-title-row">
              <h3 class="flight-title">{{ item.title }}</h3>
              <span class="flight-date">{{ item.label }}</span>
            </span>
            <span class="flight-desc">{{ item.description }}</span>
          </span>
        </NuxtLink>
      </li>

      <li
        class="tl-outro item-reveal"
        :style="{ '--reveal-delay': `${Math.min(items.length * 60 + 60, 480)}ms` }"
      >
        <span class="tl-dot" aria-hidden="true"></span>

        <div class="outro-copy">
          <p class="outro-title">Thank you for flying.</p>
          <p class="outro-sub">A few placeholders between takeoff and landing.</p>
        </div>

        <CabinGallery />
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
export interface FlightItem {
  id: number | string
  kind: 'project' | 'blog'
  title: string
  description: string
  href: string
  date: string
  label: string
  icon: string
}

const props = defineProps<{
  items: FlightItem[]
}>()

const trackRef = ref<HTMLElement | null>(null)
const pathRef = ref<HTMLElement | null>(null)
const curveSvgRef = ref<SVGSVGElement | null>(null)
const dotsCurveRef = ref<SVGPathElement | null>(null)
const litCurveRef = ref<SVGPathElement | null>(null)

const isExternal = (url: string) => url.startsWith('http')
const isImageIcon = (icon: string) => icon.startsWith('http') || icon.startsWith('/')
const isIconifyIcon = (icon: string) => icon.startsWith('i-')

let currentProgress = 0
let targetProgress = 0
let renderId = 0
let dots: Array<{ el: HTMLElement, y: number }> = []

const measure = () => {
  const track = trackRef.value
  const path = pathRef.value
  if (!track || !path) return

  dots = [...track.querySelectorAll<HTMLElement>('.tl-dot')].map((el) => {
    const rect = el.getBoundingClientRect()
    return { el, y: rect.top + rect.height / 2 + window.scrollY }
  })

  const scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  targetProgress = scrollRange <= 0
    ? 1
    : Math.min(1, Math.max(0, window.scrollY / scrollRange))

  if (dotsCurveRef.value && litCurveRef.value) {
    const mobile = window.matchMedia('(max-width: 760px)').matches
    const width = mobile ? 61 : 44
    const height = mobile ? 75 : 110
    curveSvgRef.value.setAttribute('viewBox', `0 0 ${width} ${height}`)
    curveSvgRef.value.style.width = `${width}px`
    curveSvgRef.value.style.height = `${height}px`
    const path = mobile
      ? 'M60.5 0V15A30 30 0 0 1 30.5 45H30.5A30 30 0 0 0 0.5 75'
      : 'M43 0V7.3A39 39 0 0 1 21.71 42.05A39 39 0 0 0 0.5 76.75V110'
    dotsCurveRef.value.setAttribute('d', path)
    litCurveRef.value.setAttribute('d', path)
  }
}

const render = () => {
  const track = trackRef.value
  const path = pathRef.value
  if (!track || !path) {
    renderId = 0
    return
  }

  currentProgress += (targetProgress - currentProgress) * 0.12
  if (Math.abs(targetProgress - currentProgress) < 0.0002) {
    currentProgress = targetProgress
  }

  const curveLength = dotsCurveRef.value?.getTotalLength() || 118
  const railHeight = Math.max(0, track.offsetHeight)
  const travelled = currentProgress * (curveLength + railHeight)
  const curveProgress = Math.min(1, Math.max(0, travelled / curveLength))
  const railProgress = railHeight
    ? Math.min(1, Math.max(0, (travelled - curveLength) / railHeight))
    : 0

  path.style.setProperty('--curve-p', curveProgress.toFixed(4))
  path.style.setProperty('--rail-p', railProgress.toFixed(4))

  const tipDocumentY = track.getBoundingClientRect().top
    + window.scrollY
    + curveLength * curveProgress
    + railHeight * railProgress

  for (const dot of dots) {
    dot.el.classList.toggle('is-lit', dot.y <= tipDocumentY)
  }

  if (currentProgress !== targetProgress) {
    renderId = window.requestAnimationFrame(render)
    return
  }

  renderId = 0
}

const queueRender = () => {
  measure()
  if (!renderId) renderId = window.requestAnimationFrame(render)
}

onMounted(() => {
  queueRender()
  window.addEventListener('scroll', queueRender, { passive: true })
  window.addEventListener('resize', queueRender)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueRender)
  window.removeEventListener('resize', queueRender)
  if (renderId) window.cancelAnimationFrame(renderId)
})
</script>

<style scoped>
.flight-track {
  --rail-x: -21.5px;
  --curve-p: 0;
  --rail-p: 0;
  position: relative;
  margin-top: 118px;
}

.plan-head {
  position: absolute;
  left: -3px;
  top: -106px;
  width: 48px;
  text-align: center;
  color: var(--color-route-500);
}

.plan-label {
  display: block;
  font-size: 6px;
  font-weight: 500;
  line-height: 6px;
  letter-spacing: 0.127em;
  text-transform: uppercase;
}

.plan-plane {
  display: block;
  width: 16px;
  height: 15px;
  margin: 10px auto 0;
}

.flight-path {
  position: absolute;
  left: calc(var(--rail-x) - 0.5px);
  top: -65px;
  bottom: 24px;
  width: 1px;
}

.path-curve {
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  height: 110px;
  overflow: visible;
}

.pc-dots {
  stroke: var(--color-warm-300);
  stroke-width: 1;
  stroke-dasharray: 2 3.5;
  stroke-linecap: round;
}

html.dark .pc-dots {
  stroke: #39383f;
}

.pc-lit {
  stroke: var(--color-route-400);
  stroke-width: 1.25;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--curve-p));
}

.path-rail {
  position: absolute;
  top: 110px;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to bottom, var(--color-warm-300) 0 2px, transparent 2px 5.5px);
  background-size: 1px 5.5px;
}

html.dark .path-rail {
  background-image: linear-gradient(to bottom, #39383f 0 2px, transparent 2px 5.5px);
}

.path-lit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--rail-p) * 100%);
  background: var(--color-route-400);
}

.path-tip {
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 7px;
  height: 3px;
  transform: translate(-50%);
  overflow: visible;
}

.path-tip path {
  stroke: var(--color-route-500);
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.flight-list {
  display: flex;
  flex-direction: column;
  gap: 36px;
  list-style: none;
  width: 100%;
}

.tl-entry {
  position: relative;
}

.tl-dot {
  position: absolute;
  left: var(--rail-x);
  top: 50%;
  z-index: 1;
  width: 13px;
  height: 13px;
  border: 1px solid var(--color-warm-300);
  border-radius: 50%;
  background: var(--color-paper);
  transform: translate(-50%, -50%);
  transition: border-color 0.3s var(--ease-out);
}

.tl-dot::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b4b2b2;
  transform: translate(-50%, -50%);
  transition: background-color 0.3s var(--ease-out);
}

html.dark .tl-dot {
  border-color: #39383f;
  background: var(--color-night);
}

html.dark .tl-dot::after {
  background: #565454;
}

.tl-dot.is-lit {
  border-color: var(--color-route-500);
}

.tl-dot.is-lit::after {
  background: var(--color-route-500);
}

.flight-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-radius: 6px;
  transition: transform 0.3s var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .flight-item:hover {
    transform: translateY(-2px);
  }
}

.flight-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  overflow: hidden;
  border: 0.5px solid var(--color-warm-50);
  border-radius: 50%;
  background: var(--color-warm-100);
  box-shadow: 0 0 0 1px var(--color-warm-200);
  color: var(--color-warm-900);
  transition: transform 0.32s var(--ease-out);
}

.flight-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.08);
}

.flight-item:hover .flight-icon {
  transform: translateY(-3px) scale(1.05);
}

html.dark .flight-icon {
  border-color: rgba(255 255 255 / 0.14);
  background: var(--color-olive-800);
  box-shadow: 0 0 0 1px rgba(255 255 255 / 0.14);
  color: var(--color-night-ink);
}

.flight-copy {
  min-width: 0;
  flex: 1;
}

.flight-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.flight-title {
  min-width: 0;
  overflow: hidden;
  flex: 1;
  color: var(--color-warm-900);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.12px;
  line-height: 1.8;
  text-overflow: ellipsis;
  text-wrap: balance;
  white-space: nowrap;
}

html.dark .flight-title {
  color: var(--color-night-ink);
}

.flight-date {
  flex-shrink: 0;
  color: var(--color-warm-500);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}

html.dark .flight-date {
  color: var(--color-night-body);
}

.flight-desc {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 2px;
  color: var(--color-body-ink);
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.82;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

html.dark .flight-desc {
  color: var(--color-night-body);
}

.tl-outro {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 0;
}

.outro-copy {
  min-width: min(100%, 16rem);
}

.outro-title {
  color: var(--color-warm-900);
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.12px;
  line-height: 1.6;
}

.outro-sub {
  margin-top: 4px;
  color: var(--color-body-ink);
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.82;
}

html.dark .outro-title {
  color: var(--color-night-ink);
}

html.dark .outro-sub {
  color: var(--color-night-body);
}

@media (max-width: 760px) {
  .flight-track {
    --rail-x: 3.5px;
    margin-top: 108px;
  }

  .plan-head {
    left: calc(50% - 24px);
    top: -115px;
  }

  .flight-path {
    top: -74px;
  }

  .path-rail {
    top: 75px;
  }

  .tl-entry {
    padding-left: 32px;
  }

  .tl-dot {
    left: var(--rail-x);
  }

  .tl-outro {
    padding-left: 32px;
  }

  .tl-outro {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
  }

  .cabin-gallery {
    transform: scale(0.78);
    transform-origin: left center;
  }

  .flight-list {
    gap: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flight-item,
  .flight-icon,
  .tl-dot,
  .tl-dot::after {
    transition: none !important;
    transform: none !important;
  }

  .flight-item:hover .flight-icon {
    transform: none !important;
  }
}
</style>
