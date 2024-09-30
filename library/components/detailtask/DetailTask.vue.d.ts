import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * Detail task component props
 */
export interface DetailTaskProps {
  /**
   * The task's id.
   *
   * If this prop is not specified, the dialog will assume for a creation of a new task.
   *
   * @defaultValue undefined
   */
  taskId?: string;
}

/**
 * Detail task component emits
 */
export type DetailTaskEmits = {
  /**
   * Emits when dialog shown.
   */
  show: [];
  /**
   * Emits when there is a change on the task.
   */
  change: [];
};

/**
 * **WangsVue - DetailTask**
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
declare class DetailTask extends ClassComponent<
  DetailTaskProps,
  unknown,
  DetailTaskEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Dropdown: GlobalComponentConstructor<DetailTask>;
  }
}

export default DetailTask;
