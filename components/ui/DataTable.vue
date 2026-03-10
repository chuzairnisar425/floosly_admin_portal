<!-- app/components/ui/DataTable.vue -->
<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
    <!-- Table Header with Actions -->
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <slot name="header" />
      </div>
    </div>

    <!-- Search and Filters -->
    <div v-if="searchable || filterable" class="px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Input -->
        <!-- <div v-if="searchable" class="flex-1">
          <div class="relative">
            <input
              type="text"
              :value="searchTerm"
              @input="$emit('update:searchTerm', $event.target.value)"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <div class="absolute left-3 top-2.5">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div> -->
        
        <!-- Filter Slot -->
        <div v-if="filterable" class="sm:w-64">
          <slot name="filters" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8">
      <Loader />
    </div>

    <!-- Empty State -->
    <div v-else-if="!data?.length" class="p-8 text-center">
      <div class="flex flex-col items-center">
        <svg class="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500 text-lg">No data available</p>
        <p class="text-gray-400 text-sm mt-1">There are no items to display at the moment.</p>
        <slot name="empty-action" />
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table Header -->
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                {{ column.label }}
                <!-- Sort Icons -->
                <button v-if="column.sortable" @click="$emit('sort', column.key)" class="hover:text-gray-700">
                  <svg v-if="sortBy === column.key && sortOrder === 'asc'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg v-else-if="sortBy === column.key && sortOrder === 'desc'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <svg v-else class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </th>
            <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        
        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in data" :key="item.id || index" 
              class="hover:bg-gray-50 transition-colors"
              :class="{ 'bg-primary-50': isSelected && isSelected(item) }">
            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
              <!-- Custom Cell Rendering -->
              <template v-if="column.component">
                <component :is="column.component" :value="item[column.key]" :item="item" />
              </template>
              
              <!-- Status Badge -->
              <template v-else-if="column.key === 'status'">
                <StatusBadge :status="item[column.key]" />
              </template>
              
              <!-- Date Formatting -->
              <template v-else-if="column.key.includes('date') || column.key.includes('createdAt')">
                {{ formatDate(item[column.key]) }}
              </template>
              
              <!-- Default Text -->
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
            
            <!-- Actions Slot -->
            <td v-if="$slots.actions" class="px-6 py-4 text-right space-x-3">
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginate && totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ ((currentPage - 1) * perPage) + 1 }}</span>
          to <span class="font-medium">{{ Math.min(currentPage * perPage, totalItems) }}</span>
          of <span class="font-medium">{{ totalItems }}</span> results
        </div>
        <div class="flex space-x-2">
          <button @click="$emit('page-change', currentPage - 1)" 
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Previous
          </button>
          <button @click="$emit('page-change', currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  columns: {
    type: Array,
    required: true,
    validator: (columns) => {
      return columns.every(col => col.key && col.label)
    }
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchTerm: {
    type: String,
    default: ''
  },
  filterable: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: 'asc',
    validator: (value) => ['asc', 'desc'].includes(value)
  },
  paginate: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    default: 0
  },
  isSelected: {
    type: Function,
    default: null
  }
})

defineEmits(['update:searchTerm', 'sort', 'page-change'])

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.perPage)
})
</script>