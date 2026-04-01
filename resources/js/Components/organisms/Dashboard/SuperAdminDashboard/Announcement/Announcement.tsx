import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconCalendar } from '@tabler/icons-react';
import { Container, Grid, TextInput, Breadcrumbs, Anchor, Card, Text, Group, Button, Radio, Notification, Modal, Box } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import RitchText from '@/Components/molecules/RichText/RichText';
import '@mantine/tiptap/styles.css';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import Editor from '@/Components/molecules/JoditEditor/JoditEditor';
import useUserStore from '@/Store/User.store';
import { access } from 'fs';

type Announcement = {
  id: string;
  title: string;
  description: string;
  valid_upto: string;
  is_active: string;
  display_sequence: string;
};

export default function Announcement() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [viewedAnnouncement, setViewedAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const items = [{ title: 'Dashboard', href: `/${roleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const { errors } = usePage().props;
  const today = new Date();

  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const form = useForm({
    initialValues: {
      id: '',
      title: '',
      display_sequence: '',
      description: '',
      valid_upto: '',
      is_active: '',
    },
  });

  useEffect(() => {
    if (currentAnnouncement) {
      form.setValues({
        id: currentAnnouncement.id,
        title: currentAnnouncement.title,
        description: currentAnnouncement.description,
        valid_upto: currentAnnouncement.valid_upto ? new Date(currentAnnouncement.valid_upto).toISOString().split('T')[0] : '',
        is_active: currentAnnouncement.is_active,
        display_sequence: currentAnnouncement.display_sequence || '',
      });
    }
  }, [currentAnnouncement]);

  const handleSubmit = () => {
    const submitValues = {
      ...form.values,
      // Format the valid_upto date as YYYY-MM-DD before sending to the database
      valid_upto: form.values.valid_upto ? new Date(form.values.valid_upto).toISOString().split('T')[0] : null,
    };

    if (isEditing && currentAnnouncement) {
      router.put(`/Action/announcement/${currentAnnouncement.id}`, submitValues, {
        onSuccess: () => {
          setNotificationMessage('Announcement updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentAnnouncement(null);
          form.setFieldValue('description', '');
          form.reset();
        },
      });
    } else {
      router.post('/Action/announcement', submitValues, {
        onSuccess: () => {
          setNotificationMessage('Announcement created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.setFieldValue('description', '');
          form.reset();
        },
      });
    }
  };

  const handleDelete = () => {
    if (announcementToDelete) {
      router.delete(`/Action/announcement/${announcementToDelete.id}`, {
        onSuccess: () => {
          setNotificationMessage('Announcement deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setOpenedDeleteModal(false);
        },
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setIsEditing(true);
    setCurrentAnnouncement(announcement);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (announcement: Announcement) => {
    setViewedAnnouncement(announcement);
  };

  const openDeleteModal = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setOpenedDeleteModal(true);
  };

  const { AnnouncementList } = usePage<{ AnnouncementList: Announcement[] }>().props;
  const validAnnouncementList = Array.isArray(AnnouncementList) ? AnnouncementList : [];

  const truncateHTML = (html: string, maxLength: number) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    let text = '';
    let length = 0;

    const traverseNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const remainingLength = maxLength - length;

        if (remainingLength <= 0) return; // Stop if maxLength is reached

        if (textContent.length > remainingLength) {
          text += textContent.substring(0, remainingLength) + '...';
          length = maxLength; // Set length to maxLength to stop traversal
        } else {
          text += textContent;
          length += textContent.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (length < maxLength) {
          const newElement = document.createElement(element.tagName);
          Array.from(element.childNodes).forEach(traverseNodes);
          if (newElement.childNodes.length > 0) {
            div.appendChild(newElement);
          }
        }
      }
    };

    Array.from(div.childNodes).forEach(traverseNodes);

    return text.length > maxLength ? text : div.innerHTML; // Return HTML if not truncated
  };

  const PAGE_SIZE = 10; 
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validAnnouncementList>[]>(
    () => [
      { accessorKey: 'title', header: 'Title' },
      {accessorKey: 'display_sequence', header: 'Display Sequence' },
      {
        accessorKey: 'description',
        header: 'Description',
        Cell: ({ row }: { row: { original: Announcement } }) => {
          const truncatedDescription = truncateHTML(row.original.description, 50);
          return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: truncatedDescription }} />;
        },
      },
      {
        accessorKey: 'valid_upto',
        header: 'Valid Upto',
        Cell: ({ row }: { row: { original: Announcement } }) => 
          new Date(row.original.valid_upto).toLocaleDateString(),
      },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        Cell: ({ row }: { row: { original: Announcement } }) => (
          <Group>
            <Button color="blue" size="xs" onClick={() => handleEdit(row.original)}>
              <IconEdit size={20} /> Edit
            </Button>
            <Button color="gray" size="xs" onClick={() => handleView(row.original)}>
              <IconEye size={20} /> View
            </Button>
            <Button color="red" size="xs" onClick={() => openDeleteModal(row.original)}>
              <IconRecycle size={20} /> Delete
            </Button>
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
        <label>Announcement List</label>
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
          <Text>Are you sure you want to delete this announcement?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal opened={!!viewedAnnouncement} onClose={() => setViewedAnnouncement(null)} size="lg" title="Announcement Details">
          {viewedAnnouncement && (
            <Box style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              position: 'relative'
            }}>
              <Box style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: viewedAnnouncement.is_active === 'Y' ? '#d4edda' : '#f8d7da',
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${viewedAnnouncement.is_active === 'Y' ? '#28a745' : '#dc3545'}`,
              }}>
                {viewedAnnouncement.is_active === 'Y' ? (
                  <>
                    <IconCheck size={18} color="#28a745" />
                    <span style={{ color: '#28a745', fontWeight: 600, fontSize: '14px' }}>Active</span>
                  </>
                ) : (
                  <>
                    <IconX size={18} color="#dc3545" />
                    <span style={{ color: '#dc3545', fontWeight: 600, fontSize: '14px' }}>Inactive</span>
                  </>
                )}
              </Box>
              
              <Text>
                <h3 style={{ 
                  marginTop: '0', 
                  paddingRight: '120px',
                  fontWeight: 'bold',
                  fontSize: '22px',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '2px solid #dee2e6'
                }}>
                  {viewedAnnouncement.title}
                </h3>
              </Text>
              <Box py={25}>
                <Text>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: truncateHTML(viewedAnnouncement.description, 100000000) }} />
                </Text>
              </Box>
            </Box>
          )}
        </Modal>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput autoComplete="off" label="Announcement Title" {...form.getInputProps('title')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <label>Link Expired Date</label>
            <DateInput
              size="sm"
              className="w-full"
              withAsterisk
              leftSection={<IconCalendar />}
              placeholder="Enter Expiry Date"
              minDate={today}
              value={form.values.valid_upto ? new Date(form.values.valid_upto) : null}
              onChange={(date: Date | null) => {
                form.setFieldValue('valid_upto', date ? date.toISOString().slice(0, 10) : '');
              }}
              error={form.errors.valid_upto}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <label style={{ fontWeight: 'bold' }}>Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <Radio value="Y" label="Active" />
              <Radio value="N" label="Inactive" />
            </Radio.Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <TextInput type="number" autoComplete="off" label="Display Sequence" {...form.getInputProps('display_sequence')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}> 
            <label style={{ fontWeight: 'bold' }}>Description</label>
            <RitchText 
              value={form.values.description} 
              onChange={(newContent) => form.setFieldValue('description', newContent)} 
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
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
              <Text size="lg">Announcement List</Text>
              <DataTable 
                data={validAnnouncementList}
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
