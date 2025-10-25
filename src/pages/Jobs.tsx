
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
import { 
  Search, 
  Briefcase, 
  Eye, 
  MessageSquare, 
  MapPin,
  Building,
  Clock,
  DollarSign
} from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    jobTitle: 'Software Developer',
    company: 'Tech Solutions Inc.',
    location: 'Toronto, Canada',
    salary: '$65,000/year',
    jobType: 'Full-time',
    status: 'Applied',
    applicationDate: '2024-06-18',
    workVisa: 'Required'
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    studentId: 2,
    jobTitle: 'Marketing Coordinator',
    company: 'Global Marketing Ltd.',
    location: 'Vancouver, Canada',
    salary: '$45,000/year',
    jobType: 'Part-time',
    status: 'Interview Scheduled',
    applicationDate: '2024-06-12',
    workVisa: 'Sponsored'
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs] = useState(mockJobs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Applied': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Jobs Abroad</h1>
          <Button>Post New Job</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,345</div>
              <p className="text-xs text-blue-600">+45 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Job Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-green-600">17% success rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-purple-600">Available positions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Partner Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-orange-600">Hiring partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search job applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <span>Job Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {job.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.jobTitle}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.jobType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="w-3 h-3 mr-1 text-gray-400" />
                        {job.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-semibold text-green-600">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {job.salary}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applicationDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
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
      </div>
    </AdminLayout>
  );
};

export default Jobs;
