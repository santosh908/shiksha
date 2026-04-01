import { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Anchor, Breadcrumbs, Flex,Text } from '@mantine/core';
import { RegistrationRequest } from './DevoteeRegistrationList.type';
import TableAction from '@/Components/atom/TableActionMenu/TableAction';
import StatusBadge from '@/Components/molecules/Status/StatusBaged';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { MRT_ColumnDef } from 'mantine-react-table';
import useUserStore from '@/Store/User.store';
import { modals } from '@mantine/modals';
import DataTableWithAction from '@/Components/molecules/MantineReactTable/DataTableWithAction';

export default function BhaktiBhikshukDevoteeList() {
  const { props } = usePage<{ RegistrationRequest: unknown }>();
  //const registrationRequests = (props.RegistrationRequest as RegistrationRequest[]) || [];

  const [registrationRequests, setRegistrationRequests] = useState(
    (props.RegistrationRequest as RegistrationRequest[]) || []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const { roles: RoleName } = useUserStore();

  
  const items = [{ title: 'Dashboard', href: `/${RoleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const dateFormate = (dateString: string) =>{
    const dt = dateString; // The date string
    const cDt = new Date(dt);
    const cDate = cDt.toLocaleDateString('en-GB');
    return cDate;
  } 
  const PAGE_SIZE = 10;
  const sortedDevotees = useMemo(() => {
    const devotees = props.devotees || [];
    return [...registrationRequests].sort((a, b) => {
      // Assuming 'pending' status_code is 'P' and 'approved' is 'A'
      if (a.status_code === 'S' && b.status_code !== 'S') return -1;
      if (a.status_code !== 'S' && b.status_code === 'S') return 1;
      if (a.status_code === 'A' && b.status_code !== 'A') return -1;
      if (a.status_code !== 'A' && b.status_code === 'A') return 1;
      return 0;
    });
  }, [props.registrationRequests]);

const handleApproveReject = (selectedRows: RegistrationRequest[], action: 'approve' | 'reject') => {
    const selectedIds = selectedRows.map(row => row.ProfilePrID);
    const idsString = selectedIds.join(',');
    const encodedId = btoa(idsString);

    const modalTitle = action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection';
    const modalMessage = action === 'approve' 
      ? 'Are you sure you want to approve the selected devotees?' 
      : 'Are you sure you want to reject the selected devotees?';

    modals.openConfirmModal({
      title: modalTitle,
      children:  <Text size="sm">{modalMessage}</Text>,
      labels: { confirm: action === 'approve' ? 'Approve' : 'Reject', cancel: 'Cancel' },
      onConfirm: () => {
        let approveUrl = `/ApproveDevotee/${encodedId}`;
        if(action === 'approve')
        {
          if (RoleName.includes('SuperAdmin')) {
            approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
          } else if (RoleName.includes('AsheryLeader')) {
            approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
          } else if (RoleName.includes('BhaktiBhekshuk')) {
            approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
          }
        }
        else{
          if (RoleName.includes('SuperAdmin')) {
            approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
          } else if (RoleName.includes('AsheryLeader')) {
            approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
          } else if (RoleName.includes('BhaktiBhekshuk')) {
            approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
          }
        }

        router.put(
          approveUrl,
          {},
          {
            onSuccess: () => {
              modals.closeAll(); // Close the modal upon success
              const updatedRequests = registrationRequests.map(request => {
                if (selectedIds.includes(request.ProfilePrID)) {
                    return {
                        ...request,
                        status_code: action === 'approve' ? 'A' : 'R',
                    };
                }
                return request;
            });
            setRegistrationRequests(updatedRequests);
            },
          }
        );
      },
      onCancel: () => {
        modals.closeAll(); // Explicitly close the modal on cancel
      },
      onClose: () => {
        modals.closeAll();
      },
    });
  };
  

//@ts-ignore
  const columns = useMemo<MRT_ColumnDef<RegistrationRequest>[]>(
    () => [
      {
        id: 'ashery_leader_name',
        accessorKey: 'ashery_leader_name',
        header: 'Ashray Leader Name',
        accessorFn: (row: any) => row.ashray_leader_initiated_name || row.ashery_leader_name,
      },
      {
        id: 'bhakti_bhikshuk_name',
        accessorKey: 'bhakti_bhikshuk_name',
        header: 'Bhakti Vriksha Leader Name',
        accessorFn: (row: any) => row.bhakti_leader_initiated_name || row.bhakti_bhikshuk_name,
      },
      {accessorKey:'login_id',header:'Login ID'},
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'Initiated_name', header: 'Initiated Name' },
      { id: 'email', accessorKey: 'email', header: 'Email' },
      { id: 'contact_number', accessorKey: 'contact_number', header: 'Contact Number' },
      { 
        id: 'dob', 
        accessorKey: 'dob', 
        header: 'D.O.B.' ,
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
        accessorFn: (row: any) => <StatusBadge status={row.status_code} StatusRemarks={row.remarks} />,
      },
      {
        id: 'actions',
        accessorKey: '', // No direct field to access, but we still need an id
        header: 'Actions',
        accessorFn: (row: any) => <TableAction row={row} />,
      },
    ],
    [currentPage],
  );

  return (
    <Flex direction="column" gap="sm" style={{ paddingLeft: '20px' }}>
      <Breadcrumbs py={25}>
        {items}
        <label>Bhakti Vriksha Devotee List</label>
      </Breadcrumbs>
          <DataTableWithAction 
            key={JSON.stringify(sortedDevotees)}
            data={sortedDevotees}
            columnsFields={columns}
            PageSize={PAGE_SIZE}
            onApproveReject={handleApproveReject}
          />
      </Flex>
  );
}
