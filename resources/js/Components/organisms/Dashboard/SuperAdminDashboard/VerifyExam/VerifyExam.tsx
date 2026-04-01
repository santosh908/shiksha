import { useForm } from '@mantine/form';
import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconCheck, IconX } from '@tabler/icons-react';
import VerifyExamDataTable from '@/Components/molecules/MantineReactTable/VerifyExamDataTable';
import { VerifyExam } from './VerifyExam.types';
import { Container, Grid, Breadcrumbs, Anchor, Card, Notification, Box, Select, Text,Loader } from '@mantine/core';
import useUserStore from '@/Store/User.store';

export default function VerifyExamComponent() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [selectedExamLevel, setSelectedExamLevel] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const items = [{ title: 'Dashboard', href: `/${roleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const {
    submittedexam = [],
    shikshalevel = [],
    examSession = [],
  } = usePage<{ submittedexam: VerifyExam[]; shikshalevel: any[]; examSession: any[] }>().props;
  const PAGE_SIZE = 10000;
  const handlePublicResult = (selectedRows: VerifyExam[]) => {
    if (!selectedExamLevel) {
      alert('Please select an Exam Level before publishing results.');
      return;
    }
    if (selectedRows.length === 0) {
      alert('No candidates selected.');
      return;
    }
    // Group the selected rows by login_id
    const groupedResults = selectedRows.reduce((acc, row) => {
      if (!acc[row.login_id]) {
        acc[row.login_id] = {
          login_id: row.login_id,
          exam_id: row.exam_id,
          level: row.exam_level,
          ashray_leader_code: row.ashray_leader_code,
          allquestion: [],
        };
      }

      acc[row.login_id].allquestion.push({
        question_id: row.question_id,
        selected_answer_id: row.selected_answer,
      });

      return acc;
    }, {} as Record<string, any>);

    // Convert the grouped results object to an array
    const formattedResults = Object.values(groupedResults);

    
    router.post(
      '/Action/publish-result',
      {
        resultId: selectedExamLevel,
        results: formattedResults,
      },
      {
        onSuccess: () => {
          setNotificationMessage('Results published successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setSelectedExamLevel(null);
          setSelectedSession(null);
        },
        onError: (error) => {
          setNotificationMessage('Failed to published results.');
          setNotificationColor('red');
          setShowNotification(true);
          console.error('Error publishing results:', error);
        },
      }
    );
  };

  //@ts-ignore
  const columns = useMemo(
    () => [
      { accessorKey: 'login_id', header: 'Login ID' },
      { accessorKey: 'session_name', header: 'Session Name' },
      { accessorKey: 'question_english', header: 'Question (English)' },
      { accessorKey: 'question_hindi', header: 'Question (Hindi)' },
      { accessorKey: 'correctanswer', header: 'Correct Answer' },
      { accessorKey: 'selected_answer', header: 'Selected Answer' },
    ],
    []
  );

  const encryptValue = (value: string) => {
    const timestamp = new Date().getTime();
    const uniqueValue = `${value}_${timestamp}`;
    return btoa(uniqueValue);
  };

  const handleExamLevelChange = (value: string | null) => {
    setSelectedExamLevel(value);
    setSelectedSession(null);
  };

  const handleSessionChange = (value: string | null) => {
    setIsLoading(true);
    if(!selectedExamLevel){
      alert('Please Select ShikshaLevel')
      return;
    }
    setSelectedSession(value);
    setShowTable(!!(value && selectedExamLevel));
    if (value && selectedExamLevel) {
      const encryptedLevel = encryptValue(selectedExamLevel);
      const encryptedSession = encryptValue(value);

      router.get(
        `/Action/verifyexamlist/${encryptedLevel}/${encryptedSession}`,
        {},
        {
          preserveState: true,
          preserveScroll: true,
          onFinish: () => setIsLoading(false),
          onError: (error) => {
            setNotificationMessage('Failed to fetch exam data.');
            setNotificationColor('red');
            setShowNotification(true);
          },
        }
      );
    }
    else{
      setIsLoading(false);
    }
  };

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Verify Exam</label>
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
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Select
              label="Select Exam Level"
              placeholder="Pick an exam level"
              clearable={true}
              value={selectedExamLevel}
              onChange={handleExamLevelChange}
              data={shikshalevel.map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              }))}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Select
              label="Select Exam Session"
              placeholder="Pick an exam session"
              clearable={true}
              value={selectedSession}
              onChange={handleSessionChange}
              data={examSession.map((session) => ({
                value: session.id.toString(),
                label: session.session_name,
              }))}
            />
          </Grid.Col>
        </Grid>
        {isLoading ? (
          <Box ta="center" py={30}>
              <Loader size="md" />
              <Text mt={10}>Loading results...</Text>
            </Box>
          ) : (
            showTable && (
              <Grid mt={30}>
              <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <VerifyExamDataTable
                  data={submittedexam}
                  columnsFields={columns}
                  PageSize={PAGE_SIZE}
                  onAddToExam={handlePublicResult}
                  selectedExam={selectedExamLevel || ''}
                />
              </Grid.Col>
            </Grid>
            )
          )}
      </Card>
    </Container>
  );
}
