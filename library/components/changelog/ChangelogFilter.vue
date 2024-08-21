<script setup lang="ts">
import { reactive, watch } from 'vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import { useToast } from 'lib/utils';
import { MultiSelectOption } from 'lib/types/options.type';

import {
  ChangelogFilter,
  ChangelogOptionQuery,
  ChangelogProps,
} from './Changelog.vue.d';
import LogServices from 'lib/services/log.service';

const toast = useToast();

const props = defineProps<ChangelogProps & { tableName: string }>();

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
  params?: ChangelogOptionQuery,
  field?: keyof ChangelogOptionQuery,
): Promise<MultiSelectOption[] | undefined> => {
  try {
    const { data } = await LogServices.getChangelogOptions({
      ...params,
      object: props.objects ? undefined : props.object,
      objects: props.objects ? JSON.stringify(props.objects) : undefined,
      ...props.customParams,
    });

    return data.data[field];
  } catch (error) {
    toast.add({
      error,
      message: 'Error, failed to fetch options.',
    });
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
    :fields="[
      {
        label: 'Aksi',
        type: 'multiselect',
        field: 'actionOptions',
        fetchOptionFn: async (params) => {
          return await fetchOptions(params, 'actionOptions');
        },
      },
    ]"
    :table-name
    @clear="clearFilter"
    data-wv-name="history-filter"
  />
</template>
