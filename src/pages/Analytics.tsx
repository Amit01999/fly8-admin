
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Globe,
  Activity,
  Target
} from 'lucide-react';

const monthlyData = [
  { month: 'Jan', students: 65, applications: 45, visas: 32 },
  { month: 'Feb', students: 75, applications: 52, visas: 38 },
  { month: 'Mar', students: 85, applications: 61, visas: 45 },
  { month: 'Apr', students: 95, applications: 68, visas: 51 },
  { month: 'May', students: 105, applications: 78, visas: 58 },
  { month: 'Jun', students: 125, applications: 89, visas: 67 }
];

const servicesData = [
  { name: 'Profile Assessment', value: 2847, color: '#3B82F6' },
  { name: 'University Applications', value: 1234, color: '#10B981' },
  { name: 'Visa Support', value: 856, color: '#F59E0B' },
  { name: 'Accommodation', value: 564, color: '#EF4444' },
  { name: 'Education Loans', value: 456, color: '#8B5CF6' },
  { name: 'Jobs Abroad', value: 1345, color: '#06B6D4' }
];

const countryData = [
  { country: 'Canada', students: 1234, percentage: 35 },
  { country: 'USA', students: 987, percentage: 28 },
  { country: 'UK', students: 654, percentage: 18 },
  { country: 'Australia', students: 432, percentage: 12 },
  { country: 'Germany', students: 234, percentage: 7 }
];

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Active Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,453</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+8.2%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+2.1%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-blue-600">Active destinations</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="applications" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="visas" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Services Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Services Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Destination Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countryData.map((item, index) => (
                  <div key={item.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.country}</div>
                        <div className="text-sm text-gray-500">{item.students} students</div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-green-500" />
                    <span className="text-sm">University Applications</span>
                  </div>
                  <Badge className="bg-green-500 text-white">92%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Profile Assessment</span>
                  </div>
                  <Badge className="bg-blue-500 text-white">89%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Visa Support</span>
                  </div>
                  <Badge className="bg-yellow-500 text-white">85%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">New Registrations</span>
                    <span className="font-medium">+156</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Service Completion</span>
                    <span className="font-medium">+89</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <span className="font-medium">+12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
