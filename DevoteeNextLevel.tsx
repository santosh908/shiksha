import React, { useState, useMemo, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import type devoteeNextLeveType from './devoteeNextLeveType';
import { Loader, Progress } from '@mantine/core';
import './style.css'

type Props = {
  data: devoteeNextLeveType[];
  reportType: {
    id: string;
    label: string;
    icon: any; // You can type this better if needed
    description: string;
  }
};

const DevoteeNextLevel: React.FC<Props> = ({ data, reportType }) => {
const [search, setSearch] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [loading, setLoading] = useState(true);

createTheme('iskcon', {
  text: { primary: '#212121', secondary: '#757575' },
  background: { default: '#fff' },
  context: { background: '#e3f2fd', text: '#212121' },
  divider: { default: '#e0e0e0' },
  action: { button: 'rgba(0,0,0,.54)', hover: 'rgba(0,0,0,.08)', disabled: 'rgba(0,0,0,.12)' },
});

useEffect(() => {
  if (data && data.length > 0) {
    setLoading(false);
  }
}, [data]);

const columns = [
  {
    name: '#',
    selector: (_row: devoteeNextLeveType, index: number) =>
      (currentPage - 1) * rowsPerPage + index + 1,
    width: '80px',
    sortable: false,
  },
  { name: 'Login ID', selector: (row: devoteeNextLeveType) => row.login_id, sortable: true },
  { name: 'Ashery Leader Name', selector: (row: devoteeNextLeveType) => row.ashery_leader_name, sortable: true },
  { name: 'Name', selector: (row: devoteeNextLeveType) => row.name, sortable: true, },
  { name: 'Email', selector: (row: devoteeNextLeveType) => row.email, sortable: true },
  { name: 'Contact Number', selector: (row: devoteeNextLeveType) => row.contact_number, sortable: true },
  {name:'Account Approved', selector: (row: devoteeNextLeveType) => row.account_approved, sortable: true },
  {
    name: 'Address',
    selector: (row: devoteeNextLeveType) =>
      [
        row.current_address,
        row.Sector_Area,
        row.Socity_Name,
        row.district_name,
        row.state_name,
        row.pincode,
      ]
        .filter(Boolean) // removes any undefined/null/empty strings
        .join(', '),
    sortable: false, // Optional: make true if sorting is needed
  },
  {name:'Next Level', selector: (row: devoteeNextLeveType) => row.next_level, sortable: true },

  {name:'Intractive Total Marks', selector: (row: devoteeNextLeveType) => row.level_1_total_marks, sortable: true },
  {name:'Intractive Obtain', selector: (row: devoteeNextLeveType) => row.level_1_obtained_marks, sortable: true },
  {name:'Intractive Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_1_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  {name:'Shraddhavan Total Marks', selector: (row: devoteeNextLeveType) => row.level_2_total_marks, sortable: true },
  {name:'Shraddhavan Obtain', selector: (row: devoteeNextLeveType) => row.level_2_obtained_marks, sortable: true },
  {name:'Shraddhavan Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_2_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  {name:'Krishna Sevak Total Marks', selector: (row: devoteeNextLeveType) => row.level_3_total_marks, sortable: true },
  {name:'Krishna Sevak Obtain', selector: (row: devoteeNextLeveType) => row.level_3_obtained_marks, sortable: true },
  {name:'Krishna Sevak Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_3_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  {name:'Krishna Sadhak Total Marks', selector: (row: devoteeNextLeveType) => row.level_4_total_marks, sortable: true },
  {name:'Krishna Sadhak Obtain', selector: (row: devoteeNextLeveType) => row.level_4_obtained_marks, sortable: true },
  {name:'Krishna Sadhak Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_4_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },


  {name:'Shrila Prabhupada Ashray Total Marks', selector: (row: devoteeNextLeveType) => row.level_5_total_marks, sortable: true },
  {name:'Shrila Prabhupada Ashray Obtain', selector: (row: devoteeNextLeveType) => row.level_5_obtained_marks, sortable: true },
  {name:'Shrila Prabhupada Ashray Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_5_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  {name:'Assignment Submission-GPA Total Marks', selector: (row: devoteeNextLeveType) => row.level_6_total_marks, sortable: true },
  {name:'Assignment Submission-GPA Obtain', selector: (row: devoteeNextLeveType) => row.level_6_obtained_marks, sortable: true },
  {name:'Assignment Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_6_obtained_marks>'19'?'Qualified':'Not Promoted'), sortable: true },
  {name:'Written GPA Total Marks', selector: (row: devoteeNextLeveType) => row.level_7_total_marks, sortable: true },
  {name:'Gurupada Ashray (Assignment+Written) Obtain', selector: (row: devoteeNextLeveType) => row.level_7_obtained_marks, sortable: true },
  {name:'Gurupada Ashray Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_7_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  // {name:'Post Gurupada Ashray Interactive(3 panel) Total Marks', selector: (row: devoteeNextLeveType) => row.level_8_total_marks, sortable: true },
  // {name:'Post Gurupada Ashray Interactive(3 panel) Obtain', selector: (row: devoteeNextLeveType) => row.level_8_obtained_marks, sortable: true },
  // {name:'Post Gurupada Ashray Interactive(3 panel) Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_8_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },

  {name:'Ashray Leader Assesment Total Marks', selector: (row: devoteeNextLeveType) => row.level_9_total_marks, sortable: true },
  {name:'Ashray Leader Assesment Obtain', selector: (row: devoteeNextLeveType) => row.level_9_obtained_marks, sortable: true },
  {name:'Ashray Leader Assesment Is Qualified', selector: (row: devoteeNextLeveType) => (row.level_9_is_qualified=='1'?'Qualified':'Not Promoted'), sortable: true },
];

const exportToCSV = (rows: devoteeNextLeveType[]) => {
  const csvHeaders = columns.map(col => col.name);

  const csvRows = rows.map((row, index) => {
    return columns.map(col => {
      // @ts-ignore
      if (col.name === '#' && col.selector) {
        return `"${index + 1}"`;
      }
      if (col.selector) {
        try {
          const value = col.selector(row, index);
          return `"${value !== null && value !== undefined ? value : ''}"`;
        } catch {
          return '""';
        }
      }
      return '""';
    }).join(',');
  });

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `devotee-next-level-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(devotee =>
      (devotee.name && devotee.name.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.email && devotee.email.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.login_id && devotee.login_id.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.contact_number && devotee.contact_number.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.current_address && devotee.current_address.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.next_level && devotee.next_level.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.ashery_leader_name && devotee.ashery_leader_name.toLowerCase().includes(search.toLowerCase()))
      // add more fields as needed
    );
  }, [data, search]);

return (
  <div className="divContent">
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 mb-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            {reportType.icon ? <reportType.icon size={20} /> : 'R'}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{reportType.label}</h3>
        </div>
        <p className="text-gray-600 text-sm">
          {reportType.description}
        </p>
      </div>
      {/* Search + Export row - show only when loading is false */}
      {!loading && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded w-[50vw]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => exportToCSV(filteredData)}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Export CSV
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        //@ts-ignore
        columns={columns}
        data={filteredData}
        fixedHeader={true}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[15, 30, 50, 100]}
        onChangePage={(page) => setCurrentPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setRowsPerPage(newPerPage);
          setCurrentPage(page);
        }}
        progressPending={loading}
        progressComponent={
          <div className="flex flex-col items-center justify-center w-full h-32">
            <Loader size="lg" className="mb-2" />
            <Progress value={100} size="md" striped animated className="w-1/2" />
            <p className="mt-2 text-gray-500 text-sm">Loading data, please wait...</p>
          </div>
        }
      />
    </div>

);

};

export default DevoteeNextLevel;