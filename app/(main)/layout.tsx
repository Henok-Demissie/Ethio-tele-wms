"use client";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Remove leading slash and capitalize first letter
  const formattedHeader = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(1).slice(1);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header header={formattedHeader} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
