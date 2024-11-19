import { MenuItem } from 'primevue/menuitem';
import { DialogAdjustmentTaskBulkActionType } from '../DialogAdjustmentTask.vue.d';

export const dialogAddjusmentTaskBulkAction = (
  bulkActionEmitter: (
    bulkActionType: DialogAdjustmentTaskBulkActionType,
  ) => void,
): MenuItem[] => [
  {
    label: 'Assign Member Baru',
    icon: 'user-add',
    command: (): void => {
      bulkActionEmitter('assign-new-member');
    },
  },
  {
    label: 'Unassign Member Baru',
    icon: 'user-unfollow',
    command: (): void => {
      bulkActionEmitter('unassign-new-member');
    },
  },
];
