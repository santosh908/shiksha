import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, LabelList } from 'recharts';
import TasksTable from '@/Components/molecules/DashboardComponents/TasksTable/TasksTable';
import StatsCard from '@/Components/molecules/DashboardComponents/StatsCard/StatsCard';
import { usePage } from '@inertiajs/react';
import { FaUser, FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaUserFriends } from 'react-icons/fa';

export default function BhaktiBhekshukDashboard() {
  const { userName, asheryLeaderCount, BhaktiBhishuk, Devotee, ApprovedDevotee, NotApprovedDevotee, coordinatorCount } = usePage().props || {};
  // Prepare data for the chart
  const data = [
    { category: 'Ashery Leaders', count: asheryLeaderCount || 0 },
    { category: 'Bhakti Bhikshuk', count: BhaktiBhishuk || 0 },
    { category: 'Devotees', approved: ApprovedDevotee || 0, submitted: Devotee || 0, notApproved: NotApprovedDevotee || 0 },
    { category: 'Co-Ordinator', count: coordinatorCount || 0 },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Welcome back, {String(userName || 'BhaktiBhikshuk')}!</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1">
          <StatsCard
            title="DEVOTEE"
            value={`Approved: ${ApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserCheck size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="DEVOTEE"
            value={`Partially Submite: ${Devotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserClock size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="DEVOTEE"
            value={`NotApproved: ${NotApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserTimes size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="ASHERY LEADER"
            value={String(asheryLeaderCount)}
            change={24.6}
            period="month"
            icon={<FaUsers size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="BHAKTI BHIKSHUK"
            value={String(BhaktiBhishuk)}
            change={-13.8}
            period="month"
            icon={<FaUserFriends size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1">
          <StatsCard
            title="CO-ORDINATOR"
            value={String(coordinatorCount)} // Replace with dynamic data if available
            change={-9.6}
            period="month"
            icon={<FaUsers size={50} color="#4caf50" />}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">SuperAdmin Overview</h3>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <BarChart
              width={window.innerWidth >= 1024 ? 700 : window.innerWidth >= 768 ? 500 : 350} // Dynamically set width
              height={300}
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={false} />
              <YAxis tick={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Count">
                <LabelList dataKey="count" position="top" />
              </Bar>
              <Bar dataKey="approved" fill="#82ca9d" name="Approved">
                <LabelList dataKey="approved" position="top" />
              </Bar>
              <Bar dataKey="submitted" fill="#ffcc00" name="Submitted">
                <LabelList dataKey="submitted" position="top" />
              </Bar>
              <Bar dataKey="notApproved" fill="#ff7f7f" name="Not Approved">
                <LabelList dataKey="notApproved" position="top" />
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
