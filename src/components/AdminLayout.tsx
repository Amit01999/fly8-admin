
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardHeader } from './DashboardHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar - doesn't scroll with content */}
      <div className="flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area - scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
