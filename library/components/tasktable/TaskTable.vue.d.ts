import { ClassComponent } from '../ts-helpers';

export type TaskTableTab =
  | 'all'
  | 'active'
  | 'backlog'
  | 'todayHistory'
  | 'history'
  | 'deleted';

export type TaskTableSubTab = 'myTask' | 'relatedTask';

export interface TaskTableProps {
  tab: TaskTableTab;
  subTab?: TaskTableSubTab;
}

declare class TaskTable extends ClassComponent<
  TaskTableProps,
  unknown,
  unknown
> {}

export default TaskTable;
