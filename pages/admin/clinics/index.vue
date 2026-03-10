<!-- app/pages/admin/clinics/index.vue -->
<template>
  <div class="space-y-6 p-3">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clinics Management</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage all dental clinics in the system
        </p>
      </div>
      <NuxtLink
        to="/admin/clinics/create"
        class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Add New Clinic
      </NuxtLink>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-500">Total Clinics</p>
        <p class="text-2xl font-bold text-gray-900">{{ clinicStore.totalClinics }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-500">Active</p>
        <p class="text-2xl font-bold text-green-600">{{ clinicStore.activeClinics }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-500">Inactive</p>
        <p class="text-2xl font-bold text-gray-400">{{ clinicStore.inactiveClinics }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-500">This Month</p>
        <p class="text-2xl font-bold text-primary-600">{{ clinicsThisMonth }}</p>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search clinics by name, email, or address..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div class="sm:w-48">
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        <button
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Clinics Table -->
    <DataTable
      :title="`Clinics (${filteredClinics.length})`"
      :columns="columns"
      :data="paginatedData"
      :loading="clinicStore.loading"
      searchable
      :search-term="filters.search"
      @update:search-term="filters.search = $event"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @sort="handleSort"
      :paginate="true"
      :current-page="currentPage"
      :per-page="perPage"
      :total-items="filteredClinics.length"
      @page-change="currentPage = $event"
    >
      <!-- Custom cell rendering for actions -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end space-x-1">
          <!-- View Button -->
          <NuxtLink
            :to="`/admin/clinics/${item.id}`"
            class="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            title="View Details"
          >
            <EyeIcon class="h-5 w-5" />
          </NuxtLink>

          <!-- Edit Button -->
          <NuxtLink
            :to="`/admin/clinics/${item.id}/edit`"
            class="p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Edit Clinic"
          >
            <PencilIcon class="h-5 w-5" />
          </NuxtLink>

          <!-- Toggle Status Button -->
       <button
  @click="toggleClinicStatus(item)"
  class="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
  :title="item.status === 'active' ? 'Deactivate' : 'Activate'"
>
  <component 
    :is="item.status === 'active' ? PauseIcon : PlayIcon" 
    class="h-5 w-5" 
  />
</button>

          <!-- Delete Button -->
          <button
            @click="confirmDelete(item)"
            class="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Clinic"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </template>
    </DataTable>

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

    <!-- Toast Container -->
    <Toast :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup>
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin'
})

const clinicStore = useClinicStore()
const { toasts, removeToast, error: showError, success: showSuccess, warning: showWarning } = useToast()
const { confirm } = useConfirm()

// Filters state
const filters = ref({
  search: '',
  status: 'all'
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

// Load clinics on mount
onMounted(async () => {
  try {
    await clinicStore.fetchClinics()
  } catch (error) {
    showError('Failed to load clinics')
  }
})

// Filtered clinics based on search and status
const filteredClinics = computed(() => {
  let filtered = [...clinicStore.clinics]

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(clinic =>
      clinic.name.toLowerCase().includes(searchTerm) ||
      clinic.email.toLowerCase().includes(searchTerm) ||
      clinic.address.toLowerCase().includes(searchTerm)
    )
  }

  // Apply status filter
  if (filters.value.status !== 'all') {
    filtered = filtered.filter(clinic =>
      clinic.status === filters.value.status
    )
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
  return filteredClinics.value.slice(start, end)
})

// Clinics created this month
const clinicsThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return clinicStore.clinics.filter(clinic => {
    const created = new Date(clinic.createdAt)
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear
  }).length
})

// Table columns
const columns = [
  { key: 'name', label: 'Clinic Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created Date', sortable: true }
]

// Handle sort
const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    status: 'all'
  }
  currentPage.value = 1
}

// Toggle clinic status
const toggleClinicStatus = (clinic) => {
  const newStatus = clinic.status === 'active' ? 'inactive' : 'active'
  confirmDialog.value = {
    show: true,
    type: 'warning',
    title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} Clinic`,
    message: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} "${clinic.name}"?`,
    confirmText: 'Yes, Proceed',
    loading: false,
    item: clinic,
    action: 'toggle'
  }
}

// Confirm delete
const confirmDelete = (clinic) => {
  confirmDialog.value = {
    show: true,
    type: 'danger',
    title: 'Delete Clinic',
    message: `Are you sure you want to delete "${clinic.name}"? This action cannot be undone.`,
    confirmText: 'Yes, Delete',
    loading: false,
    item: clinic,
    action: 'delete'
  }
}

// Handle confirm action
const handleConfirm = async () => {
  const { item, action } = confirmDialog.value
  confirmDialog.value.loading = true

  try {
    if (action === 'delete') {
      await clinicStore.deleteClinic(item.id)
      showSuccess(`Clinic "${item.name}" deleted successfully`)
    } else if (action === 'toggle') {
      const newStatus = await clinicStore.toggleClinicStatus(item.id)
      showSuccess(`Clinic "${item.name}" ${newStatus} successfully`)
    }
    confirmDialog.value.show = false
  } catch (error) {
    showError(`Failed to ${action} clinic: ${error.message}`)
  } finally {
    confirmDialog.value.loading = false
  }
}

// Handle cancel
const handleCancel = () => {
  confirmDialog.value.show = false
}
</script>