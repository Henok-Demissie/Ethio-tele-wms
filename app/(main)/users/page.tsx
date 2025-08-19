"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Shield,
  Edit,
  Trash2,
  Crown,
  User,
  Eye,
  Activity,
  Loader2,
} from "lucide-react"
import { toast } from "sonner" // Assuming you have a toast component

interface UserAccount {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "supervisor" | "operator" | "viewer"
  department: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdDate: string
  permissions?: string[] // Permissions might not be directly returned from API for all roles
  avatar?: string
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4 text-yellow-500" />
    case "manager":
      return <Shield className="h-4 w-4 text-blue-500" />
    case "supervisor":
      return <UserCheck className="h-4 w-4 text-green-500" />
    case "operator":
      return <User className="h-4 w-4 text-purple-500" />
    case "viewer":
      return <Eye className="h-4 w-4 text-gray-500" />
    default:
      return <User className="h-4 w-4 text-gray-500" />
  }
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Admin</Badge>
    case "manager":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Manager</Badge>
    case "supervisor":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Supervisor</Badge>
    case "operator":
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Operator</Badge>
    case "viewer":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Viewer</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Inactive</Badge>
    case "suspended":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Suspended</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<UserAccount[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  })
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "", // Optional: for password change
    role: "",
    department: "",
    status: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users?search=${searchTerm}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers()
    } else {
      router.push("/login")
    }
  }, [user, searchTerm]) // Refetch when search term changes

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // User statistics (calculated from fetched data)
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const inactiveUsers = users.filter((user) => user.status === "inactive").length
  const suspendedUsers = users.filter((user) => user.status === "suspended").length
  const adminUsers = users.filter((user) => user.role === "admin").length
  const managerUsers = users.filter((user) => user.role === "manager").length
  const supervisorUsers = users.filter((user) => user.role === "supervisor").length
  const operatorUsers = users.filter((user) => user.role === "operator").length
  const viewerUsers = users.filter((user) => user.role === "viewer").length

  const handleCreateUser = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      toast.success("User created successfully!")
      setIsAddDialogOpen(false)
      setNewUser({ name: "", email: "", password: "", role: "", department: "" })
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create user.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (user: UserAccount) => {
    setSelectedUser(user)
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // Password is not pre-filled for security
      role: user.role,
      department: user.department,
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      toast.success("User updated successfully!")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update user.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick status update helper (admin only)
  const quickUpdateUserStatus = async (userId: string, status: "active" | "inactive" | "suspended") => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update status")
      }
      toast.success("User status updated")
      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast.success("User deleted successfully!")
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete user.")
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Check if the user has permission to view this page
  const userRole = (user.role as string).toUpperCase()
  const hasPermission = ["ADMIN", "MANAGER", "SUPERVISOR", "VIEWER"].includes(userRole)

  if (!hasPermission) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Card className="p-6 text-center">
          <CardTitle>Access Denied</CardTitle>
          <CardDescription className="mt-2">You do not have permission to view this page.</CardDescription>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-gray-800">User Management</h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        {userRole === "ADMIN" && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Plus className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] transition-all duration-300">
              <DialogHeader>
                <DialogTitle className="transition-colors duration-200 hover:text-gray-800">Create New User</DialogTitle>
                <DialogDescription className="transition-colors duration-200 hover:text-gray-600">Add a new user account to the warehouse system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="transition-colors duration-200 hover:text-gray-800">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                    className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="transition-colors duration-200 hover:text-gray-800">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@ethiotelecom.et"
                    required
                    className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="transition-colors duration-200 hover:text-gray-800">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="transition-colors duration-200 hover:text-gray-800">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Admin</SelectItem>
                      <SelectItem value="manager" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Manager</SelectItem>
                      <SelectItem value="supervisor" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Supervisor</SelectItem>
                      <SelectItem value="operator" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Operator</SelectItem>
                      <SelectItem value="viewer" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="transition-colors duration-200 hover:text-gray-800">Department</Label>
                  <Select
                    value={newUser.department}
                    onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                  >
                    <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Administration" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">IT Administration</SelectItem>
                      <SelectItem value="Warehouse Operations" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Warehouse Operations</SelectItem>
                      <SelectItem value="Inventory Management" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Inventory Management</SelectItem>
                      <SelectItem value="Logistics" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Logistics</SelectItem>
                      <SelectItem value="Supply Chain" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Supply Chain</SelectItem>
                      <SelectItem value="Quality Assurance" className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateUser} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">Inactive accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedUsers}</div>
            <p className="text-xs text-muted-foreground">Suspended accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>User distribution across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Admin: {adminUsers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Manager: {managerUsers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="text-sm">Supervisor: {supervisorUsers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Operator: {operatorUsers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Viewer: {viewerUsers}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage all user accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, email, department, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="h-8">
                    <TableHead className="text-xs font-semibold py-1 px-2">User</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Role</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Department</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Status</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Last Login</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Created</TableHead>
                    <TableHead className="text-xs font-semibold py-1 px-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="h-10">
                      <TableCell className="py-1 px-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <span className="text-xs">{user.department}</span>
                      </TableCell>
                      <TableCell className="py-1 px-2">{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="py-1 px-2">
                        <div className="text-xs">
                          {new Date(user.lastLogin).toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.lastLogin).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <span className="text-xs">{new Date(user.createdDate).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {userRole === "ADMIN" && (
                              <>
                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-3 w-3 mr-2" />
                                  Manage Permissions
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <Activity className="h-3 w-3 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {userRole === "ADMIN" && (
                              <>
                                {user.status === "active" ? (
                                  <DropdownMenuItem
                                    onClick={() => quickUpdateUserStatus(user.id, "inactive")}
                                  >
                                    <UserX className="h-3 w-3 mr-2" />
                                    Deactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => quickUpdateUserStatus(user.id, "active")}
                                  >
                                    <UserCheck className="h-3 w-3 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Make changes to user account details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  placeholder="user@ethiotelecom.et"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={editUser.role} onValueChange={(value) => setEditUser({ ...editUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={editUser.department}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Administration">IT Administration</SelectItem>
                    <SelectItem value="Warehouse Operations">Warehouse Operations</SelectItem>
                    <SelectItem value="Inventory Management">Inventory Management</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editUser.status} onValueChange={(value) => setEditUser({ ...editUser, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
