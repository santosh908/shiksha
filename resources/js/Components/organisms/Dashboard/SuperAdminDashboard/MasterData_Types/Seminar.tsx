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
  Notification,
  Modal,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import useUserStore from '@/Store/User.store';

type Seminar = {
  id: string;
  seminar_name_english: string;
  seminar_name_hindi: string;
  is_active: string;
};

export default function Seminar() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [seminarToDelete, setSeminarToDelete] = useState<Seminar | null>(null);
  const [viewedSeminar, setViewedSeminar] = useState<Seminar | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSeminar, setCurrentSeminar] = useState<Seminar | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();
  const items = [{ title: 'Dashboard', href: `/${roleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const form = useForm({
    initialValues: {
      id: '',
      seminar_name_english: '',
      seminar_name_hindi: '',
      is_active: '',
    },
  });

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (currentSeminar) {
      form.setValues({
        id: currentSeminar.id,
        seminar_name_english: currentSeminar.seminar_name_english,
        seminar_name_hindi: currentSeminar.seminar_name_hindi,
        is_active: currentSeminar.is_active,
      });
    }
  }, [currentSeminar]);

  const handleSubmit = () => {
    if (isEditing && currentSeminar) {
      // Update seminar
      router.put(`/Action/seminar/${currentSeminar.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Seminar updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentSeminar(null);
          form.reset();
        },
      });
    } else {
      // Create seminar
      router.post('/Action/seminar', form.values, {
        onSuccess: () => {
          setNotificationMessage('Seminar created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
      });
    }
  };

  const { SeminarList } = usePage<{ SeminarList: Seminar[] }>().props;
  const validSeminarList = Array.isArray(SeminarList) ? SeminarList : [];

  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validEducationList>[]>(
    () => [
      { accessorKey: 'seminar_name_english', header: 'Seminar Name (English)' },
      { accessorKey: 'seminar_name_hindi', header: 'Seminar Name (Hindi)' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (seminar: Seminar) => (
          <Group>
            <a color="blue" href='#' onClick={() => handleEdit(seminar)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="gray" href='#' onClick={() => handleView(seminar)}>
              <IconEye size={20} /> View
            </a>
            <a color="red" href='#' onClick={() => openDeleteModal(seminar)}>
              <IconRecycle size={20} /> Delete
            </a>
          </Group>
        ),
      },
    ],
    [currentPage],
  );

  const handleEdit = (seminar: Seminar) => {
    setIsEditing(true);
    setCurrentSeminar(seminar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (seminar: Seminar) => {
    setViewedSeminar(seminar);
  };

  const openDeleteModal = (seminar: Seminar) => {
    setSeminarToDelete(seminar);
    setOpenedDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (seminarToDelete) {
      router.delete(`/Action/seminar/${seminarToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Seminar deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Seminar</label>
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
          <Text>Are you sure you want to delete this seminar?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedSeminar} onClose={() => setViewedSeminar(null)} title="Seminar Details*">
          {viewedSeminar && (
            <Box>
              <Text>
                <strong>Seminar Name (English):</strong> {viewedSeminar.seminar_name_english}
              </Text>
              <Text>
                <strong>Seminar Name (Hindi):</strong> {viewedSeminar.seminar_name_hindi}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedSeminar.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Seminar Name in English" {...form.getInputProps('seminar_name_english')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Seminar का नाम HINDI में लिखे" {...form.getInputProps('seminar_name_hindi')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Seminar Status</label>
            <Radio.Group py={5} {...form.getInputProps('is_active')}>
              <Radio value="Y" label="Active" />
              <Radio value="N" label="Inactive" />
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group justify="center" mt="md">
              <Button type="submit" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Grid mt={30}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable 
                    data={validSeminarList}
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
