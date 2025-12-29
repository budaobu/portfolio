<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-primary-500">|</span>
        Sponsor
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
        V me 50 for KFC Crazy Thursday.
      </p>
    </div>

    <div class="space-y-6">
      <template v-for="method in sponsorMethods" :key="method.id">
        <!-- 
          方案修正：
          不再使用 <component :is="...">，而是显式拆分为两个分支。
          分支 1: 链接类型 -> 使用 <NuxtLink>，确保生成正确的 <a> 标签和跳转行为。
        -->
        <NuxtLink
          v-if="method.type === 'link'"
          :to="method.url"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="group block text-left focus:outline-none cursor-pointer"
        >
          <UCard
            :ui="{
              body: { padding: 'p-6' },
              base: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
            }"
          >
            <div class="flex items-start gap-4">
              <!-- 图标：Link 类型有 hover 放大效果 -->
              <div 
                class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform duration-300"
              >
                {{ method.icon }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ method.title }}
                  </h3>
                  <UIcon 
                    name="i-lucide:circle-arrow-out-up-right"
                    class="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                  />
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-3">
                  {{ method.description }}
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <!-- 分支 2: 非链接类型 (如二维码、地址) -> 使用 <div> -->
        <div
          v-else
          class="group block text-left focus:outline-none"
        >
          <UCard :ui="{ body: { padding: 'p-6' } }">
            <div class="flex items-start gap-4">
              <!-- 图标：普通类型无特殊交互 -->
              <div 
                v-if="method.type !== 'qrcode'"
                class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-800"
              >
                {{ method.icon }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ method.title }}
                  </h3>
                </div>

                <p class="text-gray-600 dark:text-gray-400 mb-3">
                  {{ method.description }}
                </p>

                <div v-if="method.type === 'address'" class="flex items-center gap-2">
                  <code class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-900 dark:text-white font-mono break-all">
                    {{ method.address }}
                  </code>
                  <UButton
                    icon="i-heroicons-clipboard-document"
                    color="gray"
                    variant="soft"
                    size="sm"
                    @click.stop="copyAddress(method.address)"
                  >
                    Copy
                  </UButton>
                </div>

                <div v-if="method.type === 'qrcode'" class="mt-4">
                  <img
                    :src="method.qrcode"
                    :alt="method.title"
                    class="w-48 h-full rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入 Toast 组合式函数
const toast = useToast()

// SEO 优化
useSeoMeta({
  title: 'Sponsor, Fuel the AI-Stitched Chaos, Donate',
  description: 'Support Budaobu\'s AI-stitched experiments. Stitching code together is exhausting work (even with AI). If it happens to be Thursday, please V me 50 for a KFC bucket.',
  keywords: 'Sponsor, Donate, Budaobu, AI-Stitched, KFC Fund, V me 50, Support Creator',
  ogTitle: 'Sponsor Budaobu - V me 50!',
  ogDescription: 'The AI writes the code, but I have to do the stitching. Feed the stitcher. V me 50 for KFC Crazy Thursday.',
})

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

const sponsorMethods: SponsorMethod[] = [
  {
    id: 1,
    type: 'link',
    title: 'Buy Me a Coffee',
    description: 'Support my work and keep the code flowing.',
    icon: '☕',
    url: 'https://buymeacoffee.com/lizhaoshui'
  },
  // 暂时注释加密货币钱包
  /*
  {
    id: 2,
    type: 'address',
    title: 'Crypto Wallet',
    description: 'Crypto Support: Transfer USDT (TRC20) directly to the address below.',
    icon: '₿',
    address: '占位符'
  },
  */
  {
    id: 3,
    type: 'qrcode',
    title: 'Wechat Pay',
    description: 'Scan the QR code below with WeChat to support.',
    // 更新为 public 目录下的 wx-qr.JPG，直接使用绝对路径即可
    qrcode: '/wx-qr.JPG'
  }
]

const copyAddress = async (address: string | undefined) => {
  if (!address) return

  try {
    await navigator.clipboard.writeText(address)
    
    // 使用 Nuxt UI 的 Toast 进行优雅提示
    toast.add({
      title: 'Copied Successfully',
      description: 'Wallet address copied to clipboard.',
      icon: 'i-lucide-check-circle', // 成功图标
      color: 'primary', // 使用主题色
      timeout: 3000 // 3秒后自动消失
    })
  } catch (err) {
    console.error('Copy failed:', err)
    
    // 错误处理提示
    toast.add({
      title: 'Copy Failed',
      description: 'Please manually select and copy the text.',
      icon: 'i-lucide-circle-alert',
      color: 'red'
    })
  }
}
</script>