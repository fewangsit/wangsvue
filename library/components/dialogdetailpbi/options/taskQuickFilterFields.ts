import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import TaskServices from 'lib/services/task.service';

const projectId = sessionStorage.getItem('projectId') as string;

const filterFields = (pbiId?: string): FilterField[] => [
  {
    label: 'Modul',
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          excludePbi: `["${pbiId}"]`,
          status: '["Backlog"]',
          moduleOptions: true,
        });
        return data.data.moduleOptions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  {
    label: 'Sub Modul',
    field: 'subModule',
    type: 'multiselect',
    placeholder: 'Pilih sub modul',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          excludePbi: `["${pbiId}"]`,
          status: '["Backlog"]',
          subModuleOptions: true,
        });
        return data.data.subModuleOptions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  {
    label: 'Proses',
    field: 'process',
    type: 'multiselect',
    placeholder: 'Pilih proses',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          excludePbi: `["${pbiId}"]`,
          status: '["Backlog"]',
          processOptions: true,
        });
        return data.data.processOptions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  {
    label: 'Assign',
    field: 'member',
    type: 'multiselect',
    placeholder: 'Pilih member',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          excludePbi: `["${pbiId}"]`,
          status: '["Backlog"]',
          memberOptions: true,
        });
        return data.data.memberOptions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
];

export default filterFields;
