import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Bell,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentAPI, socketService, type Student } from '@/services';
import { toast } from 'sonner';

// ============ Custom Hook for Debounced Search ============
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ Loading Skeleton Component ============
const StudentTableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// ============ Main Component ============
const Students = () => {
  // State management
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const queryClient = useQueryClient();

  // Debounced search - only triggers API call after 500ms of no typing
  const debouncedSearch = useDebounce(searchInput, 500);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, limit]);

  // Fetch students with filters
  const {
    data: studentsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['students', { page, search: debouncedSearch, status: statusFilter, limit }],
    queryFn: () =>
      studentAPI.getAllStudents({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
      }),
    placeholderData: (previousData) => previousData, // Keep showing old data while fetching new data
  });

  // Fetch student statistics
  const { data: studentStats, isLoading: loadingStats } = useQuery({
    queryKey: ['studentStats'],
    queryFn: () => studentAPI.getStudentStats(),
  });

  // Mutation to update student status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      studentAPI.updateStudentStatus(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
      toast.success('Student status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student status');
    },
  });

  // Real-time socket updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('student_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
    });

    return () => {
      socket.off('student_updated');
    };
  }, [queryClient]);

  // Computed values - map backend response structure
  const students = studentsData?.students || [];
  const totalPages = studentsData?.pagination?.pages || 1;
  const totalStudents = studentsData?.pagination?.total || 0;

  // Pagination calculations
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalStudents);

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Students Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all student accounts
            </p>
          </div>
          <Button disabled className="w-full sm:w-auto">
            <Users className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Students
                </CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    {studentStats?.totalStudents?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {studentStats?.recentRegistrations || 0} new this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Students
                </CardTitle>
                <UserCheck className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    {studentStats?.activeStudents?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Currently active</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Inactive Students
                </CardTitle>
                <UserX className="w-4 h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    {studentStats?.inactiveStudents?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Need attention</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Profile Completion
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    {studentStats?.profileCompletionRanges?.['76-100%'] || 0}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Fully completed</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar with Debounce */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name or email..."
                  className="pl-10 pr-4"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search students"
                />
                {isFetching && searchInput && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="flex-1 sm:flex-none"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                  className="flex-1 sm:flex-none"
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                  className="flex-1 sm:flex-none"
                >
                  Inactive
                </Button>
              </div>

              {/* Items per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Per page:
                </span>
                <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                All Students {totalStudents > 0 && `(${totalStudents.toLocaleString()})`}
              </CardTitle>
              {totalStudents > 0 && (
                <span className="text-sm text-gray-500">
                  Showing {startIndex}-{endIndex} of {totalStudents}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !studentsData ? (
              <StudentTableSkeleton />
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchInput || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'No students have been added yet.'}
                </p>
                {(searchInput || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchInput('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Student</TableHead>
                        <TableHead className="min-w-[200px]">Contact</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="min-w-[120px]">Profile</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student: Student) => (
                        <TableRow
                          key={student._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {student.image ? (
                                <img
                                  src={student.image}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                  {student.firstName?.[0]}
                                  {student.lastName?.[0]}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {student._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-900">{student.email}</div>
                              <div className="text-xs text-gray-500">
                                {student.phone || 'No phone'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700">
                              {student.country || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge
                                className={
                                  student.active
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }
                              >
                                {student.active ? 'Active' : 'Inactive'}
                              </Badge>
                              {!student.approved && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${student.profileCompletion || 0}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {student.profileCompletion || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {new Date(student.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="hover:bg-blue-50"
                              >
                                <Link to={`/students/${student._id}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="hover:bg-green-50"
                              >
                                <Link to={`/messages?studentId=${student._id}`}>
                                  <MessageSquare className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-yellow-50">
                                <Bell className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/students/${student._id}`}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({
                                        id: student._id,
                                        active: !student.active,
                                      })
                                    }
                                    className="cursor-pointer"
                                  >
                                    {student.active ? (
                                      <>
                                        <UserX className="w-4 h-4 mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/messages?studentId=${student._id}`}
                                      className="cursor-pointer"
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Send Message
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Send Notification
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 cursor-pointer">
                                    Delete Student
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Advanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      Showing{' '}
                      <span className="font-medium text-gray-900">
                        {startIndex}-{endIndex}
                      </span>{' '}
                      of <span className="font-medium text-gray-900">{totalStudents}</span>{' '}
                      students
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                      {/* First page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        aria-label="First page"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </Button>

                      {/* Previous page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {/* Page numbers */}
                      <div className="hidden sm:flex items-center gap-1">
                        {pageNumbers.map((pageNum, index) => {
                          if (pageNum === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(Number(pageNum))}
                              className="min-w-[40px]"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Mobile page indicator */}
                      <div className="sm:hidden px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded">
                        {page} / {totalPages}
                      </div>

                      {/* Next page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>

                      {/* Last page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page === totalPages}
                        aria-label="Last page"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Loading overlay when fetching */}
        {isFetching && studentsData && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-bottom-5">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Updating...</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Students;
