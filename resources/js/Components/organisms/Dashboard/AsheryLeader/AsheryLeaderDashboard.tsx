import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import StatsCard from '@/Components/molecules/DashboardComponents/StatsCard/StatsCard';
import { usePage } from '@inertiajs/react';
import { FaUserCheck, FaUserTimes, FaUserFriends } from 'react-icons/fa';

export default function AsheryLeaderDashboard() {
  const { userName, BhaktiBhishuk, Devotee, ApprovedDevotee, NotApprovedDevotee } = usePage().props || {};
  const approved = Number(ApprovedDevotee || 0);
  const notApproved = Number(NotApprovedDevotee || 0);
  const bhaktiVriksha = Number(BhaktiBhishuk || 0);

  // Chart dataset for the 3 devotee types.
  const data = [
    { name: 'Approved Devotee', value: approved, color: '#16a34a' },
    { name: 'Not Approved Devotee', value: notApproved, color: '#dc2626' },
    { name: 'Bhakti Vriksha Devotee', value: bhaktiVriksha, color: '#2563eb' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Welcome back, {String(userName || 'AsheryLeader')}!</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1">
          <StatsCard
            title="DEVOTEE"
            value={`Approved: ${ApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserCheck size={30} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="DEVOTEE"
            value={`NotApproved: ${NotApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserTimes size={30} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="Bhakti Vriksha Devotee"
            value={String(BhaktiBhishuk)}
            change={-13.8}
            period="month"
            icon={<FaUserFriends size={50} color="#4caf50" />}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Overview</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
