import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  MessageSquare,
  Bell,
  Loader2,
  Download,
  Eye,
  Edit,
  ArrowLeft,
  User,
  Briefcase,
  Target,
  DollarSign,
  Globe,
  Award,
  BookOpen,
  FileCheck,
} from 'lucide-react';
import { studentAPI, messageAPI, notificationAPI, socketService, type Student } from '@/services';
import { toast } from 'sonner';

const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states
  const [messageContent, setMessageContent] = useState('');
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
  });

  // Fetch student data
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentAPI.getStudentById(id!),
    enabled: !!id,
  });

  // Real-time socket updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket || !id) return;

    socket.on('student_updated', (data: any) => {
      if (data.studentId === id) {
        queryClient.invalidateQueries({ queryKey: ['student', id] });
        toast.info('Student data updated');
      }
    });

    socket.on('document_updated', (data: any) => {
      if (data.studentId === id) {
        queryClient.invalidateQueries({ queryKey: ['student', id] });
      }
    });

    return () => {
      socket.off('student_updated');
      socket.off('document_updated');
    };
  }, [id, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      messageAPI.sendMessage({ studentId: id!, content }),
    onSuccess: () => {
      toast.success('Message sent successfully');
      setMessageContent('');
      setMessageModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: (data: typeof notificationData) =>
      notificationAPI.sendNotificationToStudent({
        studentId: id!,
        ...data,
      }),
    onSuccess: () => {
      toast.success('Notification sent successfully');
      setNotifyModalOpen(false);
      setNotificationData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (data: typeof editData) =>
      studentAPI.updateStudent(id!, data),
    onSuccess: () => {
      toast.success('Student updated successfully');
      setEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student');
    },
  });

  // Update student status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (active: boolean) =>
      studentAPI.updateStudentStatus(id!, { active }),
    onSuccess: () => {
      toast.success('Student status updated');
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  // Initialize edit form when student data loads
  useEffect(() => {
    if (student) {
      setEditData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        country: student.country || '',
      });
    }
  }, [student]);

  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to format arrays
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'Not specified';
    return arr.join(', ');
  };

  // Helper function to capitalize and format field names
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Helper function to get document icon and color
  const getDocumentInfo = (docType: string) => {
    const types: Record<string, { icon: typeof FileText; color: string; label: string }> = {
      transcripts: { icon: FileCheck, color: 'text-blue-600', label: 'Academic Transcripts' },
      testScores: { icon: Award, color: 'text-purple-600', label: 'Test Scores' },
      sop: { icon: FileText, color: 'text-green-600', label: 'Statement of Purpose' },
      recommendation: { icon: Mail, color: 'text-orange-600', label: 'Recommendation Letters' },
      resume: { icon: Briefcase, color: 'text-indigo-600', label: 'Resume/CV' },
      passport: { icon: Globe, color: 'text-red-600', label: 'Passport Copy' },
    };
    return types[docType] || { icon: FileText, color: 'text-gray-600', label: formatFieldName(docType) };
  };

  // Handle document download
  const handleDownloadDocument = (url: string, filename: string) => {
    if (!url) {
      toast.error('Document not available');
      return;
    }
    window.open(url, '_blank');
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600 font-medium">Loading student details...</p>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error || !student) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Student Not Found</h2>
          <p className="text-gray-600 max-w-md text-center">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/students')} size="lg" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students List
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const profile = student.additionalDetails;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/students')} className="hover:bg-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>

        {/* Student Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                {student.image ? (
                  <img
                    src={student.image}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-xl">
                    <span className="text-4xl text-white font-bold">
                      {student.firstName?.[0]}{student.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-white/80 text-sm font-medium">
                    Student ID: {student._id}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={student.active ? 'bg-green-500 hover:bg-green-600 text-white border-0' : 'bg-red-500 hover:bg-red-600 text-white border-0'}>
                      {student.active ? '✓ Active' : '✗ Inactive'}
                    </Badge>
                    <Badge className={student.approved ? 'bg-green-500 hover:bg-green-600 text-white border-0' : 'bg-yellow-500 hover:bg-yellow-600 text-white border-0'}>
                      {student.approved ? '✓ Approved' : '⏳ Pending Approval'}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Profile: {student.profileCompletion || 0}% Complete
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setMessageModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setNotifyModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notify
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={student.active ? 'destructive' : 'default'}
                  onClick={() => updateStatusMutation.mutate(!student.active)}
                  disabled={updateStatusMutation.isPending}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    student.active ? 'Deactivate' : 'Activate'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion Progress */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-blue-600">{student.profileCompletion || 0}%</span>
              </div>
              <Progress value={student.profileCompletion || 0} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {student.profileCompletion === 100 ? '🎉 Profile is fully completed!' : 'Complete the profile for better application processing'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-sm font-medium text-gray-900 break-words">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">{student.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Country</p>
                      <p className="text-sm font-medium text-gray-900">{student.country || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(student.createdAt)}</p>
                    </div>
                  </div>
                  {profile?.age && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</p>
                        <p className="text-sm font-medium text-gray-900">{profile.age} years old</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <FileCheck className="w-5 h-5 text-green-600" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${student.active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-semibold text-gray-700">Account Status</span>
                    </div>
                    <Badge className={student.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {student.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${student.approved ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                      <span className="text-sm font-semibold text-gray-700">Approval Status</span>
                    </div>
                    <Badge className={student.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                      {student.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                    <div className="flex items-center gap-2">
                      <Progress value={student.profileCompletion || 0} className="w-24 h-2" />
                      <span className="text-sm font-bold text-blue-600">{student.profileCompletion || 0}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Student ID</span>
                    <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded text-gray-800">{student._id.slice(-12)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Education */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Current Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {profile?.currentEducationLevel && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Education Level</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{profile.currentEducationLevel.replace('_', ' ')}</p>
                    </div>
                  )}
                  {profile?.institution && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Institution</p>
                      <p className="text-sm font-medium text-gray-900">{profile.institution}</p>
                    </div>
                  )}
                  {profile?.fieldOfStudy && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Field of Study</p>
                      <p className="text-sm font-medium text-gray-900">{profile.fieldOfStudy}</p>
                    </div>
                  )}
                  {profile?.gpa && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GPA</p>
                      <p className="text-sm font-medium text-gray-900">{profile.gpa}</p>
                    </div>
                  )}
                  {profile?.graduationYear && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Graduation Year</p>
                      <p className="text-sm font-medium text-gray-900">{profile.graduationYear}</p>
                    </div>
                  )}
                  {!profile?.currentEducationLevel && !profile?.institution && !profile?.fieldOfStudy && (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No education information available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Test Scores */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Award className="w-5 h-5 text-orange-600" />
                    Test Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {profile?.ielts && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">IELTS Score</p>
                      <p className="text-sm font-medium text-gray-900">{profile.ielts}</p>
                    </div>
                  )}
                  {profile?.toefl && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">TOEFL Score</p>
                      <p className="text-sm font-medium text-gray-900">{profile.toefl}</p>
                    </div>
                  )}
                  {profile?.gre && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">GRE Score</p>
                      <p className="text-sm font-medium text-gray-900">{profile.gre}</p>
                    </div>
                  )}
                  {!profile?.ielts && !profile?.toefl && !profile?.gre && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No test scores available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['transcripts', 'testScores', 'sop', 'recommendation', 'resume', 'passport'].map((docType) => {
                      const docUrl = profile[docType as keyof typeof profile];
                      const docInfo = getDocumentInfo(docType);
                      const DocIcon = docInfo.icon;

                      if (!docUrl || typeof docUrl !== 'string') return null;

                      return (
                        <div
                          key={docType}
                          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <DocIcon className={`w-6 h-6 ${docInfo.color}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{docInfo.label}</p>
                              <p className="text-xs text-gray-500">PDF Document</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDocument(docUrl, docInfo.label)}
                              className="hover:bg-blue-50 hover:border-blue-400"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleDownloadDocument(docUrl, docInfo.label)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(!profile || !['transcripts', 'testScores', 'sop', 'recommendation', 'resume', 'passport'].some(docType => profile[docType as keyof typeof profile])) && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents Uploaded</h3>
                    <p className="text-sm text-gray-500">Student hasn't uploaded any documents yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Study Preferences */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Globe className="w-5 h-5 text-green-600" />
                    Study Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {profile?.preferredCountries && profile.preferredCountries.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferred Countries</p>
                      <p className="text-sm font-medium text-gray-900">{formatArray(profile.preferredCountries)}</p>
                    </div>
                  )}
                  {profile?.preferredDegreeLevel && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Preferred Degree Level</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{profile.preferredDegreeLevel.replace('_', ' ')}</p>
                    </div>
                  )}
                  {profile?.budget && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Budget</p>
                      <p className="text-sm font-medium text-gray-900">{profile.budget}</p>
                    </div>
                  )}
                  {!profile?.preferredCountries && !profile?.preferredDegreeLevel && !profile?.budget && (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No study preferences available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Career Goals */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {profile?.careerGoals && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Career Goals</p>
                      <p className="text-sm font-medium text-gray-900">{profile.careerGoals}</p>
                    </div>
                  )}
                  {profile?.industry && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Preferred Industry</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{profile.industry}</p>
                    </div>
                  )}
                  {profile?.workLocation && (
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Preferred Work Location</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{profile.workLocation.replace('-', ' ')}</p>
                    </div>
                  )}
                  {!profile?.careerGoals && !profile?.industry && !profile?.workLocation && (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No career information available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Message Modal */}
        <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Message to {student.firstName} {student.lastName}</DialogTitle>
              <DialogDescription>
                Send a direct message to this student's inbox
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => sendMessageMutation.mutate(messageContent)}
                disabled={!messageContent.trim() || sendMessageMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notification Modal */}
        <Dialog open={notifyModalOpen} onOpenChange={setNotifyModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send a notification to {student.firstName} {student.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Message</label>
                <Textarea
                  placeholder="Notification message..."
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[120px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Type</label>
                  <Select
                    value={notificationData.type}
                    onValueChange={(value: any) => setNotificationData(prev => ({ ...prev, type: value }))}
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
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Priority</label>
                  <Select
                    value={notificationData.priority}
                    onValueChange={(value: any) => setNotificationData(prev => ({ ...prev, priority: value }))}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNotifyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => sendNotificationMutation.mutate(notificationData)}
                disabled={!notificationData.title || !notificationData.message || sendNotificationMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendNotificationMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Send Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Student Information</DialogTitle>
              <DialogDescription>
                Update {student.firstName} {student.lastName}'s basic information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">First Name</label>
                  <Input
                    value={editData.firstName}
                    onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Last Name</label>
                  <Input
                    value={editData.lastName}
                    onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Country</label>
                <Input
                  value={editData.country}
                  onChange={(e) => setEditData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => updateStudentMutation.mutate(editData)}
                disabled={updateStudentMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateStudentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                Update Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default StudentDetails;
