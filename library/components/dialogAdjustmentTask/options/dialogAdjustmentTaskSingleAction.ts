import { MenuItem } from '../../menuitem/index';
import { DialogAdjustmentTaskSingleActionType } from '../DialogAdjustmentTask.vue.d';

export const dialogAdjustmentTaskSingleAction = (
  singleActionEmitter: (
    singleActionType: DialogAdjustmentTaskSingleActionType,
  ) => void,
): MenuItem[] => [
  {
    label: 'Assign Member Baru',
    icon: 'user-add',
    command: (): void => {
      singleActionEmitter('assign-new-member');
    },
  },
  {
    label: 'Unassign Member Baru',
    icon: 'user-unfollow',
    command: (): void => {
      singleActionEmitter('unassign-new-member');
    },
  },
  {
    label: 'Detail Task',
    icon: 'file-copy-2-line',
    command: (): void => {
      singleActionEmitter('detail-task');
    },
  },
];
