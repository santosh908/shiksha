import { useForm } from '@mantine/form';
import React, { useEffect, useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX } from '@tabler/icons-react';
import { Container, Grid, TextInput, Breadcrumbs, Anchor, Card, Text, Group, Button, Radio, Notification, Modal, Box, Flex } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import useUserStore from '@/Store/User.store';

type Book = {
  id: string;
  book_name_english: string;
  book_name_hindi: string;
  is_active: string;
};

export default function Book() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [viewedBook, setViewedBook] = useState<Book | null>(null);
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
      book_name_english: '',
      book_name_hindi: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentBook) {
      form.setValues({
        id: currentBook.id,
        book_name_english: currentBook.book_name_english,
        book_name_hindi: currentBook.book_name_hindi,
        is_active: currentBook.is_active,
      });
    }
  }, [currentBook]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentBook) {
      router.put(`/Action/book/${currentBook.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Book updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentBook(null);
          form.reset();
        },
      });
    } else {
      router.post('/Action/book', form.values, {
        onSuccess: () => {
          setNotificationMessage('Book created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
        },
      });
    }
  };

  const handleDelete = () => {
    if (bookToDelete) {
      router.delete(`/Action/book/${bookToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Book deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };

  const handleEdit = (book: Book) => {
    setIsEditing(true);
    setCurrentBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (book: Book) => {
    setViewedBook(book);
  };

  const openDeleteModal = (book: Book) => {
    setBookToDelete(book);
    setOpenedDeleteModal(true);
  };

  const { BookList } = usePage<{ BookList: Book[] }>().props;
  const validBookList = Array.isArray(BookList) ? BookList : [];

  const PAGE_SIZE = 10; 

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validBookList>[]>(
    () => [
      { accessorKey: 'book_name_english', header: 'Book Name (English)' },
      { accessorKey: 'book_name_hindi', header: 'Book Name (Hindi)' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (book: Book) => (
          //@ts-ignore
          <Group spacing="xs" align="center" noWrap>
            <a color="blue" href='#'  onClick={() => handleEdit(book)}>
              <IconEdit size={20} /> Edit
            </a>
            <a color="gray" href='#' onClick={() => handleView(book)}>
              <IconEye size={20} /> View
            </a>
            <a color="red" href='#'  onClick={() => openDeleteModal(book)}>
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
        {items}
        <label>Book</label>
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
          <Text>Are you sure you want to delete this book?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedBook} onClose={() => setViewedBook(null)} title="Book Details">
          {viewedBook && (
            <Box>
              <Text>
                <strong>Book Name (English):</strong> {viewedBook.book_name_english}
              </Text>
              <Text>
                <strong>Book Name (Hindi):</strong> {viewedBook.book_name_hindi}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedBook.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid py={10}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Book Name In English:" autoComplete="off" {...form.getInputProps('book_name_english')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Book का नाम HINDI में लिखे:" autoComplete="off" {...form.getInputProps('book_name_hindi')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <label style={{ fontWeight: 'bold' }}>Book Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Radio value="Y" label="Active" />
                <Radio value="N" label="Inactive" />
              </div>
            </Radio.Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Grid mt={30}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg">Book List</Text>
                <DataTable 
                 data={validBookList}
                 columnsFields={columns}
                 PageSize={PAGE_SIZE}
                />
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
