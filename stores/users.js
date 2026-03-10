// stores/users.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      role: 'all',
      status: 'all',
      clinicId: null,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }),

  getters: {
    // Basic stats
    totalUsers: (state) => state.users.length,
    
    activeUsers: (state) => 
      state.users.filter(u => u.status === 'active').length,
    
    inactiveUsers: (state) => 
      state.users.filter(u => u.status === 'inactive').length,
    
    // Users by role
    usersByRole: (state) => {
      return state.users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {})
    },
    
    // Filtered users
    filteredUsers: (state) => {
      let filtered = [...state.users]
      
      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply role filter
      if (state.filters.role !== 'all') {
        filtered = filtered.filter(user => user.role === state.filters.role)
      }
      
      // Apply status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(user => user.status === state.filters.status)
      }
      
      // Apply clinic filter
      if (state.filters.clinicId) {
        filtered = filtered.filter(user => user.clinicId === state.filters.clinicId)
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
    
    // Get users by clinic
    getUsersByClinic: (state) => (clinicId) => {
      return state.users.filter(u => u.clinicId === clinicId)
    },
    
    // Get user by ID
    getUserById: (state) => (id) => {
      return state.users.find(u => u.id === parseInt(id))
    }
  },

  actions: {
    // Fetch all users
    async fetchUsers(force = false) {
      // Don't refetch if we already have data (unless forced)
      if (this.users.length > 0 && !this.loading && !force) {
        return this.users
      }

      this.loading = true
      this.error = null

      
      try {
        const { users } = useApi()
        const { data, error } = await users.getAll()

        if (error) {
          throw new Error(error.message || 'Failed to fetch users')
        }

        this.users = data || []
        return this.users
      } catch (err) {
        this.error = err.message
        console.error('Fetch users error:', err)
      } finally {
        this.loading = false
      }
    },
    
    // Refresh users data (force fetch)
    async refreshUsers() {
      return this.fetchUsers(true)
    },
    async fetchUser(id) {
      this.loading = true
      this.error = null
      
      try {
        const { users } = useApi()
        const { data, error } = await users.getById(id)
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch user')
        }
        
        this.currentUser = data
        return data
      } catch (err) {
        this.error = err.message
        console.error('Fetch user error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Create user
    async createUser(userData) {
      this.loading = true
      this.error = null
      
      try {
        const { users } = useApi()
        const { data, error } = await users.create(userData)
        
        if (error) {
          throw new Error(error.message || 'Failed to create user')
        }
        
        this.users.push(data)
        return data
      } catch (err) {
        this.error = err.message
        console.error('Create user error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Update user
    async updateUser(id, userData) {
      this.loading = true
      this.error = null
      
      try {
        const { users } = useApi()
        const { data, error } = await users.update(id, userData)
        
        if (error) {
          throw new Error(error.message || 'Failed to update user')
        }
        
        const index = this.users.findIndex(u => u.id === parseInt(id))
        if (index !== -1) {
          this.users[index] = data
        }
        
        if (this.currentUser?.id === parseInt(id)) {
          this.currentUser = data
        }
        
        return data
      } catch (err) {
        this.error = err.message
        console.error('Update user error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Delete user
    async deleteUser(id) {
      this.loading = true
      this.error = null
      
      try {
        const { users } = useApi()
        const { error } = await users.delete(id)
        
        if (error) {
          throw new Error(error.message || 'Failed to delete user')
        }
        
        this.users = this.users.filter(u => u.id !== parseInt(id))
        
        if (this.currentUser?.id === parseInt(id)) {
          this.currentUser = null
        }
        
        return true
      } catch (err) {
        this.error = err.message
        console.error('Delete user error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    
    // Toggle user status
    async toggleUserStatus(id) {
      const user = this.users.find(u => u.id === parseInt(id))
      if (!user) return
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      
      try {
        await this.updateUser(id, { status: newStatus })
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
        role: 'all',
        status: 'all',
        clinicId: null,
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