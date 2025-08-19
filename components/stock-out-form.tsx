"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, Loader2, Search, Package, Warehouse, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

interface StockOutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  presetProductId?: string;
}

interface StockOutItem {
  productId: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unitPrice: number;
  currentStock?: number;
}

interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
}

export function StockOutForm({
  isOpen,
  onClose,
  onSuccess,
  presetProductId,
}: StockOutFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    warehouseId: "",
    reason: "",
    notes: "",
    items: [{
      productId: presetProductId || "",
      quantity: 1,
    }],
  });

  // Fetch data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (presetProductId) {
        setFormData((prev) => ({
          ...prev,
          items: [{ productId: presetProductId, quantity: 1 }],
        }));
      }
    }
  }, [isOpen, presetProductId]);

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

  // Get selected warehouse details
  const selectedWarehouse = warehouses.find(w => w.id === formData.warehouseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.warehouseId) {
      toast.error("Please select a warehouse");
      return;
    }
    if (!formData.reason) {
      toast.error("Please select a reason for stock-out");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    
    // Validate each item
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.productId) {
        toast.error(`Please select a product for item ${i + 1}`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      const requestBody = {
        warehouseId: formData.warehouseId,
        reason: formData.reason,
        notes: formData.notes,
        items: formData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      
      const response = await fetch("/api/stock-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        toast.success("Stock-out request created successfully!");
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          warehouseId: "",
          reason: "",
          notes: "",
          items: [{
            productId: "",
            quantity: 1,
          }],
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating stock-out request:", error);
      toast.error("Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        productId: "",
        quantity: 1,
      }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof StockOutItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="transition-colors duration-200 hover:text-gray-800 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            Create Stock-Out Request
          </DialogTitle>
          <DialogDescription className="transition-colors duration-200 hover:text-gray-600">
            Request inventory items to be removed from warehouse
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Warehouse Selection Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                Warehouse Selection
              </Label>
              
              <div className="grid gap-2">
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
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800">
                    <div className="font-medium">{selectedWarehouse.name}</div>
                    <div className="text-green-600">
                      Code: {selectedWarehouse.code} • Location: {selectedWarehouse.location}
                    </div>
                    <div className="text-green-600">
                      Capacity: {selectedWarehouse.capacity || "Unlimited"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reason and Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reason: value })
                  }
                >
                  <SelectTrigger className="transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">Sale</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="DAMAGED">Damaged</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Product Selection Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Selection
              </Label>
              
              {/* Category Filter */}
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700">Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Item {index + 1}</Label>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Product *</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateItem(index, 'productId', value)}
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
                  </div>

                  {/* Product Details Display */}
                  {item.productId && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">
                          {products.find(p => p.id === item.productId)?.name}
                        </div>
                        <div className="text-gray-600">
                          SKU: {products.find(p => p.id === item.productId)?.sku} • 
                          Brand: {products.find(p => p.id === item.productId)?.brand}
                        </div>
                        <div className="text-gray-600">
                          Unit Price: ${products.find(p => p.id === item.productId)?.unitPrice}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
