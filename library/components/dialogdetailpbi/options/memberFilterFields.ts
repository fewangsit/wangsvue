import { FilterField } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import SprintServices from 'lib/services/sprint.service';

export const filterFieldsMember = (
  projectId: string,
  pbiId: string,
  isAssign: boolean,
  isDocumentation: boolean,
): FilterField[] => {
  return [
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
          return data.data.member;
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
          );
        } catch (error) {
          console.error(error);
          return [];
        }
      },
    },
    {
      label: 'Progress Task',
      fields: ['progressMin', 'progressMax'],
      type: 'rangenumber',
      placeholder: '0',
    },
  ];
};
