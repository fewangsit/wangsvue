import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import { SprintServices } from 'wangsit-api-services';

export const filterFieldsMember = (
  projectId: string,
  pbiId: string,
  isAssign: boolean,
  isDocumentation: boolean,
): FilterField[] => {
  const defaultFilter: FilterField[] = [
    {
      label: 'Member',
      field: 'member',
      type: 'multiselect',
      placeholder: 'Pilih member',
      fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
        try {
          const { data } = await SprintServices.getPbiAssignedMembersOptions(
            projectId,
            pbiId,
            isAssign,
            { member: true },
          );
          return data.data.member as MultiSelectOption[];
        } catch (error) {
          console.error(error);
          return [];
        }
      },
    },
    {
      label: 'Tim',
      field: 'team',
      type: 'multiselect',
      placeholder: 'Pilih tim',
      fetchOptionFn: async (): Promise<MultiSelectOption[]> => {
        try {
          const { data } = await SprintServices.getPbiAssignedMembersOptions(
            projectId,
            pbiId,
            isAssign,
            { team: true },
          );
          return data.data.team.filter((team) =>
            isDocumentation ? team.label === 'TW' : team.label !== 'TW',
          ) as MultiSelectOption[];
        } catch (error) {
          console.error(error);
          return [];
        }
      },
    },
  ];

  const assignFilters: FilterField[] = [
    ...defaultFilter,
    {
      label: 'Progress Task PBI',
      fields: ['progressMin', 'progressMax'],
      type: 'rangenumber',
      placeholder: '0',
    },
    {
      label: 'Progress Task Global',
      fields: ['globalProgressMin', 'globalProgressMax'],
      type: 'rangenumber',
      placeholder: '0',
    },
  ];

  const unassignFilters: FilterField[] = [
    ...defaultFilter,
    {
      label: 'Progress Task Global',
      fields: ['progressMin', 'progressMax'],
      type: 'rangenumber',
      placeholder: '0',
    },
  ];

  return isAssign ? assignFilters : unassignFilters;
};
