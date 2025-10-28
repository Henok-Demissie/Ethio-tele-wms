import React from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    }>
      {/* Client-side search UI */}
      <SearchClient />
    </React.Suspense>
  );
}
