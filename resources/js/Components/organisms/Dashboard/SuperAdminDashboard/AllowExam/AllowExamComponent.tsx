import React, { useEffect, useState } from 'react';
import { Container, Grid, Breadcrumbs, Anchor, Card, Notification, Box, Select, Text, Loader, Button, Group, Alert } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { router, usePage } from '@inertiajs/react';
import { notifications } from '@mantine/notifications';

interface Exam {
  id: number;
  exam_name: string;
}

interface User {
  id: number;
  name: string;
  login_id: string;
}

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

export default function AllowExamComponent() {
  const {
    ExamList = [],
    UserList = [],
  } = usePage<{
    ExamList: Exam[];
    UserList: User[];
  }>().props;

  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const handleExamChange = (value: string | null) => {
    setSelectedExam(value);
    setStatusMessage(null);
  };

  const handleUserChange = (value: string | null) => {
    setSelectedUser(value);
    setStatusMessage(null);
  };

  const handleAllowExam = () => {
    if (!selectedExam || !selectedUser) {
      setStatusMessage({
        type: 'error',
        message: 'Please select both an exam and a user.'
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    router.post('/Action/AllowExam', {
      exam_id: selectedExam,
      user_id: selectedUser
    }, {
      preserveScroll: true,
      onSuccess: (response: any) => {
        if (response?.props?.flash?.success) {
          setStatusMessage({
            type: 'success',
            message: response.props.flash.success
          });

          notifications.show({
            title: 'Success',
            message: response.props.flash.success,
            color: 'green',
            icon: <IconCheck size="1.1rem" />
          });
        } else if (response?.props?.flash?.error) {
          setStatusMessage({
            type: 'error',
            message: response.props.flash.error
          });

          notifications.show({
            title: 'Error',
            message: response.props.flash.error,
            color: 'red',
            icon: <IconAlertCircle size="1.1rem" />
          });
        }
      },
      onError: (errors: any) => {
        setStatusMessage({
          type: 'error',
          message: 'An error occurred while processing your request.'
        });

        notifications.show({
          title: 'Error',
          message: 'An error occurred while processing your request.',
          color: 'red',
          icon: <IconAlertCircle size="1.1rem" />
        });

        console.error('Submission error:', errors);
      },
      onFinish: () => {
        setIsSubmitting(false);
        setLoading(false);
      }
    });
  };

  return (
    <Container size="xl" my="xl">
      <Breadcrumbs mb="lg">
        <Anchor href="/SuperAdmin/Dashboard">Dashboard</Anchor>
        <Anchor>Allow Exam</Anchor>
      </Breadcrumbs>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} size="lg" mb="md">Allow User to Retake Exam</Text>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Select
              label="Select Exam"
              placeholder="Pick a shiksha level"
              clearable={true}
              value={selectedExam}
              onChange={handleExamChange}
              data={ExamList?.map((level) => ({
                value: String(level.id),
                label: `${level.exam_name || ''} (${level.exam_name || ''})`,
              })) || []}
             searchable
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Select
              label="Select User"
              placeholder="Pick a user"
              clearable={true}
              value={selectedUser}
              onChange={handleUserChange}
              data={UserList?.map((user) => ({
                value: String(user.id),
                label: `${user.name || ''} (${user.login_id || ''})`,
              })) || []}
              searchable
              required
            />
          </Grid.Col>

          {statusMessage && (
            <Grid.Col span={12}>
              <Alert
                color={statusMessage.type === 'success' ? 'green' : 'red'}
                title={statusMessage.type === 'success' ? 'Success' : 'Error'}
                withCloseButton
                onClose={() => setStatusMessage(null)}
              >
                {statusMessage.message}
              </Alert>
            </Grid.Col>
          )}

          <Grid.Col span={12} mt="md">
            <Group>
              <Button
                color="blue"
                onClick={handleAllowExam}
                loading={isSubmitting}
                disabled={!selectedExam || !selectedUser || loading}
              >
                Allow Retake
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}