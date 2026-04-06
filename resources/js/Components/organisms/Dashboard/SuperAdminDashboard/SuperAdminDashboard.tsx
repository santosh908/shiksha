import React, { useState, useEffect, useMemo } from 'react';
import StatsCard from '@/Components/molecules/DashboardComponents/StatsCard/StatsCard';
import { router, usePage } from '@inertiajs/react';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaUserFriends } from 'react-icons/fa';
import { Modal, Text, Grid, Card, Table, Title, Stack, Loader, Center } from '@mantine/core';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

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
      onStart: () => setIsStatsLoading(true),
      onFinish: () => setIsStatsLoading(false),
      onError: () => setIsStatsLoading(false),
    });
  };


  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedExamLevel(null);
    setIsStatsLoading(false);
  };

  const formatExamDate = (value: unknown): string => {
    const raw = String(value ?? '').trim();
    if (!raw || raw === '0000-00-00' || raw === '0000-00-00 00:00:00') {
      return '-';
    }
    // Already formatted for UI (dd/MM/yyyy)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
      return raw;
    }
    // Unix timestamp (seconds)
    if (/^\d{10}$/.test(raw)) {
      const tsDate = new Date(Number(raw) * 1000);
      if (!Number.isNaN(tsDate.getTime())) {
        return tsDate.toLocaleDateString('en-GB');
      }
    }
    // Unix timestamp (milliseconds)
    if (/^\d{13}$/.test(raw)) {
      const tsDate = new Date(Number(raw));
      if (!Number.isNaN(tsDate.getTime())) {
        return tsDate.toLocaleDateString('en-GB');
      }
    }
    // Legacy non-ISO date formats (dd-mm-yyyy or dd/mm/yyyy)
    const dmyMatch = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const month = Number(dmyMatch[2]);
      const year = Number(dmyMatch[3]);
      const parsed = new Date(year, month - 1, day);
      if (
        !Number.isNaN(parsed.getTime()) &&
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed.toLocaleDateString('en-GB');
      }
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('en-GB');
  };

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'login_id', header: 'Unique ID' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'initiated_name', header: 'Initiated Name' },
      {
        accessorKey: 'exam_date',
        header: 'Exam Date',
        //@ts-ignore
        Cell: ({ row }) => formatExamDate(row.original.exam_date),
      },
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
    <div className="container mx-auto px-4 py-6 md:px-6">
      <Title order={2} mb="lg">
        Welcome back, {String(userName || 'SuperAdmin')}!
      </Title>

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

        <div
          className="col-span-1 cursor-pointer"
          onClick={() => router.get('/Action/devoteeList', { status: 'S' })}
        >
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

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Stack gap="md">
              <div>
                <Title order={4}>Registration Overview</Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Snapshot of devotee pipeline by role and approval status.
                </Text>
              </div>
              <BarChart
              h={320}
              data={data}
              dataKey="DevoteeType"
              withTooltip
              tooltipProps={{
                content: ({ label, payload }) => {
                  if (!payload?.length) return null;

                  return (
                    <div
                      style={{
                        background: '#111827',
                        color: '#F9FAFB',
                        padding: '10px 12px',
                        border: '1px solid #1F2937',
                        borderRadius: '10px',
                        minWidth: '170px',
                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '13px' }}>
                        {label}
                      </div>

                      {payload.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            fontSize: '13px',
                            marginBottom: '4px',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '999px',
                                background: item.color,
                                display: 'inline-block',
                              }}
                            />
                            <span style={{ color: '#E5E7EB' }}>{item.name}</span>
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                },
              }}
              series={[
                { name: 'Total', color: 'indigo.6' },
                { name: 'Approved', color: 'teal.6' },
                { name: 'Pending', color: 'orange.6' },
              ]}
              cursorFill="transparent"
              strokeDasharray="3 3"
            />
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={4} mb="md">Shiksha Level Qualified Devotees</Title>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Exam Level</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">No. of Devotees</th>
                </tr>
              </thead>
              <tbody>
                {examLevelData.map((stat: ExamLevelStat, index: number) => (
                  <tr key={stat.name} className="border-t cursor-pointer hover:bg-gray-50" onClick={() => handleRowClick(stat)}>
                    <td className="py-2 px-4 text-sm">{index + 1}</td>
                    <td className="py-2 px-4 text-sm font-medium">{stat.name}</td>
                    <td className="py-2 px-4 text-sm">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Grid.Col>
      </Grid>

      <Modal opened={modalOpen} onClose={handleModalClose} size="full">
        {selectedExamLevel && (
          <Grid>
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={600} mb="sm">Details for {selectedExamLevel.name}</Text>
                {isStatsLoading ? (
                  <Center py="xl">
                    <Stack align="center" gap="xs">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">Loading data...</Text>
                    </Stack>
                  </Center>
                ) : (
                  <DataTable data={validstats} columnsFields={columns} PageSize={PAGE_SIZE} />
                )}
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </div>
  );
}
