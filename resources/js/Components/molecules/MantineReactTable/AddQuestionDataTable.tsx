import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_Row,
} from 'mantine-react-table';
import { Box, Button, Pagination, useMantineTheme, Select } from '@mantine/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

// CSV configuration
const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

interface ExamItem {
  id: number;
  exam_name: string;
}

const AddQuestionDataTable = <T,>({
  columnsFields,
  data = [],
  toolbarBtns,
  PageSize,
  options = {},
  onAddToExam,
  selectedExam,
}: {
  columnsFields: any;
  data?: T[];
  toolbarBtns?: React.ReactNode;
  PageSize: number;
  options?: any;
  onAddToExam?: (selectedRows: T[], examId: string) => void;
  selectedExam: string; // Expect selectedExam here
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PageSize;
    return filteredData.slice(startIndex, startIndex + PageSize);
  }, [filteredData, currentPage, PageSize]);

  const totalPages = Math.ceil(filteredData.length / PageSize);

  const handleAddToExamAction = (selectedRows: T[], examId: string) => {
    if (selectedRows.length === 0) {
      alert("No questions selected");
      return;
    }

    // Call the parent function
    if (onAddToExam) {
      onAddToExam(selectedRows, examId);
    }
  };

  const flattenAndFilterData = (rows: T[], columns: any) => {
    const allowedKeys = columns.map((col: any) => col.accessorKey);
    return rows.map((row) => {
      const flattenedRow: Partial<T> = {};
      for (const key in row) {
        if (allowedKeys.includes(key)) {
           //@ts-ignore
          flattenedRow[key] =
            typeof row[key] === 'object' && row[key] !== null
              ? JSON.stringify(row[key])
              : row[key];
        }
      }
      return flattenedRow;
    });
  };

   //@ts-ignore
  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData = flattenAndFilterData(
      rows.map((row) => row.original),
      columnsFields
    );
     //@ts-ignore
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportAllRows = () => {
    const flattenedData = flattenAndFilterData(filteredData, columnsFields);
     //@ts-ignore
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns: [
      {
        accessorKey: 'id',
        header: '#',
        Cell: ({ row }) => {
          const serialNumber = (currentPage - 1) * PageSize + row.index + 1;
          return <span>{serialNumber}</span>;
        },
      },
      ...columnsFields,
    ],
     //@ts-ignore
    data: paginatedData,
    enableRowSelection: true,
    enablePagination: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',

    renderTopToolbarCustomActions: ({ table }) => (
      <Box className="space-y-4 w-full">
        {/* Exam Selection Section - Only visible when rows are selected */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-60 rounded-lg">
            {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
              <div className="w-full md:w-auto sm:w-full mt-4">
                 <Button
                 //@ts-ignore
                  onClick={() => handleAddToExamAction(table.getSelectedRowModel().rows.map(row => row.original), selectedExam)}
                  //disabled={!selectedExam || table.getSelectedRowModel().rows.length === 0}
                  className="bg-blue-600 text-white"
                >
                  Add to Exam
                </Button>
              </div>
            )}
          </div>
        {/* Export Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            disabled={filteredData.length === 0}
            onClick={handleExportAllRows}
            variant="outline"
          >
            Export All Rows
          </Button>
          <Button
            disabled={paginatedData.length === 0}
            //@ts-ignore
            onClick={() => handleExportRows(table.getRowModel().rows)}
            variant="outline"
          >
            Export Page Rows
          </Button>
          <Button
            disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
             //@ts-ignore
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            variant="outline"
          >
            Export Selected Rows
          </Button>
        </div>
      </Box>
    ),

    mantineTableProps: {
      striped: true,
    },
  });

  return (
    <div className="">
      {/* Search Box */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Global Search..."
        className="w-full p-2 border rounded"
      />

      {/* Table */}
      <MantineReactTable table={table} />

      {/* Custom Pagination */}
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={(page:any) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AddQuestionDataTable;