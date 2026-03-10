import { users } from '../../data/dummyData'

export default defineEventHandler(async (event) => {
  const method = event.method
  
  try {
    switch (method) {
      case 'GET':
        // Return all users
        return users

      case 'POST':
        // Create new user
        const body = await readBody(event)
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'role', 'clinicId', 'status']
        const missingFields = requiredFields.filter(field => !body[field])
        
        if (missingFields.length > 0) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: `Missing required fields: ${missingFields.join(', ')}`
          })
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Invalid email format'
          })
        }

        // Validate role
        const validRoles = ['admin', 'dentist', 'receptionist', 'hygienist']
        if (!validRoles.includes(body.role)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: `Role must be one of: ${validRoles.join(', ')}`
          })
        }

        // Validate status
        if (!['active', 'inactive'].includes(body.status)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Status must be either "active" or "inactive"'
          })
        }

        // Generate new ID
        const newId = Math.max(...users.map(u => u.id), 0) + 1
        
        const newUser = {
          id: newId,
          ...body,
          clinicId: parseInt(body.clinicId),
          createdAt: new Date().toISOString().split('T')[0]
        }

        users.push(newUser)
        return newUser

      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method Not Allowed'
        })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    })
  }
})
