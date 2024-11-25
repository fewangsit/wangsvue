import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import SprintServices from 'lib/services/sprint.service';
import { MultiSelectOption } from 'lib/types/options.type';

const pbiStatuses = [
  'Backlog',
  'Overdue',
  'Reported Bug',
  'Sprint',
  'Pending Testing',
  'Selesai',
];

const pbiCategories = ['Fitur', 'Bug', 'Performance & Security', 'Dokumentasi'];

const filterFields = (projectId: string, routeName: string): FilterField[] => {
  const returnFields: FilterField[] = [];

  if (routeName === 'SprintPbiInSprint') {
    returnFields.push({
      field: 'sprint',
      type: 'multiselect',
      placeholder: 'Pilih sprint',
      fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
        try {
          const { data } = await SprintServices.getPbiOptions(projectId, {
            sprint: true,
          });
          return data.data.sprint;
        } catch (error) {
          console.error(error);
          return [];
        }
      },
    });
  }

  returnFields.push({
    field: 'category',
    type: 'multiselect',
    placeholder: 'Pilih kategori',
    fetchOptionFn: (): MultiSelectOption[] => {
      return pbiCategories.map((category) => ({
        label: category,
        value: category,
      }));
    },
  });

  if (
    ['SprintPbiBacklog', 'SprintPbiInSprint', 'DetailSprint'].includes(
      routeName,
    )
  ) {
    returnFields.push({
      field: 'status',
      type: 'multiselect',
      placeholder: 'Pilih status',
      fetchOptionFn: (): MultiSelectOption[] => {
        return pbiStatuses
          .filter((status) => {
            if (status === 'Selesai') return false;
            if (routeName === 'SprintPbiBacklog') {
              return !['Sprint', 'Pending Testing'].includes(status);
            }
            return status;
          })
          .map((status) => ({
            label: status,
            value: status,
          }));
      },
    });
  }

  if (routeName === 'DetailSprint') {
    returnFields.push({
      fields: ['totalTaskMin', 'totalTaskMax'],
      type: 'rangenumber',
      placeholder: '0',
      tooltip: 'Jumlah Task',
    });
  }

  returnFields.push({
    fields: ['estimateDurationMin', 'estimateDurationMax'],
    type: 'rangenumber',
    placeholder: '0',
    tooltip: 'Estimasi Pengerjaan (Jam)',
  });
  return returnFields;
};

export default filterFields;
