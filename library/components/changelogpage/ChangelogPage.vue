<script setup lang="ts">
import { useToast } from 'lib/utils';
import { computed, inject, ref, shallowRef } from 'vue';
import {
  FetchResponse,
  TableCellComponent,
  TableColumn,
} from '../datatable/DataTable.vue.d';

import {
  ChangelogFilterQuery,
  ChangelogPageEmits,
  ChangelogPageProps,
  ChangelogType,
} from './ChangelogPage.vue.d';

import { AuditServices as LogServices } from 'wangsit-api-services';
import ButtonDownload from '../buttondownload/ButtonDownload.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import DataTable from '../datatable/DataTable.vue';
import ChangelogFilter from './ChangelogFilter.vue';
import TooltipSpan from '../tooltipspan/TooltipSpan.vue';

const toast = useToast();
const Preset = inject<Record<string, any>>('preset', {}).changelog;

const props = withDefaults(defineProps<ChangelogPageProps>(), {
  useButtonDownload: false,
});

defineEmits<ChangelogPageEmits>();

const dataTableKey = shallowRef<number>(0);
const showChangelogFilter = shallowRef<boolean>(false);

/**
 * Define the default params
 */
const defaultParamsQuery = ref<ChangelogFilterQuery>({
  moduleId: props.moduleId,
  subModuleId: props.subModuleId,
  object:
    props.objects || props.moduleId || props.subModuleId
      ? undefined
      : props.object,
  objects: props.objects ? JSON.stringify(props.objects) : undefined,
  ...props.customParams,
});

const scrollHeight = computed<string | undefined>(() => {
  if (props.isDialog && showChangelogFilter.value) {
    return 'calc(57vh - 126px)';
  } else if (props.isDialog) return '57vh';
  return undefined;
});

const tableName = computed<string>(() => {
  return (
    props.tableName ??
    `changelog-page-${(defaultParamsQuery.value.object ?? props.moduleId ?? props.subModuleId)?.toLowerCase().split(' ').join('-')}`
  );
});

const changelogColumn = ((): TableColumn[] => {
  const tempColumns = [
    {
      field: 'createdAt',
      header: 'Tanggal',
      sortable: true,
      visible: !props.removedColumns?.includes('createdAt'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.createdAt ?? '-';
      },
    },
    {
      field: 'action',
      header: 'Aksi',
      sortable: true,
      fixed: true,
      visible: !props.removedColumns?.includes('action'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.action ?? '-';
      },
    },
    {
      field: 'object',
      header: 'Objek',
      sortable: true,
      fixed: true,
      visible:
        (!!props.moduleId || !!props.subModuleId) &&
        !props.additionalTemplateColumns?.length &&
        !props.removedColumns?.includes('object'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.object ?? '-';
      },
    },
    {
      field: 'objectName',
      header:
        props.moduleId || props.subModuleId
          ? 'Nama Objek'
          : (props.objectNameColumn ?? props.object),
      sortable: true,
      fixed: true,
      visible:
        !props.additionalTemplateColumns?.length &&
        !props.removedColumns?.includes('objectName'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.objectName ?? '-';
      },
    },
    {
      field: 'field',
      header: 'Field',
      sortable: true,
      fixed: true,
      visible:
        !/Testing/.test(props.object) &&
        !props.removedColumns?.includes('field'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.field ?? '-';
      },
    },
    {
      field: 'oldValue',
      header: 'Data Lama',
      sortable: true,
      visible: !props.removedColumns?.includes('oldValue'),
      bodyComponent: (data: ChangelogType): TableCellComponent => {
        return {
          component: TooltipSpan,
          props: { fullText: data.oldValue },
        };
      },
    },
    {
      field: 'newValue',
      header: 'Data Baru',
      sortable: true,
      visible: !props.removedColumns?.includes('newValue'),
      bodyComponent: (data: ChangelogType): TableCellComponent => {
        return {
          component: TooltipSpan,
          props: { fullText: data.newValue },
        };
      },
    },
    {
      field: 'modifiedBy',
      header: 'Diubah Oleh',
      sortable: true,
      visible: !props.removedColumns?.includes('modifiedBy'),
      bodyTemplate: (data: ChangelogType): string => {
        return data.modifiedBy ?? '-';
      },
    },
  ].filter((col) => col.visible) as TableColumn[];

  if (props.additionalTemplateColumns?.length) {
    props.additionalTemplateColumns?.forEach((each) => {
      tempColumns.splice(each.index, 0, each.column);
    });
  }

  return tempColumns;
})();

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
  <div v-bind="Preset?.root">
    <div v-bind="Preset?.header">
      <ButtonSearch v-bind="Preset?.buttonsearch" :table-name="tableName" />
      <ButtonFilter
        v-bind="Preset?.buttonfilter"
        :table-name="tableName"
        @show-filter="showChangelogFilter = $event"
      />
      <ButtonDownload
        v-if="props.useButtonDownload"
        v-bind="Preset?.buttondownload"
        :file-name="fileName ?? 'Changelog'"
        :table-name="tableName"
      />
    </div>
    <ChangelogFilter
      :additional-template-filters="additionalTemplateFilters"
      :custom-params="props.customParams"
      :default-params-query="defaultParamsQuery"
      :module-id="moduleId"
      :object="props.object"
      :object-id="defaultParamsQuery.objectId"
      :object-name-column="props.objectNameColumn"
      :objects="props.objects"
      :removed-filters="removedFilters"
      :sub-module-id="subModuleId"
      :table-name="tableName"
    />
    <DataTable
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
