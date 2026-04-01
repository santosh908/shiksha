import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import {
  Container,
  Grid,
  TextInput,
  Breadcrumbs,
  Anchor,
  Card,
  Text,
  Group,
  Button,
  Radio,
  CardSection,
  Box,
  Modal,
  Notification,
  Select,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';

type Subject = {
  id: string;
  subject_code: number;
  subject_name: string;
  shiksha_level_id: number;
  is_active: string;
};

type shikshaLevel = {
  exam_level_id: number;
  exam_level: string;
};

export default function SubjectComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      subject_name: '',
      shiksha_level_id: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentSubject) {
      form.setValues({
        id: currentSubject.id,
        subject_name: currentSubject.subject_name,
        shiksha_level_id: currentSubject.shiksha_level_id.toString(),
        is_active: currentSubject.is_active,
      });
    }
  }, [currentSubject]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentSubject) {
      router.put(`/Action/subject/${currentSubject.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Subject data updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentSubject(null);
          form.reset();
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error updating subject data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/subject', form.values, {
        onSuccess: () => {
          setNotificationMessage('Subject data saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error saving subject data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (subject: Subject) => {
    setOpenedDeleteModal(true);
    setSubjectToDelete(subject);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      router.delete(`/Action/subject/${subjectToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Subject deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error deleting subject!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (subject: Subject) => {
    setIsEditing(true);
    setCurrentSubject(subject);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { SubjectList, shikshalevel } = usePage<{
    SubjectList: Subject[];
    shikshalevel: Array<{ id: string; exam_level: string }>;
  }>().props;

  const validSubjectList = Array.isArray(SubjectList) ? SubjectList : [];

  const PAGE_SIZE = 10;
  const columns = useMemo<MRT_ColumnDef<Subject>[]>(
    () => [
      { accessorKey: 'subject_code', header: 'Subject Code' },
      { accessorKey: 'exam_level', header: 'Shiksha Level' },
      { accessorKey: 'subject_name', header: 'Scripture/Book' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (subject: Subject) => (
          <Group>
            <a color="blue" href="#" onClick={() => handleEdit(subject)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="red" href="#" onClick={() => handleDelete(subject)}>
              <IconRecycle size={20} /> Delete
            </a>
          </Group>
        ),
      },
    ],
    [currentPage]
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Subjects</label>
      </Breadcrumbs>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        {/* Notification */}
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

        {/* Form for Subject */}
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Select
              label="Examination Level"
              placeholder="Choose Exam Level"
              data={(shikshalevel || []).map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              }))}
              {...form.getInputProps('shiksha_level_id')}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Scripture/Book" {...form.getInputProps('subject_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Radio value="Y" label="Active" />
                <Radio value="N" label="Inactive" />
              </div>
            </Radio.Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        {/* Delete confirmation modal */}
        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this subject entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={Array.isArray(SubjectList) ? SubjectList : []} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
