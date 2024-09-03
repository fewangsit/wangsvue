<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import ChangelogFilter from './ChangelogFilter.vue';
import TreeTable from '../treetable/TreeTable.vue';
import LogServices from 'lib/services/log.service';
import { FetchResponse } from '../datatable/DataTable.vue.d';
import { useToast } from 'lib/utils';

import {
  ChangelogFilterQuery,
  ChangelogPageEmits,
  ChangelogPageProps,
  ChangelogType,
} from './ChangelogPage.vue.d';

const toast = useToast();

const props = defineProps<ChangelogPageProps>();
defineEmits<ChangelogPageEmits>();

const dataTableKey = shallowRef<number>(0);
const showChangelogFilter = shallowRef<boolean>(false);

/**
 * Define the default params
 */
const defaultParamsQuery = ref<ChangelogFilterQuery>({
  object: props.objects ? undefined : props.object,
  objects: props.objects ? JSON.stringify(props.objects) : undefined,
  ...props.customParams,
});

const scrollHeight = computed<string | undefined>(() => {
  if (props.isDialog && showChangelogFilter.value) {
    return 'calc(57vh - 126px)';
  } else if (props.isDialog) return '57vh';
  return undefined;
});

const tableName = computed(
  () =>
    `changelog-page-${defaultParamsQuery.value.object?.toLowerCase().split(' ').join('-')}`,
);

const changelogColumn = computed(() => [
  {
    field: 'createdAt',
    header: 'Tanggal',
    sortable: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.createdAt ?? '-';
    },
  },
  {
    field: 'action',
    header: 'Aksi',
    sortable: true,
    fixed: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.action ?? '-';
    },
  },
  {
    field: 'objectName',
    header: props.objectNameColumn ?? props.object,
    sortable: true,
    fixed: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.objectName ?? '-';
    },
  },
  {
    field: 'field',
    header: 'Field',
    sortable: true,
    fixed: true,
    visible: !/Testing/.test(props.object),
    bodyTemplate: (data: ChangelogType): string => {
      return data.field ?? '-';
    },
  },
  {
    field: 'oldValue',
    header: 'Data Lama',
    sortable: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.oldValue ?? '-';
    },
  },
  {
    field: 'newValue',
    header: 'Data Baru',
    sortable: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.newValue ?? '-';
    },
  },
  {
    field: 'modifiedBy',
    header: 'Diubah Oleh',
    sortable: true,
    visible: true,
    bodyTemplate: (data: ChangelogType): string => {
      return data.modifiedBy ?? '-';
    },
  },
]);

const fetchChangelogs = async (
  params?: ChangelogFilterQuery,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await LogServices.getChangelog(params);
    return data;
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: '',
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-2 justify-between">
    <div
      class="flex justify-end gap-1 items-center"
      data-wv-section="changelog-dialog-header"
    >
      <ButtonSearch
        :table-name="tableName"
        class="ring-inset"
        data-wv-section="changelog-dialog-button-search"
      />
      <ButtonFilter
        :table-name="tableName"
        @show-filter="showChangelogFilter = $event"
        data-wv-section="changelog-dialog-button-filter"
      />
    </div>
    <ChangelogFilter
      :custom-params="props.customParams"
      :object="props.object"
      :object-id="defaultParamsQuery.objectId"
      :object-name-column="props.objectNameColumn"
      :objects="props.objects"
      :table-name="tableName"
    />
    <TreeTable
      :key="dataTableKey"
      :columns="changelogColumn"
      :default-query-params="defaultParamsQuery"
      :fetch-function="fetchChangelogs"
      :scroll-height="scrollHeight"
      :table-name="tableName"
      :use-option="false"
      data-key="_id"
      lazy
      selection-type="none"
      use-paginator
    />
  </div>
</template>
