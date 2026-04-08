import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_Row,
  type MRT_RowData,
} from 'mantine-react-table';
import { Box, Button, Pagination, useMantineTheme } from '@mantine/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { IconDownload } from '@tabler/icons-react';

// CSV configuration
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: false,
});

const DataTable = <T extends MRT_RowData>({
  columnsFields,
  data = [],
  toolbarBtns,
  PageSize,
  options = {},
}: {
  columnsFields: any;
  data?: T[];
  toolbarBtns?: React.ReactNode;
  PageSize: number;
  options?: any;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(PageSize); // Add state for page size

  const theme = useMantineTheme();

  // Filter data based on the search query
  const filteredData = useMemo(() => {
    return !searchQuery
      ? data
      : data.filter((row) =>
        //@ts-ignore
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
  }, [data, searchQuery]);

  // Reset currentPage only when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Utility function to format date to dd/MM/yyyy
  const dateFormate = (dateString: unknown) => {
    const raw = String(dateString ?? '').trim();
    if (!raw || raw === '0000-00-00' || raw === '0000-00-00 00:00:00') return '-';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return raw;
    if (/^\d{10}$/.test(raw)) {
      const tsDate = new Date(Number(raw) * 1000);
      return Number.isNaN(tsDate.getTime()) ? '-' : tsDate.toLocaleDateString('en-GB');
    }
    if (/^\d{13}$/.test(raw)) {
      const tsDate = new Date(Number(raw));
      return Number.isNaN(tsDate.getTime()) ? '-' : tsDate.toLocaleDateString('en-GB');
    }
    // Legacy non-ISO date formats (dd-mm-yyyy or dd/mm/yyyy)
    const dmyMatch = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const month = Number(dmyMatch[2]);
      const year = Number(dmyMatch[3]);
      const parsed = new Date(year, month - 1, day);
      if (
        !Number.isNaN(parsed.getTime()) &&
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed.toLocaleDateString('en-GB');
      }
    }
    const cDt = new Date(raw);
    if (Number.isNaN(cDt.getTime())) return '-';
    return cDt.toLocaleDateString('en-GB');
  };

  const table = useMantineReactTable({
    columns: [
      {
        accessorKey: 'id',
        header: '#',
        textalign: 'center',
        size: 50,
        Cell: ({ row }) => {
          const serialNumber = (currentPage - 1) * pageSize + row.index + 1;
          return (
            <span
              style={
                row.getIsSelected() // Apply background only if the row is selected
                  ? { backgroundColor: 'yellow', color: 'black' }
                  : {}
              }
            >
              {serialNumber}
            </span>
          );
        },
      },
      ...columnsFields.map((column: any) => ({
        ...column,
        // Respect any custom Cell renderer provided by the column. If none is provided,
        // fall back to a simple wrapper that renders the cell value. This fixes an
        // issue where component Cell renderers (for example an Edit/Save UI inside a
        // Cell) were being overwritten and not displayed.
        Cell:
          column.Cell ||
          (({ row, cell }: { row: MRT_Row<T>; cell: any }) => (
            <div
              style={
                row.getIsSelected() // Apply background only if the row is selected
                  ? { backgroundColor: 'yellow', color: 'black', padding: '2px 4px', borderRadius: '4px' }
                  : { padding: '2px 4px' }
              }
            >
              {cell.getValue()}
            </div>
          )),
      })),
    ],
    //@ts-ignore
    data: paginatedData, // Use paginated data
    enableRowSelection: true,
    enablePagination: false, // Disable built-in pagination
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',

    renderTopToolbarCustomActions: ({ table }) => (
      <Box style={{ display: 'flex', gap: '12px', padding: '4px', flexWrap: 'wrap' }}>
        <Button
          disabled={filteredData.length === 0}
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

    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withColumnBorders: true,
      withRowBorders: true,
    },
  });

// Create header mapping from accessor keys to display headers
const createHeaderMapping = (columns: any) => {
  const mapping: { [key: string]: string } = {};
  columns.forEach((col: any) => {
    if (col.accessorKey) {
      mapping[col.accessorKey] = col.header || col.accessorKey;
    }
  });
  return mapping;
};

// Utility function to flatten data for export with proper headers.
// It supports both accessorKey and computed accessorFn columns.
const flattenAndFilterData = (rows: T[], columns: any) => {
  const exportableColumns = columns.filter((col: any) => !!col.accessorKey || typeof col.accessorFn === 'function');

  return rows.map((row) => {
    const flattenedRow: { [key: string]: any } = {};

    exportableColumns.forEach((col: any) => {
      const headerName = col.header || col.accessorKey || 'Column';
      let value: any = '';

      if (typeof col.accessorFn === 'function') {
        value = col.accessorFn(row);
      } else if (col.accessorKey) {
        value = row[col.accessorKey];
      }

      const keyForDateCheck = String(col.accessorKey || headerName).toLowerCase();
      const isDateField =
        keyForDateCheck.includes('date') ||
        keyForDateCheck === 'dob' ||
        (typeof value === 'string' && !isNaN(Date.parse(value)));

      flattenedRow[headerName] =
        isDateField && value
          ? dateFormate(value)
          : typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;
    });

    return flattenedRow;
  });
};


  // Export Handlers
  //@ts-ignore
  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData = flattenAndFilterData(
      rows.map((row) => row.original),
      columnsFields
    );
    
    // Extract headers from columns
    const headerMapping = createHeaderMapping(columnsFields);
    const headers = Object.values(headerMapping);
    
    const configWithHeaders = {
      ...csvConfig,
      columnHeaders: headers,
      useKeysAsHeaders: true, // Now we can use keys because they ARE the headers
    };
    
    //@ts-ignore
    const csv = generateCsv(configWithHeaders)(rowData);
    download(configWithHeaders)(csv);
  };

  const handleExportAllRows = () => {
    const flattenedData = flattenAndFilterData(filteredData, columnsFields); // Use filtered data
    
    // Extract headers from columns
    const headerMapping = createHeaderMapping(columnsFields);
    const headers = Object.values(headerMapping);
    
    const configWithHeaders = {
      ...csvConfig,
      columnHeaders: headers,
      useKeysAsHeaders: true, // Now we can use keys because they ARE the headers
    };
    
    //@ts-ignore
    const csv = generateCsv(configWithHeaders)(flattenedData);
    download(configWithHeaders)(csv);
  };

  return (
    <div >
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
            padding-left: 12px !important; /* or margin-left */
          }
        `
      }} />
      
      {/* Search Box */}
      <Box style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search..."
          style={{
            padding: '0.5rem',
            width: '100%',
            border: `1px solid ${theme.colors.gray[4]}`,
            borderRadius: '5px',
          }}
        />
      </Box>

      {/* Page Size Selector */}
      <Box style={{ marginBottom: '1rem' }}>
        <label htmlFor="pageSize">Rows per page: </label>
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
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
      </Box>

      {/* Table */}
      <MantineReactTable  table={table} />

      {/* Custom Pagination */}
      <Pagination
        total={totalPages} // Use totalPages calculated from filteredData
        value={currentPage}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DataTable;