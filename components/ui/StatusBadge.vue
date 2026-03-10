<!-- app/components/ui/StatusBadge.vue -->
<template>
  <span :class="[
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    statusClasses
  ]">
    <span :class="['w-1.5 h-1.5 rounded-full mr-1.5', dotClasses]"></span>
    {{ formattedStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'inactive', 'pending', 'approved', 'rejected'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const formattedStatus = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})

const statusClasses = computed(() => {
  const baseClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  const colorClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return `${baseClasses[props.size]} ${colorClasses[props.status] || colorClasses.inactive}`
})

const dotClasses = computed(() => {
  const dotColors = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-400',
    approved: 'bg-blue-400',
    rejected: 'bg-red-400'
  }
  return dotColors[props.status] || dotColors.inactive
})
</script>