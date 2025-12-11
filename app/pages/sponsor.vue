<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        赞助支持
        <span class="text-primary-500">.</span>
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
        如果我的作品对你有帮助，欢迎通过以下方式赞助支持。你的支持是我持续创作的动力。
      </p>
    </div>

    <div class="space-y-6">
      <div
        v-for="method in sponsorMethods"
        :key="method.id"
        class="group"
        :class="method.type === 'link' ? 'cursor-pointer' : ''"
        @click="handleClick(method)"
      >
        <UCard
          :ui="{
            body: { padding: 'p-6' },
            base: method.type === 'link' 
              ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' 
              : ''
          }"
        >
          <div class="flex items-start gap-4">
            <div 
              v-if="method.type !== 'qrcode'"
              class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              :class="method.type === 'link' 
                ? 'bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform duration-300' 
                : 'bg-gray-100 dark:bg-gray-800'"
            >
              {{ method.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 
                  class="text-xl font-semibold text-gray-900 dark:text-white"
                  :class="method.type === 'link' ? 'group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors' : ''"
                >
                  {{ method.title }}
                </h3>
                <UIcon 
                  v-if="method.type === 'link'"
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                />
              </div>

              <p class="text-gray-600 dark:text-gray-400 mb-3">
                {{ method.description }}
              </p>

              <div v-if="method.type === 'address'" class="flex items-center gap-2">
                <code class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-900 dark:text-white font-mono break-all">
                  {{ method.address }}
                </code>
                <!-- 阻止冒泡，避免触发外层的点击事件（虽然这里不是 link 类型，但保持好习惯） -->
                <UButton
                  icon="i-heroicons-clipboard-document"
                  color="gray"
                  variant="soft"
                  size="sm"
                  @click.stop="copyAddress(method.address)"
                >
                  复制
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
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入 Toast 组合式函数
const toast = useToast()

// SEO 优化
useSeoMeta({
  title: '赞助支持', // 最终显示 "赞助支持 - Budaobu"
  description: '如果您喜欢我的作品，欢迎赞助支持。支持方式包括 Buy Me a Coffee、USDT 加密货币和微信赞赏。',
  ogTitle: '赞助支持 - Budaobu',
  ogDescription: '您的支持是我持续创作开源项目的动力。',
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
    description: '通过 Buy Me a Coffee 平台赞助，支持信用卡和 PayPal 支付。',
    icon: '☕',
    url: 'https://buymeacoffee.com/lizhaoshui'
  },
  // 暂时注释加密货币钱包
  /*
  {
    id: 2,
    type: 'address',
    title: '加密货币钱包',
    description: '如果你使用加密货币，可以直接转账到以下 USDT (TRC20) 地址。',
    icon: '₿',
    address: '占位符'
  },
  */
  {
    id: 3,
    type: 'qrcode',
    title: '微信赞赏',
    description: '使用微信扫描下方二维码进行赞赏。',
    // 更新为 public 目录下的 wx-qr.JPG，直接使用绝对路径即可
    qrcode: '/wx-qr.JPG'
  }
]

const handleClick = (method: SponsorMethod) => {
  if (method.type === 'link' && method.url) {
    window.open(method.url, '_blank')
  }
}

const copyAddress = async (address: string | undefined) => {
  if (!address) return

  try {
    await navigator.clipboard.writeText(address)
    
    // 使用 Nuxt UI 的 Toast 进行优雅提示
    toast.add({
      title: '复制成功',
      description: '钱包地址已复制到剪贴板',
      icon: 'i-heroicons-check-circle', // 成功图标
      color: 'primary', // 使用主题色
      timeout: 3000 // 3秒后自动消失
    })
  } catch (err) {
    console.error('复制失败:', err)
    
    // 错误处理提示
    toast.add({
      title: '复制失败',
      description: '请手动选中文本进行复制',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}
</script>