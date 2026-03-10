<!-- app/pages/admin/users/index.vue -->
<template>
  <div class="space-y-6 p-3">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage all staff members across clinics
        </p>
      </div>
      <NuxtLink
        to="/admin/users/create"
        class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Add New User
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <template v-if="userStore.loading && !userStore.users.length">
      <Skeleton type="stats" />
      <Skeleton type="table-row" :rows="5" :cols="6" class="mt-6" />
    </template>

    <!-- Error State -->
    <div v-else-if="userStore.error" class="bg-red-50 rounded-lg p-8 text-center">
      <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-lg font-medium text-red-800 mb-2">Error Loading Users</h2>
      <p class="text-red-600 mb-4">{{ userStore.error }}</p>
      <button
        @click="retryLoad"
        class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <ArrowPathIcon class="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Stats Summary with Animations -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, index) in stats" :key="stat.label"
             class="bg-white rounded-lg border border-gray-200 p-4 transform transition-all hover:scale-105 hover:shadow-md animate-fade-in-up"
             :style="{ animationDelay: `${index * 100}ms` }">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="text-2xl font-bold" :class="stat.color">{{ stat.value }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ stat.subtext }}</p>
        </div>
      </div>

      <!-- Filters Bar with Animation -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 animate-fade-in">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search users by name or email..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                @keyup.esc="filters.search = ''"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div class="sm:w-48">
            <select
              v-model="filters.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="dentist">Dentist</option>
              <option value="receptionist">Receptionist</option>
              <option value="hygienist">Hygienist</option>
            </select>
          </div>
          <div class="sm:w-48">
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="sm:w-48">
            <select
              v-model="filters.clinicId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Clinics</option>
              <option v-for="clinic in clinicStore.clinics" :key="clinic.id" :value="clinic.id">
                {{ clinic.name }}
              </option>
            </select>
          </div>
          <button
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Reset all filters"
          >
            <ArrowPathIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500">Active filters:</span>
          <span v-if="filters.search" class="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
            Search: "{{ filters.search }}"
            <button @click="filters.search = ''" class="ml-1 hover:text-primary-900">
              <XMarkIcon class="h-3 w-3" />
            </button>
          </span>
          <span v-if="filters.role !== 'all'" class="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
            Role: {{ filters.role }}
            <button @click="filters.role = 'all'" class="ml-1 hover:text-primary-900">
              <XMarkIcon class="h-3 w-3" />
            </button>
          </span>
          <span v-if="filters.status !== 'all'" class="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
            Status: {{ filters.status }}
            <button @click="filters.status = 'all'" class="ml-1 hover:text-primary-900">
              <XMarkIcon class="h-3 w-3" />
            </button>
          </span>
          <span v-if="filters.clinicId !== 'all'" class="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
            Clinic: {{ getClinicName(filters.clinicId) }}
            <button @click="filters.clinicId = 'all'" class="ml-1 hover:text-primary-900">
              <XMarkIcon class="h-3 w-3" />
            </button>
          </span>
        </div>
      </div>

      <!-- Users Table with Animation -->
      <div class="animate-fade-in-up" style="animation-delay: 200ms">
        <DataTable
          :title="`Users (${filteredUsers.length})`"
          :columns="columns"
          :data="paginatedData"
          :loading="userStore.loading"
          searchable
          :search-term="filters.search"
          @update:search-term="filters.search = $event"
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @sort="handleSort"
          :paginate="true"
          :current-page="currentPage"
          :per-page="perPage"
          :total-items="filteredUsers.length"
          @page-change="currentPage = $event"
        >
          <!-- Custom Role Cell -->
          <template #cell-role="{ value }">
            <span :class="roleBadgeClasses(value)" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ formatRole(value) }}
            </span>
          </template>

          <!-- Custom Clinic Cell -->
          <template #cell-clinicId="{ value }">
            <span class="text-sm text-gray-600">{{ getClinicName(value) }}</span>
          </template>

          <!-- Actions -->
          <template #actions="{ item }">
            <div class="flex items-center justify-end space-x-2">
              <!-- Keyboard shortcut tooltip -->
              <button
                @click="viewUser(item)"
                class="p-1 text-gray-500 hover:text-primary-600 transition-colors relative group"
                title="View details (⌘+Click)"
              >
                <EyeIcon class="h-5 w-5" />
                <span class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  View
                </span>
              </button>

              <NuxtLink
                :to="`/admin/users/${item.id}/edit`"
                class="p-1 text-gray-500 hover:text-blue-600 transition-colors relative group"
                title="Edit user"
              >
                <PencilIcon class="h-5 w-5" />
                <span class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Edit
                </span>
              </NuxtLink>

              <button
  @click="toggleUserStatus(item)"
  class="p-1 text-gray-500 hover:text-yellow-600 transition-colors relative group"
  :title="item.status === 'active' ? 'Deactivate' : 'Activate'"
