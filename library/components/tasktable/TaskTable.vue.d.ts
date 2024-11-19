import { ClassComponent } from '../ts-helpers';

export type TaskTablePage =
  | 'task'
  | 'project-task'
  | 'project-module'
  | 'project-subModule'
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
   * Used as query params while fetching data table
   * in project-module / project-subModule page
   */
  moduleId?: string;
  /**
   * Used as query params while fetching data table
   * in project-subModule page
   */
  subModuleId?: string;
  /**
   * Used as parameter while fetching data table
   * in member-detail page
   */
  userId?: string;
}

declare class TaskTable extends ClassComponent<
  TaskTableProps,
  unknown,
  unknown
> {}

export default TaskTable;