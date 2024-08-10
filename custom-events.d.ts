import { SidebarEvent } from '@/types/sidebarEvent.type';
import { Data } from './components/DataTable/DataTable.vue.d';
import { ScanPayload } from './components/ButtonSearchByScan/ButtonSearchByScan.vue.d';

export type DownloadEvent = CustomEvent<{
  fileName: string;
  tableName: string;
}>;

export type ScanEvent = CustomEvent<
  Partial<ScanPayload> & { tableName?: string }
>;

export type UpdateTableEvent = CustomEvent<{
  tableName?: string;
}>;

declare global {
  interface WindowEventMap {
    downloadExcel: DownloadEvent;
    fetchAllDataResolved: CustomEvent<Data[]>;
    fetchAllData: CustomEvent<string>; // Param: The table name
    // Older: updateTotalRecords: CustomEvent<number>;
    updateTotalRecords: CustomEvent<{ total: number; name: string }>;
    disableBulkAction: CustomEvent<boolean>;
    groupSidebarChanged: SidebarEvent;
    categorySidebarChanged: SidebarEvent;
    searchByScan: ScanEvent;
    updateTable: UpdateTableEvent;
  }
}
