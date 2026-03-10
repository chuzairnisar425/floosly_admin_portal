import { users } from '../../data/dummyData'
const findUserById = (id) => {
  const userId = parseInt(id)
  return users.find(u => u.id === userId)
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params?.id
  
  // ID is required for all operations in this file
  if (!id || isNaN(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'User ID is required'
    })
  }

  try {
    switch (method) {
      case 'GET':
        // Get single user by ID
        const user = findUserById(id)
        if (!user) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `User with ID ${id} does not exist`
          })
        }
        return user

      case 'PUT':
        // Update user
        const body = await readBody(event)
        const userIndex = users.findIndex(u => u.id === parseInt(id))
        
        if (userIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `User with ID ${id} does not exist`
          })
        }

        // Validate email if provided
        if (body.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(body.email)) {
            throw createError({
              statusCode: 400,
              statusMessage: 'Validation Error',
              message: 'Invalid email format'
            })
          }
        }

        // Validate role if provided
        if (body.role) {
          const validRoles = ['admin', 'dentist', 'receptionist', 'hygienist']
          if (!validRoles.includes(body.role)) {
            throw createError({
              statusCode: 400,
              statusMessage: 'Validation Error',
              message: `Role must be one of: ${validRoles.join(', ')}`
            })
          }
        }

        // Validate status if provided
        if (body.status && !['active', 'inactive'].includes(body.status)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Status must be either "active" or "inactive"'
          })
        }

        // Update user
        const updatedUser = {
          ...users[userIndex],
          ...body,
          id: parseInt(id), // Preserve ID
          clinicId: body.clinicId ? parseInt(body.clinicId) : users[userIndex].clinicId,
          createdAt: users[userIndex].createdAt // Preserve creation date
        }

        users[userIndex] = updatedUser
        return updatedUser

      case 'DELETE':
        // Delete user
        const deleteIndex = users.findIndex(u => u.id === parseInt(id))
        
        if (deleteIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `User with ID ${id} does not exist`
          })
        }

        const deletedUser = users.splice(deleteIndex, 1)[0]
        return {
          message: 'User deleted successfully',
          user: deletedUser
        }

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
