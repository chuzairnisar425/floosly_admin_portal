<!-- app/components/clinics/ClinicForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Form Header -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Form Fields -->
      <div class="px-6 py-6 space-y-6">
        <!-- Clinic Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Clinic Name <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              placeholder="Enter clinic name"
              @blur="validateField('name')"
            />
          </div>
          <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email Address <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              placeholder="clinic@example.com"
              @blur="validateField('email')"
            />
          </div>
          <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">
            Phone Number <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              placeholder="+44 123 456 7890"
              @blur="validateField('phone')"
            />
          </div>
          <p v-if="errors.phone" class="mt-2 text-sm text-red-600">{{ errors.phone }}</p>
        </div>

        <!-- Address -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">
            Address <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <textarea
              id="address"
              v-model="formData.address"
              rows="3"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              placeholder="Enter full address"
              @blur="validateField('address')"
            />
          </div>
          <p v-if="errors.address" class="mt-2 text-sm text-red-600">{{ errors.address }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="formData.status"
                value="active"
                class="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="formData.status"
                value="inactive"
                class="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Inactive</span>
            </label>
          </div>
          <p v-if="errors.status" class="mt-2 text-sm text-red-600">{{ errors.status }}</p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !isValid"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <Loader v-if="loading" size="sm" class="mr-2" />
          {{ submitText }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    })
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Clinic Information'
  },
  subtitle: {
    type: String,
    default: ''
  },
  submitText: {
    type: String,
    default: 'Save Clinic'
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Form data
const formData = ref({ ...props.initialData })

// Validation errors
const errors = ref({})

// Watch for initialData changes (for edit mode)
watch(() => props.initialData, (newData) => {
  formData.value = { ...newData }
}, { deep: true })

// Validation rules
const validators = {
  name: (value) => {
    if (!value) return 'Clinic name is required'
    if (value.length < 2) return 'Clinic name must be at least 2 characters'
    if (value.length > 100) return 'Clinic name must be less than 100 characters'
    return ''
  },
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return ''
  },
  phone: (value) => {
    if (!value) return 'Phone number is required'
    const phoneRegex = /^[\+\d\s-]{10,}$/
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
    return ''
  },
  address: (value) => {
    if (!value) return 'Address is required'
    if (value.length < 5) return 'Please enter a complete address'
    return ''
  },
  status: (value) => {
    if (!value) return 'Status is required'
    if (!['active', 'inactive'].includes(value)) return 'Please select a valid status'
    return ''
  }
}

// Validate single field
const validateField = (fieldName) => {
  if (validators[fieldName]) {
    const error = validators[fieldName](formData.value[fieldName])
    errors.value[fieldName] = error
    return !error
  }
  return true
}

// Validate all fields
const validateForm = () => {
  const newErrors = {}
  let isValid = true

  Object.keys(validators).forEach(field => {
    const error = validators[field](formData.value[field])
    if (error) {
      newErrors[field] = error
      isValid = false
    }
  })

  errors.value = newErrors
  return isValid
}

// Check if form is valid
const isValid = computed(() => {
  return Object.values(errors.value).every(error => !error) &&
         Object.keys(validators).every(field => formData.value[field])
})

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData.value })
  }
}

// Reset form
const resetForm = () => {
  formData.value = { ...props.initialData }
  errors.value = {}
}

// Expose methods to parent
defineExpose({
  resetForm,
  validateForm
})
</script>