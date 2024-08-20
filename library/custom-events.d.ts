import { Data } from 'lib/components/datatable/DataTable.vue.d';

export type DownloadEvent = CustomEvent<{
  fileName: string;
  tableName: string;
}>;

export type UpdateTableEvent = CustomEvent<{
  tableName?: string;
}>;

declare global {
  interface WindowEventMap {
    'downloadExcel': DownloadEvent;
    'fetchAllDataResolved': CustomEvent<Data[]>;
    'fetchAllData': CustomEvent<string>; // Param: The table name
    'updateTotalRecords': CustomEvent<{ total: number; name: string }>;
    'disableBulkAction': CustomEvent<boolean>;
    'data-table:update': UpdateTableEvent;
    'showingToast:severity': CustomEvent<string>;
  }
}
