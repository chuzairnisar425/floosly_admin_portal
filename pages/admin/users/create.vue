<!-- app/pages/admin/users/create.vue -->
<template>
  <div class="max-w-3xl mx-auto mt-1">
    <!-- Navigation with animation -->
    <Transition name="slide-fade">
      <div class="mb-6">
        <NuxtLink
          to="/admin/users"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-all hover:-translate-x-1"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Back to Users
        </NuxtLink>
      </div>
    </Transition>

    <!-- Page Header with animation -->
    <Transition name="fade-up">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Create New User</h1>
        <p class="text-sm text-gray-500 mt-1">
          Add a new staff member to the system. All fields marked with <span class="text-red-500">*</span> are required.
        </p>
      </div>
    </Transition>

    <!-- Loading clinics state -->
    <div v-if="clinicStore.loading" class="mb-4">
      <Skeleton type="form" />
    </div>

    <!-- User Form with animation -->
    <Transition name="fade-up" appear>
      <UserForm
        v-if="!clinicStore.loading"
        :clinics="clinicStore.clinics"
        :loading="submitting"
        title="User Information"
        subtitle="Enter the details of the new staff member"
        submit-text="Create User"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </Transition>

    <!-- Empty clinics warning -->
    <div v-if="!clinicStore.clinics.length && !clinicStore.loading" 
         class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">No clinics available</h3>
          <p class="text-sm text-yellow-700 mt-1">
            You need to create at least one clinic before adding users.
            <NuxtLink to="/admin/clinics/create" class="font-medium underline">
              Create a clinic
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const userStore = useUserStore()
const clinicStore = useClinicStore()
const toast = useToast()
const router = useRouter()

const submitting = ref(false)

// Load clinics on mount
onMounted(async () => {
  try {
    await clinicStore.fetchClinics()
  } catch (error) {
    toast.error('Failed to load clinics')
  }
})

const handleSubmit = async (formData) => {
  submitting.value = true
  
  try {
    await userStore.createUser(formData)
    toast.success('User created successfully!', 3000)
    
    // Redirect after showing success message
    setTimeout(() => {
      router.push('/admin/users')
    }, 1500)
  } catch (error) {
    toast.error(error.message || 'Failed to create user')
    submitting.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/users')
}
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>