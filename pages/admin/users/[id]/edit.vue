<!-- app/pages/admin/users/[id]/edit.vue -->
<template>
  <div class="max-w-3xl mx-auto">
    <!-- Navigation with animation -->
    <Transition name="slide-fade">
      <div class="mb-6">
        <NuxtLink
          :to="`/admin/users/${userId}`"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-all hover:-translate-x-1"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Back to User Details
        </NuxtLink>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <Skeleton type="form" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 animate-fade-in">
      <div class="bg-red-50 rounded-lg p-8">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-lg font-medium text-red-800 mb-2">Error Loading User</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="fetchData"
          class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <template v-else-if="user">
      <!-- Page Header with animation -->
      <Transition name="fade-up">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
          <p class="text-sm text-gray-500 mt-1">
            Update the information for {{ user.name }}
          </p>
        </div>
      </Transition>

      <!-- User Form with animation -->
      <Transition name="fade-up" appear>
        <UserForm
          :initial-data="user"
          :clinics="clinicStore.clinics"
          :loading="submitting"
          title="Edit User Information"
          subtitle="Make changes to the user details below"
          submit-text="Update User"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </Transition>
    </template>

    <!-- Toast Container -->
    <Toast :toasts="toast.toasts" @remove="toast.removeToast" />
  </div>
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
const userStore = useUserStore()
const clinicStore = useClinicStore()
const toast = useToast()

const userId = computed(() => parseInt(route.params.id))
const loading = ref(true)
const submitting = ref(false)
const error = ref(null)

// Fetch data
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      userStore.fetchUser(userId.value),
      clinicStore.fetchClinics()
    ])
  } catch (err) {
    error.value = err.message || 'Failed to load user details'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const user = computed(() => userStore.currentUser)

const handleSubmit = async (formData) => {
  submitting.value = true
  
  try {
    await userStore.updateUser(userId.value, formData)
    toast.success('User updated successfully!')
    
    // Redirect after short delay
    setTimeout(() => {
      router.push(`/admin/users/${userId.value}`)
    }, 1500)
  } catch (err) {
    toast.error(err.message || 'Failed to update user')
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.push(`/admin/users/${userId.value}`)
}
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>