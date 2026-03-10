<!-- app/pages/admin/clinics/[id]/edit.vue -->
<template>
  <ErrorBoundary @retry="fetchClinic">
    <div class="max-w-3xl mx-auto">
    <!-- Navigation -->
    <div class="mb-6">
      <NuxtLink
        :to="`/admin/clinics/${clinicId}`"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Back to Clinic Details
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12">
      <Loader size="lg" text="Loading clinic data..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 rounded-lg p-8">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-lg font-medium text-red-800 mb-2">Error Loading Clinic</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="fetchClinic"
          class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <template v-else-if="clinic">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Edit Clinic</h1>
        <p class="text-sm text-gray-500 mt-1">
          Update the information for {{ clinic.name }}
        </p>
      </div>

      <ClinicForm
        :initial-data="clinic"
        :loading="updating"
        title="Edit Clinic Information"
        subtitle="Make changes to the clinic details below"
        submit-text="Update Clinic"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </template>

    <!-- Toast Container -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
  </ErrorBoundary>
</template>

<script setup>
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const clinicStore = useClinicStore()
const { toasts, removeToast, success, error: showError } = useToast()
const { execute: executeUpdate, loading: updating } = useAsyncState()

const clinicId = computed(() => parseInt(route.params.id))
const loading = ref(true)
const error = ref(null)

// Fetch clinic data
const fetchClinic = async () => {
  loading.value = true
  error.value = null
  
  try {
    await clinicStore.fetchClinic(clinicId.value)
  } catch (err) {
    error.value = err.message || 'Failed to load clinic details'
  } finally {
    loading.value = false
  }
}

onMounted(fetchClinic)

const clinic = computed(() => clinicStore.currentClinic)

const handleSubmit = async (formData) => {
  try {
    await executeUpdate(
      () => clinicStore.updateClinic(clinicId.value, formData),
      {
        successMessage: 'Clinic updated successfully!',
        errorMessage: 'Failed to update clinic'
      }
    )

    // Redirect after short delay
    setTimeout(() => {
      router.push(`/admin/clinics/${clinicId.value}`)
    }, 1500)
  } catch (err) {
    // Error already handled by useAsyncState
  }
}

const handleCancel = () => {
  router.push(`/admin/clinics/${clinicId.value}`)
}
</script>