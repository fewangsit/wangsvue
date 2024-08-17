import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import mitt from 'mitt';

export type TableEvent = {
  tableName: string;
};

type Events = {
  filterTable: TableEvent & {
    filter: QueryParams;
  };
  searchTable: TableEvent & {
    search: string | undefined;
  };
  updateTable: TableEvent;
  showFilter: TableEvent & { show: boolean };
};

const eventBus = mitt<Events>();

export default eventBus;
