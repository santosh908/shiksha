import React, { useState, useMemo, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import type AllDevoteeList from './devoteeType';
import { Loader, Progress } from '@mantine/core';
import './style.css'

type Props = {
  data: AllDevoteeList[];
  reportType: {
    id: string;
    label: string;
    icon: any; // You can type this better if needed
    description: string;
  }
};

const AllDevoteeListComponent: React.FC<Props> = ({ data, reportType  }) => {
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

const dateFormate = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  let cDt = new Date(dateString);
  
  // Fix for Safari/older browsers checking typical SQL string "YYYY-MM-DD HH:MM:SS"
  if (isNaN(cDt.getTime())) {
      cDt = new Date(dateString.replace(' ', 'T'));
  }

  if (isNaN(cDt.getTime())) {
      return dateString;
  }
  
  return cDt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
  });
};

useEffect(() => {
  if (data && data.length > 0) {
    setLoading(false);
  }
}, [data]);

const columns = [
  {
    name: '#',
    selector: (_row: AllDevoteeList, index: number) =>
      (currentPage - 1) * rowsPerPage + index + 1,
    width: '50px',
    sortable: false,
  },
  { name: 'Login ID', selector: (row: AllDevoteeList) => row.login_id, sortable: true },
  { name: 'Ashery Leader Name', selector: (row: AllDevoteeList) => row.ashray_leader_initiated_name || row.ashery_leader_name, sortable: true },
  { name: 'Bhakti Vriksha Leader Name', selector: (row: AllDevoteeList) => row.bhakti_leader_initiated_name || row.bhakti_bhikshuk_name, sortable: true },
  { name: 'Name', selector: (row: AllDevoteeList) => row.name, sortable: true, },
  { name: 'Initiated Name', selector: (row: AllDevoteeList) => row.Initiated_name, sortable: true, },
  { name: 'Email', selector: (row: AllDevoteeList) => row.email, sortable: true },
  { name: 'Contact Number', selector: (row: AllDevoteeList) => row.contact_number, sortable: true },
  {name:'D.O.B.', selector: (row: AllDevoteeList) =>dateFormate(row.dob), sortable: true },
  {name:'Submited Date',selector:(rows: AllDevoteeList)=>rows.SubmitedDate},
  {name:'Have you applied before', selector: (row: AllDevoteeList) => row.have_you_applied_before, sortable: true },
  {
    name: 'Account Approved',
    selector: (row: AllDevoteeList) => {
      const status = row.account_approved?.trim();
      return !status || status === 'N' ? 'P' : status;
    },
    sortable: true,
  },
  {name:'Devotee Type', selector: (row: AllDevoteeList) => row.devotee_type, sortable: true },
  {name:'Qualification', selector: (row: AllDevoteeList) => row.eduction_name, sortable: true },
  {name:'Merital Status', selector: (row: AllDevoteeList) => row.merital_status_name, sortable: true },
  {name:'Profession', selector: (row: AllDevoteeList) => row.profession_name, sortable: true },
  {name:'Spiritual Master', selector: (row: AllDevoteeList) => row.spiritual_master, sortable: true },
  {
    name: 'Address',
    selector: (row: AllDevoteeList) =>
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
  {name:'How many round you chant', selector: (row: AllDevoteeList) => row.how_many_rounds_you_chant, sortable: true },
  {name:'When are you chanting', selector: (row: AllDevoteeList) => dateFormate(row.when_are_you_chantin), sortable: true },
  {name:'Hearing Lecture', selector: (row: AllDevoteeList) => row.spend_everyday_hearing_lectures, sortable: true },
  {name:'Bhakti Shastri Degree', selector: (row: AllDevoteeList) => row.bakti_shastri_degree, sortable: true },
  {name:'Since when you attending ashray classes',selector: (row: AllDevoteeList) => dateFormate(row.since_when_you_attending_ashray_classes), sortable: true },
  {name:'spiritual master you aspiring', selector: (row: AllDevoteeList) => row.spiritual_master_you_aspiring, sortable: true },
  {name:'Book Names', selector: (row: AllDevoteeList) => row.book_names, sortable: true },
  {name:'Prayer Names', selector: (row: AllDevoteeList) => row.prayer_names, sortable: true },
  {name:'Principle Names', selector: (row: AllDevoteeList) => row.principle_names, sortable: true },
  {name:'Seminar Names', selector: (row: AllDevoteeList) => row.seminar_names, sortable: true },
];

const exportToCSV = (rows: AllDevoteeList[]) => {
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
  link.setAttribute('download', `all-devotee-list-${new Date().toISOString().split('T')[0]}.csv`);
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
      (devotee.eduction_name && devotee.eduction_name.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.profession_name && devotee.profession_name.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.principle_names && devotee.principle_names.toLowerCase().includes(search.toLowerCase())) ||
      (devotee.bhakti_bhikshuk_name && devotee.bhakti_bhikshuk_name.toLowerCase().includes(search.toLowerCase()))
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

export default AllDevoteeListComponent;