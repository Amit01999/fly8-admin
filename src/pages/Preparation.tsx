
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
  BookOpen, 
  Calendar, 
  Users, 
  Download,
  Video,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const mockPreparationData = {
  languageTests: [
    { id: 1, studentName: 'Sarah Johnson', testType: 'IELTS', scheduledDate: '2024-07-15', status: 'Scheduled', mockScore: 7.5 },
    { id: 2, studentName: 'Michael Chen', testType: 'TOEFL', scheduledDate: '2024-07-20', status: 'Completed', mockScore: 95 },
    { id: 3, studentName: 'Emma Wilson', testType: 'IELTS', scheduledDate: '2024-07-25', status: 'Pending', mockScore: null }
  ],
  classes: [
    { id: 1, studentName: 'David Kumar', className: 'IELTS Preparation', instructor: 'Prof. Anderson', progress: 75, nextClass: '2024-07-10' },
    { id: 2, studentName: 'Lisa Zhang', className: 'Academic Writing', instructor: 'Dr. Smith', progress: 90, nextClass: '2024-07-12' },
    { id: 3, studentName: 'John Doe', className: 'Speaking Skills', instructor: 'Ms. Johnson', progress: 60, nextClass: '2024-07-14' }
  ],
  consultations: [
    { id: 1, studentName: 'Sarah Johnson', consultantName: 'Dr. Wilson', date: '2024-07-08', time: '10:00 AM', type: 'Career Guidance', status: 'Scheduled' },
    { id: 2, studentName: 'Michael Chen', consultantName: 'Prof. Davis', date: '2024-07-09', time: '2:00 PM', type: 'Academic Planning', status: 'Completed' }
  ]
};

const Preparation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Preparation Support</h1>
          <Button>Add New Session</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-blue-600">In preparation programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Language Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-green-600">Scheduled this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-purple-600">Active sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-orange-600">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students, classes, tests..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tests">Language Tests</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Language Test Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mock Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPreparationData.languageTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div className="font-medium">{test.studentName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{test.testType}</Badge>
                        </TableCell>
                        <TableCell>{test.scheduledDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {test.mockScore ? (
                            <div className="font-medium">{test.mockScore}</div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Reschedule</Button>
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

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>Class Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Next Class</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPreparationData.classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <div className="font-medium">{classItem.studentName}</div>
                        </TableCell>
                        <TableCell>{classItem.className}</TableCell>
                        <TableCell>{classItem.instructor}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={classItem.progress} className="h-2" />
                            <span className="text-xs text-gray-500">{classItem.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{classItem.nextClass}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Schedule</Button>
                            <Button size="sm">View Progress</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-purple-500" />
                  <span>Online Consultations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Consultant</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPreparationData.consultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell>
                          <div className="font-medium">{consultation.studentName}</div>
                        </TableCell>
                        <TableCell>{consultation.consultantName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{consultation.date}</div>
                            <div className="text-sm text-gray-500">{consultation.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{consultation.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(consultation.status)}>
                            {consultation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Join Call</Button>
                            <Button size="sm">Reschedule</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    <span>Study Materials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">IELTS Practice Tests</span>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">TOEFL Study Guide</span>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Academic Writing Tips</span>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    <Button className="w-full" size="sm">Upload New Resource</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Statement Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">In Review</span>
                        <Badge className="bg-blue-500 text-white">23</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completed</span>
                        <Badge className="bg-green-500 text-white">45</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pending</span>
                        <Badge className="bg-yellow-500 text-white">12</Badge>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">Manage Reviews</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Proposal Reviews</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">8 pending reviews</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">SOP Assistance</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">15 completed this week</p>
                    </div>
                    <Button className="w-full" size="sm">View All Requests</Button>
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

export default Preparation;
