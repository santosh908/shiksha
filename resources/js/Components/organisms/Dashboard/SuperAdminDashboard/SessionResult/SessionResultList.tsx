import React, { useState, useMemo, useEffect } from 'react';
import { Container, Card, Text, Breadcrumbs, Anchor, Grid, CardSection, Box, Select, Loader } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { router, usePage } from '@inertiajs/react';
import { SessionResultList } from './SessionResultList.types';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMediaQuery } from '@mantine/hooks';
import useUserStore from '@/Store/User.store';

export default function SessionResultListComponent() {
  const { devoteeResults, examSessions, currentSession } = usePage<{
    devoteeResults: SessionResultList[];
    examSessions: Array<{ id: number; session_name: string }>;
    currentSession: string | null;
  }>().props;

  const [isLoading, setIsLoading] = useState(false);
  const validdevoteeResults = Array.isArray(devoteeResults) ? devoteeResults : [];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [hasUserSelectedSession, setHasUserSelectedSession] = useState(false);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();
  const sessionOptions = examSessions.map((session) => ({
    value: session.id.toString(),
    label: session.session_name,
  }));

  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const filteredResults = useMemo(() => {
    if (!hasUserSelectedSession || !selectedSession) return [];
    return validdevoteeResults;
  }, [validdevoteeResults, selectedSession, hasUserSelectedSession]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSessionChange = (value: string | null) => {
    setIsLoading(true);
    setHasUserSelectedSession(true);
    setSelectedSession(value);

    if (value) {
      const timestamp = new Date().getTime();
      const uniqueValue = `${value}_${timestamp}`;
      const encodedSession = btoa(uniqueValue);
      router.get(
        route('Action.sessionresultlist', { session: encodedSession }),
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

  //const uniqueShikshaLevels = [...new Set(validdevoteeResults.map((item) => item.shiksha_level))];
  const uniqueShikshaLevels = [1, 2, 3, 4, 5,6,7];
  // Step 2: Define a mapping for shiksha_level names
  const shikshaLevelNames: { [key: number]: string } = {
    1: 'INTE',
    2: 'SDH',
    3: 'KSVK',
    4: 'KSD',
    5: 'SPA',
    6: 'GPAAS',
    7: 'GPA'
  };

  // Step 2: Group data by login_id and shiksha_level
  const groupedData = useMemo(() => {
    const grouped = {};

    filteredResults.forEach((result) => {
      const loginId = result.login_id;

      // Create a new group for each devotee
      //@ts-ignore
      if (!grouped[loginId]) {
        //@ts-ignore
        grouped[loginId] = {
          login_id: result.login_id || 'NA',
          ashery_leader_name: result.ashery_leader_name || 'NA',
          name: result.name || 'NA',
          email: result.email || 'NA',
          contact_number: result.contact_number || 'NA',
          Initiated_name: result.Initiated_name || 'NA',
        };

        // Initialize all shiksha levels with 'NA' to avoid missing fields
        uniqueShikshaLevels.forEach((level) => {
          //@ts-ignore
          grouped[loginId][`exam_date_${level}`] = 'NA';
          //@ts-ignore
          grouped[loginId][`total_questions_${level}`] = 'NA';
          //@ts-ignore
          grouped[loginId][`total_marks_${level}`] = 'NA';
          //@ts-ignore
          grouped[loginId][`total_obtain_${level}`] = 'NA';
          //@ts-ignore
          grouped[loginId][`is_qualified_${level}`] = 'NA';
          //@ts-ignore
          grouped[loginId][`exam_level_${level}`] = 'NA';
        });
      }

      // Fill in data for the matching level
      const level = result.shiksha_level;
      if (level && uniqueShikshaLevels.includes(level)) {
        //@ts-ignore
        grouped[loginId][`exam_date_${level}`] = result.exam_date || 'NA';
        //@ts-ignore
        grouped[loginId][`total_questions_${level}`] = result.total_questions || 'NA';
        //@ts-ignore
        grouped[loginId][`total_marks_${level}`] = result.total_marks || 'NA';
        //@ts-ignore
        grouped[loginId][`total_obtain_${level}`] = result.total_obtain || 'NA';
        //@ts-ignore
        grouped[loginId][`is_qualified_${level}`] = Number(result.is_qualified);
        //@ts-ignore
        grouped[loginId][`exam_level_${level}`] = result.exam_level || 'NA';
      }
    });

    return Object.values(grouped); // Convert to array
  }, [filteredResults, uniqueShikshaLevels]);

  // Step 3: Dynamically generate columns for each shiksha_level
  const columns = useMemo<MRT_ColumnDef<SessionResultList>[]>(() => {
    const dynamicColumns: MRT_ColumnDef<SessionResultList>[] = [
      {
        accessorKey: 'login_id',
        header: 'Devotee ID',
      },
      {
        accessorKey: 'ashery_leader_name',
        header: 'Ashery Leader',
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'Initiated_name',
        header: 'Initiated Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'contact_number',
        header: 'Contact Number',
      },
    ];

    // Add dynamic columns for each unique shiksha_level
    uniqueShikshaLevels.forEach((level) => {
      const levelName = shikshaLevelNames[level] || `Level ${level}`; // Use name or fallback to Level X

      dynamicColumns.push({
        accessorKey: `exam_date_${level}`,
        header: `${levelName} - Exam Date`,
      });
      dynamicColumns.push({
        accessorKey: `total_questions_${level}`,
        header: `${levelName} - Total Questions`,
      });
      dynamicColumns.push({
        accessorKey: `total_marks_${level}`,
        header: `${levelName} - Total Marks`,
      });
      dynamicColumns.push({
        accessorKey: `total_obtain_${level}`,
        header: `${levelName} - Total Obtain`,
      });

      // Show Assignment+Written total right after GPA total obtain.
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

      // Remove GPAAS (level 6) qualified column as requested.
      if (level !== 6) {
        dynamicColumns.push({
          accessorKey: `is_qualified_${level}`,
          header: `${levelName} - Qualified`,
          Cell: ({ cell }) => {
            // Get the value and ensure it's treated as a number
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
  }, [uniqueShikshaLevels]);

  return (
    <Container fluid py={25}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
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
                  style={{
                    width: isMobile ? '90%' : '50%', // Full width on mobile, col-6 width otherwise
                  }}
                />
              </Box>
              {isLoading ? (
                <Box ta="center" py={30}>
                  <Loader size="md" />
                  <Text mt={10}>Loading results...</Text>
                </Box>
              ) : (
                hasUserSelectedSession && selectedSession && (
                  <Box>
                    <DataTable
                    //@ts-ignore
                     data={groupedData} 
                     columnsFields={columns} PageSize={PAGE_SIZE} />
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
