import { Data, QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import mitt from 'mitt';

export type TableEvent = {
  tableName?: string;
};

export type Events = {
  'filterTable': TableEvent & {
    filter: QueryParams;
  };
  'searchTable': TableEvent & {
    search: string | undefined;
  };
  'updateTable': TableEvent;
  'showFilter': TableEvent & { show: boolean };
  'hideOverlay': unknown;
  'update:selectedData': TableEvent & { data?: Data[] };
  'clear:selectedData': TableEvent;
};

const eventBus = mitt<Events>();

export default eventBus;
