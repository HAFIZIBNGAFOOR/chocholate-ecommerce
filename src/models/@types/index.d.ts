import mongoose, { SortOrder, UpdateQuery } from 'mongoose'

export type UpdateType<T> = {
  fieldName: keyof T
  value: string
  updateData: UpdateQuery<T>
}

export type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: boolean) => void,
) => void

export type NewUserDocument = {
  userId: string
  userType: 'companyAdmin' | 'clubAdmin' | 'clubMember'
  email: string
  password: string
  clubMemberId?: string
  companyId?: string
  clubId?: string
  checkStatus: 'online' | 'offline'
  status: 'active' | 'deleted' | 'suspend'
  profileImage?: string
  username?: string
  refreshToken: string | null
  deletedAt: Date | null
}

export type UpdateUserDocument = Partial<NewUserDocument>

export type UserDocument = mongoose.Document &
  NewUserDocument & {
    comparePassword: comparePasswordFunction
  }

export type NewTokenDocument = {
  tokenId: string
  userId: string | null
  email: string
  tokenType: 'forgot' | 'register'
  expiredAt: Date | null
}
export type TokenDocument = mongoose.Document &
  NewTokenDocument &
  TokenAdminDocument

export type NewAdminDocument = {
  adminId: string
  email: string
  password: string
  adminType: 'superAdmin' | 'admin'
  refreshToken?: string | null
  deletedAt: Date | null
}

export type UpdateAdminDocument = {
  email?: string
  password?: string
  name?: string
  adminType?: 'superAdmin' | 'admin'
  refreshToken?: string | null
}

export type AdminDocument = mongoose.Document &
  NewAdminDocument & {
    comparePassword: comparePasswordFunction
  }
export type NewTokenAdminDocument = {
  tokenId: string
  adminId: string | null
  tokenType: 'forgot' | 'register'
  email: string
  expiredAt: Date | null
}
export type TokenAdminDocument = mongoose.Document & NewTokenAdminDocument

export type NewUniversityDocument = {
  universityId: string
  universityName: string
  logoUrl: string
  province: string
  address: string
  city: string
  type: 'national' | 'prefectural' | 'city' | 'private'
  website: string
  deletedAt: Date | null
}

