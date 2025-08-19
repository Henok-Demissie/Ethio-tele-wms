"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";
import { InventoryForm } from "@/components/inventory-form";
import { StockInForm } from "@/components/stock-in-form";
import { StockOutForm } from "@/components/stock-out-form";

interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQty: number;
  location: string;
  lastUpdated: string;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    brand: string;
  };
  warehouse: {
    id: string;
    name: string;
    code: string;
  };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unitPrice: number;
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [presetProductId, setPresetProductId] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryToView, setCategoryToView] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const baseUrl = window.location.origin;
      const [inventoryRes, productsRes, warehousesRes] = await Promise.all([
        fetch(`${baseUrl}/api/inventory`),
        fetch(`${baseUrl}/api/products`),
        fetch(`${baseUrl}/api/warehouses`),
      ]);

      if (inventoryRes.ok) {
        const responseData = await inventoryRes.json();
        console.log("Inventory API response:", responseData);
        const { inventoryItems } = responseData;
        console.log("First inventory item structure:", inventoryItems?.[0]);
        setInventory(inventoryItems || []);
      } else {
        console.error("Failed to fetch inventory:", inventoryRes.status);
        setInventory([]);
      }

      if (productsRes.ok) {
        const responseData = await productsRes.json();
        console.log("Products API response:", responseData);
        const { products } = responseData;
        setProducts(products || []);
      } else {
        console.error("Failed to fetch products:", productsRes.status);
        setProducts([]);
      }

      if (warehousesRes.ok) {
        const responseData = await warehousesRes.json();
        console.log("Warehouses API response:", responseData);
        const { warehouses } = responseData;
        setWarehouses(warehouses || []);
      } else {
        console.error("Failed to fetch warehouses:", warehousesRes.status);
        setWarehouses([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch inventory data");
      // Set default empty arrays on error
      setInventory([]);
      setProducts([]);
      setWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openGlobalStockIn = () => {
    setPresetProductId(null);
    setIsStockInOpen(true);
  };

  const openGlobalStockOut = () => {
    setPresetProductId(null);
    setIsStockOutOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const openCategoryDialog = (category: string) => {
    setCategoryToView(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Inventory item deleted successfully!");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete inventory item");
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await handleDeleteItem(itemToDelete.id);
      closeDeleteDialog();
    }
  };

  const handleFormSuccess = () => {
    console.log("Form success callback triggered, refreshing data...");
    fetchData();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory?.filter((item) => {
    // Safety check for item structure
    if (!item.product || !item.warehouse) {
      return false;
    }
    
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.product.brand && item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || !selectedCategory || item.product.category === selectedCategory;
    const matchesWarehouse = selectedWarehouse === "all" || !selectedWarehouse || item.warehouseId === selectedWarehouse;
    
    return matchesSearch && matchesCategory && matchesWarehouse;
  }) || [];

  // Get unique categories and warehouses for filters
  const categories = [...new Set(products?.map(p => p.category) || [])];
  const warehouseOptions = warehouses?.map(w => ({ id: w.id, name: w.name })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your warehouse inventory, track stock levels, and monitor product availability.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={openGlobalStockIn} variant="outline" className="w-full sm:w-auto">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Stock In
          </Button>
          <Button onClick={openGlobalStockOut} variant="outline" className="w-full sm:w-auto">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Stock Out
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search products, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="warehouse">Warehouse</Label>
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger>
              <SelectValue placeholder="All warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All warehouses</SelectItem>
              {warehouseOptions.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-8">
              <TableHead className="text-xs font-semibold py-1 px-2">Product</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">SKU</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Category</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Brand</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Warehouse</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Location</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Last Updated</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id} className="h-10">
                  <TableCell className="py-1 px-2 text-xs font-medium">{item.product.name}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">{item.product.sku}</TableCell>
                  <TableCell className="py-1 px-2">
                    <button
                      type="button"
                      onClick={() => openCategoryDialog(item.product.category)}
                      title="View all items in this category"
                    >
                      <Badge variant="secondary" className="text-xs hover:ring-1 hover:ring-gray-300">
                        {item.product.category}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="py-1 px-2 text-xs">{item.product.brand}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">{item.warehouse.name}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">{item.location || "N/A"}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPresetProductId(item.product.id); setIsStockInOpen(true); }}
                        className="h-6 w-6 p-0"
                        title="Stock In this product"
                      >
                        <ArrowUpCircle className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPresetProductId(item.product.id); setIsStockOutOpen(true); }}
                        className="h-6 w-6 p-0"
                        title="Stock Out this product"
                      >
                        <ArrowDownCircle className="h-3 w-3 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(item)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inventory Form Dialog */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        mode={editingItem ? "edit" : "add"}
        initialData={editingItem || undefined}
        onSuccess={handleFormSuccess}
      />

      {/* Global or Per-Item Stock In/Out Dialogs */}
      <StockInForm
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        onSuccess={handleFormSuccess}
        presetProductId={presetProductId || undefined}
      />
      <StockOutForm
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        onSuccess={handleFormSuccess}
        presetProductId={presetProductId || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inventory Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
              {itemToDelete && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{itemToDelete.product?.name}</p>
                  <p className="text-sm text-gray-600">SKU: {itemToDelete.product?.sku}</p>
                  <p className="text-sm text-gray-600">Warehouse: {itemToDelete.warehouse?.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {itemToDelete.quantity}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Items Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Category Items</DialogTitle>
            <DialogDescription>
              {categoryToView ? `Items in category: ${categoryToView}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {filteredInventory.filter(i => i.product.category === categoryToView).length === 0 ? (
              <div className="text-sm text-muted-foreground">No items in this category.</div>
            ) : (
              filteredInventory
                .filter(i => i.product.category === categoryToView)
                .map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{i.product.name}</div>
                      <div className="text-xs text-muted-foreground truncate">SKU: {i.product.sku} • Brand: {i.product.brand}</div>
                      <div className="text-xs">Available: {i.quantity - i.reservedQty}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setPresetProductId(i.product.id); setIsStockInOpen(true); }}
                      >
                        <ArrowUpCircle className="h-3 w-3 mr-1" /> In
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setPresetProductId(i.product.id); setIsStockOutOpen(true); }}
                      >
                        <ArrowDownCircle className="h-3 w-3 mr-1" /> Out
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
