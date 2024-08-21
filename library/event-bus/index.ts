import { Data, QueryParams } from '../components/datatable/DataTable.vue.d';
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
  'data-table:update-selected-data': TableEvent & { data?: Data[] };
  'data-table:clear-selected-data': TableEvent;

  'work-calendar:reset-month': unknown;
  'work-calendar:reset-year': unknown;
};

const eventBus = mitt<Events>();

export default eventBus;
