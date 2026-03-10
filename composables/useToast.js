// app/composables/useToast.js
import { ref } from 'vue'

let toasts = ref([])

export const useToast = () => {
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type, duration })
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Named methods for convenience
  const success = (message, duration = 5000) => addToast(message, 'success', duration)
  const error = (message, duration = 5000) => addToast(message, 'error', duration)
  const warning = (message, duration = 5000) => addToast(message, 'warning', duration)
  const info = (message, duration = 5000) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}