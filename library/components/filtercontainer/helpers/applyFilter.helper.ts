import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import eventBus from 'lib/event-bus';
import { GenericObject } from 'vee-validate';

const applyFilter = (values: GenericObject, tableName: string): void => {
  const fields = Object.keys(values);
  const parsedFilter: QueryParams = {};

  eventBus.emit('multi-select:hide-overlay');

  fields.forEach((field) => {
    parsedFilter[field] = JSON.stringify(values[field]);
  });

  eventBus.emit('data-table:apply-filter', {
    tableName,
    filter: parsedFilter,
  });

  eventBus.emit('data-table:clear-selected-data', {
    tableName,
  });
};

export default applyFilter;
