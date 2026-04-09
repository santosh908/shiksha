import React, { useMemo, useState } from 'react';
import { Anchor, Box, Breadcrumbs, Card, CardSection, Container, Grid, Loader, Select, Text } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMediaQuery } from '@mantine/hooks';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { SessionResultList } from '@/Components/organisms/Dashboard/SuperAdminDashboard/SessionResult/SessionResultList.types';

type SessionResultListBaseProps = {
  dashboardHref: string;
  sessionRouteName: string;
  encodeSessionForRoute?: boolean;
};

export default function SessionResultListBase({
  dashboardHref,
  sessionRouteName,
  encodeSessionForRoute = false,
}: SessionResultListBaseProps) {
  const { devoteeResults, examSessions } = usePage<{
    devoteeResults: SessionResultList[];
    examSessions: Array<{ id: number; session_name: string }>;
    currentSession: string | null;
  }>().props;

  const [isLoading, setIsLoading] = useState(false);
  const validdevoteeResults = Array.isArray(devoteeResults) ? devoteeResults : [];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [hasUserSelectedSession, setHasUserSelectedSession] = useState(false);

  const sessionOptions = examSessions.map((session) => ({
    value: session.id.toString(),
    label: session.session_name,
  }));

  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredResults = useMemo(() => {
    if (!hasUserSelectedSession || !selectedSession) return [];
    return validdevoteeResults;
  }, [validdevoteeResults, selectedSession, hasUserSelectedSession]);

  const handleSessionChange = (value: string | null) => {
    setIsLoading(true);
    setHasUserSelectedSession(true);
    setSelectedSession(value);

    if (value) {
      const sessionValue = encodeSessionForRoute
        ? btoa(`${value}_${new Date().getTime()}`)
        : value;

      router.get(
        route(sessionRouteName, { session: sessionValue }),
        {},
        {
          preserveState: true,
          preserveScroll: true,
          onFinish: () => setIsLoading(false),
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const PAGE_SIZE = 10;
  const uniqueShikshaLevels = [1, 2, 3, 4, 5, 6, 7];
  const shikshaLevelNames: { [key: number]: string } = {
    1: 'INTE',
    2: 'SDH',
    3: 'KSVK',
    4: 'KSD',
    5: 'SPA',
    6: 'GPAAS',
    7: 'GPA',
  };

  const groupedData = useMemo(() => {
    const grouped = {} as Record<string, any>;

    filteredResults.forEach((result) => {
      const loginId = result.login_id;

      if (!grouped[loginId]) {
        grouped[loginId] = {
          login_id: result.login_id || 'NA',
          ashery_leader_name: result.ashery_leader_name || 'NA',
          name: result.name || 'NA',
          Initiated_name: result.Initiated_name || 'NA',
          email: result.email || 'NA',
          contact_number: result.contact_number || 'NA',
        };

        uniqueShikshaLevels.forEach((level) => {
          grouped[loginId][`exam_date_${level}`] = 'NA';
          grouped[loginId][`total_questions_${level}`] = 'NA';
          grouped[loginId][`total_marks_${level}`] = 'NA';
          grouped[loginId][`total_obtain_${level}`] = 'NA';
          grouped[loginId][`is_qualified_${level}`] = 'NA';
          grouped[loginId][`exam_level_${level}`] = 'NA';
        });
      }

      const level = result.shiksha_level;
      if (level && uniqueShikshaLevels.includes(level)) {
        grouped[loginId][`exam_date_${level}`] = result.exam_date || 'NA';
        grouped[loginId][`total_questions_${level}`] = result.total_questions || 'NA';
        grouped[loginId][`total_marks_${level}`] = result.total_marks || 'NA';
        grouped[loginId][`total_obtain_${level}`] = result.total_obtain || 'NA';
        grouped[loginId][`is_qualified_${level}`] = Number(result.is_qualified);
        grouped[loginId][`exam_level_${level}`] = result.exam_level || 'NA';
      }
    });

    return Object.values(grouped);
  }, [filteredResults]);

  const columns = useMemo<MRT_ColumnDef<SessionResultList>[]>(() => {
    const dynamicColumns: MRT_ColumnDef<SessionResultList>[] = [
      { accessorKey: 'login_id', header: 'Devotee ID' },
      { accessorKey: 'ashery_leader_name', header: 'Ashery Leader' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
    ];

    uniqueShikshaLevels.forEach((level) => {
      const levelName = shikshaLevelNames[level] || `Level ${level}`;

      dynamicColumns.push({ accessorKey: `exam_date_${level}`, header: `${levelName} - Exam Date` });
      dynamicColumns.push({ accessorKey: `total_questions_${level}`, header: `${levelName} - Total Questions` });
      dynamicColumns.push({ accessorKey: `total_marks_${level}`, header: `${levelName} - Total Marks` });
      dynamicColumns.push({ accessorKey: `total_obtain_${level}`, header: `${levelName} - Total Obtain` });

      if (level === 7) {
        dynamicColumns.push({
          accessorKey: 'total_assignment_written',
          header: 'Total Assisgmne+Written',
          accessorFn: (row: any) => {
            const assignmentObtain = Number(row.total_obtain_6);
            const writtenObtain = Number(row.total_obtain_7);
            const safeAssignment = Number.isFinite(assignmentObtain) ? assignmentObtain : 0;
            const safeWritten = Number.isFinite(writtenObtain) ? writtenObtain : 0;
            const total = safeAssignment + safeWritten;
            return total > 0 ? total : 'NA';
          },
        });
      }

      if (level !== 6) {
        dynamicColumns.push({
          accessorKey: `is_qualified_${level}`,
          header: `${levelName} - Qualified`,
          Cell: ({ cell }) => {
            const value = Number(cell.getValue());
            return (
              <Text className="text-center font-bold">
                {value === 1 ? <span style={{ color: 'green' }}>✓</span> : <span style={{ color: 'red' }}>✗</span>}
              </Text>
            );
          },
        });
      }
    });

    return dynamicColumns;
  }, []);

  return (
    <Container fluid py={25}>
      <Breadcrumbs>
        <Anchor href={dashboardHref}>Dashboard</Anchor>
        <Text>Devotee Result List</Text>
      </Breadcrumbs>

      <Grid mt={30}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <CardSection py={25}>
              <Box
                mb={20}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Select
                  label="Select Exam Session"
                  placeholder="Choose an exam session"
                  data={sessionOptions}
                  value={selectedSession}
                  onChange={handleSessionChange}
                  clearable
                  disabled={isLoading}
                  style={{ width: isMobile ? '90%' : '50%' }}
                />
              </Box>
              {isLoading ? (
                <Box ta="center" py={30}>
                  <Loader size="md" />
                  <Text mt={10}>Loading results...</Text>
                </Box>
              ) : (
                hasUserSelectedSession &&
                selectedSession && (
                  <Box>
                    <DataTable data={groupedData} columnsFields={columns} PageSize={PAGE_SIZE} />
                  </Box>
                )
              )}
            </CardSection>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
