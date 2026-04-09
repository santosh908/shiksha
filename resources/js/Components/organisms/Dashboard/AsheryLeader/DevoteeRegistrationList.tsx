import { useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Anchor, Breadcrumbs, Button, Flex, Text } from '@mantine/core';
import { RegistrationRequest } from './DevoteeRegistrationList.type';
import TableAction from '@/Components/atom/TableActionMenu/TableAction';
import StatusBadge from '@/Components/molecules/Status/StatusBaged';
import { MRT_ColumnDef } from 'mantine-react-table';
import DataTableWithAction from '@/Components/molecules/MantineReactTable/DataTableWithAction';
import useUserStore from '@/Store/User.store';
import { modals } from '@mantine/modals';

type PaginatedDevotees = {
  data: RegistrationRequest[];
  current_page: number;
  per_page: number;
  total?: number | null;
  last_page?: number | null;
  from: number | null;
  to: number | null;
  has_more_pages?: boolean;
};

function isPaginated(
  v: RegistrationRequest[] | PaginatedDevotees | undefined
): v is PaginatedDevotees {
  return v != null && typeof v === 'object' && 'data' in v && Array.isArray((v as PaginatedDevotees).data);
}

export default function DevoteeRegistrationList() {
  const { props } = usePage<{ devotees: RegistrationRequest[] | PaginatedDevotees }>();
  const raw = props.devotees;
  const allDevotees = isPaginated(raw) ? raw.data : raw || [];
  const pagination = isPaginated(raw) ? raw : null;
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('search') ?? '';
  });
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    if (typeof window === 'undefined') return 'all';
    return new URLSearchParams(window.location.search).get('status') ?? 'all';
  });
  const [perPage, setPerPage] = useState<number>(pagination?.per_page ?? 50);
  const { roles: RoleName } = useUserStore();
  const didHydrateFiltersRef = useRef(false);

  useEffect(() => {
    if (pagination?.per_page && pagination.per_page !== perPage) {
      setPerPage(pagination.per_page);
    }
  }, [pagination?.per_page, perPage]);

  const fetchList = (params: { page?: number; per_page?: number; search?: string; status?: string }) =>
    router.get(
      '/Action/devoteeList',
      {
        page: params.page ?? pagination?.current_page ?? 1,
        per_page: params.per_page ?? perPage,
        search: params.search ?? searchQuery,
        status: params.status ?? statusFilter,
      },
      { preserveState: true, preserveScroll: true, only: ['devotees'] }
    );

  useEffect(() => {
    // Avoid duplicate request: initial page already comes from server-side render.
    if (!didHydrateFiltersRef.current) {
      didHydrateFiltersRef.current = true;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchList({ page: 1, search: searchQuery, status: statusFilter });
    }, 350);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const items = [{ title: 'Dashboard', href: `/${RoleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const dateFormate = (dateString: string) => {
    const dt = new Date(dateString);
    return dt.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
  };

  const dateTimeFormat = (dateString: string) => {
    const dt = new Date(dateString);
    return dt.toLocaleString('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleApproveReject = (selectedRows: RegistrationRequest[], action: 'approve' | 'reject') => {
    const selectedIds = selectedRows
      .map((row: any) => row.ProfilePrID ?? row.profileprid ?? row.profile_pr_id ?? row.id)
      .filter((id) => id !== null && id !== undefined && id !== '');
    if (selectedIds.length === 0) {
      console.warn('No valid devotee rows selected');
      return;
    }
    const idsString = selectedIds.join(',');
    const encodedId = btoa(idsString);
    let approveUrl = `/ApproveDevotee/${encodedId}`;
    if (action === 'approve') {
      if (RoleName.includes('SuperAdmin')) {
        approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
      } else if (RoleName.includes('AsheryLeader')) {
        approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
      } else if (RoleName.includes('BhaktiBhekshuk') || RoleName.includes('BhaktiVriksha')) {
        approveUrl = `/Action/ApproveBulkDevotee/${encodedId}`;
      }
    } else {
      if (RoleName.includes('SuperAdmin')) {
        approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
      } else if (RoleName.includes('AsheryLeader')) {
        approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
      } else if (RoleName.includes('BhaktiBhekshuk') || RoleName.includes('BhaktiVriksha')) {
        approveUrl = `/Action/RejectBulkDevotee/${encodedId}`;
      }
    }

    router.put(
      approveUrl,
      {},
      {
        onSuccess: () => {
          // Refresh current list with the same filters/pagination
          fetchList({
            page: pagination?.current_page ?? 1,
            per_page: perPage,
            search: searchQuery,
            status: statusFilter,
          });
        },
        onError: () => {
          console.error('Bulk action failed. Please refresh and try again.');
        },
      }
    );
  };
  
  const PAGE_SIZE = 10;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<RegistrationRequest>[]>(
    () => [
      {
        id: 'ashery_leader_name',
        accessorKey: 'ashery_leader_name',
        header: 'Ashery Leader',
        accessorFn: (row: any) => row.ashray_leader_initiated_name || row.ashery_leader_name,
      },
      {
        id: 'bhakti_bhikshuk_name',
        accessorKey: 'bhakti_bhikshuk_name',
        header: 'Bhakti Vriksha Leader',
        accessorFn: (row: any) => row.bhakti_leader_initiated_name || row.bhakti_bhikshuk_name,
      },
      {accessorKey:'login_id',header:'Login ID'},
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
        accessorFn: (row: any) => dateTimeFormat(row.created_at),
      },
      {
        id: 'status_code',
        accessorKey: 'status_code',
        header: 'Status',
        // CRITICAL FIX: Return the actual status value for filtering/sorting
        accessorFn: (row: any) => row.status_code,
        // Use Cell to render the StatusBadge component
        Cell: ({ row }: any) => (
          <>
          <StatusBadge status={row.original.status_code} StatusRemarks={row.original.remarks} />
          </>
        ),
      },
      {
        id: 'actions',
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: any) => <TableAction row={row.original} />,
      },
    ],
    []
  );


  return (
    <Flex direction="column" gap="sm" style={{ paddingLeft: '20px' }}>
      <Breadcrumbs py={25}>
        {items}
        <label>Devotee List</label>
      </Breadcrumbs>
      {/* Table for Submitted Registrations */}
      <Text size="lg" fw={700} mt={30} mb={10}>
        Submitted Devotees
      </Text>
      <DataTableWithAction 
        data={allDevotees} 
        columnsFields={columns} 
        PageSize={PAGE_SIZE} 
        onApproveReject={handleApproveReject}
        serverMode
        serverSearch={searchQuery}
        serverStatus={statusFilter}
        serverPerPage={perPage}
        serverCurrentPage={pagination?.current_page ?? 1}
        onServerSearchChange={setSearchQuery}
        onServerStatusChange={setStatusFilter}
        onServerPerPageChange={(next) => {
          setPerPage(next);
          fetchList({ page: 1, per_page: next });
        }}
        onExportAllRows={() => {
          const params = new URLSearchParams({
            export: '1',
            per_page: String(perPage),
            search: searchQuery,
            status: statusFilter,
          });
          window.location.href = `/Action/devoteeList?${params.toString()}`;
        }}
        hideLocalPagination
      />
      {pagination != null && (pagination.has_more_pages || (pagination.current_page ?? 1) > 1) ? (
        <Flex justify="space-between" mt="md" align="center" gap="md">
          <Button
            variant="light"
            disabled={(pagination.current_page ?? 1) <= 1}
            onClick={() => fetchList({ page: (pagination.current_page ?? 1) - 1 })}
          >
            Previous
          </Button>
          <Text size="sm" c="dimmed">
            Page {pagination.current_page}
            {pagination.from != null && pagination.to != null ? ` · rows ${pagination.from}–${pagination.to}` : ''}
            {pagination.total != null ? ` of ${pagination.total}` : ''}
          </Text>
          <Button
            variant="light"
            disabled={!pagination.has_more_pages}
            onClick={() => fetchList({ page: (pagination.current_page ?? 1) + 1 })}
          >
            Next
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
}