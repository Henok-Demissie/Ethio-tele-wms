"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user.name || ""} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <Badge variant="outline" className="w-fit mx-auto">
              {user.role}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            {user.department && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>{user.department}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Status: {user.status || "Active"}</span>
            </div>
            {user.lastLogin && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{user.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{user.department || "Not specified"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-sm text-gray-900 py-2">
                  <Badge variant="outline">{user.role}</Badge>
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">24</h3>
              <p className="text-sm text-blue-800">Orders Processed</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">156</h3>
              <p className="text-sm text-green-800">Items Managed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">8</h3>
              <p className="text-sm text-purple-800">Reports Generated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
