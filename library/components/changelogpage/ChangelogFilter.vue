<script setup lang="ts">
import { reactive, watch } from 'vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import {
  FilterField,
  MultiSelectFilterField,
} from '../filtercontainer/FilterContainer.vue.d';
import { useToast } from 'lib/utils';
import { MultiSelectOption } from 'lib/types/options.type';

import {
  ChangelogFilter,
  ChangelogOptionQuery,
  BaseChangelogPageProps,
} from './ChangelogPage.vue.d';
import LogServices from 'lib/services/log.service';

const toast = useToast();

const props = defineProps<BaseChangelogPageProps & { tableName: string }>();

const fields = ((): FilterField[] => {
  const tempFields: FilterField[] = [
    {
      label: 'Tanggal',
      type: 'calendar',
      field: 'createdAt',
      visible: !props.removedFilters?.includes('createdAt'),
    },
    {
      label: 'Aksi',
      type: 'multiselect',
      field: 'action',
      visible: !props.removedFilters?.includes('action'),
      fetchOptionFn: async (
        params?: ChangelogOptionQuery,
      ): Promise<MultiSelectOption[]> => {
        return await fetchOptions('actionOptions', params);
      },
    },
    {
      label: 'Objek',
      type: 'multiselect',
      field: 'object',
      visible:
        (props.moduleId || props.subModuleId) &&
        !props.additionalTemplateFilters?.length &&
        !props.removedFilters?.includes('object'),
      fetchOptionFn: async (
        params?: ChangelogOptionQuery,
      ): Promise<MultiSelectOption[]> => {
        return await fetchOptions('objectOptions', params);
      },
    },
    {
      label:
        props.moduleId || props.subModuleId
          ? 'Objek Name'
          : (props.objectNameColumn ?? props.object),
      type: 'multiselect',
      field: 'assetName',
      visible:
        !props.additionalTemplateFilters?.length &&
        !props.removedFilters?.includes('objectName'),
      fetchOptionFn: async (
        params?: ChangelogOptionQuery,
      ): Promise<MultiSelectOption[]> => {
        return await fetchOptions('assetNameOptions', params);
      },
    },
    {
      label: 'Field',
      type: 'multiselect',
      field: 'field',
      visible:
        !/Testing/.test(props.object) &&
        !props.removedFilters?.includes('field'),
      fetchOptionFn: async (
        params?: ChangelogOptionQuery,
      ): Promise<MultiSelectOption[]> => {
        return await fetchOptions('fieldOptions', params);
      },
    },
    {
      label: 'Diubah Oleh',
      type: 'multiselect',
      field: 'modifiedBy',
      visible: !props.removedFilters?.includes('modifiedBy'),
      fetchOptionFn: async (
        params?: ChangelogOptionQuery,
      ): Promise<MultiSelectOption[]> => {
        return await fetchOptions('modifiedByOptions', params);
      },
    },
  ].filter((field) => field.visible) as FilterField[];

  if (props.additionalTemplateFilters?.length) {
    props.additionalTemplateFilters?.forEach((each) => {
      tempFields.splice(each.index, 0, {
        ...each.filter,
        ...(each.filter.type === 'multiselect'
          ? {
              fetchOptionFn: async (
                params?: ChangelogOptionQuery,
              ): Promise<MultiSelectOption[]> => {
                const filter = each.filter as MultiSelectFilterField;
                const optionField = (filter.field +
                  'Options') as keyof ChangelogOptionQuery;
                return await fetchOptions(optionField, params);
              },
            }
          : {}),
      });
    });
  }

  return tempFields;
})();

const filter = reactive<ChangelogFilter>({});

/**
 * Fetches options for a specific filter.
 * If the filter options do not exist, it makes a request to get them.
 * It also handles the loading state for the options.
 *
 * @function fetchOptions
 * @param {keyof ChangelogOptionFilter} option - The option to fetch.
 * @returns {Promise<void>}
 */
const fetchOptions = async (
  field: keyof ChangelogOptionQuery,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params?: ChangelogOptionQuery,
): Promise<MultiSelectOption[]> => {
  try {
    const { data } = await LogServices.getChangelogOptions({
      [field]: true,
      ...props.defaultParamsQuery,
      ...props.customParams,
    });

    return data.data[field] ?? [];
  } catch (error) {
    toast.add({
      error,
      message: 'Error, failed to fetch options.',
    });

    return [];
  }
};

/**
 * Clears all keys from the filter object.
 *
 * @function clearFilter
 * @returns {void}
 */
const clearFilter = (): void => {
  const keys = Object.keys(filter) as Array<keyof ChangelogFilter>;
  keys.forEach((key) => delete filter[key]);
};

/**
 * Watches the filter object for changes.
 * If a key's value is an empty array, it removes that key from the filter object.
 *
 * @function watch
 * @returns {void}
 */
watch(filter, () => {
  const keys = Object.keys(filter) as Array<keyof ChangelogFilter>;
  keys.forEach((key) => !filter[key]?.length && delete filter[key]);
});
</script>

<template>
  <FilterContainer
    :fields="fields"
    :fields-per-row="props.moduleId || props.subModuleId ? 4 : 3"
    :table-name="props.tableName"
    @clear="clearFilter"
    data-wv-name="changelog-filter"
  />
</template>
