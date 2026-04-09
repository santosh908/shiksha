import React from 'react';
import StatsCard from '@/Components/molecules/DashboardComponents/StatsCard/StatsCard';
import { usePage } from '@inertiajs/react';
import { FaUserCheck, FaUserClock, FaUserTimes, FaUserFriends } from 'react-icons/fa';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function BhaktiBhekshukDashboard() {
  const {
    userName,
    assignedDevoteeCount = 0,
    approvedCount = 0,
    rejectedCount = 0,
    pendingCount = 0,
  } = (usePage().props || {}) as {
    userName?: string;
    assignedDevoteeCount?: number;
    approvedCount?: number;
    rejectedCount?: number;
    pendingCount?: number;
  };

  const assigned = Number(assignedDevoteeCount) || 0;
  const approved = Number(approvedCount) || 0;
  const rejected = Number(rejectedCount) || 0;
  const pending = Number(pendingCount) || 0;

  const mixData = [
    { name: 'Approved Devotee', value: approved, color: '#16a34a' },
    { name: 'Pending Devotee', value: pending, color: '#f59e0b' },
    { name: 'Rejected Devotee', value: rejected, color: '#dc2626' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Welcome back, {String(userName || 'BhaktiBhikshuk')}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="DEVOTEE" value={`Assigned: ${assigned}`} change={0} period="month" icon={<FaUserFriends size={30} color="#4caf50" />} />
        <StatsCard title="DEVOTEE" value={`Approved: ${approved}`} change={0} period="month" icon={<FaUserCheck size={30} color="#4caf50" />} />
        <StatsCard title="DEVOTEE" value={`Pending: ${pending}`} change={0} period="month" icon={<FaUserClock size={30} color="#4caf50" />} />
        <StatsCard title="DEVOTEE" value={`Rejected: ${rejected}`} change={0} period="month" icon={<FaUserTimes size={30} color="#4caf50" />} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Devotee Status Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={mixData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={4}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {mixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
