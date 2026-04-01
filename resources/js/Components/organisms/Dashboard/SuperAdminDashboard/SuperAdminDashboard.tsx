import React, { useState, useEffect, useMemo } from 'react';
import TasksTable from '@/Components/molecules/DashboardComponents/TasksTable/TasksTable';
import StatsCard from '@/Components/molecules/DashboardComponents/StatsCard/StatsCard';
import { router, usePage } from '@inertiajs/react';
import { FaUser, FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaUserFriends } from 'react-icons/fa';
import { Modal, Button, Group, Text, Grid, Card, Table } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { useForm } from '@mantine/form';
import { BarChart } from '@mantine/charts';
import useUserStore from '@/Store/User.store';

type ExamLevelStat = {
  id: string;
  name: string;
  count: number;
};

type User = {
  id: string;
  email: string;
  name: string;
  initiated_name: string;
  exam_date: string;
  total_questions: string;
  total_marks: string;
  total_obtain: string;
  is_qualified: string;
  contact_number: string;
  login_id: string;
};

export default function SuperAdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamLevel, setSelectedExamLevel] = useState<ExamLevelStat | null>(null);
  const [openedModal, setOpenedModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      id: '',
      login_id: '',
      email: '',
      name: '',
      exam_date: '',
      total_questions: '',
      total_marks: '',
      total_obtain: '',
      is_qualified: '',
      contact_number: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValues({
        id: currentUser.id,
        login_id: currentUser.login_id,
        email: currentUser.email,
        name: currentUser.name,
        exam_date: currentUser.exam_date,
        total_questions: currentUser.total_questions,
        total_marks: currentUser.total_marks,
        total_obtain: currentUser.total_obtain,
        is_qualified: currentUser.is_qualified,
        contact_number: currentUser.contact_number,
      });
    }
  }, [currentUser]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const { stats } = usePage<{ stats: User[] }>().props;
  const validstats = Array.isArray(stats) ? stats : [];

  const { devoteeusers } = usePage<{ devoteeusers: User[] }>().props;
  const validdevoteeusers = Array.isArray(devoteeusers) ? devoteeusers : [];
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const PAGE_SIZE = 10;

  const { userName, asheryLeaderCount, BhaktiBhishuk, Devotee, ApprovedDevotee, NotApprovedDevotee, coordinatorCount, examLevelStats } =
    usePage().props || {};

  const data = [
    { DevoteeType: 'Ashery Leaders', Total: asheryLeaderCount, Approved: asheryLeaderCount, Pending: 0 },
    { DevoteeType: 'Bhakti Bhikshuk', Total: BhaktiBhishuk, Approved: BhaktiBhishuk, Pending: 0 },
    //{ DevoteeType: 'Co-Ordinator', Total: coordinatorCount, Approved: coordinatorCount, Pending: 0 },
    { DevoteeType: 'Devotees', Total: ApprovedDevotee, Approved: Devotee, Pending: NotApprovedDevotee },
  ];

  const examLevelData = Array.isArray(examLevelStats)
    ? examLevelStats.map((stat) => ({
        id: stat.id,
        name: stat.exam_level,
        count: stat.user_count,
      }))
    : [];

  const handleRowClick = (stat: ExamLevelStat) => {

    setSelectedExamLevel(stat);
    setModalOpen(true);

    router.reload({
      data: { level: stat.id },
      only: ['stats', 'devoteeusers'],
    });
  };


  const handleModalClose = () => {
    setModalOpen(false);
    router.get(`/${roleName[0]}/dashboard`);
  };

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'login_id', header: 'Unique ID' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'initiated_name', header: 'Initiated Name' },
      { accessorKey: 'exam_date', header: 'Exam Date' },
      { accessorKey: 'total_questions', header: 'Total Questions' },
      {
        accessorKey: 'total_marks',
        header: 'Total Marks',
        //@ts-ignore
        Cell: ({ row }) => {
          const data = row.original;
          if (data.shiksha_level === 6 || data.shiksha_level === 7) {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Table className="table table-responsive">
                  <Table.Tr>
                    <Table.Td>Assignment Submission-GPA :</Table.Td>
                    <Table.Th>{data.level_6_marks || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Gurupada Ashray :</Table.Td>
                    <Table.Th>{data.level_7_marks || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total: </Table.Td>
                    <Table.Th>{data.total_marks}</Table.Th>
                  </Table.Tr>
                </Table>
              </div>
            );
          } else if (data.shiksha_level === 8 || data.shiksha_level === 9) {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Table className="table table-responsive">
                  <Table.Tr>
                    <Table.Td> Post Gurupada Ashray Interactive(3 panel):</Table.Td>
                    <Table.Th>{data.level_8_marks || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Ashray Leader Assesment :</Table.Td>
                    <Table.Th>{data.level_9_marks || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total: </Table.Td>
                    <Table.Th>{data.total_marks}</Table.Th>
                  </Table.Tr>
                </Table>
              </div>
            );
          }
          return data.total_marks;
        },
      },
      {
        accessorKey: 'total_obtain',
        header: 'Total Marks Obtain',
        //@ts-ignore
        Cell: ({ row }) => {
          const data = row.original;
          if (data.shiksha_level === 6 || data.shiksha_level === 7) {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Table className="table table-responsive">
                  <Table.Tr>
                    <Table.Td>Assignment Submission-GPA :</Table.Td>
                    <Table.Th>{data.level_6_obtain || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Gurupada Ashray :</Table.Td>
                    <Table.Th>{data.level_7_obtain || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total: </Table.Td>
                    <Table.Th>{data.total_obtain}</Table.Th>
                  </Table.Tr>
                </Table>
              </div>
            );
          } else if (data.shiksha_level === 8 || data.shiksha_level === 9) {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Table className="table table-responsive table-bordered">
                  <Table.Tr>
                    <Table.Td> Post Gurupada Ashray Interactive(3 panel):</Table.Td>
                    <Table.Th>{data.level_8_obtain || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Ashray Leader Assesment :</Table.Td>
                    <Table.Th>{data.level_9_obtain || 0}</Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Total: </Table.Td>
                    <Table.Th>{data.total_obtain}</Table.Th>
                  </Table.Tr>
                </Table>
              </div>
            );
          }
          return data.total_obtain;
        },
      },
    ],
    [currentPage]
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Welcome back, {String(userName || 'SuperAdmin')}!</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 mb-8">
        <div className="col-span-1 cursor-pointer" onClick={() => router.get('/Action/devoteeList')}>
          <StatsCard
            title="DEVOTEE"
            value={`Approved: ${ApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserCheck size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1 cursor-pointer" onClick={() => router.get('/Action/partiallydevoteeList')}>
          <StatsCard
            title="DEVOTEE"
            text-align="center"
            value={`Partially Submitted: ${Devotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserClock size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1 cursor-pointer">
          <StatsCard
            title="DEVOTEE"
            value={`Not Approved: ${NotApprovedDevotee || 'N/A'}`}
            change={18.7}
            period="month"
            icon={<FaUserTimes size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1 cursor-pointer" onClick={() => router.get('/Action/asheryleader')}>
          <StatsCard
            title="ASHERY LEADER"
            value={String(asheryLeaderCount)}
            change={24.6}
            period="month"
            icon={<FaUsers size={50} color="#4caf50" />}
          />
        </div>

        <div className="col-span-1 cursor-pointer" onClick={() => router.get('/Action/bhaktibhikshuk')}>
          <StatsCard
            title="Bhakti Vriksha"
            value={String(BhaktiBhishuk)}
            change={-13.8}
            period="month"
            icon={<FaUserFriends size={50} color="#4caf50" />}
          />
        </div>

        {/* <div className="col-span-1 cursor-pointer" onClick={() => router.get('/Action/shikshappuser')}>
          <StatsCard
            title="CO-ORDINATOR"
            value={String(coordinatorCount)}
            change={-9.6}
            period="month"
            icon={<FaUsers size={50} color="#4caf50" />}
          />
        </div> */}
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <h3 className="mb-4 text-medium font-medium">SuperAdmin Overview</h3>
          {/* <BarChart 
            h={300}
            data={data}
            dataKey="DevoteeType"
            withTooltip   
            series={[
              { name: 'Total', color: 'violet.6' },
              { name: 'Approved', color: 'blue.6' },
              { name: 'Pending', color: 'teal.6' },
            ]}
            cursorFill="transparent"
            style={{ backgroundColor: 'white' }}
          /> */}
          <BarChart 
              h={300}
              data={data}
              dataKey="DevoteeType"
              withTooltip
              tooltipProps={{
                content: ({ label, payload }) => {
                  if (!payload?.length) return null;

                  return (
                    <div
                      style={{
                        background: 'white',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        minWidth: '140px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      {/* Title */}
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>
                        {label}
                      </div>

                      {/* Rows */}
                      {payload.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            fontSize: '13px',
                            marginBottom: '2px',
                          }}
                        >
                          <span style={{ color: item.color }}>
                            {item.name}
                          </span>
                          <span style={{ fontWeight: 500 }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                },
              }}
              series={[
                { name: 'Total', color: 'violet.6' },
                { name: 'Approved', color: 'blue.6' },
                { name: 'Pending', color: 'teal.6' },
              ]}
              cursorFill="transparent"
              style={{ backgroundColor: 'white' }}
            />

        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6}}>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium"> Shiksha Level Exams Qualified Devotees</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Exam Level</th>
                  <th className="py-2 px-4 text-left">No. of Devotees</th>
                </tr>
              </thead>
              <tbody>
                {examLevelData.map((stat: ExamLevelStat) => (
                  <tr key={stat.name} className="border-t cursor-pointer" onClick={() => handleRowClick(stat)}>
                    <td className="py-2 px-4">{stat.id}</td>
                    <td className="py-2 px-4">{stat.name}</td>
                    <td className="py-2 px-4">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Grid.Col>
      </Grid>

      <Modal opened={modalOpen} onClose={handleModalClose} size="full">
        {selectedExamLevel && (
          <Grid>
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg">Details for {selectedExamLevel.name}</Text>
                <DataTable data={validstats} columnsFields={columns} PageSize={PAGE_SIZE} />
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </div>
  );
}
