import { ClassComponent } from '../ts-helpers';
import { Project } from 'lib/types/project.type';
import { Pbi } from './DialogDetailPbi.vue.d';

export interface TaskDetailPbiProps {
  /**
   * PBI data to display on the dialog
   */
  selectedPbi?: Pbi;
  /**
   * Project detail, used to determine whether the current user is a PM or not
   */
  project?: Project;
  /**
   * Whether the PBI can be edited or not
   *
   * @default true
   */
  editable?: boolean;
}

declare class TaskDetailPbi extends ClassComponent<
  TaskDetailPbiProps,
  unknown,
  unknown
> {}

export default TaskDetailPbi;
