
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { notificationAPI, studentAPI, socketService } from '@/services';
import { toast } from 'sonner';

const Notifications = () => {
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    recipients: 'individual' as 'individual' | 'group' | 'all',
    studentId: ''
  });

  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationAPI.getAdminNotifications({ page: 1, limit: 20 }),
  });

  // Fetch notification stats
  const { data: notificationStats } = useQuery({
    queryKey: ['notificationStats'],
    queryFn: () => notificationAPI.getNotificationStats(),
  });

  // Fetch students for dropdown
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentAPI.getAllStudents({ limit: 100 }),
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: typeof newNotification) => {
      if (data.recipients === 'individual' && data.studentId) {
        return notificationAPI.sendNotificationToStudent({
          studentId: data.studentId,
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
        });
      } else if (data.recipients === 'all') {
        return notificationAPI.sendNotificationToAll({
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
        });
      }
      throw new Error('Invalid recipients selection');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Notification sent successfully');
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        recipients: 'individual',
        studentId: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    },
  });

  // Real-time socket updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('notification_sent', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
    });

    return () => {
      socket.off('notification_sent');
    };
  }, [queryClient]);

  const notifications = notificationsData?.notifications || [];
  const students = studentsData?.students || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newNotification.recipients === 'individual' && !newNotification.studentId) {
      toast.error('Please select a student');
      return;
    }

    sendNotificationMutation.mutate(newNotification);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationStats?.totalSent?.toLocaleString() || '0'}</div>
              <p className="text-xs text-blue-600">{notificationStats?.last24Hours || 0} in last 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Read Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationStats?.readPercentage?.toFixed(1) || '0'}%</div>
              <p className="text-xs text-green-600">Average read rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">By Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationStats?.byType?.info || 0}</div>
              <p className="text-xs text-purple-600">Info notifications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationStats?.byType?.error || 0}</div>
              <p className="text-xs text-orange-600">Error/Urgent</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send New Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-500" />
                <span>Send New Notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Notification message..."
                  className="min-h-[120px]"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value: any) =>
                      setNewNotification(prev => ({ ...prev, type: value as typeof prev.type }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newNotification.priority}
                    onValueChange={(value: any) =>
                      setNewNotification(prev => ({ ...prev, priority: value as typeof prev.priority }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Recipients</label>
                <Select
                  value={newNotification.recipients}
                  onValueChange={(value: any) =>
                    setNewNotification(prev => ({ ...prev, recipients: value as typeof prev.recipients, studentId: '' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Student</SelectItem>
                    <SelectItem value="all">All Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newNotification.recipients === 'individual' && (
                <div>
                  <label className="text-sm font-medium">Select Student</label>
                  <Select
                    value={newNotification.studentId}
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, studentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student: any) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.firstName} {student.lastName} ({student.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handleSendNotification}
                  className="flex-1"
                  disabled={sendNotificationMutation.isPending}
                >
                  {sendNotificationMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No notifications sent yet</p>
                ) : (
                  notifications.map((notification: any) => (
                    <div key={notification._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <h4 className="font-medium">{notification.title}</h4>
                        </div>
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {notification.recipientModel === 'student' ? 'Student' : 'Admin'}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
