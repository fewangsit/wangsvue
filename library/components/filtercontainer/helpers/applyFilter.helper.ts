import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import eventBus from 'lib/event-bus';
import { GenericObject } from 'vee-validate';

const applyFilter = (
  values: GenericObject,
  tableName: string,
  emit?: (...args: any[]) => any,
): void => {
  const fields = Object.keys(values);
  const parsedFilter: QueryParams = {};

  eventBus.emit('multi-select:hide-overlay');

  fields.forEach((field) => {
    const isArray = Array.isArray(values[field]);

    if (
      (values[field] != null && !isArray) ||
      (isArray && values[field].length)
    ) {
      parsedFilter[field] = JSON.stringify(values[field]);
    } else {
      parsedFilter[field] = values[field];
    }
  });

  eventBus.emit('data-table:apply-filter', {
    tableName,
    filter: parsedFilter,
  });

  eventBus.emit('data-table:clear-selected-data', {
    tableName,
  });

  emit?.('apply', parsedFilter);
};

export default applyFilter;
