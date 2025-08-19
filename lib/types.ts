export interface UserAccount {
  id: string
  name: string
  email: string
  password_hash?: string // Add password_hash
  role: "admin" | "manager" | "supervisor" | "operator" | "viewer"
  department: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdDate: string
  permissions: string[]
  avatar?: string
}
