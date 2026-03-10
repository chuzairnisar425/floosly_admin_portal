import { clinics } from '../../data/dummyData'

const findClinicById = (id) => {
  const clinicId = parseInt(id)
  return clinics.find(c => c.id === clinicId)
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params?.id
  
  // ID is required for all operations in this file
  if (!id || isNaN(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Clinic ID is required'
    })
  }

  try {
    switch (method) {
      case 'GET':
        // Get single clinic by ID
        const clinic = findClinicById(id)
        if (!clinic) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `Clinic with ID ${id} does not exist`
          })
        }
        return clinic

      case 'PUT':
        // Update clinic
        const body = await readBody(event)
        const clinicIndex = clinics.findIndex(c => c.id === parseInt(id))
        
        if (clinicIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `Clinic with ID ${id} does not exist`
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

        // Validate status if provided
        if (body.status && !['active', 'inactive'].includes(body.status)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Status must be either "active" or "inactive"'
          })
        }

        // Update clinic
        const updatedClinic = {
          ...clinics[clinicIndex],
          ...body,
          id: parseInt(id), // Preserve ID
          createdAt: clinics[clinicIndex].createdAt // Preserve creation date
        }

        clinics[clinicIndex] = updatedClinic
        return updatedClinic

      case 'DELETE':
        // Delete clinic
        const deleteIndex = clinics.findIndex(c => c.id === parseInt(id))
        
        if (deleteIndex === -1) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: `Clinic with ID ${id} does not exist`
          })
        }

        const deletedClinic = clinics.splice(deleteIndex, 1)[0]
        return {
          message: 'Clinic deleted successfully',
          clinic: deletedClinic
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
