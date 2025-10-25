
import { useState } from 'react';
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
  FileText,
  Eye,
  MessageSquare,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatModal from '@/components/ChatModal';

const mockAssessments = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    submissionDate: '2024-06-25',
    status: 'Under Review',
    completionPercentage: 75,
    assessorName: 'Dr. Smith',
    documents: ['Academic Transcripts', 'IELTS Certificate', 'Personal Statement'],
    score: null,
    feedback: 'Initial review in progress'
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    studentId: 2,
    submissionDate: '2024-06-20',
    status: 'Completed',
    completionPercentage: 100,
    assessorName: 'Dr. Johnson',
    documents: ['Academic Transcripts', 'TOEFL Certificate', 'CV', 'SOP'],
    score: 85,
    feedback: 'Strong academic background with excellent language skills'
  },
  {
    id: 3,
    studentName: 'Emma Wilson',
    studentId: 3,
    submissionDate: '2024-06-18',
    status: 'Pending Submission',
    completionPercentage: 45,
    assessorName: null,
    documents: ['Academic Transcripts'],
    score: null,
    feedback: 'Awaiting additional documents'
  }
];

const ProfileAssessment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assessments] = useState(mockAssessments);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Pending Submission':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Submission':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = (studentId: number, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setIsChatModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Profile Assessment</h1>
          <Button>Generate Report</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">345</div>
              <p className="text-xs text-blue-600">+15 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-yellow-600">Pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-purple-600">+3% improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assessments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        {/* Assessments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Assessor</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assessment.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {assessment.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{assessment.submissionDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(assessment.status)}
                        <Badge className={getStatusColor(assessment.status)}>
                          {assessment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={assessment.completionPercentage} className="h-2" />
                        <span className="text-xs text-gray-500">{assessment.completionPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assessment.assessorName || <span className="text-gray-400">Not assigned</span>}
                    </TableCell>
                    <TableCell>
                      {assessment.score ? (
                        <div className="font-medium">{assessment.score}%</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {assessment.documents.slice(0, 2).map((doc, index) => (
                          <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {doc}
                          </div>
                        ))}
                        {assessment.documents.length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{assessment.documents.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/students/${assessment.studentId}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartChat(assessment.studentId, assessment.studentName)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
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
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Pending Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Priority</span>
                  <Badge className="bg-red-100 text-red-800">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medium Priority</span>
                  <Badge className="bg-yellow-100 text-yellow-800">25</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Priority</span>
                  <Badge className="bg-green-100 text-green-800">50</Badge>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Review Queue
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline" size="sm">
                  Undergraduate Template
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Graduate Template
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  PhD Template
                </Button>
                <Button className="w-full" size="sm">
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-600">Strong academic profile...</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-xs text-gray-600">Needs improvement in...</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <Button className="w-full" variant="outline" size="sm">
                  View All Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && selectedStudent && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedStudent(null);
          }}
          studentName={selectedStudent.name}
          studentId={selectedStudent.id}
        />
      )}
    </AdminLayout>
  );
};

export default ProfileAssessment;
