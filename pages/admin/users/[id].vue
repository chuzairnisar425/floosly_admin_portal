<!-- app/pages/admin/users/[id].vue -->
<template>
  <div class="max-w-4xl mx-auto mt-1">
    <!-- Loading State with Skeleton -->
    <div v-if="loading" class="space-y-6">
      <Skeleton type="card" />
      <Skeleton type="card" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 animate-fade-in">
      <div class="bg-red-50 rounded-lg p-8">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-lg font-medium text-red-800 mb-2">Error Loading User</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="fetchUser"
          class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowPathIcon class="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>

    <!-- User Details -->
    <template v-else-if="user">
      <!-- Navigation with animation -->
      <Transition name="slide-fade">
        <div class="mb-6 flex justify-between items-center">
          <NuxtLink
            to="/admin/users"
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-all hover:-translate-x-1"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-1" />
            Back to Users
          </NuxtLink>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/admin/users/${user.id}/edit`"
              class="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              <PencilIcon class="h-4 w-4 mr-2" />
              Edit User
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- User Profile Card with animation -->
      <Transition name="fade-up" appear>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <!-- Header with gradient -->
          <div class="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold text-primary-600">
                  {{ user.name.charAt(0) }}
                </span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-white">{{ user.name }}</h1>
                <p class="text-primary-100 text-sm">User ID: #{{ user.id }}</p>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 w-24">Status:</span>
                <StatusBadge :status="user.status" size="lg" />
              </div>
              
              <!-- Role -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 w-24">Role:</span>
                <span :class="roleBadgeClass" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ formatRole(user.role) }}
                </span>
              </div>
              
              <!-- Email -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 w-24">Email:</span>
                <a :href="`mailto:${user.email}`" class="text-sm text-primary-600 hover:text-primary-700 hover:underline">
                  {{ user.email }}
                </a>
              </div>
              
              <!-- Created Date -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 w-24">Joined:</span>
                <span class="text-sm text-gray-900">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Assigned Clinic Card with animation -->
      <Transition name="fade-up" appear>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">Assigned Clinic</h2>
          </div>
          
          <div v-if="clinic" class="p-6">
            <div class="flex items-start space-x-4">
              <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon class="h-6 w-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ clinic.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ clinic.address }}</p>
                <div class="mt-2 flex items-center space-x-4">
                  <a :href="`mailto:${clinic.email}`" class="text-xs text-primary-600 hover:underline">
                    {{ clinic.email }}
                  </a>
                  <a :href="`tel:${clinic.phone}`" class="text-xs text-gray-500 hover:text-primary-600">
                    {{ clinic.phone }}
                  </a>
                </div>
              </div>
              <NuxtLink
                :to="`/admin/clinics/${clinic.id}`"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Clinic →
              </NuxtLink>
            </div>
          </div>

          <div v-else-if="clinicStore.loading" class="p-6">
            <Skeleton type="card" />
          </div>

          <div v-else class="p-6 text-center text-gray-500">
            No clinic assigned
          </div>
        </div>
      </Transition>
    </template>

  </div>
</template>

<script setup>
import { 
  ArrowLeftIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const userStore = useUserStore()
const clinicStore = useClinicStore()
const toast = useToast()

const userId = computed(() => parseInt(route.params.id))
const loading = ref(true)
const error = ref(null)

// Fetch user data
const fetchUser = async () => {
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

onMounted(fetchUser)

const user = computed(() => userStore.currentUser)

const clinic = computed(() => {
  if (!user.value) return null
  return clinicStore.clinics.find(c => c.id === user.value.clinicId)
})

const formatRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const roleBadgeClass = computed(() => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    dentist: 'bg-blue-100 text-blue-800',
    receptionist: 'bg-green-100 text-green-800',
    hygienist: 'bg-yellow-100 text-yellow-800'
  }
  return classes[user.value?.role] || 'bg-gray-100 text-gray-800'
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.4s ease;
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