<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
  FetchResponse,
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import { ProjectLeaders } from './DetailMember.vue.d';
import { MenuItem } from '../menuitem';
import { navigateToUrl } from 'single-spa';
import { getUserPermission } from 'lib/utils';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import DataTable from '../datatable/DataTable.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import ProjectServices from 'lib/services/project.service';
import BadgeGroup from '../badgegroup/BadgeGroup.vue';

const props = defineProps<{
  memberId: string;
}>();

const leaderColumns: TableColumn[] = [
  {
    field: 'name',
    header: 'Proyek',
    sortable: true,
    fixed: true,
  },
  {
    field: 'projectManager',
    header: 'Proyek Manager',
    sortable: true,
    bodyComponent: (data: ProjectLeaders): TableCellComponent => {
      return {
        component: BadgeGroup,
        props: {
          headerLabel: 'Proyek Manager',
          labels: data.projectManager.map((member) => member.nickName),
          limit: 2,
          emptyable: true,
        },
      };
    },
  },
  {
    field: 'totalTeams',
    header: 'Jml Tim',
    sortable: true,
  },
  {
    field: 'totalMembers',
    header: 'Jml Member',
    sortable: true,
  },
  {
    field: 'moduleProgress.percentage',
    header: 'Progress Modul',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: ProjectLeaders): string => {
      return `${Math.round(data.moduleProgress.percentage)}% (${data.moduleProgress.completedModules}/${data.moduleProgress.totalModules})`;
    },
  },
  {
    field: 'taskProgress.percentage',
    header: 'Progress Task',
    sortable: true,
    fixed: true,
    bodyTemplate: (data: ProjectLeaders): string => {
      return `${Math.round(data.taskProgress.percentage)}% (${data.taskProgress.completedTasks}/${data.taskProgress.totalTasks})`;
    },
  },
];

const leaderFilterField: FilterField[] = [
  {
    label: 'Proyek',
    field: 'projectIds',
    type: 'multiselect',
    placeholder: 'Pilih proyek',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      return await fetchOptions('projectOptions');
    },
  },
  {
    label: 'Proyek Manager',
    field: 'projectManagerIds',
    type: 'multiselect',
    placeholder: 'Pilih member',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      return await fetchOptions('projectManagerOptions');
    },
  },
  {
    label: 'Jml Tim',
    fields: ['totalTeamsMin', 'totalTeamsMax'],
    type: 'rangenumber',
    placeholder: '0',
  },
  {
    label: 'Jml Member',
    fields: ['totalMembersMin', 'totalMembersMax'],
    type: 'rangenumber',
    placeholder: '0',
  },
  {
    label: 'Progress Modul (%)',
    fields: ['moduleProgressMin', 'moduleProgressMax'],
    type: 'rangenumber',
    placeholder: '0',
  },
  {
    label: 'Progress Task (%)',
    fields: ['taskProgressMin', 'taskProgressMax'],
    type: 'rangenumber',
    placeholder: '0',
  },
];

const selectedProject = shallowRef<ProjectLeaders>();

const singleAction = computed<MenuItem[]>(() => [
  {
    label: 'Detail Proyek',
    icon: 'file-copy-2-line',
    visible:
      getUserPermission().read ||
      selectedProject.value?.projectManager
        .map((member) => member._id)
        .includes(props.memberId),
    command: (): void => {
      sessionStorage.setItem('projectId', selectedProject.value._id);
      navigateToUrl('/proyek/detail-proyek/tim');
    },
  },
]);

const fetchOptions = async (field: string): Promise<MultiSelectOption[]> => {
  try {
    const { data } = await ProjectServices.getProjectLeadersOptions({
      leaderId: props.memberId,
    });
    return data.data[field] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getMemberLeaders = async (
  query: QueryParams,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await ProjectServices.getProjectLeaders({
      ...query,
      leaderId: props.memberId,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex justify-between gap-4" data-wv-section="tabletoolbars">
    <ButtonSearch class="ml-auto" table-name="member-leaders" />
    <ButtonFilter table-name="member-leaders" />
  </div>
  <FilterContainer :fields="leaderFilterField" table-name="member-leaders" />
  <DataTable
    :columns="leaderColumns"
    :fetch-function="getMemberLeaders"
    :options="singleAction"
    @toggle-option="selectedProject = $event"
    data-key="_id"
    lazy
    selection-type="none"
    table-name="member-leaders"
    use-paginator
  />
</template>
