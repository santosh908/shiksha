import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Container, Grid, Breadcrumbs, Anchor, Card, Notification, Box, Select, Text, Loader, Button } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { UpdateMarksList } from './updatemarks.types';

export default function UpdateMarksComponent() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [selectedShikshaLevel, setSelectedShikshaLevel] = useState<string | null>(null);
  const [selectedShikshaLevelName, setSelectedShikshaLevelName] = useState<string | null>(null);
  const [selectedExamSession, setSelectedExamSession] = useState<string | null>(null);
  const [selectedLoginId, setSelectedLoginId] = useState<string | null>(null);
  const [loginSearch, setLoginSearch] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localDevoteeResults, setLocalDevoteeResults] = useState<UpdateMarksList[]>([]);

  const items = [{ title: 'Dashboard', href: '/SuperAdmin/dashboard' }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));


  const {
    devoteeResults = [],
    loginid = [],
    shikshalevel = [],
    sessionList = [],
  } = usePage<{
    devoteeResults: UpdateMarksList[];
    loginid: string[];
    shikshalevel: any[];
    sessionList: any[];
  }>().props;

  useEffect(() => {
    setLocalDevoteeResults(devoteeResults);
  }, [devoteeResults]);

  // Remove duplicate login IDs
  const uniqueLoginIds = [...new Set(loginid)];

  const columns = useMemo(
    () => [
      { accessorKey: 'login_id', header: 'Login ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
      { accessorKey: 'ashery_leader_name', header: 'Ashery Leader Name' },
      { accessorKey: 'exam_date', header: 'Exam Date' },
      { accessorKey: 'total_questions', header: 'Total Questions' },
      { accessorKey: 'total_marks', header: 'Total Marks' },
      { accessorKey: 'qualifying_marks', header: 'Qualifying Marks' },
      {
        accessorKey: 'total_obtain',
        header: 'Obtained Marks',
        //@ts-ignore
        Cell: ({ row }) => {
          const [isEditing, setIsEditing] = useState(false);
          const [newTotalObtain, setNewTotalObtain] = useState(row.original.total_obtain);

          const handleEdit = () => {
            setIsEditing(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const handleSave = () => {
            const maxMarks = parseFloat(row.original.total_marks);
            const qualifyingMarks = parseFloat(row.original.qualifying_marks);
            const newObtainedMarks = parseFloat(newTotalObtain);

            // Optimistically update the local state
            setLocalDevoteeResults((prev) =>
              prev.map((result) => {
                if (result.login_id === row.original.login_id) {
                  return {
                    ...result,
                    total_obtain: newTotalObtain,
                    is_qualified: newObtainedMarks >= qualifyingMarks ? '1' : '0',
                  };
                }
                return result;
              })
            );

            router.post(
              '/Action/updatemarks/save',
              {
                login_id: row.original.login_id,
                exam_id: row.original.exam_id,
                exam_level: selectedShikshaLevel,
                total_obtain: newTotalObtain,
              },
              {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                  setIsEditing(false);
                  setNotificationMessage('Marks updated successfully!');
                  setNotificationColor('teal');
                  setShowNotification(true);

                  // Refresh data while preserving dropdown state
                        if (selectedExamSession && selectedShikshaLevel && selectedLoginId) {
                          router.get(
                            `/Action/updatemarks/${selectedExamSession}/${selectedShikshaLevel}/${selectedLoginId}`,
                            {},
                            {
                              preserveState: true,
                              preserveScroll: true,
                              only: ['devoteeResults'],
                            }
                          );
                        }
                },
                onError: () => {
                  // Revert the optimistic update on error
                  setLocalDevoteeResults((prev) =>
                    prev.map((result) => {
                      if (result.login_id === row.original.login_id) {
                        return {
                          ...result,
                          total_obtain: row.original.total_obtain,
                          is_qualified: parseFloat(row.original.total_obtain) >= qualifyingMarks ? '1' : '0',
                        };
                      }
                      return result;
                    })
                  );
                  setNotificationMessage('Failed to update marks.');
                  setNotificationColor('red');
                  setShowNotification(true);
                },
              }
            );
          };

          const maxMarks = parseFloat(row.original.total_marks);

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max={maxMarks}
                  step="1"
                  value={newTotalObtain}
                  onChange={(e) => {
                    const value = Math.min(maxMarks, Math.max(0, parseFloat(e.target.value) || 0));
                    setNewTotalObtain(value.toString());
                  }}
                  style={{
                    marginRight: 10,
                    padding: '5px 10px',
                    fontSize: '16px',
                    width: '80px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <span>{row.original.total_obtain}</span>
              )}
              <Button variant="outline" color="blue" onClick={handleEdit} size="xs">
                Edit
              </Button>
              {isEditing && (
                <Button variant="filled" color="green" onClick={handleSave} size="xs">
                  Save
                </Button>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'is_qualified',
        header: 'Qualified',
        Cell: ({ row }: { row: { original: { is_qualified: number | string } } }) => {
          const isQualified = Number(row.original.is_qualified) === 1;

          return (
            <span
              style={{
                color: isQualified ? 'green' : 'red',
                fontWeight: 'bold',
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: isQualified ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              }}
            >
              {isQualified ? '✅ Qualified' : '❌ Not Qualified'}
            </span>
          );
        },
      },
    ],
    [selectedShikshaLevelName, localDevoteeResults]
  );

  const handleShikshaLevelChange = (value: string | null) => {
    if (!selectedExamSession) {
      alert('Please select Exam Session first');
      return;
    }
    setSelectedShikshaLevel(value);

    if (value) {
      const selectedLevel = shikshalevel.find((level) => level.id.toString() === value);
      if (selectedLevel) {
        setSelectedShikshaLevelName(selectedLevel.id);
      }
    } else {
      setSelectedShikshaLevelName(null);
    }

    setSelectedLoginId(null);
    setShowTable(false);
  };

  const fetchResults = (loginValue: string | null) => {
    setIsLoading(true);

    // Require both session and shiksha level to be selected before fetching results.
    if (!selectedExamSession && !selectedShikshaLevel) {
      alert('Please select Exam Session and Shiksha Level first');
      setIsLoading(false);
      return;
    }
    if (!selectedExamSession) {
      alert('Please select Exam Session first');
      setIsLoading(false);
      return;
    }
    if (!selectedShikshaLevel) {
      alert('Please select Shiksha Level first');
      setIsLoading(false);
      return;
    }

    const finalLogin = loginValue || null;
    setSelectedLoginId(finalLogin);
    setShowTable(!!(finalLogin && selectedShikshaLevel && selectedExamSession));

    if (finalLogin && selectedShikshaLevel && selectedExamSession) {
      router.get(
        `/Action/updatemarks/${selectedExamSession}/${selectedShikshaLevel}/${finalLogin}`,
        {},
        {
          preserveState: true,
          preserveScroll: true,
          only: ['devoteeResults'],
          onFinish: () => setIsLoading(false),
          onError: () => {
            setNotificationMessage('Failed to fetch marks data.');
            setNotificationColor('red');
            setShowNotification(true);
            setIsLoading(false);
          },
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleLoginIdChange = (value: string | null) => {
    // If user selected from the dropdown, clear search and fetch immediately
    setLoginSearch('');
    fetchResults(value);
  };

  const PAGE_SIZE = 10;

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Update Marks</label>
      </Breadcrumbs>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        {showNotification && (
          <Notification
            icon={notificationColor === 'teal' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={notificationColor}
            title={notificationColor === 'teal' ? 'Success' : 'Error'}
            onClose={() => setShowNotification(false)}
          >
            {notificationMessage}
          </Notification>
        )}

        <Grid mt={30}>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Select
              label="Select Exam Session"
              placeholder="Pick an exam session"
              clearable={true}
              value={selectedExamSession}
              onChange={(v) => {
                setSelectedExamSession(v);
                // reset dependent selects
                setSelectedShikshaLevel(null);
                setSelectedLoginId(null);
                setShowTable(false);
              }}
              data={sessionList.map((s) => ({ value: s.id.toString(), label: s.session_name }))}
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Select
              label="Select Shiksha Level"
              placeholder="Pick a shiksha level"
              clearable={true}
              value={selectedShikshaLevel}
              onChange={handleShikshaLevelChange}
              data={shikshalevel.map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              }))}
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Select
                label="Select Login ID"
                placeholder="Pick a login ID"
                clearable={true}
                value={selectedLoginId}
                onChange={handleLoginIdChange}
                data={uniqueLoginIds.map((id) => ({
                  value: id.toString(),
                  label: id,
                }))}
                searchable
                searchValue={loginSearch}
                onSearchChange={(val) => setLoginSearch(val)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // If user typed a login and pressed Enter, use that search text
                    const v = selectedLoginId || (loginSearch ? loginSearch : null);
                    fetchResults(v);
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button size="xs" onClick={() => fetchResults(selectedLoginId || (loginSearch ? loginSearch : null))}>
                Load
              </Button>
            </div>
          </Grid.Col>
        </Grid>

        {isLoading ? (
          <Box ta="center" py={30}>
            <Loader size="md" />
            <Text mt={10}>Loading results...</Text>
          </Box>
        ) : (
          showTable &&
          localDevoteeResults.length > 0 ? (
            <Grid mt={30}>
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <DataTable data={localDevoteeResults} columnsFields={columns} PageSize={PAGE_SIZE} />
              </Grid.Col>
            </Grid>
          ):(
            <Box ta="center"   py={30}>
              <Text color='red'  mt={10}>! No result found</Text>
            </Box>
          )
        )}
      </Card>
    </Container>
  );
}
