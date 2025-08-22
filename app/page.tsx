"use client"

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import UserLayout from "@/components/UserLayout";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by trying to fetch user data
    fetch("/api/auth/me")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to EthioTelecom WMS</h1>
          <p className="text-gray-600 mb-6">Please login to access the dashboard</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Convert user to UserAccount type
  const userAccount = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role as any,
    department: user.department || '',
    status: 'active' as const,
    lastLogin: new Date().toISOString(),
    createdDate: new Date().toISOString(),
    permissions: [],
    avatar: undefined
  };

  if (userAccount.role === "admin") {
    return <AdminLayout user={userAccount} />;
  } else {
    return <UserLayout user={userAccount} />;
  }
}
