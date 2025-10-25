
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
  Home, 
  Eye, 
  MessageSquare, 
  MapPin,
  Bed,
  Users,
  DollarSign
} from 'lucide-react';

const mockAccommodations = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    property: 'Downtown Student Residence',
    type: 'Shared Room',
    location: 'Toronto, Canada',
    rent: '$800/month',
    status: 'Approved',
    applicationDate: '2024-06-10',
    moveInDate: '2024-09-01'
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    studentId: 2,
    property: 'University Heights Apartment',
    type: 'Studio',
    location: 'Vancouver, Canada',
    rent: '$1200/month',
    status: 'Pending',
    applicationDate: '2024-06-15',
    moveInDate: '2024-08-15'
  }
];

const Accommodation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accommodations] = useState(mockAccommodations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAccommodations = accommodations.filter(acc =>
    acc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Accommodation Management</h1>
          <Button>Add New Property</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-blue-600">+12 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">178</div>
              <p className="text-xs text-green-600">76% approval rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Available Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-purple-600">Active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,600</div>
              <p className="text-xs text-orange-600">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search accommodations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Accommodations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-blue-500" />
              <span>Accommodation Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Move-in Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccommodations.map((accommodation) => (
                  <TableRow key={accommodation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{accommodation.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {accommodation.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{accommodation.property}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Bed className="w-3 h-3 mr-1" />
                          {accommodation.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {accommodation.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-green-500" />
                        {accommodation.rent}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(accommodation.status)}>
                        {accommodation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{accommodation.applicationDate}</TableCell>
                    <TableCell>{accommodation.moveInDate}</TableCell>
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

export default Accommodation;
