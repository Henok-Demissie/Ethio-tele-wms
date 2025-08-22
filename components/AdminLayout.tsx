"use client"

import React from "react"
import { UserAccount } from "@/lib/types"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface AdminLayoutProps {
  user: UserAccount
}

export default function AdminLayout({ user }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Admin Dashboard
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dashboard Cards */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900">Total Products</h3>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">In Stock</h3>
                  <p className="text-3xl font-bold text-green-600">987</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-900">Low Stock</h3>
                  <p className="text-3xl font-bold text-yellow-600">45</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-red-900">Out of Stock</h3>
                  <p className="text-3xl font-bold text-red-600">12</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">No recent activity to display.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
