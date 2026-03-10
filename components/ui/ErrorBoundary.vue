<!-- components/ui/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="min-h-[400px] flex items-center justify-center">
    <div class="text-center max-w-md">
      <div class="mb-6">
        <svg class="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <div class="space-y-3">
        <button
          @click="retry"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Try Again
        </button>
        <button
          @click="goBack"
          class="block w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Something went wrong'
  },
  message: {
    type: String,
    default: 'We encountered an unexpected error. Please try again.'
  }
})

const emit = defineEmits(['retry'])

const hasError = ref(false)
const error = ref(null)

const retry = () => {
  hasError.value = false
  error.value = null
  emit('retry')
}

const goBack = () => {
  const router = useRouter()
  router.go(-1)
}

// Error boundary logic
onErrorCaptured((err) => {
  hasError.value = true
  error.value = err
  console.error('Error boundary caught:', err)
  return false // Prevent error from propagating
})
</script>
