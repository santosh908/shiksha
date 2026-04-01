import { useForm } from '@mantine/form';
import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { Container, Grid, TextInput, Breadcrumbs, Anchor, Card, Text, Group, Button, Radio, Notification, Modal, Box } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import useUserStore from '@/Store/User.store';

type Prayer = {
  id: string;
  prayer_name_english: string;
  prayer_name_hindi: string;
  is_active: string;
};

export default function Prayers() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [prayerToDelete, setPrayerToDelete] = useState<Prayer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const items = [{ title: 'Dashboard', href: `/${roleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const form = useForm({
    initialValues: {
      id: '',
      prayer_name_english: '',
      prayer_name_hindi: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentPrayer) {
      form.setValues({
        id: currentPrayer.id,
        prayer_name_english: currentPrayer.prayer_name_english,
        prayer_name_hindi: currentPrayer.prayer_name_hindi,
        is_active: currentPrayer.is_active,
      });
    }
  }, [currentPrayer]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentPrayer) {
      router.put(`/Action/prayers/${currentPrayer.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Prayer updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentPrayer(null);
          form.reset();
        },
        onError: (errors) => {
          setNotificationMessage('Error updating prayer.');
          setNotificationColor('red');
          setShowNotification(true);
          console.error('Update errors:', errors);
        },
      });
    } else {
      router.post('/Action/prayers', form.values, {
        onSuccess: () => {
          setNotificationMessage('Prayer created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: (errors) => {
          setNotificationMessage('Error creating prayer.');
          setNotificationColor('red');
          setShowNotification(true);
          console.error('Create errors:', errors);
        },
      });
    }
  };

  const handleDelete = () => {
    if (prayerToDelete) {
      router.delete(`/Action/prayers/${prayerToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Prayer deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
        onError: () => {
          setNotificationMessage('Error deleting prayer.');
          setNotificationColor('red');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };

  const handleEdit = (prayer: Prayer) => {
    setIsEditing(true);
    setCurrentPrayer(prayer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (prayer: Prayer) => {
    setPrayerToDelete(prayer);
    setOpenedDeleteModal(true);
  };

  const { PrayerList } = usePage<{ PrayerList: Prayer[] }>().props;
  const validPrayerList = Array.isArray(PrayerList) ? PrayerList : [];

  const PAGE_SIZE = 10;

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validPrayerList>[]>(
    () => [
      { accessorKey: 'prayer_name_english', header: 'Prayer Name (English)' },
      { accessorKey: 'prayer_name_hindi', header: 'Prayer Name (Hindi)' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (prayer: Prayer) => (
          //@ts-ignore
          <Group spacing="xs" align="center" noWrap>
            <a
              color="blue"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEdit(prayer);
              }}
            >
              <IconEdit size={20} /> Edit
            </a>
            <a
              color="red"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openDeleteModal(prayer);
              }}
            >
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
        {items}
        <label>Memorised Prayers</label>
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
          <Text>Are you sure you want to delete this prayer?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Grid py={10}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Prayer Name In English:" autoComplete="off" {...form.getInputProps('prayer_name_english')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Prayer का नाम HINDI में लिखे:" autoComplete="off" {...form.getInputProps('prayer_name_hindi')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Prayer Status</label>
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
              {isEditing && (
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentPrayer(null);
                    form.reset();
                  }}
                  color="gray"
                >
                  Cancel
                </Button>
              )}
            </Group>
          </Grid.Col>
        </Grid>

        <Grid mt={30}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg">Prayer List</Text>
              <DataTable data={validPrayerList} columnsFields={columns} PageSize={PAGE_SIZE} />
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
