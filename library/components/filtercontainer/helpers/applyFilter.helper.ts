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
    const isAlreadyString = typeof values[field] === 'string';

    // First, filter all undefined/null value
    const filterredValues: GenericObject = isArray
      ? values[field]?.filter((each: keyof GenericObject) => !!each)
      : values[field];

    if (
      ((filterredValues != null && !isArray) ||
        (isArray && filterredValues.length)) &&
      !isAlreadyString
    ) {
      // If filterred value still has length then original value will be used,
      parsedFilter[field] = filterredValues?.length
        ? JSON.stringify(values[field])
        : JSON.stringify(filterredValues);
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
