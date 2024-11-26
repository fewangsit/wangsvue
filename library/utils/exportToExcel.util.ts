import * as XLSX from 'xlsx';

export interface ITable {
  headers: string[];
  data: Record<string, unknown>[];
  tableName: string;
  tableTitle?: string;
}

interface IExcelOptions {
  tables: ITable[];
  fileName: string;
  additionalTexts?: string[];
}

/**
 * Function to export excel, previously this only handle for 1 table in 1 file
 * Now this function has been refactored to be able to format multiple tables in 1 file without altered its original functionality
 * However, the way to called this function is changing a little bit (look for component DataTable and find usage of util `exportToExcel`)
 *
 * @param options - param that contain tables and filename for excel
 */
const exportToExcel = async (options: IExcelOptions): Promise<void> => {
  const workbook = XLSX.utils.book_new();
  const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  let currentRow = 0;

  // Loop through each table
  options.tables.forEach((table) => {
    if (table.tableTitle) {
      XLSX.utils.sheet_add_aoa(workSheet, [[table.tableTitle]], {
        origin: { r: currentRow, c: 0 },
      });
      currentRow += 1; // Add padding
    }

    // Add table headers
    const heading = [table.headers];
    XLSX.utils.sheet_add_aoa(workSheet, heading, {
      origin: { r: currentRow, c: 0 },
    });

    // Add table data
    XLSX.utils.sheet_add_json(workSheet, table.data, {
      origin: { r: currentRow + 1, c: 0 },
      skipHeader: true,
    });

    // Update currentRow to start below the current table
    currentRow += table.data.length + 3; // Add padding
  });

  // Add additional text below all tables
  if (options.additionalTexts) {
    currentRow += 1; // Add padding

    options.additionalTexts.forEach((text, index) => {
      XLSX.utils.sheet_add_aoa(workSheet, [[text]], {
        origin: { r: currentRow + index, c: 0 }, // Add text row by row
      });
    });
  }

  XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');
  const timestamps = new Date()
    .toLocaleDateString('en-gb', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replaceAll('/', '');

  XLSX.writeFile(workbook, `${options.fileName}-${timestamps}.xlsx`);
};

export default exportToExcel;
