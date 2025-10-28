"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, ShoppingCart, Building2, User } from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  // Types for local mock search results
  type Product = { id: number; name: string; sku: string; category: string; stock: number };
  type Order = { id: number; orderNumber: string; status: string; totalAmount: number };
  type Supplier = { id: number; name: string; code: string; city: string };
  type User = { id: number; name: string; email: string; role: string };

  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    orders: Order[];
    suppliers: Supplier[];
    users: User[];
  }>({ products: [], orders: [], suppliers: [], users: [] });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      // Simulate search results - in a real app, this would call your API
      const mockResults = {
        products: [
          { id: 1, name: "Router", sku: "RT-001", category: "Networking", stock: 45 },
          { id: 2, name: "Switch", sku: "SW-002", category: "Networking", stock: 23 },
        ],
        orders: [
          { id: 1, orderNumber: "ORD-001", status: "PENDING", totalAmount: 1500 },
          { id: 2, orderNumber: "ORD-002", status: "COMPLETED", totalAmount: 2300 },
        ],
        suppliers: [
          { id: 1, name: "Tech Solutions Ltd", code: "TSL-001", city: "Addis Ababa" },
          { id: 2, name: "Network Equipment Co", code: "NEC-002", city: "Dire Dawa" },
        ],
        users: [
          { id: 1, name: "John Doe", email: "john@example.com", role: "ADMIN" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "USER" },
        ]
      };

      // Filter results based on search term
      const filteredResults = {
        products: mockResults.products.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        orders: mockResults.orders.filter(item =>
          item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        suppliers: mockResults.suppliers.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        users: mockResults.users.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const totalResults = searchResults.products.length + searchResults.orders.length +
                     searchResults.suppliers.length + searchResults.users.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Search Results</h1>
        <div className="text-sm text-gray-500">
          {totalResults} results found for "{query}"
        </div>
      </div>

      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Search products, orders, suppliers, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      ) : totalResults === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check the spelling.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Products */}
          {searchResults.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products ({searchResults.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {product.sku} • {product.category}</p>
                      </div>
                      <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                        {product.stock} in stock
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders */}
          {searchResults.orders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Orders ({searchResults.orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{order.orderNumber}</h4>
                        <p className="text-sm text-gray-600">${order.totalAmount}</p>
                      </div>
                      <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suppliers */}
          {searchResults.suppliers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Suppliers ({searchResults.suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.suppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{supplier.name}</h4>
                        <p className="text-sm text-gray-600">{supplier.code} • {supplier.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users */}
          {searchResults.users.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Users ({searchResults.users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
