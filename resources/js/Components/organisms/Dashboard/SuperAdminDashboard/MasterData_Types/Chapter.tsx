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
  Select,
} from '@mantine/core';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';

type Chapter = {
  id: string;
  chapter_code: number;
  chapter_name: string;
  is_active: string;
  subject_id: number;
};

type Subject = {
  subject_name_id: string;
  subject_name: string;
};

export default function ChapterComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      chapter_name: '',
      subject_id: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentChapter) {
      form.setValues({
        id: currentChapter.id,
        chapter_name: currentChapter.chapter_name,
        subject_id: currentChapter.subject_id.toString(),
        is_active: currentChapter.is_active,
      });
    }
  }, [currentChapter]);

  const handleSubmit = () => {
    if (isEditing && currentChapter) {
      router.put(`/Action/chapter/${currentChapter.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Chapter data updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentChapter(null);
          form.reset();
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error updating chapter data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/chapter', form.values, {
        onSuccess: () => {
          setNotificationMessage('Chapter data saved successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error saving chapter data!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (chapter: Chapter) => {
    setOpenedDeleteModal(true);
    setChapterToDelete(chapter);
  };

  const confirmDelete = () => {
    if (chapterToDelete) {
      router.delete(`/Action/chapter/${chapterToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Chapter deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          router.reload();
        },
        onError: () => {
          setNotificationMessage('Error deleting chapter!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setIsEditing(true);
    setCurrentChapter(chapter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { ChapterList, Subject } = usePage<{
    ChapterList: Chapter[];
    Subject: Array<{ id: string; subject_name: string }>;
  }>().props;
  const validChapterList = Array.isArray(ChapterList) ? ChapterList : [];
  const PAGE_SIZE = 10;

  const columns = useMemo<MRT_ColumnDef<Chapter>[]>(
    () => [
      { accessorKey: 'chapter_code', header: 'Chapter Code' },
      { accessorKey: 'subject_name', header: 'Scripture/Book' },
      { accessorKey: 'chapter_name', header: 'Chapter/Section' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        Cell: ({ row }) => (
          <Group>
            <Button variant="subtle" color="blue" onClick={() => handleEdit(row.original)}>
              <IconEdit size={16} /> Edit
            </Button>
            <Button variant="subtle" color="red" onClick={() => handleDelete(row.original)}>
              <IconRecycle size={16} /> Delete
            </Button>
          </Group>
        ),
      },
    ],
    [currentPage]
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Chapters</label>
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
              label="Scripture/Book"
              placeholder="Choose Scripture/Book"
              data={(Subject || []).map((subject) => ({
                value: subject.id.toString(),
                label: subject.subject_name,
              }))}
              {...form.getInputProps('subject_id')}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter  Chapter/Section" {...form.getInputProps('chapter_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Status</label>
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
            </Group>
          </Grid.Col>
        </Grid>

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this chapter entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>
        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={validChapterList} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
