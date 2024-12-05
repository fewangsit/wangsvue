import { ClassComponent } from '../ts-helpers';

export interface DialogImprovementTaskProps {
  projectId: string | undefined;
  taskId: string | undefined;
  notificationId: string | undefined;
}

export type DialogImprovementTaskEmits = {
  /**
   * Emits when the notification is read and
   * the dialog is closed
   */
  close: [id: string];
};

declare class DialogImprovementTask extends ClassComponent<
  DialogImprovementTaskProps,
  unknown,
  DialogImprovementTaskEmits
> {}

export default DialogImprovementTask;
