
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
  CreditCard, 
  Eye, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Building,
  TrendingUp
} from 'lucide-react';

const mockLoans = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    loanAmount: '$50,000',
    lender: 'ABC Education Finance',
    purpose: 'Tuition & Living Expenses',
    status: 'Approved',
    applicationDate: '2024-06-05',
    approvalDate: '2024-06-20',
    interestRate: '6.5%',
    repaymentTerm: '10 years'
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    studentId: 2,
    loanAmount: '$35,000',
    lender: 'XYZ Student Loans',
    purpose: 'Tuition Fee',
    status: 'Under Review',
    applicationDate: '2024-06-10',
    approvalDate: '-',
    interestRate: '7.2%',
    repaymentTerm: '8 years'
  }
];

const Loans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans] = useState(mockLoans);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Disbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.lender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Education Loans</h1>
          <Button>Add New Loan Application</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-blue-600">+23 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Approved Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">312</div>
              <p className="text-xs text-green-600">68% approval rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.5M</div>
              <p className="text-xs text-purple-600">Disbursed amount</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Active Lenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-orange-600">Partner institutions</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search loan applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span>Loan Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {loan.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.purpose}</div>
                        <div className="text-sm text-gray-500">{loan.repaymentTerm}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="w-3 h-3 mr-1 text-gray-400" />
                        {loan.lender}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-semibold text-green-600">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {loan.loanAmount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {loan.applicationDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
                        {loan.interestRate}
                      </div>
                    </TableCell>
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

export default Loans;
