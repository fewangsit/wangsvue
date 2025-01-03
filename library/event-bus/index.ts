import { Data, QueryParams } from '../components/datatable/DataTable.vue.d';
import { ToastParams } from '../utils/toast.util';
import mitt from './mitt';

export type TableEvent = {
  tableName?: string;
};

export type Events = {
  'data-table:apply-filter': TableEvent & {
    filter: QueryParams;
  };

  'search-table': TableEvent & {
    search: string | undefined;
  };

  'show-filter': TableEvent & { show: boolean };

  'multi-select:hide-overlay': unknown;

  'button-download:multi-tables': {
    table: {
      headers: string[];
      data: Record<string, unknown>[];
      tableName: string;
      tableTitle?: string;
    };
  };

  'data-table:update': TableEvent;
  'data-table:download': TableEvent & {
    fileName: string;
    multiTableNames?: string[];
    additionalTexts?: (string | string[])[];
  };
  'data-table:select-all-record': TableEvent;
  'data-table:update-total-record': TableEvent & { total: number };
  'data-table:update-selected-data': TableEvent & { data?: Data[] };
  'data-table:clear-selected-data': TableEvent;

  'work-calendar:reset-month': unknown;
  'work-calendar:reset-year': unknown;

  'toast:add': ToastParams;

  'overlay:show': { overlayId: number };
};

const eventBus = mitt<Events>();

export default eventBus;
