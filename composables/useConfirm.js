// app/composables/useConfirm.js
import { ref } from 'vue'

export const useConfirm = () => {
  const dialog = ref({
    show: false,
    title: 'Confirm Action',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  })

  const confirm = (options) => {
    return new Promise((resolve, reject) => {
      dialog.value = {
        show: true,
        title: options.title || 'Confirm Action',
        message: options.message,
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          dialog.value.show = false
          resolve(true)
        },
        onCancel: () => {
          dialog.value.show = false
          resolve(false)
        }
      }
    })
  }

  const closeConfirm = () => {
    dialog.value.show = false
  }

  return {
    dialog,
    confirm,
    closeConfirm
  }
}