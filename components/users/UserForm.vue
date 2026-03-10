<!-- app/components/users/UserForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>

      <div class="px-6 py-6 space-y-6">
        <!-- Full Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Full Name <span class="text-red-500">*</span>
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
              placeholder="Enter full name"
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
              placeholder="user@example.com"
              @blur="validateField('email')"
            />
          </div>
          <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">
            Role <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <select
              id="role"
              v-model="formData.role"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.role ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              @blur="validateField('role')"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="dentist">Dentist</option>
              <option value="receptionist">Receptionist</option>
              <option value="hygienist">Hygienist</option>
            </select>
          </div>
          <p v-if="errors.role" class="mt-2 text-sm text-red-600">{{ errors.role }}</p>
        </div>

        <!-- Clinic Selection -->
        <div>
          <label for="clinicId" class="block text-sm font-medium text-gray-700">
            Assigned Clinic <span class="text-red-500">*</span>
          </label>
          <div class="mt-1">
            <select
              id="clinicId"
              v-model="formData.clinicId"
              :class="[
                'block w-full rounded-md shadow-sm sm:text-sm',
                errors.clinicId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              ]"
              @blur="validateField('clinicId')"
            >
              <option :value="null">Select a clinic</option>
              <option v-for="clinic in clinics" :key="clinic.id" :value="clinic.id">
                {{ clinic.name }}
              </option>
            </select>
          </div>
          <p v-if="errors.clinicId" class="mt-2 text-sm text-red-600">{{ errors.clinicId }}</p>
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
      role: '',
      clinicId: null,
      status: 'active'
    })
  },
  clinics: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'User Information'
  },
  subtitle: {
    type: String,
    default: ''
  },
  submitText: {
    type: String,
    default: 'Save User'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({ ...props.initialData })
const errors = ref({})

watch(() => props.initialData, (newData) => {
  formData.value = { ...newData }
}, { deep: true })

const validators = {
  name: (value) => {
    if (!value) return 'Full name is required'
    if (value.length < 2) return 'Name must be at least 2 characters'
    return ''
  },
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return ''
  },
  role: (value) => {
    if (!value) return 'Role is required'
    const validRoles = ['admin', 'dentist', 'receptionist', 'hygienist']
    if (!validRoles.includes(value)) return 'Please select a valid role'
    return ''
  },
  clinicId: (value) => {
    if (!value) return 'Please select a clinic'
    if (isNaN(parseInt(value))) return 'Please select a valid clinic'
    return ''
  },
  status: (value) => {
    if (!value) return 'Status is required'
    if (!['active', 'inactive'].includes(value)) return 'Please select a valid status'
    return ''
  }
}

const validateField = (fieldName) => {
  if (validators[fieldName]) {
    const error = validators[fieldName](formData.value[fieldName])
    errors.value[fieldName] = error
    return !error
  }
  return true
}

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

const isValid = computed(() => {
  return Object.values(errors.value).every(error => !error) &&
         Object.keys(validators).every(field => formData.value[field])
})

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { 
      ...formData.value,
      clinicId: parseInt(formData.value.clinicId)
    })
  }
}

const resetForm = () => {
  formData.value = { ...props.initialData }
  errors.value = {}
}

defineExpose({
  resetForm,
  validateForm
})
</script>