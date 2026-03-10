<!-- app/components/ui/Skeleton.vue -->
<template>
  <div :class="['animate-pulse', className]">
    <div v-if="type === 'card'" class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 bg-gray-200 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <div class="h-3 bg-gray-200 rounded"></div>
        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>

    <div v-else-if="type === 'table-row'" class="space-y-3">
      <div v-for="i in rows" :key="i" class="flex space-x-4">
        <div v-for="j in cols" :key="j" class="h-4 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>

    <div v-else-if="type === 'form'" class="space-y-4">
      <div v-for="i in 5" :key="i" class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="type === 'stats'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>

    <div v-else :class="defaultClasses">
      <div class="h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['card', 'table-row', 'form', 'stats', 'default'].includes(value)
  },
  rows: {
    type: Number,
    default: 5
  },
  cols: {
    type: Number,
    default: 4
  },
  className: {
    type: String,
    default: ''
  }
})

const defaultClasses = 'space-y-2'
</script>