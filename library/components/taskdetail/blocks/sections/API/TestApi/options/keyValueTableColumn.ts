import { TableColumn } from 'lib/components/datatable/DataTable.vue.d';

export const keyValueTableColum: TableColumn[] = [
  {
    field: 'keys',
    header: 'Key',
    sortable: true,
    reorderable: false,
    fixed: true,
  },
  { field: 'value', header: 'Value', sortable: true, editable: true },
];
