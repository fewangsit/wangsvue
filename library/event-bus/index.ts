import { Data, QueryParams } from 'lib/components/datatable/DataTable.vue';
import { ToastParams } from 'lib/utils/toast.util';
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

  'data-table:update': TableEvent;
  'data-table:download': TableEvent & { fileName: string };
  'data-table:select-all-record': TableEvent;
  'data-table:update-total-record': TableEvent & { total: number };
  'data-table:update-selected-data': TableEvent & { data?: Data[] };
  'data-table:clear-selected-data': TableEvent;

  'detail-task:show': { taskId: string };
  'detail-task:create': { taskId: string };
  'detail-task:update': { taskId: string };
  'detail-task:delete': { taskId: string };

  'work-calendar:reset-month': unknown;
  'work-calendar:reset-year': unknown;

  'toast:add': ToastParams;
};

const eventBus = mitt<Events>();

export default eventBus;
