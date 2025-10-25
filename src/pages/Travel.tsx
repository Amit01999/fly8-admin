
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
import { 
  Search, 
  Plane, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  User,
  Package
} from 'lucide-react';

const mockTravelData = {
  tickets: [
    { id: 1, studentName: 'Sarah Johnson', destination: 'Toronto, Canada', departure: '2024-08-15', arrival: '2024-08-16', status: 'Confirmed', airline: 'Air Canada', price: '$850' },
    { id: 2, studentName: 'Michael Chen', destination: 'New York, USA', departure: '2024-08-20', arrival: '2024-08-21', status: 'Pending', airline: 'Delta Airlines', price: '$920' },
    { id: 3, studentName: 'Emma Wilson', destination: 'London, UK', departure: '2024-09-01', arrival: '2024-09-02', status: 'Booked', airline: 'British Airways', price: '$780' }
  ],
  pickup: [
    { id: 1, studentName: 'David Kumar', airport: 'Toronto Pearson', arrivalTime: '14:30', date: '2024-08-15', driver: 'John Smith', status: 'Assigned' },
    { id: 2, studentName: 'Lisa Zhang', airport: 'JFK International', arrivalTime: '18:45', date: '2024-08-20', driver: 'Mike Johnson', status: 'Confirmed' }
  ],
  packages: [
    { id: 1, studentName: 'John Doe', packageType: 'Student Starter Pack', destination: 'Vancouver', status: 'Delivered', trackingNumber: 'FL8001234' },
    { id: 2, studentName: 'Maria Garcia', packageType: 'Welcome Package', destination: 'Boston', status: 'In Transit', trackingNumber: 'FL8001235' }
  ]
};

const Travel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': case 'booked': case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': case 'in transit': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Travel Support</h1>
          <Button>Book New Ticket</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Flight Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-blue-600">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Airport Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-green-600">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Travel Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-purple-600">Active packages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$78,500</div>
              <p className="text-xs text-orange-600">Travel bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search travel bookings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tickets">Flight Tickets</TabsTrigger>
            <TabsTrigger value="pickup">Airport Pickup</TabsTrigger>
            <TabsTrigger value="checklist">Fly Checklist</TabsTrigger>
            <TabsTrigger value="packages">Travel Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <span>Flight Ticket Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Airline</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTravelData.tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div className="font-medium">{ticket.studentName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{ticket.destination}</span>
                          </div>
                        </TableCell>
                        <TableCell>{ticket.departure}</TableCell>
                        <TableCell>{ticket.arrival}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.airline}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ticket.price}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Modify</Button>
                            <Button size="sm">View Ticket</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pickup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-500" />
                  <span>Airport Pickup Service</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Airport</TableHead>
                      <TableHead>Arrival Date</TableHead>
                      <TableHead>Arrival Time</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTravelData.pickup.map((pickup) => (
                      <TableRow key={pickup.id}>
                        <TableCell>
                          <div className="font-medium">{pickup.studentName}</div>
                        </TableCell>
                        <TableCell>{pickup.airport}</TableCell>
                        <TableCell>{pickup.date}</TableCell>
                        <TableCell>{pickup.arrivalTime}</TableCell>
                        <TableCell>{pickup.driver}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pickup.status)}>
                            {pickup.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Contact Driver</Button>
                            <Button size="sm">Update</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Travel Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Passport & Visa</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">234 Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Flight Tickets</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">45 Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Accommodation</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">189 Confirmed</Badge>
                    </div>
                    <Button className="w-full" size="sm">Generate Checklist</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Guide Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm">Active Guides</div>
                      <div className="text-xs text-gray-600">12 guides available</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm">Consultations</div>
                      <div className="text-xs text-gray-600">34 sessions this week</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-sm">Resources</div>
                      <div className="text-xs text-gray-600">156 travel guides</div>
                    </div>
                    <Button className="w-full" size="sm">Assign Guide</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span>Travel Packages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Package Type</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Tracking Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTravelData.packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <div className="font-medium">{pkg.studentName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pkg.packageType}</Badge>
                        </TableCell>
                        <TableCell>{pkg.destination}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {pkg.trackingNumber}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pkg.status)}>
                            {pkg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">Track</Button>
                            <Button size="sm">Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Travel;
