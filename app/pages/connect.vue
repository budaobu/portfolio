<script setup lang="ts">
import { socialLinks as socialLinksData } from '~/utils/appData'

useSiteSeo('connect')

// Form State
const state = reactive({
  name: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const toast = useToast()

const socialLinks = computed(() =>
  socialLinksData.filter(link => link.placement?.includes('connect'))
)

// Real Form Submission via local API (Resend)
const onSubmit = async () => {
  // 1. Basic Validation
  if (!state.name || !state.email || !state.message) {
    toast.add({
      title: 'Please fill in all fields',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
    return
  }

  isLoading.value = true

  try {
    // 2. Send Data to our server API (/server/api/send.post.ts)
    const response = await $fetch('/api/send', {
      method: 'POST',
      body: {
        name: state.name,
        email: state.email,
        message: state.message,
      }
    })

    // 3. Handle Response
    toast.add({
      title: 'Message Sent',
      description: 'Thanks for reaching out! I will get back to you soon.',
      icon: 'i-lucide-check-circle',
      color: 'coral'
    })

    // Reset Form
    state.name = ''
    state.email = ''
    state.message = ''

  } catch (error: any) {
    toast.add({
      title: 'Submission Failed',
      description: error.statusMessage || 'Something went wrong. Please try again later.',
      icon: 'i-lucide-alert-circle',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
      <!-- Left Column: Header -->
      <div class="relative">
        <!-- Decorative geometric element -->
        <div class="absolute -top-4 -left-4 w-20 h-20 border-[3px] border-coral-500/30 rotate-12 hidden lg:block"></div>

        <h1 class="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-warm-900 dark:text-warm-100 leading-[0.95] tracking-tight mb-8">
          Get in<br/>Touch
        </h1>

        <p class="text-xl text-warm-600 dark:text-warm-400 leading-relaxed mb-8 max-w-md">
          Have a project in mind or just want to say hi? Drop me a message and I'll get back to you as soon as possible.
        </p>

        <!-- Alternative contact methods -->
        <div class="space-y-4">
          <h2 class="text-sm font-medium text-warm-500 uppercase tracking-widest mb-4">Other ways to reach me</h2>
          <div class="flex flex-wrap gap-3">
            <UButton
              v-for="social in socialLinks"
              :key="social.name"
              :to="social.url"
              target="_blank"
              rel="noopener noreferrer nofollow"
              :aria-label="social.name"
              color="gray"
              variant="outline"
              :icon="social.icon"
              :label="social.name"
              class="rounded-sm"
            />
          </div>
        </div>

        <!-- Decorative line -->
        <div class="mt-12 flex items-center gap-4">
          <div class="h-px bg-warm-300 dark:bg-warm-700 flex-1 max-w-xs"></div>
          <span class="text-sm font-medium text-warm-500 uppercase tracking-widest">or</span>
          <div class="h-px bg-warm-300 dark:bg-warm-700 flex-1"></div>
        </div>
      </div>

      <!-- Right Column: Form -->
      <div class="bg-warm-100 dark:bg-warm-900 border border-warm-200 dark:border-warm-800 p-8 sm:p-10">
        <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
          <UFormGroup label="Name" name="name">
            <UInput
              v-model="state.name"
              placeholder="Your Name"
              size="lg"
              icon="i-lucide-user"
              color="gray"
              variant="outline"
              :ui="{ rounded: 'rounded-sm' }"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Your Email Address"
              size="lg"
              icon="i-lucide-mail"
              color="gray"
              variant="outline"
              :ui="{ rounded: 'rounded-sm' }"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Message" name="message">
            <UTextarea
              v-model="state.message"
              placeholder="What's on your mind?"
              :rows="6"
              size="lg"
              color="gray"
              variant="outline"
              resize
              :ui="{ rounded: 'rounded-sm' }"
              class="w-full"
            />
          </UFormGroup>

          <div class="pt-4">
            <UButton
              type="submit"
              block
              size="xl"
              color="coral"
              variant="solid"
              :loading="isLoading"
              label="Send Message"
              class="font-medium rounded-sm transition-transform active:scale-[0.98]"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
