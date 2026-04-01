import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { MRT_ColumnDef } from 'mantine-react-table';
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
  Input,
  Select,
  Checkbox,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { router, usePage } from '@inertiajs/react';

type Permission = {
  id: number;
  name: string;
};

type Role = {
  name: string;
};

type SuperAdmin = {
  id: string;
  role: string;
  code: string;
  name: string;
  email: string;
  Initiated_name: string;
  dob: string;
  contact_number: string;
  is_active: string;
  permissions: string;
};

export default function ShikshappuserComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [SuperAdminToDelete, setSuperAdminToDelete] = useState<SuperAdmin | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSuperAdmin, setCurrentSuperAdmin] = useState<SuperAdmin | null>(null);
  const [viewedSuperAdmin, setViewedSuperAdmin] = useState<SuperAdmin | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const form = useForm({
    initialValues: {
      id: '',
      role: '',
      code: '',
      name: '',
      email: '',
      Initiated_name: '',
      dob: '',
      contact_number: '',
      is_active: '',
      permissions: '',
      unique_user_check: 1,
      have_you_applied_before: 'N',
      devotee_type: 'SA',
      password: '12345678',
      password_confirmation: '12345678',
    },
  });

  const today = new Date();
  const [selectedRole, setSelectedRole] = useState('');

  // const { errors, Permission } = usePage<{
  //   errors: Record<string, string>;
  //   Permission: { id: number; name: string }[] | null;
  // }>().props;

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (currentSuperAdmin) {
      form.setValues({
        role: currentSuperAdmin.role,
        code: currentSuperAdmin.code,
        id: currentSuperAdmin.id,
        name: currentSuperAdmin.name,
        Initiated_name: currentSuperAdmin.Initiated_name,
        email: currentSuperAdmin.email,
        dob: currentSuperAdmin.dob,
        contact_number: currentSuperAdmin.contact_number,
        is_active: currentSuperAdmin.is_active,
        permissions: currentSuperAdmin.permissions,
      });
    }
  }, [currentSuperAdmin]);

  const handleSubmit = () => {
    if (isEditing && currentSuperAdmin) {
      router.put(`/Action/shikshappuser/${currentSuperAdmin.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('SuperAdmin updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentSuperAdmin(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating SuperAdmin!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/shikshappuser', form.values, {
        onSuccess: () => {
          setNotificationMessage('SuperAdmin added successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error adding SuperAdmin!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (SuperAdmin: SuperAdmin) => {
    setOpenedDeleteModal(true);
    setSuperAdminToDelete(SuperAdmin);
  };

  const confirmDelete = () => {
    if (SuperAdminToDelete) {
      router.delete(`/Action/shikshappuser/${SuperAdminToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('SuperAdmin deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting SuperAdmin!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (SuperAdmin: SuperAdmin) => {
    setIsEditing(true);
    setCurrentSuperAdmin(SuperAdmin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (SuperAdmin: SuperAdmin) => {
    setViewedSuperAdmin(SuperAdmin);
  };

  const { AdminUser, roleList, premissionList, AsheryLeader } = usePage<{
    AdminUser: { ShikshAppUserList: SuperAdmin[] };
    roleList: Array<{ id: string; name: string }>;
    premissionList: Array<{ id: string; name: string }>;
    AsheryLeader: Array<{ code: string; ashery_leader_name: string }>;
  }>().props;

  const ShikshAppUserList = AdminUser?.ShikshAppUserList || [];

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<SuperAdmin>[]>(
    () => [
      {
        //@ts-ignore
        accessorFn: (row: any, index: any) => index + 1,
        accessorKey: 'id',
        header: '#',
      },
      { accessorKey: 'name', header: 'Admin Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'dob', header: 'Date of Birth' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        accessorFn: (SuperAdmin: SuperAdmin) => (
          <Group>
            <a color="blue" href="#" onClick={() => handleEdit(SuperAdmin)}>
              <IconEdit size={20} /> Edit
            </a>
            <a href="#" color="green" onClick={() => handleView(SuperAdmin)}>
              <IconEye size={20} /> View
            </a>
            <a href="#" color="red" onClick={() => handleDelete(SuperAdmin)}>
              <IconRecycle size={20} /> Delete
            </a>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href="/SuperAdmin/dashboard">Dashboard</Anchor>
        <label>SuperAdmin</label>
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
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Select
              label="Role"
              searchable
              placeholder="Choose Role"
              {...form.getInputProps('role')}
              data={(roleList || []).map((level) => ({
                value: level.name,
                label: level.name,
              }))}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter  Name:" {...form.getInputProps('name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Select
              label="Ashray Leader Name"
              searchable
              placeholder="Choose Ashray Leader"
              {...form.getInputProps('code')}
              data={(AsheryLeader || []).map((level) => ({
                value: level.code.toString(),
                label: level.ashery_leader_name,
              }))}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Initiated Name:" {...form.getInputProps('Initiated_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Email:" {...form.getInputProps('email')} type="email" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label>DOB</label>
            <DateInput
              size="sm"
              className="w-full"
              withAsterisk
              leftSection={<IconCalendar />}
              placeholder="Enter Date of Birth"
              maxDate={today}
              value={form.values.dob ? new Date(form.values.dob) : null}
              onChange={(date: Date | null) => form.setFieldValue('dob', date ? date.toISOString().split('T')[0] : '')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput
              label="Contact Name:"
              {...form.getInputProps('contact_number')}
              placeholder="Enter contact number"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              minLength={10}
              onInput={(e) => {
                const value = e.currentTarget.value;
                if (!/^\d*$/.test(value)) {
                  e.preventDefault();
                }
              }}
              error={form.errors.contact_name}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Active Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Radio value="Y" label="Active" />
                <Radio value="N" label="Inactive" />
              </div>
            </Radio.Group>
          </Grid.Col>
          <Input type="hidden" name="unique_user_check" value="1" />
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Add SuperAdmin'}
              </Button>
              <Button type="button" onClick={() => form.reset()} color="green">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this SuperAdmin entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedSuperAdmin} onClose={() => setViewedSuperAdmin(null)} title="SuperAdmin Details">
          {viewedSuperAdmin && (
            <Box>
              <Text>
                <strong>Admin Name:</strong> {viewedSuperAdmin.name}
              </Text>
              <Text>
                <strong>Email:</strong> {viewedSuperAdmin.email}
              </Text>

              <Text>
                <strong>Date of Birth:</strong> {viewedSuperAdmin.dob}
              </Text>
              <Text>
                <strong>Contact Number:</strong> {viewedSuperAdmin.contact_number}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  {Array.isArray(ShikshAppUserList) && ShikshAppUserList.length > 0 ? (
                    <DataTable data={ShikshAppUserList} columnsFields={columns} PageSize={10} />
                  ) : (
                    <></>
                  )}
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
