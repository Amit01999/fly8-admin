
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  GraduationCap, 
  Eye, 
  MessageSquare, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const mockApplications = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    university: 'University of Toronto',
    program: 'Computer Science Masters',
    country: 'Canada',
    applicationDate: '2024-06-15',
    status: 'Under Review',
    progress: 75,
    deadline: '2024-08-15',
    fee: '$150',
    documents: ['Transcripts', 'SOP', 'LOR', 'Resume']
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    studentId: 2,
    university: 'Stanford University',
    program: 'MBA',
    country: 'USA',
    applicationDate: '2024-06-10',
    status: 'Accepted',
    progress: 100,
    deadline: '2024-07-30',
    fee: '$250',
    documents: ['Transcripts', 'GMAT', 'Essays', 'Resume']
  },
  {
    id: 3,
    studentName: 'Emma Wilson',
    studentId: 3,
    university: 'Oxford University',
    program: 'PhD in Physics',
    country: 'UK',
    applicationDate: '2024-06-20',
    status: 'Pending Documents',
    progress: 45,
    deadline: '2024-09-01',
    fee: '$200',
    documents: ['Transcripts', 'Research Proposal']
  }
];

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications] = useState(mockApplications);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending Documents':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending Documents':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app =>
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">University Applications</h1>
          <Button>Add New Application</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-blue-600">+25 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-green-600">46% acceptance rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-yellow-600">Pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-purple-600">Partner institutions</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter by Status</Button>
          <Button variant="outline">Filter by Country</Button>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span>Application Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>University & Program</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {application.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.university}</div>
                        <div className="text-sm text-gray-500">{application.program}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{application.country}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.applicationDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={application.progress} className="h-2" />
                        <span className="text-xs text-gray-500">{application.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{application.deadline}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{application.fee}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/students/${application.studentId}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Accepted</span>
                  </div>
                  <Badge className="bg-green-500 text-white">567</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Under Review</span>
                  </div>
                  <Badge className="bg-yellow-500 text-white">456</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Pending Docs</span>
                  </div>
                  <Badge className="bg-orange-500 text-white">123</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <Badge className="bg-red-500 text-white">88</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">University of Toronto</div>
                  <div className="text-xs text-gray-600">Computer Science Masters</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">Due in 15 days</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Stanford University</div>
                  <div className="text-xs text-gray-600">MBA Program</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Due in 30 days</span>
                  </div>
                </div>
                <Button className="w-full" size="sm">View All Deadlines</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Computer Science</span>
                  <Badge variant="outline">234</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Business Administration</span>
                  <Badge variant="outline">187</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engineering</span>
                  <Badge variant="outline">156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medicine</span>
                  <Badge variant="outline">98</Badge>
                </div>
                <Button className="w-full" variant="outline" size="sm">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Applications;
