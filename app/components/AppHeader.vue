<template>
  <header class="sticky top-0 z-50 bg-warm-50/88 dark:bg-olive-950/88 backdrop-blur-xl">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="brand-link" aria-label="Back to Home">
        <NuxtImg
          src="/avatar.webp"
          alt=""
          width="36"
          height="36"
          format="webp"
          quality="88"
          class="brand-avatar"
        />
        <span class="brand-name">Budaobu</span>
      </NuxtLink>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="seat-button"
          :class="{ 'is-active': isActive(item.path) }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          <span class="seat-back" aria-hidden="true"></span>
          <span class="seat-label">{{ item.label }}</span>
        </NuxtLink>

        <NuxtLink
          to="/sponsor"
          class="seat-button is-support"
          :aria-current="route.path.startsWith('/sponsor') ? 'page' : undefined"
        >
          <span class="seat-back" aria-hidden="true"></span>
          <span class="seat-label">Sponsor</span>
        </NuxtLink>

        <CabinWindow v-if="route.path !== '/'" size="compact" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/projects', label: 'Projects' },
  { path: '/blog', label: 'Blog' },
  { path: '/uses', label: 'Uses' }
]

const isActive = (path: string) => route.path.startsWith(path)
</script>

<style scoped>
.brand-link {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-warm-900);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  transition: transform 0.3s var(--ease-out);
}

.brand-avatar {
  flex: 0 0 auto;
  min-width: 36px;
  max-width: 36px;
  width: 36px;
  height: 36px;
  overflow: hidden;
  border: 0.5px solid var(--color-warm-50);
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 1px var(--color-warm-200);
  transition: transform 0.32s var(--ease-out);
}

@media (max-width: 639px) {
  .brand-name {
    display: none;
  }
}

html.dark .brand-avatar {
  border-color: rgba(255 255 255 / 0.14);
  box-shadow: 0 0 0 1px rgba(255 255 255 / 0.14);
}

html.dark .brand-link {
  color: var(--color-night-ink);
}

@media (hover: hover) and (pointer: fine) {
  .brand-link:hover {
    transform: translateY(-1px) scale(1.05);
  }

  .brand-link:hover .brand-avatar {
    transform: translateY(-2px) scale(1.05);
  }
}

.seat-button {
  position: relative;
  display: inline-flex;
  min-width: 58px;
  height: 35px;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--color-warm-200);
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-paper) 72%, transparent);
  padding-bottom: 8px;
  transition: border-color 0.18s var(--ease-out), background-color 0.18s var(--ease-out), transform 0.18s var(--ease-out);
}

html.dark .seat-button {
  border-color: #33312f;
  background: color-mix(in srgb, var(--color-olive-900) 74%, transparent);
}

.seat-back {
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 999px;
  background: var(--color-warm-300);
  transition: background-color 0.18s var(--ease-out), transform 0.18s var(--ease-out);
}

html.dark .seat-back {
  background: #4a4848;
}

.seat-label {
  color: var(--color-warm-600);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.09em;
  line-height: 1;
  text-transform: uppercase;
  transition: color 0.18s var(--ease-out);
}

html.dark .seat-label {
  color: var(--color-night-body);
}

@media (hover: hover) and (pointer: fine) {
  .seat-button:hover {
    border-color: var(--color-warm-300);
    background: color-mix(in srgb, var(--color-warm-100) 82%, transparent);
    transform: translateY(-1px);
  }

  .seat-button:hover .seat-back {
    transform: scale(1.04);
  }

  .seat-button:hover .seat-label {
    color: var(--color-warm-900);
  }

  html.dark .seat-button:hover {
    border-color: #39383f;
    background: color-mix(in srgb, var(--color-olive-800) 88%, transparent);
  }

  html.dark .seat-button:hover .seat-label {
    color: var(--color-night-ink);
  }
}

.seat-button.is-active {
  border-color: rgb(58 83 237 / 38%);
  background: rgb(58 83 237 / 8%);
}

.seat-button.is-active .seat-back {
  background: var(--color-route-500);
}

.seat-button.is-active .seat-label {
  color: var(--color-route-500);
}

.seat-button.is-support {
  min-width: 52px;
}

.seat-button.is-support:hover {
  border-color: rgb(232 90 63 / 42%);
}

.seat-button.is-support:hover .seat-back {
  background: var(--color-coral-500);
}

.seat-button.is-support:hover .seat-label {
  color: var(--color-coral-600);
}

.seat-button:focus-visible {
  outline: 2px solid var(--color-route-500);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .brand-link,
  .brand-avatar,
  .seat-button,
  .seat-back {
    transition: none !important;
    transform: none !important;
  }
}
</style>
