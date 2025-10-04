import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col">
        {/* 3. Header */}
        <Header />
        
        {/* 4. Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}