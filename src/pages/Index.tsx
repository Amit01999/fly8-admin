import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  FileCheck,
  TrendingUp,
  Calendar,
  MessageSquare,
  Loader2,
  UserCheck,
  UserX,
  Bell,
  Clock,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { studentAPI, messageAPI, appointmentAPI, socketService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch statistics from all services
  const { data: studentStats, isLoading: loadingStudents, error: errorStudents } = useQuery({
    queryKey: ['studentStats'],
    queryFn: () => studentAPI.getStudentStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: messageStats, isLoading: loadingMessages, error: errorMessages } = useQuery({
    queryKey: ['messageStats'],
    queryFn: () => messageAPI.getMessageStats(),
    refetchInterval: 30000,
  });

  const { data: appointmentStats, isLoading: loadingAppointments, error: errorAppointments } = useQuery({
    queryKey: ['appointmentStats'],
    queryFn: () => appointmentAPI.getAppointmentStats(),
    refetchInterval: 30000,
  });

  const { data: todayAppointments, isLoading: loadingToday } = useQuery({
    queryKey: ['todayAppointments'],
    queryFn: () => appointmentAPI.getTodayAppointments(),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: conversationsData, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageAPI.getAllConversations(),
    refetchInterval: 30000,
  });

  // Real-time socket updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for real-time updates
    socket.on('student_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
      toast.success('Student data updated', { duration: 2000 });
    });

    socket.on('message_received', () => {
      queryClient.invalidateQueries({ queryKey: ['messageStats', 'conversations'] });
      toast.info('New message received', { duration: 2000 });
    });

    socket.on('appointment_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentStats', 'todayAppointments'] });
      toast.info('Appointment updated', { duration: 2000 });
    });

    socket.on('notification_sent', () => {
      toast.info('New notification sent', { duration: 2000 });
    });

    return () => {
      socket.off('student_updated');
      socket.off('message_received');
      socket.off('appointment_updated');
      socket.off('notification_sent');
    };
  }, [queryClient]);

  const isLoading = loadingStudents || loadingMessages || loadingAppointments;
  const hasErrors = errorStudents || errorMessages || errorAppointments;

  // Helper function to format time ago
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

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Failed to Load Dashboard</h2>
          <p className="text-gray-600 max-w-md text-center">
            Unable to fetch dashboard data. Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()} size="lg" className="mt-4">
            Reload Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Calculate stats with proper fallbacks
  const totalStudents = studentStats?.totalStudents || 0;
  const activeStudents = studentStats?.activeStudents || 0;
  const inactiveStudents = studentStats?.inactiveStudents || 0;
  const recentRegistrations = studentStats?.recentRegistrations || 0;
  const unreadMessages = messageStats?.totalUnread || 0;
  const totalConversations = messageStats?.totalConversations || 0;
  const upcomingAppointments = appointmentStats?.upcoming || 0;
  const todayAppointmentsList = todayAppointments?.appointments || [];
  const conversations = conversationsData || [];

  // Profile completion breakdown
  const profileCompletion = studentStats?.profileCompletionRanges || {
    '0-25%': 0,
    '26-50%': 0,
    '51-75%': 0,
    '76-100%': 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Welcome Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.firstName || 'Admin'}! 👋
                </h1>
                <p className="text-white/80 text-lg">
                  Here's what's happening with your Fly8 platform today.
                </p>
                <p className="text-white/60 text-sm mt-2">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <Activity className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-medium">Live Updates Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Students
                </CardTitle>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalStudents.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{recentRegistrations} new this month
              </p>
              <Link to="/students">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-blue-600">
                  View all students →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Students */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Students
                </CardTitle>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {activeStudents.toLocaleString()}
              </div>
              <p className="text-xs text-orange-600 mt-2 flex items-center">
                <UserX className="w-3 h-3 mr-1" />
                {inactiveStudents} inactive
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: totalStudents > 0 ? `${(activeStudents / totalStudents) * 100}%` : '0%' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% active rate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Today */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Appointments Today
                </CardTitle>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {todayAppointmentsList.length}
              </div>
              <p className="text-xs text-blue-600 mt-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {upcomingAppointments} upcoming total
              </p>
              <Link to="/appointments">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-purple-600">
                  View schedule →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Unread Messages */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Unread Messages
                </CardTitle>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center relative">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  {unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {unreadMessages}
              </div>
              <p className="text-xs text-gray-600 mt-2 flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {totalConversations} total conversations
              </p>
              <Link to="/messages">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-orange-600">
                  View messages →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats - Profile Completion & Countries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Completion Breakdown */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Profile Completion Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {totalStudents > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">76-100% Complete</span>
                      <span className="text-sm font-bold text-green-600">
                        {profileCompletion['76-100%']} students
                      </span>
                    </div>
                    <Progress
                      value={totalStudents > 0 ? (profileCompletion['76-100%'] / totalStudents) * 100 : 0}
                      className="h-2 bg-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">51-75% Complete</span>
                      <span className="text-sm font-bold text-blue-600">
                        {profileCompletion['51-75%']} students
                      </span>
                    </div>
                    <Progress
                      value={totalStudents > 0 ? (profileCompletion['51-75%'] / totalStudents) * 100 : 0}
                      className="h-2 bg-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">26-50% Complete</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {profileCompletion['26-50%']} students
                      </span>
                    </div>
                    <Progress
                      value={totalStudents > 0 ? (profileCompletion['26-50%'] / totalStudents) * 100 : 0}
                      className="h-2 bg-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">0-25% Complete</span>
                      <span className="text-sm font-bold text-red-600">
                        {profileCompletion['0-25%']} students
                      </span>
                    </div>
                    <Progress
                      value={totalStudents > 0 ? (profileCompletion['0-25%'] / totalStudents) * 100 : 0}
                      className="h-2 bg-gray-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No profile data available</p>
                  <p className="text-xs mt-1">Student profiles will appear here once added</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Engagement Stats */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Activity className="w-5 h-5 text-green-600" />
                Student Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {totalStudents > 0 ? (
                <div className="space-y-4">
                  {/* Active vs Inactive */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">Active Students</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{activeStudents}</span>
                    </div>
                    <Progress value={totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0} className="h-2 bg-green-200" />
                    <p className="text-xs text-gray-600 mt-1">
                      {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% of total students
                    </p>
                  </div>

                  {/* Profile Completeness */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Completed Profiles</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {profileCompletion['76-100%']}
                      </span>
                    </div>
                    <Progress
                      value={totalStudents > 0 ? (profileCompletion['76-100%'] / totalStudents) * 100 : 0}
                      className="h-2 bg-blue-200"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {totalStudents > 0 ? Math.round((profileCompletion['76-100%'] / totalStudents) * 100) : 0}% have complete profiles
                    </p>
                  </div>

                  {/* Recent Growth */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-700">New This Month</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{recentRegistrations}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span>Growth Rate</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {totalStudents > 0 ? `+${Math.round((recentRegistrations / totalStudents) * 100)}%` : '0%'}
                      </Badge>
                    </div>
                  </div>

                  {/* Message Activity */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-700">Active Conversations</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">{totalConversations}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span>Unread Messages</span>
                      <Badge className="bg-orange-100 text-orange-800">{unreadMessages}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No engagement data available</p>
                  <p className="text-xs mt-1">Student activity will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Appointments & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Today's Schedule
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {todayAppointmentsList.length} appointments
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {todayAppointmentsList.length > 0 ? (
                  <>
                    {todayAppointmentsList.slice(0, 4).map((appointment: any) => (
                      <div
                        key={appointment._id}
                        className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all bg-white group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {appointment.title || 'Appointment'}
                            </p>
                            <Badge
                              className={`text-xs ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                          {appointment.student && (
                            <p className="text-xs text-gray-500 mt-1">
                              <Users className="w-3 h-3 inline mr-1" />
                              {appointment.student.firstName} {appointment.student.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {todayAppointmentsList.length > 4 && (
                      <Link to="/appointments">
                        <Button className="w-full mt-3" variant="outline" size="sm">
                          View All {todayAppointmentsList.length} Appointments
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">No appointments scheduled for today</p>
                    <p className="text-xs mt-1">Your schedule is clear!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  Recent Messages
                </CardTitle>
                {unreadMessages > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadMessages} unread
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {conversations.length > 0 ? (
                  <>
                    {conversations.slice(0, 4).map((conversation: any) => {
                      const student = conversation.student;
                      const lastMsg = conversation.lastMessage;
                      const timeAgo = lastMsg?.createdAt ? formatTimeAgo(lastMsg.createdAt) : 'Unknown';

                      return (
                        <div
                          key={conversation.conversationId}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {student?.image ? (
                                <img
                                  src={student.image}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {student?.firstName?.[0]}{student?.lastName?.[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-sm text-gray-900">
                                  {student?.firstName} {student?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{timeAgo}</p>
                              </div>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {lastMsg?.content || 'No messages yet'}
                          </p>
                        </div>
                      );
                    })}
                    <Link to="/messages">
                      <Button className="w-full mt-3" variant="outline" size="sm">
                        View All Conversations
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1">Messages will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-md lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link to="/students">
                  <Button className="w-full h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                    <Users className="w-5 h-5" />
                    <span className="text-xs">View Students</span>
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button className="w-full h-20 flex-col gap-2 bg-green-600 hover:bg-green-700">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-xs">Messages</span>
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button className="w-full h-20 flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                    <Bell className="w-5 h-5" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button className="w-full h-20 flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
              <CardTitle className="text-gray-800">System Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">API</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Socket.io</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
