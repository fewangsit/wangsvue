<script setup lang="ts">
import {
  FetchResponse,
  QueryParams,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import DataTable from '../datatable/DataTable.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import { AuditServices as LogServices } from 'wangsit-api-services';

const props = defineProps<{
  memberId: string;
}>();

const logColumns: TableColumn[] = [
  {
    field: 'createdAt',
    header: 'Tanggal',
    sortable: true,
    bodyTemplate: (data: any): string => {
      return data.createdAt ?? '-';
    },
  },
  {
    field: 'action',
    header: 'Aktivitas',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: any): string => {
      return data.action ?? '-';
    },
  },
  {
    field: 'object',
    header: 'Objek',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: any): string => {
      return data.object ?? '-';
    },
  },
  {
    field: 'objectName',
    header: 'Nama Objek',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: any): string => {
      return data.objectName ?? '-';
    },
  },
];

const logFilterField: FilterField[] = [
  {
    label: 'Tanggal',
    type: 'calendar',
    field: 'createdAt',
  },
  {
    label: 'Aktivitas',
    type: 'multiselect',
    field: 'action',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      return await fetchOptions('actionOptions');
    },
  },
  {
    label: 'Objek',
    type: 'multiselect',
    field: 'objects',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      return await fetchOptions('objectOptions');
    },
  },
  {
    label: 'Nama Objek',
    type: 'multiselect',
    field: 'objectName',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      return await fetchOptions('objectNameOptions');
    },
  },
];

const fetchOptions = async (field: string): Promise<MultiSelectOption[]> => {
  try {
    const { data } = await LogServices.getUserlogOptions({
      [field]: true,
      memberId: props.memberId,
    });

    return data.data[field] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getUserLog = async (
  query: QueryParams,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await LogServices.getUserlog({
      ...query,
      userId: props.memberId,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex justify-between gap-4" data-wv-section="tabletoolbars">
    <ButtonSearch class="ml-auto" table-name="member-log" />
    <ButtonFilter table-name="member-log" />
  </div>
  <FilterContainer :fields="logFilterField" table-name="member-log" />
  <DataTable
    :columns="logColumns"
    :custom-column="false"
    :fetch-function="getUserLog"
    :use-option="false"
    data-key="_id"
    lazy
    selection-type="none"
    table-name="member-log"
    use-paginator
  />
</template>
