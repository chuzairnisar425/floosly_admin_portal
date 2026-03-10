<!-- app/components/ui/Toast.vue -->
<template>
  <TransitionGroup
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 w-96"
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'rounded-lg shadow-lg p-4 flex items-start gap-3',
        toastClasses[toast.type]
      ]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <component :is="toastIcons[toast.type]" class="h-5 w-5" />
      </div>
      
      <!-- Message -->
      <div class="flex-1 text-sm font-medium">
        {{ toast.message }}
      </div>
      
      <!-- Close Button -->
      <button
        @click="removeToast(toast.id)"
        class="flex-shrink-0 ml-4 text-current hover:opacity-75"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove'])

const toastClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const removeToast = (id) => {
  emit('remove', id)
}
</script>