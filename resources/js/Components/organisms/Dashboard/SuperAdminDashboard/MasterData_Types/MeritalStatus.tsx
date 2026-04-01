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
  Box,
  Modal,
  Notification,
  CardSection,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import useUserStore from '@/Store/User.store';

type Meritalstatus = {
  id: string;
  merital_status_name: string;
  is_active: string;
};

export default function Meritalstatus() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [meritalStatusToDelete, setMeritalStatusToDelete] = useState<Meritalstatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMeritalStatus, setCurrentMeritalStatus] = useState<Meritalstatus | null>(null);
  const [viewedMeritalStatus, setViewedMeritalStatus] = useState<Meritalstatus | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      merital_status_name: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentMeritalStatus) {
      form.setValues({
        id: currentMeritalStatus.id,
        merital_status_name: currentMeritalStatus.merital_status_name,
        is_active: currentMeritalStatus.is_active,
      });
    }
  }, [currentMeritalStatus]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentMeritalStatus) {
      router.put(`/Action/meritalstatus/${currentMeritalStatus.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Marital status updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentMeritalStatus(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating marital status!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/meritalstatus', form.values, {
        onSuccess: () => {
          setNotificationMessage('Marital status saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error saving marital status!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (meritalStatus: Meritalstatus) => {
    setOpenedDeleteModal(true);
    setMeritalStatusToDelete(meritalStatus);
  };

  const confirmDelete = () => {
    if (meritalStatusToDelete) {
      router.delete(`/Action/meritalstatus/${meritalStatusToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Marital status deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting marital status!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (meritalStatus: Meritalstatus) => {
    setIsEditing(true);
    setCurrentMeritalStatus(meritalStatus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (meritalStatus: Meritalstatus) => {
    setViewedMeritalStatus(meritalStatus);
  };

  const { MeritalStatusList } = usePage<{ MeritalStatusList: Meritalstatus[] }>().props;
  const validMeritalStatusList = Array.isArray(MeritalStatusList) ? MeritalStatusList : [];
  const PAGE_SIZE = 10; 

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<Meritalstatus>[]>(
    () => [
      { accessorKey: 'merital_status_name', header: 'Marital Status Name' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        accessorFn: (meritalStatus: Meritalstatus) => (
          <Group>
            <a color="blue" href='#' onClick={() => handleEdit(meritalStatus)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="green" href='#' onClick={() => handleView(meritalStatus)}>
              <IconEye size={20} /> View
            </a>
            <a color="red" href='#' onClick={() => handleDelete(meritalStatus)}>
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
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Marital Status</label>
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

        {/* Form for Marital Status */}
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={4}>
            <TextInput label="Enter Marital Status:" {...form.getInputProps('merital_status_name')} />
          </Grid.Col>
          <Grid.Col span={4}>
            <label style={{ fontWeight: 'bold' }}>Marital Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <Radio value="Y" label="Active" />
              <Radio value="N" label="Inactive" />
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        {/* Delete confirmation modal */}
        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this marital status entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        {/* View marital status modal */}
        <Modal opened={!!viewedMeritalStatus} onClose={() => setViewedMeritalStatus(null)} title="Marital Status Details">
          {viewedMeritalStatus && (
            <Box>
              <Text>
                <strong>Marital Status Name:</strong> {viewedMeritalStatus.merital_status_name}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedMeritalStatus.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={20} mt={30}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                <DataTable 
                    data={validMeritalStatusList}
                    columnsFields={columns}
                    PageSize={PAGE_SIZE}
                  />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
