<!-- app/pages/admin/clinics/create.vue -->
<template>
  <div class="max-w-3xl mx-auto p-3">
    <!-- Navigation -->
    <div class="mb-6">
      <NuxtLink
        to="/admin/clinics"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Back to Clinics
      </NuxtLink>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Create New Clinic</h1>
      <p class="text-sm text-gray-500 mt-1">
        Add a new dental clinic to the system. All fields marked with <span class="text-red-500">*</span> are required.
      </p>
    </div>

    <!-- Clinic Form -->
    <ClinicForm
      :loading="loading"
      title="Clinic Information"
      subtitle="Enter the details of the new dental clinic"
      submit-text="Create Clinic"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const clinicStore = useClinicStore()
const toast = useToast()
const router = useRouter()

const loading = ref(false)

const handleSubmit = async (formData) => {
  loading.value = true
  
  try {
    await clinicStore.createClinic(formData)
    toast.success('Clinic created successfully!')
    
    // Redirect after short delay to show success message
    setTimeout(() => {
      router.push('/admin/clinics')
    }, 1500)
  } catch (error) {
    toast.error(error.message || 'Failed to create clinic')
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/clinics')
}
</script>