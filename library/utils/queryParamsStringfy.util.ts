import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import { QueryParamsStringfy } from 'lib/types/queryParamsStringfy.type';

/**
 * This Function will turn all array query params to string
 * using JSON Stringfy
 */
export const queryParamsStringfy = (
  data: QueryParams | undefined,
): QueryParamsStringfy | undefined => {
  if (!data) {
    return;
  }
  const assignedData = {};

  Object.keys(data).forEach((item) => {
    if (Array.isArray(data[item])) {
      if (data[item].length > 0) {
        Object.assign(assignedData, {
          [item]: JSON.stringify(data[item]),
        });
      }
    } else if (data[item] !== undefined) {
      Object.assign(assignedData, {
        [item]: data[item],
      });
    }
  });
  return assignedData;
};
