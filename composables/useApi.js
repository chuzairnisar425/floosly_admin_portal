// composables/useApi.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api'

  // Generic fetch wrapper with error handling
  const fetchApi = async (endpoint, options = {}) => {
    try {
      const { data, error } = await useFetch(endpoint, {
        baseURL,
        ...options,
        // Ensure we handle errors properly
        onResponseError({ response }) {
          console.error('API Error:', response._data)
        }
      })

      if (error.value) {
        throw error.value
      }

      return { data: data.value, error: null }
    } catch (err) {
      console.error('Fetch error:', err)
      return { 
        data: null, 
        error:  { message: 'An unexpected error occurred' }
      }
    }
  }

  // Clinics API
  const clinics = {
    // Get all clinics
    getAll: () => fetchApi('/api/clinics'),
    
    // Get single clinic
    getById: (id) => fetchApi(`/api/clinics/${id}`),
    
    // Create clinic
    create: (clinicData) => fetchApi('/api/clinics', {
      method: 'POST',
      body: clinicData
    }),
    
    // Update clinic
    update: (id, clinicData) => fetchApi(`/api/clinics/${id}`, {
      method: 'PUT',
      body: clinicData
    }),
    
    // Delete clinic
    delete: (id) => fetchApi(`/api/clinics/${id}`, {
      method: 'DELETE'
    })
  }

  // Users API
  const users = {
    getAll: () => fetchApi('/api/users'),
    getById: (id) => fetchApi(`/api/users/${id}`),
    create: (userData) => fetchApi('/api/users', {
      method: 'POST',
      body: userData
    }),
    update: (id, userData) => fetchApi(`/api/users/${id}`, {
      method: 'PUT',
      body: userData
    }),
    delete: (id) => fetchApi(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    clinics,
    users,
    fetchApi
  }
}