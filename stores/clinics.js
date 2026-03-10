// stores/clinics.js
import { defineStore } from 'pinia'

export const useClinicStore = defineStore('clinics', {
  state: () => ({
    clinics: [],
    currentClinic: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }),

  getters: {
    // Basic stats
    totalClinics: (state) => state.clinics.length,
    
    activeClinics: (state) => 
      state.clinics.filter(c => c.status === 'active').length,
    
    inactiveClinics: (state) => 
      state.clinics.filter(c => c.status === 'inactive').length,
    
    // Filtered clinics based on current filters
    filteredClinics: (state) => {
      let filtered = [...state.clinics]
      
      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(clinic => 
          clinic.name.toLowerCase().includes(searchTerm) ||
          clinic.email.toLowerCase().includes(searchTerm) ||
          clinic.address.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(clinic => 
          clinic.status === state.filters.status
        )
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        const aVal = a[state.filters.sortBy]
        const bVal = b[state.filters.sortBy]
        const order = state.filters.sortOrder === 'asc' ? 1 : -1
        
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal) * order
        }
        return (aVal - bVal) * order
      })
      
      return filtered
    },
    
    // Get clinic by ID
    getClinicById: (state) => (id) => {
      return state.clinics.find(c => c.id === parseInt(id))
    }
  },

  actions: {
    // Fetch all clinics
    async fetchClinics() {
      // Don't refetch if we already have data (unless forced)
      if (this.clinics.length > 0 && !this.loading) {
        return this.clinics
      }

      this.loading = true
      this.error = null

      try {
        const { clinics } = useApi()
        const { data, error } = await clinics.getAll()

        if (error) {
          throw new Error(error.message || 'Failed to fetch clinics')
        }

        this.clinics = data || []
        return this.clinics
      } catch (err) {
        this.error = err.message
        console.error('Fetch clinics error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Fetch single clinic
    async fetchClinic(id) {
      this.loading = true
      this.error = null
      
      try {
        const { clinics } = useApi()
        const { data, error } = await clinics.getById(id)
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch clinic')
        }
        
        this.currentClinic = data
        return data
      } catch (err) {
        this.error = err.message
        console.error('Fetch clinic error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Create clinic
    async createClinic(clinicData) {
      this.loading = true
      this.error = null
      
      try {
        const { clinics } = useApi()
        const { data, error } = await clinics.create(clinicData)
        
        if (error) {
          throw new Error(error.message || 'Failed to create clinic')
        }
        
        // Add to local state
        this.clinics.push(data)
        
        // Show success message (we'll add toast later)
        console.log('Clinic created successfully:', data)
        
        return data
      } catch (err) {
        this.error = err.message
        console.error('Create clinic error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Update clinic
    async updateClinic(id, clinicData) {
      this.loading = true
      this.error = null
      
      try {
        const { clinics } = useApi()
        const { data, error } = await clinics.update(id, clinicData)
        
        if (error) {
          throw new Error(error.message || 'Failed to update clinic')
        }
        
        // Update in local state
        const index = this.clinics.findIndex(c => c.id === parseInt(id))
        if (index !== -1) {
          this.clinics[index] = data
        }
        
        // Update current clinic if it's the one being edited
        if (this.currentClinic?.id === parseInt(id)) {
          this.currentClinic = data
        }
        
        return data
      } catch (err) {
        this.error = err.message
        console.error('Update clinic error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Delete clinic
    async deleteClinic(id) {
      this.loading = true
      this.error = null
      
      try {
        const { clinics } = useApi()
        const { error } = await clinics.delete(id)
        
        if (error) {
          throw new Error(error.message || 'Failed to delete clinic')
        }
        
        // Remove from local state
        this.clinics = this.clinics.filter(c => c.id !== parseInt(id))
        
        // Clear current clinic if it's the one deleted
        if (this.currentClinic?.id === parseInt(id)) {
          this.currentClinic = null
        }
        
        return true
      } catch (err) {
        this.error = err.message
        console.error('Delete clinic error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Toggle clinic status (activate/deactivate)
    async toggleClinicStatus(id) {
      const clinic = this.clinics.find(c => c.id === parseInt(id))
      if (!clinic) return
      
      const newStatus = clinic.status === 'active' ? 'inactive' : 'active'
      
      try {
        await this.updateClinic(id, { status: newStatus })
        return newStatus
      } catch (err) {
        console.error('Toggle status error:', err)
        throw err
      }
    },
    
    // Update filters
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    // Reset filters
    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      }
    },
    
    // Clear error
    clearError() {
      this.error = null
    }
  }
})