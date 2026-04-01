import { useForm } from '@mantine/form';
import React, { useEffect, useState,useMemo } from 'react';
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

type Profession = {
  id: string;
  profession_name: string;
  is_active: string;
};

export default function Profession() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [professionToDelete, setProfessionToDelete] = useState<Profession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfession, setCurrentProfession] = useState<Profession | null>(null);
  const [viewedProfession, setViewedProfession] = useState<Profession | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      profession_name: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentProfession) {
      form.setValues({
        id: currentProfession.id,
        profession_name: currentProfession.profession_name,
        is_active: currentProfession.is_active,
      });
    }
  }, [currentProfession]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentProfession) {
      // Update existing profession
      router.put(`/Action/profession/${currentProfession.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Profession updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentProfession(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating profession!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      // Create new profession
      router.post('/Action/profession', form.values, {
        onSuccess: () => {
          setNotificationMessage('Profession saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error saving profession!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (profession: Profession) => {
    setOpenedDeleteModal(true);
    setProfessionToDelete(profession);
  };

  const confirmDelete = () => {
    if (professionToDelete) {
      router.delete(`/Action/profession/${professionToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Profession deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting profession!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (profession: Profession) => {
    setIsEditing(true);
    setCurrentProfession(profession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (profession: Profession) => {
    setViewedProfession(profession);
  };

  const { ProfessionList } = usePage<{ ProfessionList: Profession[] }>().props;
  const validProfessionList = Array.isArray(ProfessionList) ? ProfessionList : [];
  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<Profession>[]>(
    () => [
    { accessorKey: 'profession_name', header: 'Profession Name' },
    { accessorKey: 'is_active', header: 'Status' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      accessorFn: (profession: Profession) => (
        <Group>
          <a color="blue" href='#' onClick={() => handleEdit(profession)}>
            <IconEdit size={20} /> Edit
          </a>
          <a color="green" href='#' onClick={() => handleView(profession)}>
            <IconEye size={20} /> View
          </a>
          <a color="red" href='#' onClick={() => handleDelete(profession)}>
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
        <label>Profession</label>
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

        {/* Form for Profession */}
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={4}>
            <TextInput label="Enter Profession Name:" {...form.getInputProps('profession_name')} />
          </Grid.Col>
          <Grid.Col span={4}>
            <label style={{ fontWeight: 'bold' }}>Profession Status</label>
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
          <Text>Are you sure you want to delete this profession entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        {/* View profession modal */}
        <Modal opened={!!viewedProfession} onClose={() => setViewedProfession(null)} title="Profession Details">
          {viewedProfession && (
            <Box>
              <Text>
                <strong>Profession Name:</strong> {viewedProfession.profession_name}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedProfession.is_active}
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
                    data={validProfessionList}
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
