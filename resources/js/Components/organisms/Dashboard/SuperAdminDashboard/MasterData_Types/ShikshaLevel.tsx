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
  CardSection,
  Box,
  Modal,
  Notification,
  Radio,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';

type ShikshaLevel = {
  id: string;
  shikshalevel_code: number;
  exam_level: string;
  is_active: string;
};

export default function ShikshaLevelComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ShikshaLevel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<ShikshaLevel | null>(null);
  const [viewedItem, setViewedItem] = useState<ShikshaLevel | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      exam_level: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentItem) {
      form.setValues({
        id: currentItem.id,
        exam_level: currentItem.exam_level,
        is_active: currentItem.is_active,
      });
    }
  }, [currentItem]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentItem) {
      router.put(`/Action/shikshalevel/${currentItem.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Shiksha Level updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentItem(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating Shiksha Level!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/shikshalevel', form.values, {
        onSuccess: () => {
          setNotificationMessage('Shiksha Level added successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error adding Shiksha Level!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (item: ShikshaLevel) => {
    setOpenedDeleteModal(true);
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      router.delete(`/Action/shikshalevel/${itemToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Shiksha Level deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting Shiksha Level!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (item: ShikshaLevel) => {
    setIsEditing(true);
    setCurrentItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (item: ShikshaLevel) => {
    setViewedItem(item);
  };

  const { SubjectList } = usePage<{ SubjectList: ShikshaLevel[] }>().props;
  const validSubjectList = Array.isArray(SubjectList) ? SubjectList : [];

  const PAGE_SIZE = 10;
  const columns = useMemo<MRT_ColumnDef<ShikshaLevel>[]>(
    () => [
      { accessorKey: 'shikshalevel_code', header: 'Shiksha Level Code' },
      { accessorKey: 'exam_level', header: 'Exam Level' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (item: ShikshaLevel) => (
          <Group>
            <a color="blue" href="#" onClick={() => handleEdit(item)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="green" href="#" onClick={() => handleView(item)}>
              <IconEye size={20} /> View
            </a>
            <a color="red" href="#" onClick={() => handleDelete(item)}>
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
        <label>Shiksha Levels</label>
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

        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput label="Enter Exam Level:" {...form.getInputProps('exam_level')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <label style={{ fontWeight: 'bold' }}>Exam Level Status</label>
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

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedItem} onClose={() => setViewedItem(null)} title="Shiksha Level Details">
          {viewedItem && (
            <Box>
              <Text>
                <strong>Exam Level:</strong> {viewedItem.exam_level}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedItem.is_active ? 'Active' : 'Inactive'}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={validSubjectList} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
