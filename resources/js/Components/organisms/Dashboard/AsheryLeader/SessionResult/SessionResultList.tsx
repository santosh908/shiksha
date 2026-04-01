import React, { useState, useMemo, useEffect } from 'react';
import { Container, Card, Text, Breadcrumbs, Anchor, Grid, CardSection, Box, Select, Loader } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { router, usePage } from '@inertiajs/react';
import { SessionResultList } from './SessionResultList.types';
import type { MRT_ColumnDef } from 'mantine-react-table';

export default function SessionResultListComponent() {
  const { devoteeResults, examSessions, currentSession } = usePage<{
    devoteeResults: SessionResultList[];
    examSessions: Array<{ id: number; session_name: string }>;
    currentSession: string | null;
  }>().props;

  const [isLoading, setIsLoading] = useState(false);
  const validdevoteeResults = Array.isArray(devoteeResults) ? devoteeResults : [];
  const [selectedSession, setSelectedSession] = useState<string | null>(currentSession);
  const sessionOptions = examSessions.map((session) => ({
    value: session.id.toString(),
    label: session.session_name,
  }));

  const filteredResults = useMemo(() => {
    if (!selectedSession) return [];
    return validdevoteeResults;
  }, [validdevoteeResults, selectedSession]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSessionChange = (value: string | null) => {
    setIsLoading(true);
    setSelectedSession(value);

    if (value) {
      router.get(
        route('AsheryLeader.sessionresultlist', { session: value }),
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
  const uniqueShikshaLevels = [1, 2, 3, 4, 5];
  // Step 2: Define a mapping for shiksha_level names
  const shikshaLevelNames: { [key: number]: string } = {
    1: 'INTE',
    2: 'SDH',
    3: 'KSVK',
    4: 'KSD',
    5: 'SPA',
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
    });

    return dynamicColumns;
  }, [uniqueShikshaLevels]);

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href="/AsheryLeader/dashboard">Dashboard</Anchor>
        <Text>Devotee Result List</Text>
      </Breadcrumbs>

      <Grid mt={30}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <CardSection>
              <Box mb={20}>
                <Select
                  label="Select Exam Session"
                  placeholder="Choose an exam session"
                  data={sessionOptions}
                  value={selectedSession}
                  onChange={handleSessionChange}
                  clearable
                  disabled={isLoading}
                />
              </Box>
              {isLoading ? (
                <Box ta="center" py={30}>
                  <Loader size="md" />
                  <Text mt={10}>Loading results...</Text>
                </Box>
              ) : (
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
