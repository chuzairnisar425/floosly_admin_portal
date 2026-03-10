// types/clinic.ts
export interface Clinic {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CreateClinicDTO {
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
}

export interface UpdateClinicDTO extends Partial<CreateClinicDTO> {}

export interface ClinicFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  sortBy?: keyof Clinic
  sortOrder?: 'asc' | 'desc'
}

export interface ClinicsResponse {
  data: Clinic[]
  total: number
  active: number
  inactive: number
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  message: string
  data?: any
}