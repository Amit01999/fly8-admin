
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText, 
  CreditCard, 
  Scale, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  User
} from 'lucide-react';

const mockVisaData = {
  applications: [
    { id: 1, studentName: 'Sarah Johnson', country: 'Canada', visaType: 'Study Permit', status: 'Interview Scheduled', progress: 80, submissionDate: '2024-06-15', interviewDate: '2024-07-10' },
    { id: 2, studentName: 'Michael Chen', country: 'USA', visaType: 'F-1 Student Visa', status: 'Approved', progress: 100, submissionDate: '2024-06-10', interviewDate: '2024-06-25' },
    { id: 3, studentName: 'Emma Wilson', country: 'UK', visaType: 'Tier 4 Student Visa', status: 'Document Review', progress: 60, submissionDate: '2024-06-20', interviewDate: null }
  ],
  bankSupport: [
    { id: 1, studentName: 'David Kumar', service: 'Bank Statement Verification', status: 'Completed', date: '2024-06-20' },
    { id: 2, studentName: 'Lisa Zhang', service: 'Financial Documentation', status: 'In Progress', date: '2024-06-22' }
  ],
  translations: [
    { id: 1, studentName: 'John Doe', document: 'Birth Certificate', language: 'Spanish to English', status: 'Completed', date: '2024-06-18' },
    { id: 2, studentName: 'Maria Garcia', document: 'Academic Transcripts', language: 'Portuguese to English', status: 'In Progress', date: '2024-06-23' }
  ]
};

const Visa = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'interview scheduled': return 'bg-blue-100 text-blue-800';
      case 'document review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Visa & Interview Support</h1>
          <Button>Schedule Interview</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Visa Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-blue-600">Active applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187</div>
              <p className="text-xs text-green-600">80% success rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Interviews This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-purple-600">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Documents Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-orange-600">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search visa applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter by Status</Button>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Visa Applications</TabsTrigger>
            <TabsTrigger value="bank">Bank Support</TabsTrigger>
            <TabsTrigger value="translation">Translation Services</TabsTrigger>
            <TabsTrigger value="training">Interview Training</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Visa Application Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Visa Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Interview Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisaData.applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.studentName}</div>
                        </TableCell>
                        <TableCell>{application.country}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{application.visaType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={application.progress} className="h-2" />
                            <span className="text-xs text-gray-500">{application.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{application.submissionDate}</TableCell>
                        <TableCell>
                          {application.interviewDate ? (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-blue-500" />
                              <span className="text-sm">{application.interviewDate}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not scheduled</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Update Status</Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  <span>Bank Support Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisaData.bankSupport.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="font-medium">{service.studentName}</div>
                        </TableCell>
                        <TableCell>{service.service}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.date}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="translation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span>Translation Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Language Pair</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVisaData.translations.map((translation) => (
                      <TableRow key={translation.id}>
                        <TableCell>
                          <div className="font-medium">{translation.studentName}</div>
                        </TableCell>
                        <TableCell>{translation.document}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{translation.language}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(translation.status)}>
                            {translation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{translation.date}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Download</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <span>Interview Training</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Scheduled Sessions</span>
                        <Badge className="bg-blue-500 text-white">12</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completed</span>
                        <Badge className="bg-green-500 text-white">34</Badge>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">Schedule Training</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-purple-500" />
                    <span>Lawyer Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Active Cases</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">8 ongoing consultations</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Pending Review</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">5 cases under review</p>
                    </div>
                    <Button className="w-full" size="sm">Request Lawyer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Attestation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Educational Documents</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">23 pending attestations</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Personal Documents</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">12 in process</p>
                    </div>
                    <Button className="w-full" size="sm">Manage Attestations</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Visa;
