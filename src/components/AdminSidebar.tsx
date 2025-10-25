import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Plane,
  Home,
  CreditCard,
  Briefcase,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '../../public/logo.png';

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Profile Assessment', href: '/profile-assessment', icon: FileText },
  { name: 'Preparation Support', href: '/preparation', icon: GraduationCap },
  {
    name: 'University Applications',
    href: '/applications',
    icon: GraduationCap,
  },
  { name: 'Visa Support', href: '/visa', icon: FileText },
  { name: 'Travel Support', href: '/travel', icon: Plane },
  { name: 'Accommodation', href: '/accommodation', icon: Home },
  { name: 'Education Loans', href: '/loans', icon: CreditCard },
  { name: 'Job Opportunities', href: '/jobs', icon: Briefcase },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Logo Header - Fixed */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Fly8 Logo" className="w-8 h-8" />

          <h1 className="text-xl font-bold">Admin</h1>
        </div>
      </div>

      {/* Navigation - Scrollable without visible scrollbar */}
      <nav className="flex-1 overflow-y-auto mt-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sidebarItems.map(item => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-6 py-3 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors',
                isActive && 'bg-blue-600 text-white border-r-2 border-blue-400'
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
