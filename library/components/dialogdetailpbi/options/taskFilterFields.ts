import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import { Pbi } from '../DialogDetailPbi.vue.d';
import TaskServices from 'lib/services/task.service';

const projectId = sessionStorage.getItem('projectId') as string;

const filterFields = (selectedPbi?: Partial<Pbi>): FilterField[] => [
  {
    label: 'Modul',
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          pbi: `["${selectedPbi?._id}"]`,
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
          pbi: `["${selectedPbi?._id}"]`,
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
          pbi: `["${selectedPbi?._id}"]`,
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
    label: 'Task',
    field: 'task',
    type: 'multiselect',
    placeholder: 'Pilih task',
    fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
      try {
        const { data } = await TaskServices.getTaskOptions({
          project: `["${projectId}"]`,
          pbi: `["${selectedPbi?._id}"]`,
          taskOptions: true,
        });
        return data.data.taskOptions;
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
          pbi: `["${selectedPbi?._id}"]`,
          memberOptions: true,
        });
        return data.data.memberOptions;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  {
    label: 'Status',
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih status',
    fetchOptionFn: (): MultiSelectOption[] => {
      return [
        'Waiting Approval',
        'Backlog',
        'Sprint',
        'Pending Review Leader',
        'Reported Bug',
        'Fixing Bug',
        'Penyesuaian',
        'Selesai',
      ].map((status) => ({
        label: status,
        value: status,
      }));
    },
  },
  {
    label: 'Last Modified Status',
    field: 'lastModified',
    type: 'calendar',
    placeholder: 'Pilih tanggal',
  },
];

export default filterFields;
