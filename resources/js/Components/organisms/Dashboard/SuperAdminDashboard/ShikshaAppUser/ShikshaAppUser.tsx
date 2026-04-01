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
  Select,
  Checkbox,
} from '@mantine/core';
import { 
  IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconCalendar,
  IconList, IconUserPlus, IconUserCheck, IconTrash, IconPencil,
  IconFileCheck, IconUsers, IconBook, IconSchool, IconCertificate,
  IconShieldCheck, IconSettings, IconDashboard, IconChartBar,
  IconMessage, IconBell, IconFileText, IconUserCircle, IconClipboardList,
  IconPresentation, IconBookmark, IconAward, IconReportAnalytics
} from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { router, usePage } from '@inertiajs/react';
import useUserStore from '@/Store/User.store';

type Permission = {
  id: number;
  name: string;
};

type Role = {
  name: string;
};

type SuperAdmin = {
  id: string;
  role_name: string;
  code: string;
  name: string;
  email: string;
  devotee_type: string;
  Initiated_name: string;
  dob: string;
  contact_number: string;
  permissions: Permission[];
};
 
export default function ShikshappuserComponent() {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [SuperAdminToDelete, setSuperAdminToDelete] = useState<SuperAdmin | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSuperAdmin, setCurrentSuperAdmin] = useState<SuperAdmin | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [viewPermissionsModal, setViewPermissionsModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [selectedAshrayLeader, setSelectedAshrayLeader] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const form = useForm({
    initialValues: {
      id: '',
      role_name: '',
      code: '',
      name: '',
      email: '',
      Initiated_name: '',
      dob: '',
      contact_number: '',
      permissions: [] as string[],
      unique_user_check: 1,
      have_you_applied_before: 'N',
      devotee_type: '',
      password: '12345678',
      password_confirmation: '12345678',
    },
  });

  type User = {
    permissions: { name: string }[];
  };

  const today = new Date();

  const { errors, Permission } = usePage<{
    errors: Record<string, string>;
    Permission: { id: number; name: string }[] | null;
  }>().props;

  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (currentSuperAdmin) {
      form.setValues({
        id: currentSuperAdmin.id,
        role_name: currentSuperAdmin.role_name,
        code: currentSuperAdmin.code,
        name: currentSuperAdmin.name,
        email: currentSuperAdmin.email,
        Initiated_name: currentSuperAdmin.Initiated_name,
        dob: currentSuperAdmin.dob,
        contact_number: currentSuperAdmin.contact_number,
        devotee_type: currentSuperAdmin.devotee_type,
        permissions: currentSuperAdmin.permissions.map((p: { id: number }) => p.id.toString()),
      });
    }
  }, [currentSuperAdmin]);

  const handleSubmit = () => {
    let submitValues = { ...form.values };
    if (submitValues.role_name !== 'BhaktiVriksha') {
      //@ts-ignore
      delete submitValues.code;
    }
    if (isEditing && currentSuperAdmin) {
      router.put(`/Action/shikshappuser/${currentSuperAdmin.id}`, submitValues, {
        onSuccess: () => {
          setNotificationMessage('Record updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentSuperAdmin(null);
          setSelectedAshrayLeader('');
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error updating SuperAdmin!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    } else {
      router.post('/Action/shikshappuser', submitValues, {
        onSuccess: () => {
          setNotificationMessage('Record added successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setCurrentSuperAdmin(null);
          setSelectedAshrayLeader('');
          form.reset();
        },
        onError: () => {
          setNotificationMessage('Error adding record!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

  const handleDelete = (SuperAdmin: SuperAdmin) => {
    setOpenedDeleteModal(true);
    setSuperAdminToDelete(SuperAdmin);
  };

  const confirmDelete = () => {
    if (SuperAdminToDelete) {
      router.delete(`/Action/shikshappuser/${SuperAdminToDelete.id}`, {
        onSuccess: () => {
          setOpenedDeleteModal(false);
          setNotificationMessage('Record deleted successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
        },
        onError: () => {
          setNotificationMessage('Error deleting Record!');
          setNotificationColor('red');
          setShowNotification(true);
        },
      });
    }
  };

      // Fetch login ID based on email input
  const handleEmailChange = async (email: string) => {
    form.setFieldValue('email', email);
    setEmailValid(null);
    if (email) {
      try {
        const response = await fetch(`/Action/userDetailsByEmailID/${email}`);
        if (response.ok) {
          const data = await response.json();
          if(data!="NA" && isEditing===false)
          {
            form.setFieldValue('name', data.name); 
            form.setFieldValue('Initiated_name', data.Initiated_name); 
            form.setFieldValue('dob', data.dob); 
            form.setFieldValue('contact_number', data.contact_number); 
            form.setFieldValue('is_active', data.is_active); 
            setEmailValid(true);
          }
        } 
      } catch (error) {
        console.error('Error while fetching details:', error);
        setEmailValid(false); // Mark email as invalid
      }
    }
  };

  const handleEdit = (SuperAdmin: SuperAdmin) => {
    setIsEditing(true);
    setCurrentSuperAdmin(SuperAdmin);
    setSelectedAshrayLeader(SuperAdmin.code || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentSuperAdmin) {
      form.setFieldValue('code', currentSuperAdmin.code || '');
      setSelectedAshrayLeader(currentSuperAdmin.code || '');
    }
  }, [currentSuperAdmin]);


  const handleViewPermissions = (permissions: Permission[]) => {
    setSelectedPermissions(permissions);
    setViewPermissionsModal(true);
  };

  const { AdminUserList, AsheryLeader, roleList } = usePage<{
    AdminUserList: SuperAdmin[];
    roleList: { id: string; name: string }[];
    AsheryLeader: { code: string; ashery_leader_name: string }[];
  }>().props;

  const validAdminUserList = Array.isArray(AdminUserList) ? AdminUserList : [];
  const [modalOpened, setModalOpened] = useState(false);
  
  const handleRoleChange = (value: string | null) => {
    form.setFieldValue('role_name', value || ''); // Ensure role_name is updated correctly
    if (value !== 'BhaktiVriksha') {
      form.setFieldValue('code', ''); // Clear Ashray Leader code if role is not BhaktiVriksha
    }
  };

  // Reset form when switching from edit to add mode
  const handleReset = () => {
    form.reset();
    setIsEditing(false);
    setCurrentSuperAdmin(null);
    setSelectedAshrayLeader('');
  };

  const groupPermissions = (permissions: any) => {
    return permissions.reduce((groups: any, permission: any) => {
      const [group] = permission.name.split('.');
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
      return groups;
    }, {});
  };
  const toPascalCase = (str: string) => {
    // Handle common compound words in the domain
    const compoundWords: Record<string, string> = {
      'devoteeregistration': 'DevoteeRegistration',
      'shikshalevel': 'ShikshaLevel',
      'bhaktivriksha': 'BhaktiVriksha',
      'ashrayleader': 'AshrayLeader',
      'postregistration': 'PostRegistration',
      'preregistration': 'PreRegistration',
      'examresult': 'ExamResult',
      'devoteedetails': 'DevoteeDetails',
      'userdetails': 'UserDetails',
      'adminuser': 'AdminUser',
      'superadmin': 'SuperAdmin',
    };
    
    const lowerStr = str.toLowerCase().trim();
    
    // Check if it's a known compound word
    if (compoundWords[lowerStr]) {
      return compoundWords[lowerStr];
    }
    
    // Split on common separators and capitalize each word
    return str
      .toLowerCase()
      .replace(/(?:^|\s|_|-)(\w)/g, (_, c) => c.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase words
  };
  
  // Function to get icon for permission action
  const getPermissionIcon = (permissionName: string) => {
    const action = permissionName.split('.')[1] || permissionName;
    const iconStyle = { size: 18, style: { marginRight: '8px' } };
    
    switch (action.toLowerCase()) {
      case 'create':
      case 'store':
        return <IconUserPlus {...iconStyle} />;
      case 'list':
      case 'view':
      case 'index':
        return <IconList {...iconStyle} />;
      case 'edit':
      case 'update':
        return <IconPencil {...iconStyle} />;
      case 'delete':
      case 'destroy':
        return <IconTrash {...iconStyle} />;
      case 'show':
      case 'detail':
        return <IconEye {...iconStyle} />;
      case 'approve':
      case 'verify':
        return <IconUserCheck {...iconStyle} />;
      case 'export':
      case 'download':
        return <IconFileCheck {...iconStyle} />;
      default:
        return <IconShieldCheck {...iconStyle} />;
    }
  };

  // Function to get icon for module category
  const getModuleIcon = (moduleName: string) => {
    const iconProps = { size: 20, style: { marginRight: '8px' } };
    
    switch (moduleName.toLowerCase()) {
      case 'dashboard':
        return <IconDashboard {...iconProps} />;
      case 'user':
      case 'users':
      case 'admin':
        return <IconUsers {...iconProps} />;
      case 'report':
      case 'reports':
        return <IconReportAnalytics {...iconProps} />;
      case 'exam':
      case 'examination':
      case 'test':
        return <IconBook {...iconProps} />;
      case 'devotee':
      case 'devotees':
        return <IconUserCircle {...iconProps} />;
      case 'level':
      case 'shiksha':
        return <IconSchool {...iconProps} />;
      case 'certificate':
        return <IconCertificate {...iconProps} />;
      case 'announcement':
      case 'notification':
        return <IconBell {...iconProps} />;
      case 'attendance':
        return <IconClipboardList {...iconProps} />;
      case 'assignment':
      case 'task':
        return <IconPresentation {...iconProps} />;
      case 'course':
        return <IconBookmark {...iconProps} />;
      case 'achievement':
      case 'award':
        return <IconAward {...iconProps} />;
      case 'settings':
        return <IconSettings {...iconProps} />;
      default:
        return <IconShieldCheck {...iconProps} />;
    }
  };

  // Function to get meaningful label for permission
  const getPermissionLabel = (permissionName: string) => {
    const parts = permissionName.split('.');
    const action = parts[1] || permissionName;
    
    // Common action mappings for clearer labels
    const actionLabels: Record<string, string> = {
      'create': 'Create',
      'store': 'Create',
      'list': 'View List',
      'index': 'View All',
      'show': 'View Details',
      'edit': 'Edit',
      'update': 'Update',
      'delete': 'Delete',
      'destroy': 'Remove',
      'approve': 'Approve',
      'reject': 'Reject',
      'verify': 'Verify',
      'export': 'Export',
      'download': 'Download',
      'upload': 'Upload',
      'import': 'Import',
      'print': 'Print',
      'view': 'View',
      'search': 'Search',
      'filter': 'Filter',
      'sort': 'Sort',
    };
    
    const lowerAction = action.toLowerCase();
    
    // Check if it's a direct match
    if (actionLabels[lowerAction]) {
      return actionLabels[lowerAction];
    }
    
    // Check if action contains a known action word (e.g., "shikshalevelstore" contains "store")
    for (const [key, value] of Object.entries(actionLabels)) {
      if (lowerAction.includes(key)) {
        return value;
      }
    }
    
    // If no match, convert to PascalCase
    return toPascalCase(action);
  };

  // Function to get description for permission
  const getPermissionDescription = (permissionName: string) => {
    const parts = permissionName.split('.');
    const module = parts[0] || '';
    const action = parts[1] || permissionName;
    
    const moduleName = toPascalCase(module);
    
    const descriptions: Record<string, string> = {
      'create': `Add new ${moduleName} records to the system`,
      'store': `Save ${moduleName} information`,
      'list': `Access and browse ${moduleName} list`,
      'index': `View all ${moduleName} entries`,
      'show': `View detailed ${moduleName} information`,
      'edit': `Modify existing ${moduleName} records`,
      'update': `Update ${moduleName} data`,
      'delete': `Remove ${moduleName} records from system`,
      'destroy': `Permanently delete ${moduleName} entries`,
      'approve': `Approve ${moduleName} requests`,
      'reject': `Reject ${moduleName} submissions`,
      'verify': `Verify and validate ${moduleName} data`,
      'export': `Export ${moduleName} data to files`,
      'download': `Download ${moduleName} documents`,
      'upload': `Upload ${moduleName} files`,
      'import': `Import ${moduleName} data from files`,
      'print': `Print ${moduleName} reports`,
      'view': `View ${moduleName} content`,
    };
    
    return descriptions[action.toLowerCase()] || `Manage ${moduleName} - ${toPascalCase(action)}`;
  };

  const getModuleDescription = (moduleName: string) => {
    const descriptions: Record<string, string> = {
      'dashboard': 'Overview and analytics dashboard access',
      'user': 'User account and profile management',
      'users': 'User management and administration',
      'admin': 'Administrative functions and controls',
      'report': 'Generate and access reports',
      'reports': 'Reporting and analytics features',
      'exam': 'Examination management and operations',
      'examination': 'Test and exam administration',
      'devotee': 'Devotee information and records',
      'devotees': 'Manage devotee profiles',
      'level': 'Level and progression management',
      'shiksha': 'Shiksha program administration',
      'certificate': 'Certificate generation and management',
      'announcement': 'Announcements and broadcasts',
      'notification': 'Notification management',
      'attendance': 'Attendance tracking and records',
      'assignment': 'Assignment and task management',
      'course': 'Course content and curriculum',
      'achievement': 'Achievement and awards tracking',
      'settings': 'System settings and configuration',
    };
    
    return descriptions[moduleName.toLowerCase()] || `${toPascalCase(moduleName)} module access and management`;
  };

  const groupedPermissions = groupPermissions(Permission);

  // Function to display only first few permissions with ellipsis
  const displayPermissionsPreview = (permissions: Permission[]) => {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return 'No Permissions';
    }
    
    // Show only first 2 permissions
    const MAX_PREVIEW = 2;
    const permNames = permissions.map(perm => {
      const parts = perm.name.split('.');
      return parts.length > 1 ? parts[1] : perm.name; // Show only the action part, not the module
    });
    
    if (permNames.length <= MAX_PREVIEW) {
      return permNames.join(', ');
    } else {
      return `${permNames.slice(0, MAX_PREVIEW).join(', ')}... +${permNames.length - MAX_PREVIEW} more`;
    }
  };

  // Group permissions by module for the modal view
  const groupPermissionsByModule = (permissions: Permission[]) => {
    return permissions.reduce((groups: Record<string, Permission[]>, permission) => {
      const [module] = permission.name.split('.');
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
      return groups;
    }, {});
  };

  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<AdminUserList>[]>(
    () => [
     // {accessorKey: 'code', header: 'Code'},
      {accessorKey: 'login_id',header:'Login ID'},
      { accessorKey: 'role_name', header: 'Role' },
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row }) => {
          const { role_name, name, ashery_leader_name } = row.original;
          if (role_name === 'BhaktiVriksha' && ashery_leader_name) {
            return `${name} (${ashery_leader_name})`;
          }
          return name;
        },
      },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'dob', header: 'Date of Birth' },
      { accessorKey: 'contact_number', header: 'Contact Number' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Group>
            <a color="blue" href="#" onClick={() => handleEdit(row.original)}>
              <IconEdit size={20} /> Edit
            </a>
            <a href="#" color="red" onClick={() => handleDelete(row.original)}>
              <IconRecycle size={20} /> Delete
            </a>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Add Admin</label>
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
              label="Role"
              searchable
              clearable
              placeholder="Choose Role"
              value={form.values.role_name}
              onChange={handleRoleChange}
              data={(roleList || []).map((level) => ({
                value: level.name,
                label: level.name,
              }))}
              withAsterisk
                error={form.errors.role_name}
                />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <TextInput
                label="Email:"
                type="email"
                value={form.values.email}
                onChange={(e) => {
                  form.setFieldValue('email', e.target.value);
                  handleEmailChange(e.target.value);
                }}
                error={form.errors.email}
              />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Name:" {...form.getInputProps('name')} />
          </Grid.Col>

          {form.values.role_name === 'BhaktiVriksha' && (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Select
                label="Ashray Leader Name"
                searchable
                clearable
                placeholder="Choose Ashray Leader"
                value={form.values.code}
                onChange={(value) => {
                  form.setFieldValue('code', value || '');
                  setSelectedAshrayLeader(value || '');
                }}
                data={(AsheryLeader || []).map((level) => ({
                  value: level.code.toString(),
                  label: level.ashery_leader_name,
                }))}
              />
            </Grid.Col>
          )}

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <TextInput label="Enter Initiated Name:" {...form.getInputProps('Initiated_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
            <label>DOB</label>
            <DateInput
              size="sm"
              className="w-full"
              {...form.getInputProps('dob')}
              withAsterisk
              leftSection={<IconCalendar />}
              placeholder="Enter Date of Birth"
              maxDate={today}
              value={form.values.dob ? new Date(form.values.dob) : null}
              onChange={(date: Date | null) => form.setFieldValue('dob', date ? date.toISOString().split('T')[0] : '')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 2 }}>
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
                if (/[^0-9]/.test(value)) {
                  e.preventDefault();
                }
              }}
              error={form.errors.contact_number}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <label style={{ fontWeight: 'bold' }}>Permissions : </label>
            <div style={{ padding: '20px' }}>
              <Button onClick={() => setModalOpened(true)}>Set Permissions</Button>
            </div>
          </Grid.Col>

          <Input type="hidden" name="unique_user_check" value="1" />
          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Add User'}
              </Button>
              <Button type="button" onClick={handleReset} color="green">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
          <Text>Are you sure you want to delete this SuperAdmin entry?</Text>
          <Group>
            <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal 
          opened={modalOpened} 
          onClose={() => setModalOpened(false)} 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconShieldCheck size={24} />
              <span>Set User Permissions</span>
            </div>
          }
          size="xxl"
          styles={{
            header: { 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: '#fff',
              padding: '20px',
              borderRadius: '8px 8px 0 0'
            },
            title: { 
              color: '#fff', 
              fontSize: '20px', 
              fontWeight: 600 
            },
            body: {
              padding: '0'
            }
          }}
        >
          <div style={{ 
            padding: '20px', 
            background: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
              Select the permissions you want to grant to this user. Permissions control what actions users can perform within different modules of the system.
            </Text>
            <div style={{ 
              marginTop: '12px', 
              padding: '12px', 
              background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)',
              borderRadius: '6px',
              border: '1px solid #b2dfdb'
            }}>
              <Text size="xs" fw={500} c="#004d40">
                <IconCheck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Selected: <strong>{form.values.permissions.length}</strong> permission{form.values.permissions.length !== 1 ? 's' : ''}
              </Text>
            </div>
          </div>

          <Checkbox.Group 
            value={form.values.permissions} 
            onChange={(value) => form.setFieldValue('permissions', value)} 
            withAsterisk
          >
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '20px'
            }}>
              {Object.entries(groupedPermissions).map(([groupName, perms]) => (
                <Card 
                  key={groupName} 
                  shadow="md" 
                  p="lg" 
                  radius="md" 
                  withBorder 
                  style={{ 
                    border: '2px solid #e9ecef',
                    background: '#fff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ':hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }}
                >
                  <Card.Section 
                    withBorder 
                    inheritPadding 
                    py="sm"
                    style={{
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderBottom: '2px solid #667eea'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getModuleIcon(groupName)}
                        <Text fw={700} size="md" style={{ color: '#495057' }}>
                          {toPascalCase(groupName)}
                        </Text>
                      </div>
                      <Text size="xs" c="dimmed" fw={500}>
                        {
                          //@ts-ignore
                          perms?.length || 0
                        } {
                          //@ts-ignore
                          perms?.length === 1 ? 'action' : 'actions'
                        }
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed" mt={6} style={{ lineHeight: 1.4 }}>
                      {getModuleDescription(groupName)}
                    </Text>
                  </Card.Section>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px', 
                    marginTop: '12px',
                    flexGrow: 1
                  }}>
                    {
                      //@ts-ignore
                      perms?.map((perm: any) => (
                        <div 
                          key={perm.id}
                          style={{
                            padding: '10px',
                            borderRadius: '6px',
                            background: form.values.permissions.includes(perm.id.toString()) 
                              ? 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)' 
                              : '#f8f9fa',
                            border: `1px solid ${form.values.permissions.includes(perm.id.toString()) ? '#667eea' : '#dee2e6'}`,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!form.values.permissions.includes(perm.id.toString())) {
                              e.currentTarget.style.background = '#e9ecef';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!form.values.permissions.includes(perm.id.toString())) {
                              e.currentTarget.style.background = '#f8f9fa';
                            }
                          }}
                        >
                          <Checkbox 
                            value={perm.id.toString()} 
                            label={
                              <div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  marginBottom: '4px',
                                  fontWeight: 600,
                                  color: '#495057'
                                }}>
                                  {getPermissionIcon(perm.name)}
                                  {getPermissionLabel(perm.name)}
                                </div>
                                <Text 
                                  size="xs" 
                                  c="dimmed" 
                                  style={{ 
                                    marginLeft: '26px',
                                    lineHeight: 1.3,
                                    fontSize: '11px'
                                  }}
                                >
                                  {getPermissionDescription(perm.name)}
                                </Text>
                              </div>
                            }
                            styles={{
                              label: { cursor: 'pointer', width: '100%' },
                              input: { cursor: 'pointer' }
                            }}
                          />
                        </div>
                      ))
                    }
                  </div>
                </Card>
              ))}
            </div>
          </Checkbox.Group>

          <div style={{ 
            marginTop: '0px', 
            padding: '20px',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            borderTop: '2px solid #dee2e6',
            background: '#f8f9fa'
          }}>
            <div>
              <Text size="sm" fw={500} c="dimmed">
                Review your selections before saving
              </Text>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button 
                variant="outline" 
                onClick={() => setModalOpened(false)}
                leftSection={<IconX size={16} />}
                color="gray"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalOpened(false);
                }}
                leftSection={<IconCheck size={16} />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </Modal>

        {/* Enhanced Modal for Viewing Permissions */}
        <Modal 
          opened={viewPermissionsModal} 
          onClose={() => setViewPermissionsModal(false)} 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconShieldCheck size={24} />
              <span>User Permissions Overview</span>
            </div>
          }
          size="lg"
          styles={{
            header: { 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: '#fff',
              padding: '20px',
              borderRadius: '8px 8px 0 0'
            },
            title: { 
              color: '#fff', 
              fontSize: '18px', 
              fontWeight: 600 
            },
            body: {
              padding: '0'
            }
          }}
        >
          <div style={{ 
            padding: '20px', 
            background: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
              This user has been granted the following permissions across different modules:
            </Text>
            <div style={{ 
              marginTop: '12px', 
              padding: '12px', 
              background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)',
              borderRadius: '6px',
              border: '1px solid #b2dfdb'
            }}>
              <Text size="xs" fw={500} c="#004d40">
                <IconCheck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Total Permissions: <strong>{selectedPermissions.length}</strong>
              </Text>
            </div>
          </div>

          <div style={{ 
            maxHeight: '60vh', 
            overflowY: 'auto',
            padding: '20px',
            background: '#fff'
          }}>
            {Object.entries(groupPermissionsByModule(selectedPermissions)).map(([module, perms]) => (
              <Card 
                key={module} 
                shadow="md" 
                p="md" 
                radius="md" 
                withBorder 
                mb="md"
                style={{
                  border: '2px solid #e9ecef',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #667eea'
                }}>
                  {getModuleIcon(module)}
                  <Text fw={700} size="md" style={{ color: '#495057' }}>
                    {toPascalCase(module)}
                  </Text>
                  <Text size="xs" c="dimmed" ml="auto" fw={500}>
                    {perms.length} {perms.length === 1 ? 'permission' : 'permissions'}
                  </Text>
                </div>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px'
                }}>
                  {perms.map((perm, index) => {
                    const actionName = perm.name.split('.')[1] || perm.name;
                    return (
                      <div 
                        key={perm.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
                          borderRadius: '6px',
                          border: '1px solid #667eea',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #c5cae9 0%, #9fa8da 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = '';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)';
                        }}
                      >
                        {getPermissionIcon(perm.name)}
                        <Text size="sm" fw={500} style={{ color: '#495057' }}>
                          {getPermissionLabel(perm.name)}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
          
          <div style={{
            padding: '16px 20px',
            borderTop: '2px solid #dee2e6',
            background: '#f8f9fa',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Button 
              onClick={() => setViewPermissionsModal(false)}
              leftSection={<IconX size={16} />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Close
            </Button>
          </div>
        </Modal>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={validAdminUserList} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}