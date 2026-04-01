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

type Education = {
  id: string;
  eduction_name: string;
  is_active: string;
};

export default function Education() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [viewedEducation, setViewedEducation] = useState<Education | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);

  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      eduction_name: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentEducation) {
      form.setValues({
        id: currentEducation.id,
        eduction_name: currentEducation.eduction_name,
        is_active: currentEducation.is_active,
      });
    }
  }, [currentEducation]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentEducation) {
      router.put(`/Action/education/${currentEducation.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Education data updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentEducation(null);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating education data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/education', form.values, {
        onSuccess: () => {
          setNotificationMessage('Education data saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error saving education data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (education: Education) => {
    setOpenedDeleteModal(true);
    setEducationToDelete(education);
  };

  const confirmDelete = () => {
    if (educationToDelete) {
      router.delete(`/Action/education/${educationToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Education data deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting education data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (education: Education) => {
    setIsEditing(true);
    setCurrentEducation(education);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (education: Education) => {
    setViewedEducation(education);
  };

  const { EducationList } = usePage<{ EducationList: Education[] }>().props;
  const validEducationList = Array.isArray(EducationList) ? EducationList : [];
  const PAGE_SIZE = 10; 

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validEducationList>[]>(
    () => [
      { accessorKey: 'eduction_name', header: 'Education Name' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (education: Education) => (
          <Group>
            <a color="blue" href='#'  onClick={() => handleEdit(education)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="green" href='#'  onClick={() => handleView(education)}>
              <IconEye size={20} /> View
            </a>
            <a color="red" href='#'   onClick={() => handleDelete(education)}>
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
        <label>Education</label>
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

        {/* Form for Education */}
        <Grid pl={20} pr={20} py={20} style={{ backgroundColor: '#f1f1f1' }}>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput label="Enter Education Name:" {...form.getInputProps('eduction_name')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <label style={{ fontWeight: 'bold' }}>Education Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <Radio value="Y" label="Active" />
              <Radio value="N" label="Inactive" />
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
          <Text>Are you sure you want to delete this education entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        {/* View education modal */}
        <Modal opened={!!viewedEducation} onClose={() => setViewedEducation(null)} title="Education Details">
          {viewedEducation && (
            <Box>
              <Text>
                <strong>Education Name:</strong> {viewedEducation.eduction_name}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedEducation.is_active}
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
                    data={validEducationList}
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
