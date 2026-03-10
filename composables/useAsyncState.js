// composables/useAsyncState.js
export const useAsyncState = () => {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const execute = async (asyncFn, options = {}) => {
    const { showToast = true, successMessage, errorMessage } = options

    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      data.value = result

      if (showToast && successMessage) {
        const { success } = useToast()
        success(successMessage)
      }

      return result
    } catch (err) {
      error.value = err.message || 'An error occurred'

      if (showToast) {
        const { error: showError } = useToast()
        showError(errorMessage || error.value)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    execute,
    reset
  }
}
