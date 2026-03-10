
import { clinics } from '../../data/dummyData'
// Helper function to find clinic by ID
const findClinicById = (id) => {
  const clinicId = parseInt(id)
  return clinics.find(c => c.id === clinicId)
}

// Helper function to generate new ID
const generateNewId = () => {
  return Math.max(...clinics.map(c => c.id), 0) + 1
}

// GET /api/clinics - Get all clinics
// GET /api/clinics/{id} - Get single clinic
// POST /api/clinics - Create clinic
// PUT /api/clinics/{id} - Update clinic
// DELETE /api/clinics/{id} - Delete clinic

export default defineEventHandler(async (event) => {
  const method = event.method
  const { name } = event.context.params || {}
  try {
    // Handle different HTTP methods
    switch (method) {
      case 'GET':
        // If there's an ID in the params (e.g., /api/clinics/1)
        if (name && !isNaN(parseInt(name))) {
          const clinic = findClinicById(name)
          if (!clinic) {
            throw createError({
              statusCode: 404,
              statusMessage: 'Clinic not found',
              message: `Clinic with ID ${name} does not exist`
            })
          }
          return clinic
        }
        // If no ID, return all clinics (GET /api/clinics)
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

        // Validate phone (simple validation)
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

        const newClinic = {
          id: generateNewId(),
          ...body,
          createdAt: new Date().toISOString().split('T')[0]
        }

        clinics.push(newClinic)
        return newClinic

      case 'PUT':
        // Update existing clinic
        if (!name || isNaN(parseInt(name))) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Clinic ID is required for update'
          })
        }

        const clinicIndex = clinics.findIndex(c => c.id === parseInt(name))
        if (clinicIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `Clinic with ID ${name} not found`
          })
        }

        const updateData = await readBody(event)
        
        // Validate status if provided
        if (updateData.status && !['active', 'inactive'].includes(updateData.status)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Status must be either "active" or "inactive"'
          })
        }

        // Update clinic (preserve id and createdAt)
        clinics[clinicIndex] = {
          ...clinics[clinicIndex],
          ...updateData,
          id: clinics[clinicIndex].id, // Ensure ID doesn't change
          createdAt: clinics[clinicIndex].createdAt // Preserve original creation date
        }

        return clinics[clinicIndex]

      case 'DELETE':
        // Delete clinic
        if (!name || isNaN(parseInt(name))) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Clinic ID is required for deletion'
          })
        }

        const deleteIndex = clinics.findIndex(c => c.id === parseInt(name))
        if (deleteIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `Clinic with ID ${name} not found`
          })
        }

        // Remove clinic
        const deletedClinic = clinics.splice(deleteIndex, 1)[0]
        
        // Also remove associated users? (Optional - good to mention in docs)
        // This shows you're thinking about data integrity
        
        return {
          message: 'Clinic deleted successfully',
          deletedClinic
        }

      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method Not Allowed',
          message: `HTTP method ${method} is not supported for this endpoint`
        })
    }
  } catch (error) {
    // Re-throw if it's already a createError
    if (error.statusCode) {
      throw error
    }
    
    // Handle unexpected errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An unexpected error occurred',
      data: error.message
    })
  }
})