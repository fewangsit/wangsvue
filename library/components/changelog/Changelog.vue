<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useToast } from 'lib/utils';

import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import Dialog from '../dialog/Dialog.vue';
import DataTable from '../datatable/DataTable.vue';
import Icon from '../icon/Icon.vue';
import ChangelogFilter from './ChangelogFilter.vue';
import LogServices from 'lib/services/log.service';
import { FetchResponse } from '../datatable/DataTable.vue.d';

import {
  ChangelogFilterQuery,
  ChangelogEmits,
  ChangelogProps,
  ChangelogType,
} from './Changelog.vue.d';

const props = defineProps<ChangelogProps>();
defineEmits<ChangelogEmits>();

const toast = useToast();

const showChangelogFilter = ref<boolean>(false);
const showChangelogDialog = ref<boolean>(false);
const dataTableKey = ref<number>(0);
const searchLogs = ref<string>();

const tableName = computed(
  () =>
    `changelog-${defaultParamsQuery.value.object?.toLowerCase().split(' ').join('-')}`,
);

const changelogColumnHeader = computed<string>(() => {
  switch (props.object) {
    case 'Akun Member':
      return 'Email';
    case 'Process':
      return 'Template Process';
    default:
      return props.object;
  }
});

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
    header: changelogColumnHeader.value,
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

/**
 * Define the default params
 */
const defaultParamsQuery = ref<ChangelogFilterQuery>({
  object: props.objects ? undefined : props.object,
  objects: props.objects ? JSON.stringify(props.objects) : undefined,
  ...props.customParams,
});

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

/**
 * Need to reset the state to make sure every dialog open, the fetch result is correct.
 */
const resetState = (): void => {
  showChangelogFilter.value = false;
  searchLogs.value = undefined;
};

watch(showChangelogDialog, (newValue) => {
  if (newValue) resetState();
});
</script>

<template>
  <button @click="showChangelogDialog = true" type="button">
    <Icon
      class="text-2xl"
      icon="file-history"
      info="Changelog"
      severity="secondary"
      tooltip-pos="bottom"
    />
  </button>
  <Dialog
    v-model:visible="showChangelogDialog"
    :base-z-index="3000"
    :header="'Changelog: ' + changelogColumnHeader"
    @hide="$emit('hide')"
    class="w-[800px] !z-50"
    content-class="-mr-3 pr-3"
    data-wv-name="dialog-changelog"
    modal
  >
    <div v-if="showChangelogDialog" class="flex flex-col gap-2 justify-between">
      <div
        class="flex justify-end gap-1 items-center"
        data-wv-section="dialog-changelog-header"
      >
        <ButtonSearch
          @search="searchLogs = $event"
          class="ring-inset"
          data-wv-section="dialog-changelog-button-search"
        />
        <ButtonFilter
          v-model:show-filter="showChangelogFilter"
          data-wv-section="dialog-changelog-button-filter"
        />
      </div>
      <ChangelogFilter
        v-show="showChangelogFilter"
        :changelog-column-header="changelogColumnHeader"
        :custom-params="props.customParams"
        :object="props.object"
        :object-id="defaultParamsQuery.objectId"
        :objects="props.objects"
        :table-name="tableName"
      />
      <DataTable
        :key="dataTableKey"
        :columns="changelogColumn"
        :default-query-params="defaultParamsQuery"
        :fetch-function="fetchChangelogs"
        :rows="10"
        :scroll-height="showChangelogFilter ? 'calc(50vh - 126px)' : '50vh'"
        :search="searchLogs"
        :table-name="tableName"
        :use-option="false"
        data-key="_id"
        lazy
        selection-type="none"
        use-paginator
      />
    </div>
  </Dialog>
</template>
