import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import mitt from 'mitt';

type Events = {
  filterTable: {
    tableName: string;
    filter: QueryParams;
  };
  searchTable: {
    tableName: string;
    search: string | undefined;
  };
};

const eventBus = mitt<Events>();

export default eventBus;
