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
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { router, usePage } from '@inertiajs/react';
import useUserStore from '@/Store/User.store';

type AsheryLeader = {
  id: string;
  ashery_leader_code: number;
  name: string;
  email: string;
  Initiated_name: string;
  dob: string;
  contact_number: string;
  is_active: string;
};

export default function AsheryLeaderComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [asheryLeaderToDelete, setAsheryLeaderToDelete] = useState<AsheryLeader | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsheryLeader, setCurrentAsheryLeader] = useState<AsheryLeader | null>(null);
  const [viewedAsheryLeader, setViewedAsheryLeader] = useState<AsheryLeader | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const pageSize = 10;

  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      email: '',
      Initiated_name: '',
      dob: '',
      contact_number: '',
      is_active: '',
      unique_user_check: 1,
      have_you_applied_before: 'N',
      devotee_type: 'AL',
      password: '12345678',
      password_confirmation: '12345678',
    },
  });

  useEffect(() => {
    if (currentAsheryLeader) {
      form.setValues({
        id: currentAsheryLeader.id,
        name: currentAsheryLeader.name,
        email: currentAsheryLeader.email,
        Initiated_name: currentAsheryLeader.Initiated_name,
        dob: currentAsheryLeader.dob,
        contact_number: currentAsheryLeader.contact_number,
        is_active: currentAsheryLeader.is_active,
      });
    }
  }, [currentAsheryLeader]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);


  const confirmDelete = () => {
    if (asheryLeaderToDelete) {
      router.delete(`/Action/asheryleader/${asheryLeaderToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Ashery Leader deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting Ashery Leader!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (asheryLeader: AsheryLeader) => {
    setIsEditing(true);
    setCurrentAsheryLeader(asheryLeader);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (asheryLeader: AsheryLeader) => {
    setViewedAsheryLeader(asheryLeader);
  };

  const { AsheryLeaderList } = usePage<{ AsheryLeaderList: AsheryLeader[] }>().props;
  const validAsheryLeaderList = Array.isArray(AsheryLeaderList) ? AsheryLeaderList : [];

  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<AsheryLeaderList>[]>(
    () => [
      { accessorKey: 'ashery_leader_code', header: 'Code',size:50 , },
      { accessorKey: 'login_id', header: 'Login ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'dob', header: 'Date of Birth' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
      { accessorKey: 'is_active', header: 'Status' },
      // {
      //   accessorKey: 'actions',
      //   header: 'Actions',
      //   accessorFn: (asheryLeader: AsheryLeader) => (
      //     <Group>
      //       {/* <a color="blue" href="#" onClick={() => handleEdit(asheryLeader)}>
      //         <IconEdit size={20} /> Edit
      //       </a> */}
      //       <a href="#" color="green" onClick={() => handleView(asheryLeader)}>
      //         <IconEye size={20} /> View
      //       </a>
      //       {/* <a href="#" color="red" onClick={() => handleDelete(asheryLeader)}>
      //         <IconRecycle size={20} /> Delete
      //       </a> */}
      //     </Group>
      //   ),
      // },
    ],
    []
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Ashray Leaders</label>
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

        {/* <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput 
              label="Email:" 
              {...form.getInputProps('email')} 
              onChange={(e) => handleEmailChange(e.target.value)} 
              type="email" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Ashery Leader Name:" {...form.getInputProps('name')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Initiated Name:" {...form.getInputProps('Initiated_name')} />
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
              label="Contact Number:"
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
                {isEditing ? 'Update' : 'Add Ashrey Leader'}
              </Button>
              <Button type="button" onClick={() => form.reset()} color="green">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid> */}

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this Ashery Leader entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedAsheryLeader} onClose={() => setViewedAsheryLeader(null)} title="Ashery Leader Details">
          {viewedAsheryLeader && (
            <Box>
              <Text>
                <strong>Ashery Leader Name:</strong> {viewedAsheryLeader.name}
              </Text>
              <Text>
                <strong>Email:</strong> {viewedAsheryLeader.email}
              </Text>
              <Text>
                <strong>Initiated Name:</strong> {viewedAsheryLeader.Initiated_name}
              </Text>
              <Text>
                <strong>Date of Birth:</strong> {viewedAsheryLeader.dob}
              </Text>
              <Text>
                <strong>Contact Number:</strong> {viewedAsheryLeader.contact_number}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedAsheryLeader.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={25} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={validAsheryLeaderList} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
