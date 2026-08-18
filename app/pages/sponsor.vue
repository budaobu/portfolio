<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
    <!-- Page Header -->
    <SectionHeading
      large
      eyebrow="Support"
      title="Sponsor"
      description="V me 50 for KFC Crazy Thursday."
    />

    <!-- Sponsor Methods List -->
    <div class="flex flex-col divide-y divide-dotted divide-warm-200 dark:divide-warm-800">
      <template v-for="method in sponsorMethods" :key="method.id">
        <!-- Link Type -->
        <NuxtLink
          v-if="method.type === 'link'"
          :to="method.url"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group flex w-[calc(100%+1.5rem)] items-center gap-3 -mx-3 px-3 py-3 rounded-lg focus:outline-none transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800"
        >
          <div class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ method.icon }}</span>
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
              {{ method.title }}
            </h3>
            <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
              {{ method.description }}
            </p>
          </div>

          <UIcon
            name="i-lucide-arrow-up-right"
            class="w-4 h-4 flex-shrink-0 text-warm-400 group-hover:text-coral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[transform,color] duration-200 ease-out"
          />
        </NuxtLink>

        <!-- Address / QRCode Type: 行点击展开详情 -->
        <div v-else>
          <button
            type="button"
            class="group flex w-[calc(100%+1.5rem)] items-center gap-3 -mx-3 px-3 py-3 rounded-lg text-left focus:outline-none transition-colors duration-150 ease-out hover:bg-warm-100 dark:hover:bg-olive-800"
            :aria-expanded="openId === method.id"
            @click="toggle(method.id)"
          >
            <div class="w-10 h-10 rounded-lg border border-warm-200 dark:border-warm-800 bg-warm-200 dark:bg-warm-800 flex items-center justify-center flex-shrink-0">
              <span v-if="method.icon" class="text-lg">{{ method.icon }}</span>
              <UIcon
                v-else
                :name="method.type === 'qrcode' ? 'i-lucide-qr-code' : 'i-lucide-wallet'"
                class="w-5 h-5 text-warm-900 dark:text-warm-100"
              />
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-medium text-warm-900 dark:text-warm-100 truncate group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors duration-150 ease-out">
                {{ method.title }}
              </h3>
              <p class="mt-0.5 text-xs text-warm-500 dark:text-warm-400 line-clamp-1">
                {{ method.description }}
              </p>
            </div>

            <UIcon
              name="i-lucide-chevron-down"
              class="w-4 h-4 flex-shrink-0 text-warm-400 group-hover:text-coral-500 transition-[transform,color] duration-200 ease-out"
              :class="{ 'rotate-180': openId === method.id }"
            />
          </button>

          <!-- Expanded Panel -->
          <div v-if="openId === method.id" class="pb-4 pl-13">
            <img
              v-if="method.type === 'qrcode'"
              :src="method.qrcode"
              :alt="method.title"
              class="w-44 h-auto rounded-lg border border-warm-200 dark:border-warm-700"
            />

            <div v-else-if="method.type === 'address'" class="flex items-center gap-2">
              <code class="flex-1 min-w-0 px-3 py-2 bg-warm-100 dark:bg-warm-800 rounded-lg text-xs text-warm-900 dark:text-warm-100 font-mono break-all">
                {{ method.address }}
              </code>
              <UButton
                icon="i-lucide-clipboard"
                color="gray"
                variant="ghost"
                size="xs"
                label="Copy"
                @click.stop="copyAddress(method.address)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

useSiteSeo('sponsor')

interface SponsorMethod {
  id: number
  type: 'link' | 'address' | 'qrcode'
  title: string
  description: string
  icon?: string
  url?: string
  address?: string
  qrcode?: string
}

const openId = ref<number | null>(null)

const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id
}

const copyAddress = async (address: string | undefined) => {
  if (!address) return

  try {
    await navigator.clipboard.writeText(address)

    toast.add({
      title: 'Copied Successfully',
      description: 'Wallet address copied to clipboard.',
      icon: 'i-lucide-check-circle',
      color: 'coral',
      timeout: 3000
    })
  } catch (err) {
    toast.add({
      title: 'Copy Failed',
      description: 'Please manually select and copy the text.',
      icon: 'i-lucide-circle-alert',
      color: 'red'
    })
  }
}
</script>
