import { Project } from 'lib/types/project.type';
import { AssignedMember, Pbi } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { ClassComponent } from '../ts-helpers';

export type TaskTablePage =
  | 'task'
  | 'project-task'
  | 'project-module'
  | 'project-subModule'
  | 'project-productBacklogItem'
  | 'member-detail'
  | 'my-profile';

export type TaskTableTab =
  | 'all'
  | 'active'
  | 'backlog'
  | 'todayHistory'
  | 'history'
  | 'deleted';

export type TaskTableSubTab = 'myTask' | 'relatedTask';

export interface TaskTableProps {
  page: TaskTablePage;
  tab: TaskTableTab;
  subTab?: TaskTableSubTab;
  /**
   * Used as query params while fetching data table
   * in project-task / project-module / project-subModule page
   */
  projectId?: string;
  /**
   * Used as initial value of module for task detail's legend
   * in project-module / project-subModule page
   */
  moduleId?: string;
  /**
   * Used as query params while fetching data table
   * in project-module / project-subModule page
   */
  moduleInitial?: string;
  /**
   * Used as query params while fetching data table
   * and initial value of submodule for task detail's legend
   * in project-subModule page
   */
  subModuleId?: string;
  /**
   * Used as query params while fetching data table
   * in project-productBacklogItem page, and
   * to edit the selected PBI
   */
  selectedPbi?: Pbi;
  assignedPbiMembers?: AssignedMember[];
  /**
   * Used to determine whether the current user is a PM or not
   */
  project?: Project;
  editablePbi?: boolean;
  /**
   * Used as parameter while fetching data table
   * in member-detail page
   */
  userId?: string;
}

export type TaskTableEmits = {
  /**
   * Emit on click 'Ambil Task' button
   */
  showUnassignedTask: [];
};

declare class TaskTable extends ClassComponent<
  TaskTableProps,
  unknown,
  TaskTableEmits
> {}

export default TaskTable;
