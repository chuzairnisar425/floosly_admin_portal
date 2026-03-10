<!-- app/components/ui/Loader.vue -->
<template>
  <div class="flex justify-center items-center" :class="containerClasses">
    <!-- Spinner -->
    <div :class="spinnerClasses" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    
    <!-- Optional Text -->
    <span v-if="text" class="ml-3 text-gray-500" :class="textClasses">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  fullPage: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const spinnerSizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4'
}

const containerClasses = computed(() => {
  if (props.fullPage) {
    return 'fixed inset-0 bg-white bg-opacity-75 z-50'
  }
  if (props.overlay) {
    return 'absolute inset-0 bg-white bg-opacity-75 z-10'
  }
  return ''
})

const spinnerClasses = computed(() => {
  return [
    'animate-spin rounded-full border-primary-600 border-t-transparent',
    spinnerSizes[props.size]
  ].join(' ')
})

const textClasses = computed(() => {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return textSizes[props.size]
})
</script>