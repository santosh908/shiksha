import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_Row,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Box, Button, Group, Pagination, useMantineTheme } from '@mantine/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { IconDownload } from '@tabler/icons-react';

// CSV configuration
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
}); 

// Status code mapping - adjust these values based on your actual database values
const getStatusDisplayText = (statusCode: any): string => {
  if (!statusCode) return '';
  
  const code = String(statusCode).toLowerCase().trim();
  
  // Map numeric codes to display text
  const statusMap: Record<string, string> = {
    '1': 'approved',
    '2': 'partially submitted',
    '3': 'rejected',
    '4': 'pending',
    // Letter codes
    'a': 'approved',
    'n': 'partially submitted',
    'p': 'partially submitted',
    'r': 'rejected',
    's': 'submitted',
    'd': 'deleted',
    // Also handle if already text
    'approved': 'approved',
    'partially submitted': 'partially submitted',
    'rejected': 'rejected',
    'pending': 'pending',
    'submitted': 'submitted',
    'deleted': 'deleted',
    'partially_submitted': 'partially submitted',
  };
  
  return statusMap[code] || code;
};

const DataTableWithAction = <T extends Record<string, any>>({
  columnsFields,
  data = [],
  toolbarBtns,
  PageSize,
  options = {},
  onApproveReject,
}: {
  columnsFields: any;
  data?: T[];
  toolbarBtns?: React.ReactNode;
  PageSize: number;
  options?: any;
  onApproveReject?: (selectedRows: T[], action: 'approve' | 'reject') => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(PageSize);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sorting, setSorting] = useState<any[]>([]);

  const theme = useMantineTheme();

  // Utility function to normalize status for comparison
  const normalizeStatus = (status: any): string => {
    if (!status) return '';
    return getStatusDisplayText(status);
  };

  // Get unique status values from the actual data
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    data.forEach((row) => {
      if (row.status_code) {
        statuses.add(normalizeStatus(row.status_code));
      }
    });
    return Array.from(statuses).sort();
  }, [data]);

  // Filter data based on the search query and status filter
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply status filter first
    if (statusFilter !== 'all') {
      filtered = filtered.filter((row) => 
        normalizeStatus(row.status_code) === statusFilter
      );
    }

    // Apply search query - SEARCH IN RAW DATA + STATUS DISPLAY TEXT
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      filtered = filtered.filter((row) => {
        return Object.entries(row).some(([key, value]) => {
          // Skip null/undefined
          if (value === null || value === undefined) return false;
          
          // Special handling for status_code field
          if (key.toLowerCase() === 'status_code' || key.toLowerCase().includes('status')) {
            const statusDisplayText = getStatusDisplayText(value);
            return statusDisplayText.includes(query);
          }
          
          // Skip React elements and functions
          if (typeof value === 'object' || typeof value === 'function') {
            return false;
          }
          
          // Convert value to string and search
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(query);
        });
      });
    }

    return filtered;
  }, [data, searchQuery, statusFilter]);

  // Sort the filtered data BEFORE pagination
  const sortedAndFilteredData = useMemo(() => {
    if (sorting.length === 0) {
      return filteredData;
    }

    const sorted = [...filteredData];
    const sortConfig = sorting[0];
    const columnId = sortConfig.id;
    const isDesc = sortConfig.desc;

    sorted.sort((rowA, rowB) => {
      let valueA: any;
      let valueB: any;

      // Find the column definition
      const column = columnsFields.find((col: any) => 
        col.id === columnId || col.accessorKey === columnId
      );

      // Get values using accessorFn if available, otherwise use direct access
      if (column?.accessorFn && typeof column.accessorFn === 'function') {
        valueA = column.accessorFn(rowA);
        valueB = column.accessorFn(rowB);
      } else {
        valueA = rowA[columnId];
        valueB = rowB[columnId];
      }

      // Special handling for status_code column
      if (columnId === 'status_code' || columnId.toLowerCase().includes('status')) {
        const statusA = normalizeStatus(valueA);
        const statusB = normalizeStatus(valueB);
        
        // Define status priority for sorting
        const statusPriority: Record<string, number> = {
          'approved': 1,
          'partially submitted': 2,
          'rejected': 3,
          'pending': 4,
        };

        const priorityA = statusPriority[statusA] || 999;
        const priorityB = statusPriority[statusB] || 999;

        if (priorityA !== priorityB) {
          return isDesc ? priorityB - priorityA : priorityA - priorityB;
        }
        return isDesc ? statusB.localeCompare(statusA) : statusA.localeCompare(statusB);
      }

      // Handle null/undefined
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      // String comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return isDesc 
          ? valueB.localeCompare(valueA) 
          : valueA.localeCompare(valueB);
      }

      // Number comparison
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isDesc ? valueB - valueA : valueA - valueB;
      }

      // Default: convert to string and compare
      const strA = String(valueA);
      const strB = String(valueB);
      return isDesc 
        ? strB.localeCompare(strA) 
        : strA.localeCompare(strB);
    });

    return sorted;
  }, [filteredData, sorting, columnsFields]);

  // Reset currentPage when search query, status filter, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sorting]);

  // Pagination logic - Apply to SORTED data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedAndFilteredData.slice(startIndex, startIndex + pageSize);
  }, [sortedAndFilteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / pageSize);

  // Utility function to format date to dd/MM/yyyy
  const dateFormate = (dateString: string) => {
    const dt = dateString;
    const cDt = new Date(dt);
    const cDate = cDt.toLocaleDateString('en-GB');
    return cDate;
  };

  // Utility function to flatten data for export
  const flattenAndFilterData = (rows: T[], columns: any) => {
    const allowedKeys = columns.map((col: any) => col.accessorKey).filter(Boolean);

    return rows.map((row) => {
      const flattenedRow: Partial<T> = {};
      for (const key in row) {

        if (allowedKeys.includes(key)) {
  let value = row[key]; // ✅ must be let

  // Normalize status for export
  if (key === "status_code" || key.toLowerCase().includes("status")) {
    const normalized = getStatusDisplayText(value);

    // Convert N & P → P
    //@ts-ignore
    value = normalized === "partially" ? "P" : normalized;
  }

  const isDateField =
    key.toLowerCase().includes("date") ||
    key.toLowerCase() === "dob" ||
    (typeof value === "string" && !isNaN(Date.parse(value)));
//@ts-ignore
  flattenedRow[key] =
    isDateField && value
      ? dateFormate(value)
      : typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : value;
}

      }
      return flattenedRow;
    });
  };

  const handleExportAllRows = () => {
    const flattenedData = flattenAndFilterData(sortedAndFilteredData, columnsFields);
    //@ts-ignore
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData = rows.map((row) => row.original);
    const flattenedData = flattenAndFilterData(rowData, columnsFields);
    //@ts-ignore
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  const handleAction = (selectedRows: T[], action: 'approve' | 'reject') => {
    if (selectedRows.length === 0) {
      alert("No devotees selected");
      return;
    }

    if (onApproveReject) {
      onApproveReject(selectedRows, action);
    }
  };

  // Enhanced columns - preserve original Cell renderers
  const enhancedColumns = useMemo(() => {
    return columnsFields.map((column: any) => {
      const baseColumn = { ...column };

      // For actions column, keep as is
      if (baseColumn.id === 'actions' || baseColumn.accessorKey === 'actions') {
        return baseColumn;
      }

      // If column already has a custom Cell, preserve it and wrap with selection highlight
      if (baseColumn.Cell) {
        const originalCell = baseColumn.Cell;
        baseColumn.Cell = ({ row, cell, ...rest }: any) => {
          const content = originalCell({ row, cell, ...rest });
          
          return (
            <div
              style={
                row.getIsSelected()
                  ? { backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '4px' }
                  : { padding: '5px' }
              }
            >
              {content}
            </div>
          );
        };
      } else {
        // Add default Cell with selection highlight
        baseColumn.Cell = ({ row, cell }: any) => (
          <div
            style={
              row.getIsSelected()
                ? { backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '4px' }
                : { padding: '5px' }
            }
          >
            {cell.getValue()}
          </div>
        );
      }

      return baseColumn;
    });
  }, [columnsFields]);

  const table = useMantineReactTable({
    columns: [
      {
        accessorKey: 'id',
        header: '#',
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: MRT_Row<T> }) => {
          const serialNumber = (currentPage - 1) * pageSize + row.index + 1;
          return (
            <span
              style={
                row.getIsSelected()
                  ? { backgroundColor: 'yellow', color: 'black', padding: '8px' }
                  : { padding: '8px' }
              }
            >
              {serialNumber}
            </span>
          );
        },
      },
      ...enhancedColumns,
    ],
    //@ts-ignore
    data: paginatedData,
    enableRowSelection: true,
    enablePagination: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableSorting: true,
    enableColumnFilters: false,
    manualSorting: false,
    onSortingChange: setSorting,
    state: {
      sorting,
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box style={{ display: 'flex', gap: '12px', padding: '4px', flexWrap: 'wrap' }}>
        {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
          <Group>
            <Button
              //@ts-ignore
              onClick={() => handleAction(table.getSelectedRowModel().rows.map(row => row.original), 'approve')}
              color="green"
              className="bg-green-600 text-white"
            >
              Approve Selected ({table.getSelectedRowModel().rows.length})
            </Button>
            <Button
              //@ts-ignore
              onClick={() => handleAction(table.getSelectedRowModel().rows.map(row => row.original), 'reject')}
              color="red"
              className="bg-red-600 text-white"
            >
              Reject Selected ({table.getSelectedRowModel().rows.length})
            </Button>
          </Group>
        )}

        <Button
          disabled={sortedAndFilteredData.length === 0}
          onClick={handleExportAllRows}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export All Rows
        </Button>
        <Button
          disabled={paginatedData.length === 0}
          //@ts-ignore
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          //@ts-ignore
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      {/* Add global style override */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .m_4e7aa4ef, .m_4e7aa4f3 {
            padding: 0 !important;
          }
          .mantine-Table-th, .mantine-Table-td {
            padding: 0 !important;
          }
          [data-mantine-color-scheme] .m_4e7aa4ef,
          [data-mantine-color-scheme] .m_4e7aa4f3 {
            padding: 0 !important;
          }
          .mantine-Table-th:first-child,
          .mantine-Table-td:first-child {
            padding-left: 12px !important;
          }
        `
      }} />

      {/* Filter and Search Section */}
      <Box style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status Filter */}
        <Box style={{ flex: '0 0 auto' }}>
          <label htmlFor="statusFilter" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 2.5rem 0.5rem 0.8rem',
              borderRadius: '5px',
              border: `1px solid ${theme.colors.gray[4]}`,
              background: `white url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 0.6rem center`,
              backgroundSize: '16px',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.toUpperCase().replace(/_/g, ' ') === "A"
                  ? "Approved"
                  : ["N", "P"].includes(status.toUpperCase().replace(/_/g, ' '))
                  ? "Partially Submitted"
                  : status.toUpperCase().replace(/_/g, ' ') === "R"
                   ? "Rejected"
                  : status.toUpperCase().replace(/_/g, ' ') === "S"
                   ? "Submitted"
                  : status.toUpperCase().replace(/_/g, ' ') === "D"
                  ? "Deleted"
                  : status.toUpperCase().replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </Box>

        {/* Search Box */}
        <Box style={{ flex: '1 1 300px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search: Name, Email)..."
            style={{
              padding: '0.5rem',
              width: '100%',
              border: `1px solid ${theme.colors.gray[4]}`,
              borderRadius: '5px',
            }}
          />
        </Box>
      </Box>

      {/* Page Size Selector */}
      <Box style={{ marginBottom: '1rem' }}>
        <label htmlFor="pageSize" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
          Rows per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{
            padding: '0.4rem 2rem 0.4rem 0.6rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            background: `white url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 0.6rem center`,
            backgroundSize: '16px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            cursor: 'pointer',
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>

        {/* Show filtered count */}
        <span style={{ marginLeft: '1rem', color: theme.colors.gray[6] }}>
          Showing {sortedAndFilteredData.length} of {data.length} records
          {statusFilter !== 'all' && ` (filtered by: ${statusFilter.toUpperCase().replace(/_/g, ' ')})`}
          {searchQuery && ` (search: "${searchQuery}")`}
        </span>
      </Box>

      {/* Table */}
      <MantineReactTable table={table} />

      {/* Custom Pagination */}
      <Box style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </Box>
    </div>
  );
};

export default DataTableWithAction;