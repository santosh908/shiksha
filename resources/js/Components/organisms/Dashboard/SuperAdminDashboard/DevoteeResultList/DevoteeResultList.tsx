import React, { useState, useMemo, useEffect } from 'react';
import { Container, Card, Text, Breadcrumbs, Anchor, Grid, CardSection, Box, Checkbox, Group } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { router, usePage } from '@inertiajs/react';
import { DevoteeResultList } from './DevoteeResultList.types';
import type { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';

interface GroupedDevoteeResult extends DevoteeResultList {
  [key: string]: any;
  exam_id: number;
}

export default function DevoteeResultListComponent() {
  const { devoteeResults } = usePage<{ devoteeResults: DevoteeResultList[] }>().props;
  const validdevoteeResults = Array.isArray(devoteeResults) ? devoteeResults : [];
  const [searchTerm, setSearchTerm] = useState('');
  const { flash } = usePage().props as { flash?: { success?: string } };
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();


  React.useEffect(() => {
    if (flash?.success) {
      alert(flash.success);
    }
  }, [flash]);

  const PAGE_SIZE = 10;
  const uniqueShikshaLevels = [1, 2, 3, 4, 5, 6, 7];
  const shikshaLevelNames: { [key: number]: string } = {
    1: 'INTE',
    2: 'SDH',
    3: 'KSVK',
    4: 'KSD',
    5: 'SPA',
    6: 'GPAAS',
    7: 'GPA'
  };

  const groupedData = useMemo(() => {
    const grouped: { [key: string]: GroupedDevoteeResult } = {};
    validdevoteeResults.forEach((result) => {
      const loginId = result.login_id;


      if (!grouped[loginId]) {
        //@ts-ignore
        grouped[loginId] = {
          login_id: result.login_id || 'NA',
          ashery_leader_name: result.ashery_leader_name || 'NA',
          name: result.name || 'NA',
          Initiated_name: result.Initiated_name || 'NA',
          email: result.email || 'NA',
          contact_number: result.contact_number || 'NA',
          exam_id: result.exam_id || 0,
        };

        uniqueShikshaLevels.forEach((level) => {
          grouped[loginId][`total_questions_${level}`] = 'NA';
          grouped[loginId][`total_marks_${level}`] = 'NA';
          grouped[loginId][`total_obtain_${level}`] = 'NA';
          grouped[loginId][`is_qualified_${level}`] = null;
          grouped[loginId][`exam_level_${level}`] = 'NA';
          grouped[loginId][`IsAllowed_${level}`] = 'NA';
        });
      }

      const level = result.shiksha_level;
      
      if (level && uniqueShikshaLevels.includes(level)) {
        grouped[loginId][`total_questions_${level}`] = result.total_questions || 'NA';
        grouped[loginId][`total_marks_${level}`] = result.total_marks || 'NA';
        grouped[loginId][`total_obtain_${level}`] = result.total_obtain || 'NA';
        grouped[loginId][`is_qualified_${level}`] = result.is_qualified === null ? null : Number(result.is_qualified);
        grouped[loginId][`exam_level_${level}`] = result.exam_level || 'NA';
        
        if (result.IsAllowed) {
          grouped[loginId][`IsAllowed_${level}`] = result.IsAllowed;
        } else {
          grouped[loginId][`IsAllowed_${level}`] = 'NA';
        }
      }
    });

    return Object.values(grouped);
  }, [validdevoteeResults, uniqueShikshaLevels]);

  const columns = useMemo<MRT_ColumnDef<GroupedDevoteeResult>[]>(() => {
    const baseColumns: MRT_ColumnDef<GroupedDevoteeResult>[] = [
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

    uniqueShikshaLevels.forEach((level) => {
      const levelName = shikshaLevelNames[level] || `Level ${level}`;
      
      baseColumns.push({
        accessorKey: `total_questions_${level}`,
        header: `${levelName} - Questions`,
      });

      baseColumns.push({
        id: `${levelName} - Marks`,
        accessorKey: `total_marks_${level}`,
        header: `${levelName} - Marks`,
      });

      baseColumns.push({
        accessorKey: `total_obtain_${level}`,
        header: `${levelName} - Obtain`,
      });

      baseColumns.push({
        accessorKey: `is_qualified_${level}`,
        header: `${levelName} - Qualified`,
        Cell: ({ row }) => {
          const isQualified = row.original[`is_qualified_${level}`];
          const isAllowed = row.original[`IsAllowed_${level}`];
          const handleCheckboxChange = (checked: boolean) => {
            const payload = {
              login_id: row.original.login_id,
              exam_id: row.original.exam_id,
              shiksha_level: level,
              is_qualified: checked ? '1' : '0',
              IsAllowed: checked ? 'Y' : 'N',
            };
            
            router.post('/Action/resultAloowPrevent', payload, {
              onSuccess: () => {
                //console.log('Update successful');
              },
              onError: () => {
                //console.log('Error updating qualification');
              },
            });
          };
          let status = {
            label: '',
            color: '',
            checked: false
          };
          const qualifiedValue = Number(isQualified);
          if (qualifiedValue === 1) {
            status = {
              label: 'Qualified',
              color: 'green',
              checked: true
            };
          } 
          else 
          {
            if (isAllowed === 1) {
              status = {
                label: 'Special Permission For Exam',
                color: 'blue',
                checked: true
              };
            } else if (isAllowed === 0) {
              status = {
                label: 'Disqualified by Admin',
                color: 'red',
                checked: false
              };
            } else {
              status = {
                label: 'Not Qualified',
                color: 'red',
                checked: false
              };
            }
          }

          return (
            <Text component="div" className="text-center font-bold">
              <Group>
                <Checkbox
                  mt={5}
                  label={
                    <>
                      <span style={{ color: status.color }}>
                        {status.checked ? '✓' : '✗'}
                      </span>
                      {' '}{status.label}
                    </>
                  }
                  checked={status.checked}
                 // disabled={isQualified === null || isQualified === 'NA'}
                  onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
                />
              </Group>
            </Text>
          );
        },
      });
    });

    return baseColumns;
  }, [uniqueShikshaLevels]);

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <Text>Devotee Result List</Text>
      </Breadcrumbs>

      <Grid mt={30}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <CardSection>
              <Box>
                <DataTable
                  data={groupedData}
                  columnsFields={columns}
                  PageSize={PAGE_SIZE}
                />
              </Box>
            </CardSection>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}