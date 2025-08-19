"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestPage() {
  const [dbTest, setDbTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setDbTest(data)
      if (data.success) {
        toast.success("Database connection successful!")
      } else {
        toast.error("Database connection failed!")
      }
    } catch (error) {
      console.error("Test error:", error)
      toast.error("Test failed!")
    } finally {
      setLoading(false)
    }
  }

  const testInventoryAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      console.log("Inventory API response:", data)
      if (response.ok) {
        toast.success(`Inventory API working! Found ${data.inventoryItems?.length || 0} items`)
      } else {
        toast.error(`Inventory API error: ${data.error}`)
      }
    } catch (error) {
      console.error("Inventory API test error:", error)
      toast.error("Inventory API test failed!")
    } finally {
      setLoading(false)
    }
  }

  const testProductsAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      console.log("Products API response:", data)
      if (response.ok) {
        toast.success(`Products API working! Found ${data.products?.length || 0} products`)
      } else {
        toast.error(`Products API error: ${data.error}`)
      }
    } catch (error) {
      console.error("Products API test error:", error)
      toast.error("Products API test failed!")
    } finally {
      setLoading(false)
    }
  }

  const testWarehousesAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/warehouses")
      const data = await response.json()
      console.log("Warehouses API response:", data)
      if (response.ok) {
        toast.success(`Warehouses API working! Found ${data.warehouses?.length || 0} warehouses`)
      } else {
        toast.error(`Warehouses API error: ${data.error}`)
      }
    } catch (error) {
      console.error("Warehouses API test error:", error)
      toast.error("Warehouses API test failed!")
    } finally {
      setLoading(false)
    }
  }

  const testAddInventory = async () => {
    setLoading(true)
    try {
      // First get products and warehouses
      const [productsRes, warehousesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/warehouses")
      ])
      
      const productsData = await productsRes.json()
      const warehousesData = await warehousesRes.json()
      
      if (!productsRes.ok || !warehousesRes.ok) {
        toast.error("Failed to get products or warehouses")
        return
      }
      
      if (productsData.products.length === 0 || warehousesData.warehouses.length === 0) {
        toast.error("No products or warehouses available")
        return
      }
      
      // Use the first product and warehouse
      const testData = {
        productId: productsData.products[0].id,
        warehouseId: warehousesData.warehouses[0].id,
        quantity: 10,
        reservedQty: 0,
        location: "Test Location"
      }
      
      console.log("Testing add inventory with data:", testData)
      
      const response = await fetch("/api/test-add-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })
      
      const data = await response.json()
      console.log("Add inventory response:", data)
      
      if (response.ok) {
        toast.success("Inventory added successfully!")
      } else {
        toast.error(`Add inventory error: ${data.error}`)
      }
    } catch (error) {
      console.error("Add inventory test error:", error)
      toast.error("Add inventory test failed!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Database and API Test Page</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testDatabase} disabled={loading}>
              {loading ? "Testing..." : "Test Database Connection"}
            </Button>
            {dbTest && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold">Database Test Results:</h3>
                <pre className="text-sm mt-2">{JSON.stringify(dbTest, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testInventoryAPI} disabled={loading} variant="outline" className="w-full">
              Test Inventory API
            </Button>
            <Button onClick={testProductsAPI} disabled={loading} variant="outline" className="w-full">
              Test Products API
            </Button>
            <Button onClick={testWarehousesAPI} disabled={loading} variant="outline" className="w-full">
              Test Warehouses API
            </Button>
            <Button onClick={testAddInventory} disabled={loading} variant="outline" className="w-full">
              Test Add Inventory
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            1. Click "Test Database Connection" to verify the database is working
            2. Click the API test buttons to verify each API endpoint is working
            3. Check the browser console for detailed response data
            4. If any tests fail, the error will be shown in the toast notification
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 