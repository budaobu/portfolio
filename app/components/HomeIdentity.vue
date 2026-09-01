<template>
  <aside class="home-identity" aria-label="Cabin identity">
    <div class="identity-inner">
      <span class="identity-rail" aria-hidden="true"></span>

      <div class="label-tag identity-lines text-warm-500 dark:text-warm-400">
        <p class="text-warm-900 dark:text-warm-100">Budaobu</p>
        <p>LAKESHIRE</p>
        <p>26.4, 411.4</p>
        <p>GMT +8</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.home-identity {
  width: min(100%, 64rem);
  margin-inline: auto;
  padding: 1rem;
  margin-bottom: 2rem;
}

.identity-inner {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 22px;
  margin-bottom: 0;
}

.identity-rail {
  align-self: stretch;
  width: 8px;
  flex-shrink: 0;
  background-image: radial-gradient(circle at 0.8px 0.8px, #cbc9d6 0.8px, transparent 0.9px);
  background-size: 3.2px 3.6px;
}

html.dark .identity-rail {
  background-image: radial-gradient(circle at 0.8px 0.8px, #33312f 0.8px, transparent 0.9px);
}

.identity-lines {
  padding: 12px 0;
  white-space: nowrap;
}

@media (min-width: 1220px) {
  .home-identity {
    position: fixed;
    top: 72px;
    left: clamp(24px, calc((100vw - 40rem) / 2 - 306px), 72px);
    z-index: 30;
    width: auto;
    margin: 0;
    padding: 0;
  }

  .identity-inner {
    justify-content: flex-start;
  }

  .identity-lines {
    padding: 8px 0;
  }
}
</style>