>
  <PauseIcon v-if="item.status === 'active'" class="h-5 w-5" />
  <PlayIcon v-else class="h-5 w-5" />

  <span class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
    {{ item.status === 'active' ? 'Deactivate' : 'Activate' }}
  </span>
</button>

              <button
                @click="confirmDelete(item)"
                class="p-1 text-gray-500 hover:text-red-600 transition-colors relative group"
                title="Delete user"
              >
                <TrashIcon class="h-5 w-5" />
                <span class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Delete
                </span>
              </button>
            </div>
          </template>
        </DataTable>
      </div>
    </template>

    <!-- Keyboard Shortcuts Help -->
    <div class="fixed bottom-4 right-4">
      <button
        @click="showShortcuts = !showShortcuts"
        class="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Keyboard shortcuts"
      >
        <CommandLineIcon class="h-5 w-5" />
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="showShortcuts" class="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Keyboard Shortcuts</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">⌘ + N</span>
              <span class="text-gray-900">New user</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">⌘ + F</span>
              <span class="text-gray-900">Focus search</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ESC</span>
              <span class="text-gray-900">Clear search</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">?</span>
              <span class="text-gray-900">Show shortcuts</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-model="confirmDialog.show"
      :type="confirmDialog.type"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :loading="confirmDialog.loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

  </div>
</template>

<script setup>
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CommandLineIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const userStore = useUserStore()
const clinicStore = useClinicStore()
const toast = useToast()
const confirm = useConfirm()
const route = useRoute()
const router = useRouter()

// UI state
const showShortcuts = ref(false)

// Filters state
const filters = ref({
  search: '',
  role: 'all',
  status: 'all',
  clinicId: 'all'
})

// Sorting state
const sortBy = ref('name')
const sortOrder = ref('asc')

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Confirm dialog state
const confirmDialog = ref({
  show: false,
  type: 'warning',
  title: '',
  message: '',
  confirmText: 'Confirm',
  loading: false,
  item: null,
  action: null
})

// Load data on mount
onMounted(async () => {
  try {
    await Promise.all([
      userStore.fetchUsers(),
      clinicStore.fetchClinics()
    ])
  } catch (error) {
    toast.error('Failed to load data')
  }

  // Check for search param in URL
  if (route.query.search) {
    filters.value.search = route.query.search
  }
})

// Keyboard shortcuts
onMounted(() => {
  const handleKeyDown = (e) => {
    // Cmd/Ctrl + N: New user
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault()
      router.push('/admin/users/create')
    }
    
    // Cmd/Ctrl + F: Focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault()
      const searchInput = document.querySelector('input[placeholder*="Search"]')
      if (searchInput) searchInput.focus()
    }
    
    // ?: Show shortcuts
    if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      showShortcuts.value = !showShortcuts.value
    }
    
    // ESC: Clear search if focused
    if (e.key === 'Escape') {
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'INPUT') {
        filters.value.search = ''
      }
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
})

