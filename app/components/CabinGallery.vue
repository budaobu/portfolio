<template>
  <div class="cabin-gallery" role="group" aria-label="Flight placeholder gallery" @pointerleave="activeIndex = null">
    <!-- The fanned cards are decorative placeholders; captions do not describe real photos. -->
    <span
      v-for="(card, index) in cards"
      :key="index"
      class="memory-card"
      :class="{ 'is-active': activeIndex === index }"
      :style="{ zIndex: activeIndex === index ? 10 : cards.length - index }"
      @pointerenter="activeIndex = index"
    >
      <svg viewBox="0 0 42 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient :id="`memory-${index}`" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" :stop-color="card.from" />
            <stop offset="1" :stop-color="card.to" />
          </linearGradient>
        </defs>
        <rect width="42" height="56" rx="4.4" :fill="`url(#memory-${index})`" />
        <path
          d="M12 27c-3.3 0-6-2.5-6-5.6s2.7-5.6 6-5.6c.7 0 1.4.1 2 .3C15.4 13.6 18 12 21 12c4.2 0 7.7 3 8.4 6.9 2.7.5 4.6 2.7 4.6 5.3 0 3-2.6 5.4-5.8 5.4H12Z"
          fill="rgba(255,253,251,.74)"
        />
        <path d="M9 42h24" stroke="rgba(23,22,15,.24)" stroke-width="1" stroke-linecap="round" />
        <path d="M9 47h16" stroke="rgba(23,22,15,.16)" stroke-width="1" stroke-linecap="round" />
      </svg>

      <span class="memory-tip" aria-hidden="true">{{ card.caption }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const activeIndex = ref<number | null>(null)

const cards = [
  { caption: 'Takeoff', from: '#d7e7fb', to: '#faf5f5' },
  { caption: 'Experiment 01', from: '#fde4db', to: '#faf5f5' },
  { caption: 'Cruise', from: '#dbe3fb', to: '#f4f3f0' },
  { caption: 'Night route', from: '#242322', to: '#4a4848' },
  { caption: 'Landing', from: '#f5f3f0', to: '#cbc9d6' }
]
</script>

<style scoped>
.cabin-gallery {
  position: relative;
  flex-shrink: 0;
  width: 161px;
  height: 62px;
}

.memory-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42px;
  height: 56px;
  overflow: visible;
  border: 1.234px solid var(--color-warm-50);
  border-radius: 5.65px;
  transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--r)) scale(var(--s, 1));
  box-shadow:
    0 0.6px 3.6px rgb(23 22 15 / 0.1),
    0 0.3px 0.9px rgb(23 22 15 / 0.06);
  transition: transform 0.42s var(--ease-out), box-shadow 0.42s var(--ease-out);
}

html.dark .memory-card {
  border-color: rgba(255 255 255 / 0.14);
}

.memory-card:nth-child(1) { --x: -55.8px; --y: 0.2px; --r: -7.65deg; }
.memory-card:nth-child(2) { --x: -26.1px; --y: -1.7px; --r: -3deg; }
.memory-card:nth-child(3) { --x: 0; --y: -2.1px; --r: 0deg; }
.memory-card:nth-child(4) { --x: 26.2px; --y: -1.4px; --r: 3deg; }
.memory-card:nth-child(5) { --x: 55.9px; --y: 0.2px; --r: 7.54deg; }

.memory-card.is-active {
  --y: -11px;
  --s: 1.12;
  box-shadow:
    0 6px 18px rgb(23 22 15 / 0.16),
    0 1px 3px rgb(23 22 15 / 0.08);
}

.memory-card.is-active:nth-child(1) { --r: -2.3deg; }
.memory-card.is-active:nth-child(2) { --r: -0.9deg; }
.memory-card.is-active:nth-child(3) { --r: 0deg; }
.memory-card.is-active:nth-child(4) { --r: 0.9deg; }
.memory-card.is-active:nth-child(5) { --r: 2.26deg; }

.memory-card svg {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4.4px;
}

.memory-tip {
  position: absolute;
  bottom: calc(100% + 9px);
  left: 50%;
  display: none;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgb(25 24 23 / 0.92);
  color: #fffdfb;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1.5;
  text-transform: uppercase;
  transform: translate(-50%);
  white-space: nowrap;
  pointer-events: none;
}

.memory-card.is-active .memory-tip {
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .memory-card {
    transition: none !important;
  }
}
</style>
