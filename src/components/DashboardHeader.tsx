import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Activity,
  UserCircle2,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { notificationAPI, type Notification } from '@/services/notificationAPI';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const DashboardHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch unread notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['adminNotifications', { status: 'unread', limit: 10 }],
    queryFn: () =>
      notificationAPI.getAdminNotifications({ status: 'unread', limit: 10 }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const notifications: Notification[] = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.pagination?.total || 0;

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      toast.success('Notification marked as read');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      toast.success('All notifications marked as read');
    },
  });

  // Get page title and breadcrumbs based on current route
  const getPageInfo = () => {
    const path = location.pathname;

    if (path === '/' || path === '/dashboard') {
      return { title: 'Dashboard', breadcrumbs: ['Dashboard'] };
    } else if (path === '/students') {
      return { title: 'Students', breadcrumbs: ['Dashboard', 'Students'] };
    } else if (path.startsWith('/students/')) {
      return {
        title: 'Student Details',
        breadcrumbs: ['Dashboard', 'Students', 'Details'],
      };
    } else if (path === '/messages') {
      return { title: 'Messages', breadcrumbs: ['Dashboard', 'Messages'] };
    } else if (path === '/appointments') {
      return {
        title: 'Appointments',
        breadcrumbs: ['Dashboard', 'Appointments'],
      };
    } else if (path === '/notifications') {
      return {
        title: 'Notifications',
        breadcrumbs: ['Dashboard', 'Notifications'],
      };
    } else if (path === '/feedback') {
      return { title: 'Feedback', breadcrumbs: ['Dashboard', 'Feedback'] };
    } else if (path === '/analytics') {
      return { title: 'Analytics', breadcrumbs: ['Dashboard', 'Analytics'] };
    } else if (path === '/settings') {
      return { title: 'Settings', breadcrumbs: ['Dashboard', 'Settings'] };
    }

    return { title: 'Dashboard', breadcrumbs: ['Dashboard'] };
  };

  const { title, breadcrumbs } = getPageInfo();

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      navigate(`/students?search=${encodeURIComponent(debouncedSearch)}`);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsReadMutation.mutate(notification._id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'system':
        return <Activity className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-indigo-100 border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between gap-8">
          {/* Left section - Page title and breadcrumbs */}
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumbs above title */}
            <div className="flex items-center gap-1.5 text-xs">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb}>
                  {index > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <button
                    className={cn(
                      'transition-colors font-medium',
                      index === breadcrumbs.length - 1
                        ? 'text-slate-900 cursor-default'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                    onClick={() => {
                      if (index === 0 && index !== breadcrumbs.length - 1)
                        navigate('/');
                      else if (
                        index === 1 &&
                        crumb === 'Students' &&
                        index !== breadcrumbs.length - 1
                      )
                        navigate('/students');
                    }}
                  >
                    {crumb}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>

          {/* Right section - Search, notifications, and user menu */}
          <div className="flex items-center gap-2">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-slate-600 transition-colors" />
                <Input
                  placeholder="Search students..."
                  className="pl-10 pr-4 w-[320px] h-10 bg-slate-50 border-slate-200 text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-300 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200 mx-1" />

            {/* Notifications dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <Bell className="w-[18px] h-[18px] text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[380px] max-h-[500px] overflow-y-auto p-0"
              >
                <div className="px-4 py-3 border-b bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => markAllAsReadMutation.mutate()}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-12 text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      No new notifications
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      We'll notify you when something arrives
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map(notification => (
                      <button
                        key={notification._id}
                        className="w-full flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1.5">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      className="w-full text-center py-3 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                      onClick={() => navigate('/notifications')}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2.5 px-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium text-xs">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900 leading-tight">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-slate-500 leading-tight">
                      {user?.role || 'Admin'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2">
                <div className="px-2 py-2.5 mb-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  className="cursor-pointer rounded-md py-2.5"
                  onClick={() => navigate('/profile')}
                >
                  <UserCircle2 className="w-4 h-4 mr-2.5 text-slate-600" />
                  <span className="text-sm">My Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer rounded-md py-2.5"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2.5 text-slate-600" />
                  <span className="text-sm">Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer rounded-md py-2.5"
                  onClick={() => navigate('/messages')}
                >
                  <Mail className="w-4 h-4 mr-2.5 text-slate-600" />
                  <span className="text-sm">Messages</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-md py-2.5"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  <span className="text-sm font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
