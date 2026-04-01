import { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Anchor, Box, Breadcrumbs, Card, Container, Text, Button, Flex, Modal, Group } from '@mantine/core';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { MRT_ColumnDef } from 'mantine-react-table';
import { IconEdit, IconPencil, IconRecycle } from '@tabler/icons-react';

type User = {
  id: String;
  login_id: String;
  name: string;
  email: string;
  Initiated_name: string;
  dob: string;
  contact_number: string;
  devotee_type: string;
};

export default function PartiallyDevoteeListComponent() {
  const { PartiallyDevoteeSuperAdminList } = usePage<{ PartiallyDevoteeSuperAdminList: User[] }>().props;
  const validPartiallyDevoteeSuperAdminList = Array.isArray(PartiallyDevoteeSuperAdminList) ? PartiallyDevoteeSuperAdminList : [];
  const [currentPage, setCurrentPage] = useState(1);

  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [partiallydevoteeToDelete, setPartiallyDevoteeToDelete] = useState<User | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const dateFormate = (dateString: string) => {
    if (!dateString) return 'Invalid Date'; // Handle empty or undefined date strings
    const cDt = new Date(dateString);
    if (isNaN(cDt.getTime())) return 'Invalid Date'; // Handle invalid date strings
    return cDt.toLocaleDateString('en-GB'); // Format as dd/MM/yyyy
  };

  const handleDelete = () => {
    if (partiallydevoteeToDelete) {
      router.delete(`/Action/partiallydevotee/${partiallydevoteeToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Partially Devotee deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
        onError: () => {
          setNotificationMessage('Error deleting Partially Devotee!');
          setNotificationColor('red');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };
  const handleEdit = (id: string) => {
    const encodedId = btoa(id); // Encode the ID
    router.visit(`/Action/SuperAdminPartiallDevoteeDetails/${encodedId}`);
  };
  const PAGE_SIZE = 10; 
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'login_id', header: 'Login ID' },
      {accessorKey:'name',header:'Name'},
      {accessorKey:'Initiated_name',header:'Initiated Name'},
      { id: 'email', accessorKey: 'email', header: 'Email' },
      { id: 'contact_number', accessorKey: 'contact_number', header: 'Contact Number' },
      {
        id: 'dob',
        accessorKey: 'dob',
        header: 'D.O.B.',
        accessorFn: (row: any) => dateFormate(row.dob),
      },
      {
        id: 'created_at',
        accessorKey: 'created_at',
        header: 'Submitted Date',
        accessorFn: (row: any) => dateFormate(row.created_at),
      },
      {
        id: 'status_code',
        accessorKey: 'status_code',
        header: 'Status',
        accessorFn: (row: any) => <>{row.status_code || 'Partially filled'}</>,
      },
      {
        id: 'actions',
        header: 'Actions',
        accessorFn: (row: any) => (
          <Flex gap={10}>
            <a  href='#' color="blue" onClick={() => handleEdit(row.id)}>
            <IconEdit size={20} /> Edit
            </a>
            <a href='#'
              color="red"
              onClick={() => {
                setPartiallyDevoteeToDelete(row);
                setOpenedDeleteModal(true);
              }}
            >
             <IconRecycle size={20} />  Delete
            </a>
          </Flex>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {[{ title: 'Dashboard', href: '/SuperAdmin/dashboard' }].map((item, index) => (
          <Anchor href={item.href} key={index}>
            {item.title}
          </Anchor>
        ))}
        <>Partially Filled Devotees</>
      </Breadcrumbs>
      <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
        <Text>Are you sure you want to delete this devotee?</Text>
        <Group>
          <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        <DataTable 
          data={PartiallyDevoteeSuperAdminList}
          columnsFields={columns}
          PageSize={PAGE_SIZE}
        />
      </Card>
    </Container>
  );
}
