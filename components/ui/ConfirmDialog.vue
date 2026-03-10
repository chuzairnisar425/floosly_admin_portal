<!-- app/components/ui/ConfirmDialog.vue -->
<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="close" class="relative z-50">
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <!-- Dialog Content -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <!-- Icon -->
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="iconBackgroundClass">
                <component :is="iconComponent" class="h-6 w-6" :class="iconColorClass" aria-hidden="true" />
              </div>

              <!-- Title -->
              <DialogTitle as="h3" class="mt-4 text-center text-lg font-medium leading-6 text-gray-900">
                {{ title }}
              </DialogTitle>

              <!-- Message -->
              <div class="mt-2">
                <p class="text-sm text-gray-500 text-center">
                  {{ message }}
                </p>
              </div>

              <!-- Additional Content Slot -->
              <div v-if="$slots.content" class="mt-4">
                <slot name="content" />
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-center space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
                  @click="close"
                  :disabled="loading"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="confirmButtonClass"
                  @click="confirm"
                  :disabled="loading"
                >
                  <Loader v-if="loading" size="sm" class="mr-2" />
                  {{ confirmText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const close = () => {
  if (!props.loading) {
    emit('update:modelValue', false)
    emit('cancel')
  }
}

const confirm = () => {
  emit('confirm')
}

const iconComponent = computed(() => {
  const icons = {
    warning: ExclamationTriangleIcon,
    danger: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon
  }
  return icons[props.type]
})

const iconBackgroundClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
    success: 'bg-green-100'
  }
  return classes[props.type]
})

const iconColorClass = computed(() => {
  const classes = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus-visible:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
  }
  return classes[props.type]
})
</script>