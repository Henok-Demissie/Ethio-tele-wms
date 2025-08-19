"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Upload, Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"

const documents = [
  {
    id: "1",
    name: "Inventory Management Policy",
    type: "Policy",
    category: "Operations",
    size: "2.4 MB",
    format: "PDF",
    uploadedBy: "Tigist Haile",
    uploadDate: "2024-01-15",
    lastModified: "2024-01-15",
    downloads: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Supplier Agreement Template",
    type: "Template",
    category: "Legal",
    size: "1.8 MB",
    format: "DOCX",
    uploadedBy: "Abebe Kebede",
    uploadDate: "2024-01-10",
    lastModified: "2024-01-12",
    downloads: 23,
    status: "active",
  },
  {
    id: "3",
    name: "Safety Procedures Manual",
    type: "Manual",
    category: "Safety",
    size: "5.2 MB",
    format: "PDF",
    uploadedBy: "Dawit Tesfaye",
    uploadDate: "2024-01-08",
    lastModified: "2024-01-08",
    downloads: 67,
    status: "active",
  },
  {
    id: "4",
    name: "Monthly Report - December 2023",
    type: "Report",
    category: "Reports",
    size: "3.1 MB",
    format: "PDF",
    uploadedBy: "Rahel Mulugeta",
    uploadDate: "2024-01-05",
    lastModified: "2024-01-05",
    downloads: 89,
    status: "archived",
  },
  {
    id: "5",
    name: "Equipment Maintenance Log",
    type: "Log",
    category: "Maintenance",
    size: "0.8 MB",
    format: "XLSX",
    uploadedBy: "Meron Tadesse",
    uploadDate: "2024-01-03",
    lastModified: "2024-01-16",
    downloads: 12,
    status: "active",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case "archived":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Archived</Badge>
    case "draft":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Draft</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Policy":
      return "text-blue-600"
    case "Manual":
      return "text-green-600"
    case "Report":
      return "text-purple-600"
    case "Template":
      return "text-orange-600"
    case "Log":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground">Manage warehouse documents, policies, and reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Stored documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((doc) => doc.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.reduce((sum, doc) => sum + doc.downloads, 0)}</div>
            <p className="text-xs text-muted-foreground">All time downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13.3 MB</div>
            <p className="text-xs text-muted-foreground">Total storage</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Browse and manage all warehouse documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{document.name}</div>
                          <div className="text-sm text-muted-foreground">{document.format}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getTypeColor(document.type)}`}>{document.type}</span>
                    </TableCell>
                    <TableCell>{document.category}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>{document.uploadedBy}</TableCell>
                    <TableCell>{new Date(document.lastModified).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3 text-muted-foreground" />
                        <span>{document.downloads}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
