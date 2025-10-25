
import React from 'react';
import { Progress } from '@/components/ui/progress';

const services = [
  { name: 'Profile Assessment', completed: 245, total: 312, percentage: 78 },
  { name: 'University Applications', completed: 189, total: 245, percentage: 77 },
  { name: 'Visa Support', completed: 156, total: 189, percentage: 83 },
  { name: 'Preparation Support', completed: 198, total: 234, percentage: 85 },
  { name: 'Travel Support', completed: 134, total: 156, percentage: 86 },
  { name: 'Accommodation', completed: 167, total: 201, percentage: 83 },
  { name: 'Education Loans', completed: 98, total: 134, percentage: 73 },
  { name: 'Job Opportunities', completed: 89, total: 112, percentage: 79 }
];

export const ServiceOverview = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Overview</h3>
      
      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{service.name}</span>
              <span className="text-sm text-gray-500">
                {service.completed}/{service.total}
              </span>
            </div>
            <Progress value={service.percentage} className="h-2" />
            <div className="text-right">
              <span className="text-xs text-gray-500">{service.percentage}% completion</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
