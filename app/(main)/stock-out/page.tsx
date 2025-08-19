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
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { StockOutForm } from "@/components/stock-out-form";

interface StockOutRequest {
  id: string;
  orderNumber: string;
  warehouse: {
    id: string;
    name: string;
    code: string;
  };
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  notes: string;
  totalAmount: number;
  createdAt: string;
  orderItems: StockOutItem[];
}

interface StockOutItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
}

export default function StockOutPage() {
  const [requests, setRequests] = useState<StockOutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stock-out");
      
      if (response.ok) {
        const { stockOutRecords } = await response.json();
        setRequests(stockOutRecords || []);
      } else {
        console.error("Failed to fetch stock-out requests");
        setRequests([]);
        toast.error("Failed to fetch stock-out requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
      toast.error("Failed to fetch stock-out requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRequest = () => {
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchRequests();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="default" className="bg-blue-600">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "SALE":
        return "Sale";
      case "TRANSFER":
        return "Transfer";
      case "DAMAGED":
        return "Damaged";
      case "EXPIRED":
        return "Expired";
      case "OTHER":
        return "Other";
      default:
        return reason;
    }
  };

  // Filter requests based on search, status, and reason
  const filteredRequests = requests.filter((request) => {
    // Safety check to ensure request has required properties
    if (!request.orderNumber || !request.warehouse?.name) {
      return false;
    }
    
    const matchesSearch = 
      request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || !statusFilter || request.status === statusFilter;
    const matchesReason = reasonFilter === "all" || !reasonFilter || request.reason === reasonFilter;
    
    return matchesSearch && matchesStatus && matchesReason;
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
          <h1 className="text-3xl font-bold tracking-tight">Stock Out Management</h1>
          <p className="text-muted-foreground">
            Manage outgoing inventory requests and stock movements.
          </p>
        </div>
        <Button onClick={handleAddRequest} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Stock-Out Request
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search order number or warehouse..."
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
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All reasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reasons</SelectItem>
              <SelectItem value="SALE">Sale</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
              <SelectItem value="DAMAGED">Damaged</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-8">
              <TableHead className="text-xs font-semibold py-1 px-2">Request #</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Warehouse</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Reason</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Status</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Total Quantity</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Notes</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Created</TableHead>
              <TableHead className="text-xs font-semibold py-1 px-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No stock-out requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="h-10">
                  <TableCell className="py-1 px-2 text-xs font-medium">{request.orderNumber}</TableCell>
                  <TableCell className="py-1 px-2">
                    <div>
                      <div className="text-xs font-medium">{request.warehouse.name}</div>
                      <div className="text-xs text-muted-foreground">{request.warehouse.code}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Badge variant="outline" className="text-xs">{getReasonLabel(request.reason)}</Badge>
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      {getStatusBadge(request.status)}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2 text-xs">{request.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}</TableCell>
                  <TableCell className="py-1 px-2">
                    <div className="max-w-[150px] truncate text-xs" title={request.notes}>
                      {request.notes || "No notes"}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2 text-xs">{new Date(request.createdAt).toLocaleDateString()}</TableCell>
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

      {/* Stock-Out Form Dialog */}
      <StockOutForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
