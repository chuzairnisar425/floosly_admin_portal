<!-- pages/admin/index.vue -->
<template>
  <div class="space-y-6 p-3">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">
          Welcome back! Here's what's happening with your clinics today.
        </p>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <CalendarIcon class="h-4 w-4" />
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Clinics Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Clinics</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ clinicStore.totalClinics }}</p>
            <div class="flex items-center mt-2 space-x-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ clinicStore.activeClinics }} Active
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {{ clinicStore.inactiveClinics }} Inactive
              </span>
            </div>
          </div>
          <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon class="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ userStore.totalUsers }}</p>
            <div class="flex items-center mt-2 space-x-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {{ userStore.activeUsers }} Active
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {{ userStore.inactiveUsers }} Inactive
              </span>
            </div>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Active Clinics Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Clinics</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ clinicStore.activeClinics }}</p>
            <p class="text-xs text-gray-500 mt-2">
              {{ ((clinicStore.activeClinics / clinicStore.totalClinics) * 100 || 0).toFixed(1) }}% of total
            </p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Inactive Clinics Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Inactive Clinics</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ clinicStore.inactiveClinics }}</p>
            <p class="text-xs text-gray-500 mt-2">
              Needs attention
            </p>
          </div>
          <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Users by Role Chart -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
        <div v-if="Object.keys(userStore.usersByRole).length" class="space-y-3">
          <div v-for="(count, role) in userStore.usersByRole" :key="role" class="flex items-center">
            <span class="w-24 text-sm text-gray-600 capitalize">{{ role }}</span>
            <div class="flex-1">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-600 rounded-full"
                  :style="{ width: `${(count / userStore.totalUsers) * 100}%` }"
                ></div>
              </div>
            </div>
            <span class="ml-3 text-sm font-medium text-gray-700">{{ count }}</span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No user data available
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div :class="['h-2 w-2 mt-2 rounded-full', activity.type === 'create' ? 'bg-green-400' : activity.type === 'update' ? 'bg-blue-400' : 'bg-red-400']"></div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
            </div>
          </div>
          <div v-if="!recentActivities.length" class="text-center py-8 text-gray-500">
            No recent activity
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Clinics Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Recent Clinics</h3>
        <NuxtLink 
          to="/admin/clinics"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View All
          <ArrowRightIcon class="h-4 w-4" />
        </NuxtLink>
      </div>
      <div class="p-6">
        <DataTable
          :columns="clinicColumns"
          :data="recentClinics"
          :loading="clinicStore.loading"
        >
          <template #actions="{ item }">
            <NuxtLink 
              :to="`/admin/clinics/${item.id}`"
              class="text-primary-600 hover:text-primary-900 text-sm font-medium"
            >
              View Details
            </NuxtLink>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Toast Container -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup>
import { 
  CalendarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const clinicStore = useClinicStore()
const userStore = useUserStore()
const { toasts, removeToast, error: showError } = useToast()

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([
      clinicStore.fetchClinics(),
      userStore.fetchUsers()
    ])
  } catch (error) {
    console.error('Dashboard error:', error)
    showError('Failed to load dashboard data')
  }
})

// Computed properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const recentClinics = computed(() => {
  return clinicStore.clinics.slice(0, 5)
})

// Mock recent activities (in real app, this would come from an API)
const recentActivities = computed(() => {
  const activities = []
  
  // Add clinic creation activities
  clinicStore.clinics.slice(0, 3).forEach(clinic => {
    activities.push({
      id: `clinic-${clinic.id}`,
      type: 'create',
      message: `New clinic "${clinic.name}" was added`,
      timestamp: clinic.createdAt
    })
  })
  
  // Add user activities
  userStore.users.slice(0, 3).forEach(user => {
    activities.push({
      id: `user-${user.id}`,
      type: 'update',
      message: `User "${user.name}" was updated`,
      timestamp: user.createdAt
    })
  })
  
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
})

// Table columns
const clinicColumns = [
  { key: 'name', label: 'Clinic Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

// Helper function
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}
</script>