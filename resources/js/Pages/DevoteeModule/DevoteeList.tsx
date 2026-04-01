import React, { useEffect, useState, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { Loader, Button, TextInput, Card, Title } from '@mantine/core';
import { IconEye, IconSearch, IconDownload } from '@tabler/icons-react'; // Make sure tabler icons are installed
import axios from 'axios';
import * as XLSX from 'xlsx';
import DevoteeDetailsModal from '../../Components/organisms/DevoteeModule/DevoteeDetailsModal';
import Dashboard from '@/Layouts/DashboardLayout/DashboardLayout1/Dashboard';

// Reuse the type if possible, or define a new one relevant for the list
interface DevoteeListItem {
    login_id: string;
    name: string;
    Initiated_name: string;
    dob: string;
    next_level: string;
    // ... potentially other fields for search
    email?: string;
    contact_number?: string;
}

const DevoteeListPage = () => {
    const [data, setData] = useState<DevoteeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDevotee, setSelectedDevotee] = useState<any>(null);
    const [selectedExamDetails, setSelectedExamDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        try {
            const response = await axios.get('/Action/devotee-module/list');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching devotee list:', error);
            setLoading(false);
        }
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map((item, index) => ({
            'S.No': index + 1,
            'Login ID': item.login_id,
            'Name': item.name,
            'Email': item.email,
            'Initiated Name': item.Initiated_name,
            'Next Exam Level': item.next_level
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Devotees");
        XLSX.writeFile(workbook, "DevoteeList.xlsx");
    };

    const handleViewMore = async (row: DevoteeListItem) => {
        setDetailsLoading(true);
        try {
            const id = (row as any).prid || (row as any).id;
            
            const response = await axios.get(`/Action/devotee-module/details/${id}`);
            setSelectedDevotee(response.data.personal_details);
            setSelectedExamDetails(response.data.exam_details);
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching details:', error);
            alert('Failed to load details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        if (!search) return data;
        const lowerSearch = search.toLowerCase();
        return data.filter(item => 
            (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
            (item.login_id && item.login_id.toLowerCase().includes(lowerSearch)) ||
            (item.Initiated_name && item.Initiated_name.toLowerCase().includes(lowerSearch))
        );
    }, [data, search]);

    const columns = [
        {
            name: 'S.No',
            cell: (_row: DevoteeListItem, index: number) => (page - 1) * perPage + index + 1,
            width: '70px',
        },
        {
            name: 'Login ID',
            selector: (row: DevoteeListItem) => row.login_id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row: DevoteeListItem) => row.name,
            sortable: true,
        },
        {
            name:'email',
            selector:(row:DevoteeListItem)=>row.email,
            sortable:true
        },
        {
            name: 'Initiated Name',
            selector: (row: DevoteeListItem) => row.Initiated_name,
            sortable: true,
        },
        {
            name: 'Next Exam Level',
            selector: (row: DevoteeListItem) => row.next_level ,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row: DevoteeListItem) => (
                <Button 
                   size="xs" 
                   variant="light" 
                   color="blue" 
                   leftSection={<IconEye size={16}/>}
                   onClick={() => handleViewMore(row)}
                   loading={detailsLoading && (selectedDevotee?.prid === (row as any).prid)} 
                   // Note: loading state is global for simplicity, refined per row if needed
                >
                    View More
                </Button>
            ),
        },
    ];

    return (
        <Dashboard>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <div className="flex justify-between items-center mb-6">
                        <Title order={3}>Devotee Overview</Title>
                        <div className="flex gap-2">
                            <TextInput
                                placeholder="Search by Name, ID..."
                                leftSection={<IconSearch size={16} />}
                                value={search}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                style={{ width: 300 }}
                            />
                            <Button 
                                color="green" 
                                leftSection={<IconDownload size={16} />}
                                onClick={handleDownloadExcel}
                            >
                                Excel
                            </Button>
                        </div>
                    </div>

                    <DataTable
                    //@ts-ignore
                        columns={columns}
                        data={filteredData}
                        pagination
                        paginationServer={false}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                            setPerPage(currentRowsPerPage);
                            setPage(currentPage);
                        }}
                        progressPending={loading}
                        progressComponent={<Loader />}
                        fixedHeader
                        highlightOnHover
                    />
                </Card>

                <DevoteeDetailsModal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    devotee={selectedDevotee}
                    examDetails={selectedExamDetails}
                />
            </div>
        </Dashboard>
    );
};

export default DevoteeListPage;
