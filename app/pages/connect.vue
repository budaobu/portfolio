<script setup lang="ts">
useSiteSeo('connect')

// Form State
const state = reactive({
  name: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const toast = useToast()

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
      color: 'primary'
    })
      
    // Reset Form
    state.name = ''
    state.email = ''
    state.message = ''
    
  } catch (error: any) {
    console.error('Form submission error:', error)
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
  <UContainer class="py-16 sm:py-24">
    <!-- Limit max width for visual focus -->
    <div class="max-w-lg mx-auto">
      
      <!-- Minimal Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-3">
          Contact
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Leave a message directly, and I'll reply via email as soon as possible.
        </p>
      </div>

      <!-- Minimal Form: No borders, pure layout -->
      <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
        
        <UFormGroup label="Name" name="name">
          <UInput 
            v-model="state.name" 
            placeholder="Your Name" 
            size="lg" 
            icon="i-lucide-user" 
            color="gray"
            variant="outline"
            :ui="{ rounded: 'rounded-lg' }"
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
            :ui="{ rounded: 'rounded-lg' }"
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
            :ui="{ rounded: 'rounded-lg' }"
            class="w-full"
          />
        </UFormGroup>

        <div class="pt-4">
          <UButton 
            type="submit" 
            block
            size="xl" 
            color="primary" 
            variant="solid"
            :loading="isLoading"
            label="Send Message"
            class="rounded-full font-bold transition-transform active:scale-[0.98]"
            :ui="{ rounded: 'rounded-full' }"
          />
        </div>
      </form>
      
    </div>
  </UContainer>
</template>