// server/api/users/[name].js
import { users } from '../../data/dummyData'
// Helper function to find user by ID
const findUserById = (id) => {
  const userId = parseInt(id)
  return users.find(u => u.id === userId)
}

// Helper function to generate new ID
const generateNewId = () => {
  return Math.max(...users.map(u => u.id), 0) + 1
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const { name } = event.context.params || {}
  
  try {
    switch (method) {
      case 'GET':
        if (name && !isNaN(parseInt(name))) {
          const user = findUserById(name)
          if (!user) {
            throw createError({
              statusCode: 404,
              statusMessage: 'User not found',
              message: `User with ID ${name} does not exist`
            })
          }
          return user
        }
        return users

      case 'POST':
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

        const newUser = {
          id: generateNewId(),
          ...body,
          clinicId: parseInt(body.clinicId),
          createdAt: new Date().toISOString().split('T')[0]
        }

        users.push(newUser)
        return newUser

      case 'PUT':
        if (!name || isNaN(parseInt(name))) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'User ID is required for update'
          })
        }

        const userIndex = users.findIndex(u => u.id === parseInt(name))
        if (userIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `User with ID ${name} not found`
          })
        }

        const updateData = await readBody(event)
        
        // Validate role if provided
        if (updateData.role) {
          const validRoles = ['admin', 'dentist', 'receptionist', 'hygienist']
          if (!validRoles.includes(updateData.role)) {
            throw createError({
              statusCode: 400,
              statusMessage: 'Validation Error',
              message: `Role must be one of: ${validRoles.join(', ')}`
            })
          }
        }

        // Validate status if provided
        if (updateData.status && !['active', 'inactive'].includes(updateData.status)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Status must be either "active" or "inactive"'
          })
        }

        // Update user
        users[userIndex] = {
          ...users[userIndex],
          ...updateData,
          id: users[userIndex].id,
          clinicId: updateData.clinicId ? parseInt(updateData.clinicId) : users[userIndex].clinicId,
          createdAt: users[userIndex].createdAt
        }

        return users[userIndex]

      case 'DELETE':
        if (!name || isNaN(parseInt(name))) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'User ID is required for deletion'
          })
        }

        const deleteIndex = users.findIndex(u => u.id === parseInt(name))
        if (deleteIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `User with ID ${name} not found`
          })
        }

        const deletedUser = users.splice(deleteIndex, 1)[0]
        
        return {
          message: 'User deleted successfully',
          deletedUser
        }

      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method Not Allowed',
          message: `HTTP method ${method} is not supported for this endpoint`
        })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An unexpected error occurred',
      data: error.message
    })
  }
})