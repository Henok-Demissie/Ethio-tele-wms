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
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { StockInForm } from "@/components/stock-in-form";

interface StockInReceipt {
  id: string;
  orderNumber: string;
  supplier?: {
    id: string;
    name: string;
    code: string;
  };
  warehouse?: {
    id: string;
    name: string;
    code: string;
  };
  reason?: string;
  expectedDate?: string;
  status: "PENDING" | "RECEIVED" | "CANCELLED";
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  orderItems?: StockInItem[];
}

interface StockInItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
  quantity: number;
  totalPrice: number;
}

export default function StockInPage() {
  const [receipts, setReceipts] = useState<StockInReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stock-in");
      
      if (response.ok) {
        const { stockInRecords } = await response.json();
        setReceipts(stockInRecords || []);
      } else {
        console.error("Failed to fetch stock-in receipts");
        setReceipts([]);
        toast.error("Failed to fetch stock-in receipts");
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setReceipts([]);
      toast.error("Failed to fetch stock-in receipts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReceipt = () => {
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchReceipts();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "RECEIVED":
        return <Badge variant="default" className="bg-green-600">Received</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "RECEIVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Filter receipts based on search and status
  const filteredReceipts = (receipts || []).filter((receipt) => {
    const matchesSearch = 
      receipt.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || !statusFilter || receipt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Stock In Management</h1>
          <p className="text-muted-foreground">
            Manage incoming inventory shipments and stock receipts.
          </p>
        </div>
        <Button onClick={handleAddReceipt} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Stock-In Receipt
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search receipt number, supplier, or PO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RECEIVED">Received</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-8">
              <TableHead className="text-xs font-semibold py-1 px-2">Receipt #</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Supplier</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Warehouse</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Purchase Order</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Expected Date</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Status</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Total Amount</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Created</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No stock-in receipts found
                </TableCell>
              </TableRow>
            ) : (
              filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id} className="h-10">
                  <TableCell className="py-1 px-2 text-xs font-medium">{receipt.orderNumber}</TableCell>
                  <TableCell className="py-1 px-2">
                    <div>
                      <div className="text-xs font-medium">{receipt.supplier?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{receipt.supplier?.code || ""}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <div>
                      <div className="text-xs font-medium">{receipt.warehouse?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{receipt.warehouse?.code || ""}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2 text-xs">{receipt.reason || "N/A"}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">
                    {receipt.expectedDate ? new Date(receipt.expectedDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(receipt.status)}
                      {getStatusBadge(receipt.status)}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2 text-xs">${receipt.totalAmount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell className="py-1 px-2 text-xs">{new Date(receipt.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-1 px-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stock-In Form Dialog */}
      <StockInForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
