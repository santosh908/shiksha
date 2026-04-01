

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
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';

type Registration = {
  id: string;
  registration_start_date: string;
  registration_end_date: string;
  is_open: string;
};

export default function StartRegistrationComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(null);
  const [viewedRegistration, setViewedRegistration] = useState<Registration | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState<'teal' | 'red'>('teal');
  const [currentPage, setCurrentPage] = useState(1);

  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      registration_start_date: '',
      registration_end_date: '',
      is_open: 'Open',
    },
  });

  useEffect(() => {
    if (currentRegistration) {
      form.setValues({
        id: currentRegistration.id,
        registration_start_date: currentRegistration.registration_start_date,
        registration_end_date: currentRegistration.registration_end_date,
        is_open: currentRegistration.is_open,
      });
    }
  }, [currentRegistration]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentRegistration) {
      router.post(`/Action/update_registration_status/${currentRegistration.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Registration status updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentRegistration(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating registration!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/start_registration', form.values, {
        onSuccess: () => {
          setNotificationMessage('Registration status saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error saving registration!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (registration: Registration) => {
    setOpenedDeleteModal(true);
    setRegistrationToDelete(registration);
  };

  const confirmDelete = () => {
    if (registrationToDelete) {
      router.post(`/Action/delete_registration_status/${registrationToDelete.id}`, {}, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Registration status deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting registration!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (registration: Registration) => {
    setIsEditing(true);
    setCurrentRegistration(registration);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (registration: Registration) => {
    setViewedRegistration(registration);
  };

const { registrationList } = usePage<{ registrationList: Registration[] }>().props;
const validRegistrationList = Array.isArray(registrationList) ? registrationList : [];

  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validRegistrationList>[]>(
    () => [
      { accessorKey: 'registration_start_date', header: 'Start Date' },
      { accessorKey: 'registration_end_date', header: 'End Date' },
      { accessorKey: 'is_open', header: 'Is Open' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (registration: Registration) => (
          <Group>
            <a color="blue" href="#" onClick={() => handleEdit(registration)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="red" href="#" onClick={() => handleDelete(registration)}>
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
        <label>Registration</label>
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

        {/* Form for Registration */}
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <TextInput label="Start Date" type="date" {...form.getInputProps('registration_start_date')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <TextInput label="End Date" type="date" {...form.getInputProps('registration_end_date')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Is Open</label>
            <Radio.Group {...form.getInputProps('is_open')}>
              <Radio value="Open" label="Open" />
              <Radio value="Close" label="Close" />
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
          <Text>Are you sure you want to delete this registration entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        {/* View registration modal */}
        <Modal opened={!!viewedRegistration} onClose={() => setViewedRegistration(null)} title="Registration Details">
          {viewedRegistration && (
            <Box>
              <Text>
                <strong>Start Date:</strong> {viewedRegistration.registration_start_date}
              </Text>
              <Text>
                <strong>End Date:</strong> {viewedRegistration.registration_end_date}
              </Text>
              <Text>
                <strong>Is Open:</strong> {viewedRegistration.is_open}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable 
                    data={validRegistrationList}
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
