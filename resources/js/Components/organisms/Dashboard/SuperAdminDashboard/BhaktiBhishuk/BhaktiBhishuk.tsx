import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
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
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconCalendar, IconHttpDelete } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';

type BhaktiBhikshuk = {
  code: string;
  bhakti_bhekshuk_code: number;
  id: string;
  name: string;
  email: string;
  Initiated_name: string;
  dob: string;
  contact_number: string;
  is_active: string;
};

export default function BhaktiBhikshukComponent() {
  const [currentBhaktiBhikshuk, setCurrentBhaktiBhikshuk] = useState<BhaktiBhikshuk | null>(null);
  const [viewedBhaktiBhikshuk, setViewedBhaktiBhikshuk] = useState<BhaktiBhikshuk | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const form = useForm({
    initialValues: {
      code: '',
      id: '',
      name: '',
      email: '',
      Initiated_name: '',
      dob: '',
      contact_number: '',
      is_active: '',
    },
  });

  const today = new Date();

  useEffect(() => {
    if (currentBhaktiBhikshuk) {
      form.setValues({
        code: currentBhaktiBhikshuk.code || '',
        id: currentBhaktiBhikshuk.id ? currentBhaktiBhikshuk.id.toString() : '',
        name: currentBhaktiBhikshuk.name || '',
        email: currentBhaktiBhikshuk.email || '',
        Initiated_name: currentBhaktiBhikshuk.Initiated_name || '',
        dob: currentBhaktiBhikshuk.dob || '',
        contact_number: currentBhaktiBhikshuk.contact_number || '',
        is_active: currentBhaktiBhikshuk.is_active || '',
      });
    }
  }, [currentBhaktiBhikshuk]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleView = (bhaktiBhikshuk: BhaktiBhikshuk) => {
    setViewedBhaktiBhikshuk(bhaktiBhikshuk);
  };

  const { AsheryLeader } = usePage<{
    AsheryLeader: Array<{ code: string; ashery_leader_name: string }>;
  }>().props;

  const { BhaktiBhikshukList } = usePage<{ BhaktiBhikshukList: BhaktiBhikshuk[] }>().props;
  const validBhaktiBhikshukList = Array.isArray(BhaktiBhikshukList) ? BhaktiBhikshukList : [];

  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<BhaktiBhikshukList>[]>(
    () => [
      {accessorKey: 'bhakti_bhekshuk_code', header: 'Code', size:50 , },
      {accessorKey: 'login_id', header: 'Login ID' },
      { accessorKey: 'ashery_leader_name', header: 'Ashray Leader Name' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'dob', header: 'Date of Birth' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
      { accessorKey: 'is_active', header: 'Status' },
    ],
    [currentPage]
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href="/SuperAdmin/dashboard">Dashboard</Anchor>
        <label>Bhakti Vriksha</label>
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
{/* 
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
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
            <TextInput label="Enter Bhakti Vriksha Name:"
             {...form.getInputProps('name')} 
             />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Email:"
             {...form.getInputProps('email')} 
              onChange={(e) => handleEmailChange(e.target.value)} 
             type="email" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Initiated Name:" {...form.getInputProps('Initiated_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <label>DOB</label>
            <DateInput
              size="sm"
              className="w-full"
              withAsterisk
              leftSection={<IconCalendar />}
              placeholder="Enter Date of Birth"
              maxDate={today}
              value={form.values.dob ? new Date(form.values.dob) : undefined} // Convert string to Date for DateInput
              onChange={(date) => {
                const formattedDate = date ? date.toISOString().split('T')[0] : ''; // Format as 'YYYY-MM-DD'
                form.setFieldValue('dob', formattedDate); // Update the form value as a string
              }}
              error={form.errors.dob}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
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
              error={form.errors.contact_number}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <label style={{ fontWeight: 'bold' }}>Active Status</label>
            <Radio.Group
              {...form.getInputProps('is_active')}
              value={form.values.is_active.toString()}
              onChange={(value) => form.setFieldValue('is_active', value)}
            >
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
                {isEditing ? 'Update' : 'Add Bhakti Bhikshuk'}
              </Button>
              <Button type="button" onClick={() => form.reset()} color="green">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this Bhakti Vrikshuk?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal> */}

        <Modal opened={!!viewedBhaktiBhikshuk} onClose={() => setViewedBhaktiBhikshuk(null)} title="Ashery Leader Details">
          {viewedBhaktiBhikshuk && (
            <Box>
              <Text>
                <strong>Ashery Leader Name:</strong> {viewedBhaktiBhikshuk.name}
              </Text>
              <Text>
                <strong>Email:</strong> {viewedBhaktiBhikshuk.email}
              </Text>
              <Text>
                <strong>Initiated Name:</strong> {viewedBhaktiBhikshuk.Initiated_name}
              </Text>
              <Text>
                <strong>Date of Birth:</strong> {viewedBhaktiBhikshuk.dob}
              </Text>
              <Text>
                <strong>Contact Number:</strong> {viewedBhaktiBhikshuk.contact_number}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedBhaktiBhikshuk.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <CardSection inheritPadding mt="md" pb="lg">
          <DataTable data={validBhaktiBhikshukList} columnsFields={columns} PageSize={PAGE_SIZE} />
        </CardSection>
      </Card>
    </Container>
  );
}
