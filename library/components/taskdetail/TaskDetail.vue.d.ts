import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * Detail task component props
 */
export interface DetailTaskProps {
  /**
   * V-model visible
   */
  visible: boolean;
  projectId: string | undefined;
  /**
   * The task's id.
   *
   * If this prop is not specified, the dialog will assume for a creation of a new task.
   *
   */
  taskId?: string;
  initialModule?: {
    _id: string;
    name?: string;
  };
  initialSubModule?: {
    _id: string;
    name?: string;
    repository?: string;
  };
  productBacklogItemId?: string;
  approvalId?: string;
}

/**
 * Detail task component emits
 */
export type DetailTaskEmits = {
  /**
   *
   */
  'update:visible': [value: boolean];
  /**
   * Emits when dialog shown.
   */
  'show': [];
  /**
   * Emits when new task is created.
   */
  'create': [];
  /**
   * Emits when there is an update on the task.
   */
  'update': [];
  /**
   * Emits when the task is deleted.
   */
  'delete': [];
};

/**
 * **WangsVue - TaskDetail**
 *
 * _DetailTask is a component to show detail task dialog._
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group Component
 *
 * @experimental
 */
declare class TaskDetail extends ClassComponent<
  DetailTaskProps,
  unknown,
  DetailTaskEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Dropdown: GlobalComponentConstructor<TaskDetail>;
  }
}

export default TaskDetail;
