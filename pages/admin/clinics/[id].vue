<!-- app/pages/admin/clinics/[id].vue -->
<template>
  <div class="max-w-4xl mx-auto mt-1">
    <!-- Loading State -->
    <div v-if="loading" class="py-12">
      <Loader size="lg" text="Loading clinic details..." />
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

    <!-- Clinic Details -->
    <template v-else-if="clinic">
      <!-- Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <NuxtLink
          to="/admin/clinics"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Back to Clinics
        </NuxtLink>
        <div class="flex space-x-2">
          <NuxtLink
            :to="`/admin/clinics/${clinic.id}/edit`"
            class="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <PencilIcon class="h-4 w-4 mr-2" />
            Edit Clinic
          </NuxtLink>
        </div>
      </div>

      <!-- Clinic Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
          <h1 class="text-2xl font-bold text-white">{{ clinic.name }}</h1>
          <p class="text-primary-100 text-sm mt-1">Clinic ID: #{{ clinic.id }}</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status Badge -->
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Status:</span>
              <StatusBadge :status="clinic.status" size="lg" />
            </div>
            
            <!-- Created Date -->
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Created:</span>
              <span class="text-sm text-gray-900">{{ formatDate(clinic.createdAt) }}</span>
            </div>
            
            <!-- Email -->
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Email:</span>
              <a :href="`mailto:${clinic.email}`" class="text-sm text-primary-600 hover:text-primary-700">
                {{ clinic.email }}
              </a>
            </div>
            
            <!-- Phone -->
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Phone:</span>
              <a :href="`tel:${clinic.phone}`" class="text-sm text-gray-900 hover:text-primary-600">
                {{ clinic.phone }}
              </a>
            </div>
          </div>
          
          <!-- Address -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Address</h3>
            <p class="text-gray-900">{{ clinic.address }}</p>
          </div>
        </div>
      </div>

      <!-- Users Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Clinic Staff</h2>
          <span class="text-sm text-gray-500">{{ clinicUsers.length }} users</span>
        </div>
        
        <div class="p-6">
          <DataTable
            :columns="userColumns"
            :data="clinicUsers"
            :loading="userStore.loading"
          >
            <template #actions="{ item }">
              <NuxtLink
                :to="`/admin/users/${item.id}`"
                class="text-primary-600 hover:text-primary-700 text-sm"
              >
                View
              </NuxtLink>
            </template>
          </DataTable>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { 
  ArrowLeftIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const clinicStore = useClinicStore()
const userStore = useUserStore()
const toast = useToast()

const clinicId = computed(() => parseInt(route.params.id))
const loading = ref(true)
const error = ref(null)

// Fetch clinic data
const fetchClinic = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      clinicStore.fetchClinic(clinicId.value),
      userStore.fetchUsers()
    ])
  } catch (err) {
    error.value = err.message || 'Failed to load clinic details'
  } finally {
    loading.value = false
  }
}

onMounted(fetchClinic)

const clinic = computed(() => clinicStore.currentClinic)

const clinicUsers = computed(() => {
  return userStore.users.filter(user => user.clinicId === clinicId.value)
})

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
]

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>