
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    id: 1,
    student: 'Sarah Johnson',
    action: 'Submitted Profile Assessment',
    time: '2 hours ago',
    status: 'pending',
    avatar: '/placeholder.svg'
  },
  {
    id: 2,
    student: 'Michael Chen',
    action: 'Applied to University of Toronto',
    time: '4 hours ago',
    status: 'in_progress',
    avatar: '/placeholder.svg'
  },
  {
    id: 3,
    student: 'Emma Wilson',
    action: 'Visa Interview Scheduled',
    time: '6 hours ago',
    status: 'scheduled',
    avatar: '/placeholder.svg'
  },
  {
    id: 4,
    student: 'David Kumar',
    action: 'Accommodation Request',
    time: '8 hours ago',
    status: 'approved',
    avatar: '/placeholder.svg'
  },
  {
    id: 5,
    student: 'Lisa Zhang',
    action: 'Job Application Submitted',
    time: '1 day ago',
    status: 'review',
    avatar: '/placeholder.svg'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'scheduled': return 'bg-purple-100 text-purple-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'review': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const RecentActivity = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Avatar className="w-10 h-10">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.student}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {activity.action}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(activity.status)}>
                {activity.status.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
