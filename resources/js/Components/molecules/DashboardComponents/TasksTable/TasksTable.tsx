import React from 'react';

export type Task = {
  name: string;
  startDate: string;
  endDate: string;
  state: 'IN PROGRESS' | 'COMPLETED' | 'PENDING';
  assignee: string;
};

type TasksTableProps = {
  tasks: Task[];
};

const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => (
  <div className="rounded-lg border bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-medium">Tasks</h3>
      <button className="flex items-center text-sm text-blue-500 hover:text-blue-600">
        View all
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="py-2 text-left text-sm font-medium text-gray-500">Start date</th>
            <th className="py-2 text-left text-sm font-medium text-gray-500">End date</th>
            <th className="py-2 text-left text-sm font-medium text-gray-500">State</th>
            <th className="py-2 text-left text-sm font-medium text-gray-500">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 text-sm">{task.name}</td>
              <td className="py-2 text-sm">{task.startDate}</td>
              <td className="py-2 text-sm">{task.endDate}</td>
              <td className="py-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    task.state === 'IN PROGRESS'
                      ? 'bg-blue-100 text-blue-700'
                      : task.state === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {task.state}
                </span>
              </td>
              <td className="py-2 text-sm">{task.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TasksTable;
