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
      <component
        v-for="method in sponsorMethods"
        :key="method.id"
        :is="getWrapperComponent(method)"
        v-bind="getWrapperProps(method)"
        :class="getCardWrapperClass(method)"
      >
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <div class="flex items-start gap-4">
            <div 
              v-if="method.icon"
              :class="getIconClass(method)"
            >
              {{ method.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 :class="getTitleClass(method)">
                  {{ method.title }}
                </h3>
                <UIcon 
                  v-if="method.type === 'link'"
                  name="i-lucide:circle-arrow-out-up-right"
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

              <img
                v-if="method.type === 'qrcode'"
                :src="method.qrcode"
                :alt="method.title"
                class="mt-4 w-48 rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </UCard>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

useSeoMeta({
  title: 'Sponsor, Fuel the AI-Stitched Chaos, Donate',
  description: 'Support Budaobu\'s AI-stitched experiments. Stitching code together is exhausting work (even with AI). If it happens to be Thursday, please V me 50 for a KFC bucket.',
  keywords: 'Sponsor, Donate, Budaobu, AI-Stitched, KFC Fund, V me 50, Support Creator',
  ogTitle: 'Sponsor Budaobu - V me 50!',
  ogDescription: 'The AI writes the code, but I have to do the stitching. Feed the stitcher. V me 50 for KFC Crazy Thursday.',
})

type SponsorMethod = 
  | {
      id: number
      type: 'link'
      title: string
      description: string
      icon: string
      url: string
    }
  | {
      id: number
      type: 'address'
      title: string
      description: string
      icon: string
      address: string
    }
  | {
      id: number
      type: 'qrcode'
      title: string
      description: string
      qrcode: string
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
  {
    id: 3,
    type: 'qrcode',
    title: 'Wechat Pay',
    description: 'Scan the QR code below with WeChat to support.',
    qrcode: '/wx-qr.JPG'
  }
]

const getWrapperComponent = (method: SponsorMethod) => {
  return method.type === 'link' ? 'NuxtLink' : 'div'
}

const getWrapperProps = (method: SponsorMethod) => {
  if (method.type === 'link') {
    return {
      to: method.url,
      target: '_blank',
      rel: 'noopener noreferrer nofollow'
    }
  }
  return {}
}

const getCardWrapperClass = (method: SponsorMethod) => {
  const baseClass = 'group block text-left focus:outline-none'
  
  if (method.type === 'link') {
    return `${baseClass} cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1`
  }
  
  return baseClass
}

const getIconClass = (method: SponsorMethod) => {
  const baseClass = 'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl'
  
  if (method.type === 'link') {
    return `${baseClass} bg-primary-100 dark:bg-primary-900/30 group-hover:scale-110 transition-transform duration-300`
  }
  
  return `${baseClass} bg-gray-100 dark:bg-gray-800`
}

const getTitleClass = (method: SponsorMethod) => {
  const baseClass = 'text-xl font-semibold text-gray-900 dark:text-white'
  
  if (method.type === 'link') {
    return `${baseClass} group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors`
  }
  
  return baseClass
}

const copyAddress = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address)
    
    toast.add({
      title: 'Copied Successfully',
      description: 'Wallet address copied to clipboard.',
      icon: 'i-lucide-check-circle',
      color: 'primary',
      timeout: 3000
    })
  } catch (err) {
    console.error('Copy failed:', err)
    
    toast.add({
      title: 'Copy Failed',
      description: 'Please manually select and copy the text.',
      icon: 'i-lucide-circle-alert',
      color: 'red'
    })
  }
}
</script>