// types/user.ts
export type UserRole = 'admin' | 'dentist' | 'receptionist' | 'hygienist'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  clinicId: number
  status: UserStatus
  createdAt: string
}

export interface CreateUserDTO {
  name: string
  email: string
  role: UserRole
  clinicId: number
  status: UserStatus
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {}

export interface UserFilters {
  search?: string
  role?: UserRole | 'all'
  status?: UserStatus | 'all'
  clinicId?: number
  sortBy?: keyof User
  sortOrder?: 'asc' | 'desc'
}

export interface UsersResponse {
  data: User[]
  total: number
  active: number
  inactive: number
  byRole: Record<UserRole, number>
}