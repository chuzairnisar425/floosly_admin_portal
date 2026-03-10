import { clinics } from '../../data/dummyData'

export default defineEventHandler(async (event) => {
  const method = event.method
  
  try {
    switch (method) {
      case 'GET':
        // Return all clinics
        return clinics

      case 'POST':
        // Create new clinic
        const body = await readBody(event)
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'address', 'status']
        const missingFields = requiredFields.filter(field => !body[field])
        
        if (missingFields.length > 0) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: `Missing required fields: ${missingFields.join(', ')}`
          })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Invalid email format'
          })
        }

        // Validate phone
        if (!body.phone.match(/^[\+\d\s-]+$/)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Invalid phone number format'
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
        const newId = Math.max(...clinics.map(c => c.id), 0) + 1
        
        const newClinic = {
          id: newId,
          ...body,
          createdAt: new Date().toISOString().split('T')[0]
        }

        clinics.push(newClinic)
        return newClinic

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
