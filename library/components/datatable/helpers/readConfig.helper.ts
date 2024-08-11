import { TableColumn } from '../DataTable.vue.d';
import useDataTableStore from '../store/dataTable.store';

export default async function readConfig(
  tableId: string,
  defaultColumns: TableColumn[],
): Promise<TableColumn[]> {
  const { config } = await useDataTableStore();
  const tableConfig = config[tableId];

  if (tableConfig) {
    return tableConfig
      .map((conf) => {
        const foundCol = defaultColumns.find((col) => col.field === conf.field);

        if (!foundCol || foundCol.visible === false) return undefined; // To hide column if the user conditionaly set the column visible to false

        return {
          ...foundCol,
          ...conf,
        } as TableColumn;
      })
      .filter((col): col is TableColumn => !!col); // Make it assignable to type TableColumn[], because `find` method produce (TableColumn | undefined)[]
  }

  return defaultColumns;
}
