import RegistrationDetailsModal from '@/Components/organisms/Dashboard/AsheryLeader/RegistrationDetailsModal';
import useUserStore from '@/Store/User.store';
import { router } from '@inertiajs/react';
import { Menu, Button, Box, Text, TextInput, Group, Loader } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconDotsVertical, IconEye, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ActionsMenuProps {
  row: any;
}

function TableAction({ row }: ActionsMenuProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openModal = () => {
    setModalOpened(true);
  };

  const { roles: RoleName } = useUserStore();
  const [pageLoading, setPageLoading] = useState(false);

  const handleApprove = () => {
    const idVal = row.ProfilePrID ?? row.user_id ?? row.userId ?? row.id ?? '';
    const encodedId = idVal !== '' ? btoa(String(idVal)) : '';
    modals.openConfirmModal({
      title: 'Confirm Approval',
      children: <Text size="sm">Are you sure you want to approve.?</Text>,
      labels: { confirm: 'Approve', cancel: 'Cancel' },
      onConfirm: () => {
        let approveUrl = `/ApproveDevotee/${encodedId}`;
        if (RoleName.includes('SuperAdmin') || RoleName.includes('Admin')) {
          approveUrl = `/Action/ApproveDevotee/${encodedId}`;
        } else if (RoleName.includes('AsheryLeader')) {
          approveUrl = `/Action/ApproveDevotee/${encodedId}`;
        } else if (RoleName.includes('BhaktiVriksha')) {
          approveUrl = `/Action/ApproveDevotee/${encodedId}`;
        }
        setPageLoading(true);       // ✅ start page loader
        modals.closeAll();
        router.put(
          approveUrl,
          {},
          {
            onSuccess: () => {
              modals.closeAll();
              setPageLoading(false);
            },
            onError: () => {
            setPageLoading(false);
          },
          }
        );
      },
      onCancel: () => {
        modals.closeAll();
      },
      onClose: () => {
        modals.closeAll();
      },
    });
  };

  const handleReject = (row: any, onReject: (row: any, reason: string) => void) => {
    let rejectionReason = '';

    modals.open({
      title: 'Confirm Rejection',
      children: (
        <>
          <Text size="sm">Please provide a reason for rejection:</Text>
          <TextInput
            mt="sm"
            placeholder="Reason for rejection"
            onChange={(event) => {
              rejectionReason = event.currentTarget.value;
            }}
          />
          <Group mt="md">
            <Button onClick={() => modals.closeAll()} variant="outline" color="gray">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onReject(row, rejectionReason);
                modals.closeAll();
              }}
              color="red"
            >
              Reject
            </Button>
          </Group>
        </>
      ),
      onClose: () => {
        modals.closeAll();
      },
    });
  };

  const handleRejectAction = (row: any, reason: any) => {
    const idVal =  row.user_id;
    const encodedId = idVal !== '' ? btoa(String(idVal)) : '';
    let approveUrl = `/RejectDevotee/${encodedId}`;
    if (RoleName.includes('SuperAdmin') || RoleName.includes('Admin')) {
      approveUrl = `/Action/RejectDevotee/${encodedId}`;
    } else if (RoleName.includes('AsheryLeader')) {
      approveUrl = `/Action/RejectDevotee/${encodedId}`;
    } else if (RoleName.includes('BhaktiVriksha')) {
      approveUrl = `/Action/RejectDevotee/${encodedId}`;
    }
    setPageLoading(true);       // ✅ start page loader
    modals.closeAll();
    router.put(
      approveUrl,
      { remarks: reason },
      {
        onSuccess: () => {
          modals.closeAll();
           setPageLoading(false);
        },
        onError: () => {
          setPageLoading(false);
        },
      }
    );
  };

  const handleDelete = (row: any) => {
  const idVal = row.user_id ?? row.id;
  if (!idVal) return;

  modals.openConfirmModal({
    title: 'Confirm Delete',
    children: (
      <Text size="sm">Are you sure you want to delete this devotee?</Text>
    ),
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' },

    onConfirm: () => {
      setPageLoading(true);       // ✅ start page loader
      modals.closeAll();

      router.delete(`/Action/deleteDevotee/${idVal}`, {
        onSuccess: () => {
          setPageLoading(false);  // ✅ stop loader
        },
        onError: () => {
          setPageLoading(false);
        },
      });
    },
  });
};

  // const handleDelete = (row: any) => {
  //   const idVal = row.user_id ?? row.id;
  //   if (!idVal) return;

  //   modals.openConfirmModal({
  //     title: 'Confirm Delete',
  //     children: isDeleting ? (
  //       <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
  //         <Loader size="md" color="red" />
  //         <Text size="sm" mt="md" color="dimmed">Deleting devotee...</Text>
  //       </Box>
  //     ) : (
  //       <Text size="sm">Are you sure you want to delete this devotee?</Text>
  //     ),
  //     labels: { confirm: 'Delete', cancel: 'Cancel' },
  //     confirmProps: { color: 'red', disabled: isDeleting },
  //     cancelProps: { disabled: isDeleting },
  //     onConfirm: () => {
  //       setIsDeleting(true);
  //       router.delete(`/Action/deleteDevotee/${idVal}`, {
  //         onSuccess: () => {
  //           setIsDeleting(false);
  //           modals.closeAll();
  //         },
  //         onError: () => {
  //           setIsDeleting(false);
  //         },
  //       });
  //     },
  //   });
  // };

  const ActionItemsWithPermissions = () => {
    const ApproveLink = () => (
      <Menu.Item onClick={handleApprove}>
        <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
          <IconCheck color="green" style={{ marginRight: 8 }} size={14} /> Approve
        </Box>
      </Menu.Item>
    );

    const RejectLink = () => (
      <Menu.Item onClick={() => handleReject(row, handleRejectAction)}>
        <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
          <IconX color="red" style={{ marginRight: 8 }} size={14} /> Reject
        </Box>
      </Menu.Item>
    );

    const idVal = row.user_id;
    const encodedId = idVal !== '' ? btoa(String(idVal)) : '';

    const EditLink = () => (
      <Menu.Item onClick={() => router.visit(`/Action/SuperAdminDevoteeDetails/${encodedId}`)}>
        <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
          <IconPencil color="red" style={{ marginRight: 8 }} size={14} /> Edit
        </Box>
      </Menu.Item>
    );

    const DeleteLink = () => (
      <Menu.Item onClick={() => handleDelete(row)} color="red">
        <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
          <IconTrash style={{ marginRight: 8 }} size={14} /> Delete
        </Box>
      </Menu.Item>
    );

    const permissions: any = {
      SuperAdmin_P: () => (
        <>
          <EditLink />
          <DeleteLink />
        </>
      ),
      SuperAdmin_N: () => (
        <>
          <EditLink />
          <DeleteLink />
        </>
      ),
      SuperAdmin_R: () => (
        <>
          <ApproveLink />
          <EditLink />
          <DeleteLink />
        </>
      ),
      SuperAdmin_A: () => (
        <>
          <RejectLink />
          <EditLink />
          <DeleteLink />
        </>
      ),
      SuperAdmin_S: () => (
        <>
           <ApproveLink />
          <RejectLink /> 
          <EditLink />
          <DeleteLink />
        </>
      ),
      Admin_R: () => (
        <>
           <ApproveLink />
          <EditLink />
        </>
      ),
      Admin_P: () => (
        <>
           <ApproveLink />
          <EditLink />
        </>
      ),
      Admin_N: () => (
        <>
           <ApproveLink />
          <EditLink />
        </>
      ),
      Admin_A: () => (
        <>
          /* <RejectLink />
          <EditLink />
        </>
      ),
      Admin_S: () => (
        <>
           <ApproveLink />
          <RejectLink /> 
          <EditLink />
        </>
      ),
      AsheryLeader_A: () => (
        <>
          <RejectLink /> 
          <EditLink />
          <DeleteLink />
        </>
      ),
      AsheryLeader_P: () => (
        <>
          <RejectLink /> 
          <EditLink />
          <DeleteLink />
        </>
      ),
      AsheryLeader_N: () => (
        <>
          <RejectLink /> 
          <EditLink />
          <DeleteLink />
        </>
      ),
      AsheryLeader_R: () => (
        <>
          <ApproveLink /> 
          <EditLink />
        </>
      ),
      AsheryLeader_S: () => (
        <>
          <ApproveLink />
          <RejectLink />
          <EditLink />
        </>
      ),
      BhaktiVriksha_S: () => (
        <>
           <ApproveLink />
          <RejectLink /> 
          <EditLink />
        </>
      ),
      BhaktiVriksha_P: () => (
        <>
           <ApproveLink />
          <RejectLink /> 
          <EditLink />
        </>
      ),
      BhaktiVriksha_N: () => (
        <>
           <ApproveLink />
          <RejectLink /> 
          <EditLink />
        </>
      ),
      BhaktiVriksha_A: () => (
        <>
          <RejectLink /> 
          <EditLink />
        </>
      ),
      BhaktiVriksha_R: () => (
        <>
          <ApproveLink />
          <EditLink />
        </>
      ),
    };

    if (permissions[`${RoleName[1]}_${row.status_code as string}`]) {
      const ActionLinks = permissions[`${RoleName[1]}_${row.status_code as string}`];
      return <ActionLinks />;
    }
    if (permissions[`${RoleName[0]}_${row.status_code as string}`]) {
      const ActionLinks = permissions[`${RoleName[0]}_${row.status_code as string}`];
      return <ActionLinks />;
    }
    return <></>;
  };

  return (
    <>

    {pageLoading && (
      <Box
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader size="lg" color="red" />
      </Box>
    )}

      <Menu>
        <Menu.Target>
          <Button variant="subtle">
            <IconDotsVertical size={16} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={openModal}>
            <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
              <IconEye style={{ marginRight: 8, color: '#ff8809' }} size={14} /> View
            </Box>
          </Menu.Item>
          <ActionItemsWithPermissions />
        </Menu.Dropdown>
      </Menu>

      <RegistrationDetailsModal opened={modalOpened} onClose={() => setModalOpened(false)} data={row} />
    </>
  );
}

export default TableAction;