// Stats
const stats = computed(() => [
  {
    label: 'Total Users',
    value: userStore.totalUsers,
    color: 'text-gray-900',
    subtext: 'All staff members'
  },
  {
    label: 'Active',
    value: userStore.activeUsers,
    color: 'text-green-600',
    subtext: `${((userStore.activeUsers / userStore.totalUsers) * 100 || 0).toFixed(1)}% of total`
  },
  {
    label: 'Inactive',
    value: userStore.inactiveUsers,
    color: 'text-gray-400',
    subtext: 'Needs attention'
  },
  {
    label: 'Roles',
    value: Object.keys(userStore.usersByRole).length,
    color: 'text-primary-600',
    subtext: 'Different positions'
  }
])

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.role !== 'all' || 
         filters.value.status !== 'all' || 
         filters.value.clinicId !== 'all'
})

// Filtered users
const filteredUsers = computed(() => {
  let filtered = [...userStore.users]

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }

  // Apply role filter
  if (filters.value.role !== 'all') {
    filtered = filtered.filter(user => user.role === filters.value.role)
  }

  // Apply status filter
  if (filters.value.status !== 'all') {
    filtered = filtered.filter(user => user.status === filters.value.status)
  }

  // Apply clinic filter
  if (filters.value.clinicId !== 'all') {
    filtered = filtered.filter(user => user.clinicId === parseInt(filters.value.clinicId))
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    const order = sortOrder.value === 'asc' ? 1 : -1

    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * order
    }
    return (aVal - bVal) * order
  })

  return filtered
})

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredUsers.value.slice(start, end)
})

// Table columns
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'clinicId', label: 'Clinic', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

// Helper functions
const formatRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const roleBadgeClasses = (role) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    dentist: 'bg-blue-100 text-blue-800',
    receptionist: 'bg-green-100 text-green-800',
    hygienist: 'bg-yellow-100 text-yellow-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getClinicName = (clinicId) => {
  const clinic = clinicStore.clinics.find(c => c.id === clinicId)
  return clinic ? clinic.name : 'Unknown Clinic'
}

// Actions
const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
}

const resetFilters = () => {
  filters.value = {
    search: '',
    role: 'all',
    status: 'all',
    clinicId: 'all'
  }
  currentPage.value = 1
  
  // Update URL
  router.replace({ query: {} })
}

const retryLoad = async () => {
  try {
    await Promise.all([
      userStore.fetchUsers(),
      clinicStore.fetchClinics()
    ])
  } catch (error) {
    // toast.error('Failed to reload data')
  }
}

const viewUser = (user) => {
  router.push(`/admin/users/${user.id}`)
}

const toggleUserStatus = (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  confirmDialog.value = {
    show: true,
    type: 'warning',
    title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} User`,
    message: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} "${user.name}"?`,
    confirmText: 'Yes, Proceed',
    loading: false,
    item: user,
    action: 'toggle'
  }
}

const confirmDelete = (user) => {
  confirmDialog.value = {
    show: true,
    type: 'danger',
    title: 'Delete User',
    message: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
    confirmText: 'Yes, Delete',
    loading: false,
    item: user,
    action: 'delete'
  }
}

const handleConfirm = async () => {
  const { item, action } = confirmDialog.value
  confirmDialog.value.loading = true

  try {
    if (action === 'delete') {
      await userStore.deleteUser(item.id)
      toast.success(`User "${item.name}" deleted successfully`)
    } else if (action === 'toggle') {
      const newStatus = await userStore.toggleUserStatus(item.id)
      toast.success(`User "${item.name}" ${newStatus} successfully`)
    }
    confirmDialog.value.show = false
  } catch (error) {
    toast.error(`Failed to ${action} user: ${error.message}`)
  } finally {
    confirmDialog.value.loading = false
  }
}

const handleCancel = () => {
  confirmDialog.value.show = false
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
</style>