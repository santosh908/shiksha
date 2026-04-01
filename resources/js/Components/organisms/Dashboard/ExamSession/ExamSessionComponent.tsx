import { useForm } from '@mantine/form';
import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { Container, Grid, TextInput, Breadcrumbs, Anchor, Card, Text, Group, Button, Radio, Notification, Modal, Box, Flex } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';


type ExamSession = {
  id: string;
  session_name: string;
  session_description: string;
  session_start_date: string;
};
export default function ExamSessionComponent() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [examSessionToDelete, setexamSessionToDelete] = useState<ExamSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [examSession, setCurrentBook] = useState<ExamSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const items = [{ title: 'Dashboard', href: '/SuperAdmin/dashboard' }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split('T')[0];

  const form = useForm({
    initialValues: {
      id: '',
      session_name: '',
      session_description: '',
      session_start_date: formattedDate,
    },
  });

  useEffect(() => {
    if (examSession) {
      form.setValues({
        id: examSession.id,
        session_name: examSession.session_name,
        session_description: examSession.session_description,
        session_start_date: examSession.session_start_date,
      });
    }
  }, [examSession]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && examSession) {
      router.put(`/Action/ExamSession/${examSession.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Exam session updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentBook(null);
          form.reset();
        },
      });
    } else {
      router.post('/Action/ExamSession', form.values, {
        onSuccess: () => {
          setNotificationMessage('Exam session created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
      });
    }
  };

  const handleDelete = () => {
    if (examSessionToDelete) {
      router.delete(`/Action/ExamSession/${examSessionToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Exam session deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };

  const handleEdit = (ExamSession: ExamSession) => {
    setIsEditing(true);
    setCurrentBook(ExamSession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (ExamSession: ExamSession) => {
    setexamSessionToDelete(ExamSession);
    setOpenedDeleteModal(true);
  };

  const { ExamSessionList } = usePage<{ ExamSessionList: ExamSession[] }>().props;
  const validExamSessionList = Array.isArray(ExamSessionList) ? ExamSessionList : [];

  const PAGE_SIZE = 10; 

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validBookList>[]>(
    () => [
      { accessorKey: 'session_name', header: 'Session Name' },
      { accessorKey: 'session_description', header: 'Session Description' },
      { accessorKey: 'session_start_date', header: 'Start Date' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (ExamSession: ExamSession) => (
          //@ts-ignore
          <Group spacing="xs" align="center" noWrap>
            <a color="blue" href='#'  onClick={() => handleEdit(ExamSession)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="red" href='#' onClick={() => openDeleteModal(ExamSession)}>
              <IconRecycle size={20} /> Delete
            </a>
          </Group>
        ),
      },
    ],
    [currentPage],
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Book</label>
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

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this book?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Grid py={10}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Session Name" autoComplete="off" {...form.getInputProps('session_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <TextInput label="Enter Session Description" autoComplete="off" {...form.getInputProps('session_description')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Select Session Start Date" type="date" autoComplete="off" {...form.getInputProps('session_start_date')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Grid mt={30}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg">Book List</Text>
                <DataTable 
                 data={validExamSessionList}
                 columnsFields={columns}
                 PageSize={PAGE_SIZE}
                />
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}