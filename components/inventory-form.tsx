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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, Package, Warehouse } from "lucide-react";
import { toast } from "sonner";

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    reservedQty: number;
    location: string;
  };
  onSuccess: () => void;
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
  location: string;
  capacity: number;
}

export function InventoryForm({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess,
}: InventoryFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: 0,
    reservedQty: 0,
    location: "",
  });

  // Fetch products and warehouses on component mount
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        productId: initialData.productId || "",
        warehouseId: initialData.warehouseId || "",
        quantity: initialData.quantity || 0,
        reservedQty: initialData.reservedQty || 0,
        location: initialData.location || "",
      });
    } else {
      setFormData({
        productId: "",
        warehouseId: "",
        quantity: 0,
        reservedQty: 0,
        location: "",
      });
    }
  }, [initialData]);

  const fetchData = async () => {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/warehouses"),
      ]);

      if (productsRes.ok) {
        const { products } = await productsRes.json();
        setProducts(products);
      }

      if (warehousesRes.ok) {
        const { warehouses } = await warehousesRes.json();
        setWarehouses(warehouses);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch form data");
    }
  };

  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  // Get selected product details
  const selectedProduct = products.find(p => p.id === formData.productId);
  const selectedWarehouse = warehouses.find(w => w.id === formData.warehouseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.productId) {
      toast.error("Please select a product");
      return;
    }

    if (!formData.warehouseId) {
      toast.error("Please select a warehouse");
      return;
    }

    if (formData.quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    if (formData.reservedQty < 0) {
      toast.error("Reserved quantity cannot be negative");
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData = {
        productId: formData.productId,
        warehouseId: formData.warehouseId,
        quantity: parseInt(formData.quantity.toString()) || 0,
        reservedQty: parseInt(formData.reservedQty.toString()) || 0,
        location: formData.location || "",
      };

      let response;
      if (mode === "add") {
        response = await fetch("/api/inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // Edit mode
        response = await fetch(`/api/inventory/${initialData?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

             if (response.ok) {
         const responseData = await response.json();
         console.log("Form submission successful:", responseData);
         const successMessage = mode === "add" 
           ? "✅ Inventory item added successfully!" 
           : "✅ Inventory item updated successfully!";
         toast.success(successMessage);
         onSuccess();
         onClose();
       } else {
         const errorData = await response.json();
         console.error("Form submission failed:", errorData);
         toast.error(errorData.error || `Failed to ${mode} inventory item`);
       }
    } catch (error) {
      console.error(`Error ${mode}ing inventory item:`, error);
      toast.error(`❌ Failed to ${mode} inventory item. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
             <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto transition-all duration-300">
                 <DialogHeader className="pb-2">
           <DialogTitle className="text-lg transition-colors duration-200 hover:text-gray-800">
             {mode === "add" ? "Add Inventory Item" : "Edit Inventory Item"}
           </DialogTitle>
         </DialogHeader>
        
                 <form onSubmit={handleSubmit}>
           <div className="grid gap-3 py-3">
                         {/* Product Selection Section */}
             <div className="space-y-2">
                             <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                 <Package className="h-3 w-3" />
                 Product Selection
               </Label>
              
                             {/* Category Filter */}
               <div className="grid gap-1">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                             {/* Product Search */}
               <div className="grid gap-1">
                <Label htmlFor="productSearch">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="productSearch"
                    placeholder="Search by name, SKU, or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

                             {/* Product Selection */}
               <div className="grid gap-1">
                <Label htmlFor="product">Product *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                >
                  <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                                          {filteredProducts.length === 0 ? (
                        <SelectItem value="no-products" disabled>
                          No products found
                        </SelectItem>
                      ) : (
                      filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-sm text-gray-500">
                              SKU: {product.sku} • {product.brand} • ${product.unitPrice}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

                             {/* Selected Product Info */}
               {selectedProduct && (
                 <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                   <div className="text-xs text-blue-800">
                     <div className="font-medium">{selectedProduct.name}</div>
                     <div className="text-blue-600">
                       {selectedProduct.category} • {selectedProduct.brand} • SKU: {selectedProduct.sku} • ${selectedProduct.unitPrice}
                     </div>
                   </div>
                 </div>
               )}
            </div>

                         {/* Warehouse Selection Section */}
             <div className="space-y-2">
                             <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                 <Warehouse className="h-3 w-3" />
                 Warehouse Selection
               </Label>
              
                             <div className="grid gap-1">
                 <Label htmlFor="warehouse">Warehouse *</Label>
                <Select
                  value={formData.warehouseId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, warehouseId: value })
                  }
                >
                  <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id} className="transition-all duration-200 hover:bg-gray-100 hover:scale-105">
                        <div className="flex flex-col">
                          <span className="font-medium">{warehouse.name}</span>
                          <span className="text-sm text-gray-500">
                            Code: {warehouse.code} • Location: {warehouse.location}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                             {/* Selected Warehouse Info */}
               {selectedWarehouse && (
                 <div className="p-2 bg-green-50 rounded-md border border-green-200">
                   <div className="text-xs text-green-800">
                     <div className="font-medium">{selectedWarehouse.name}</div>
                     <div className="text-green-600">
                       {selectedWarehouse.code} • {selectedWarehouse.location} • Capacity: {selectedWarehouse.capacity || "Unlimited"}
                     </div>
                   </div>
                 </div>
               )}
            </div>
            
                         {/* Quantity and Location Section */}
             <div className="grid grid-cols-2 gap-3">
                             <div className="grid gap-1">
                 <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
                             <div className="grid gap-1">
                 <Label htmlFor="reservedQty">Reserved Quantity</Label>
                <Input
                  type="number"
                  value={formData.reservedQty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reservedQty: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
                         <div className="grid gap-1">
               <Label htmlFor="location">Storage Location</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., A1-B2, Shelf 3, Rack 5"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Updating..."}
                </>
              ) : (
                mode === "add" ? "Add Item" : "Update Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
