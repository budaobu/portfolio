<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <!-- Page Header -->
    <div class="mb-16">
      <div class="relative inline-block">
        <!-- Decorative accent -->
        <span class="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-16 bg-coral-500"></span>
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-warm-900 dark:text-warm-100">
          Sponsor
        </h1>
      </div>
      <p class="mt-6 text-xl text-warm-600 dark:text-warm-400 max-w-2xl leading-relaxed">
        V me 50 for KFC Crazy Thursday.
      </p>
    </div>

    <!-- Sponsor Methods Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <template v-for="method in sponsorMethods" :key="method.id">
        <!-- Link Type -->
        <NuxtLink
          v-if="method.type === 'link'"
          :to="method.url"
          target="_blank"
          class="group block focus:outline-none"
        >
          <div class="h-full bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-6 transition-colors duration-200 ease-out hover:border-coral-500/50 hover:bg-warm-100 dark:hover:bg-olive-800">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl"
                :class="method.icon.includes('K') ? 'bg-coral-100 dark:bg-coral-900/30' : 'bg-warm-200 dark:bg-warm-800'"
              >
                {{ method.icon }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-xl font-medium text-warm-900 dark:text-warm-100 group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors">
                    {{ method.title }}
                  </h3>
                  <UIcon
                    name="i-lucide-arrow-up-right"
                    class="w-4 h-4 text-warm-400 group-hover:text-coral-500 transition-colors"
                  />
                </div>
                <p class="text-warm-600 dark:text-warm-400">
                  {{ method.description }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Address or QRCode Type -->
        <div
          v-else
          class="group block focus:outline-none"
        >
          <div class="h-full bg-warm-50 dark:bg-olive-900 border border-warm-200 dark:border-warm-800 p-6 transition-colors duration-200 ease-out hover:border-coral-500/50">
            <div class="flex items-start gap-4">
              <!-- Icon: regular type -->
              <div
                v-if="method.type !== 'qrcode'"
                class="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-warm-200 dark:bg-warm-800"
              >
                {{ method.icon }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-xl font-medium text-warm-900 dark:text-warm-100">
                    {{ method.title }}
                  </h3>
                </div>

                <p class="text-warm-600 dark:text-warm-400 mb-3">
                  {{ method.description }}
                </p>

                <div v-if="method.type === 'address'" class="flex items-center gap-2">
                  <code class="flex-1 px-3 py-2 bg-warm-200 dark:bg-warm-800 rounded-sm text-sm text-warm-900 dark:text-warm-100 font-mono break-all">
                    {{ method.address }}
                  </code>
                  <UButton
                    icon="i-heroicons-clipboard-document"
                    color="gray"
                    variant="outline"
                    size="sm"
                    class="rounded-sm"
                    @click.stop="copyAddress(method.address)"
                  >
                    Copy
                  </UButton>
                </div>

                <div v-if="method.type === 'qrcode'" class="mt-4">
                  <img
                    :src="method.qrcode"
                    :alt="method.title"
                    class="w-48 h-auto rounded-sm border border-warm-200 dark:border-warm-700"
                  />
                </div>
              </div>
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
