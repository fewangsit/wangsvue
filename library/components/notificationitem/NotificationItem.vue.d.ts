import { StatusSeverity } from 'lib/types/wangsStatus.type';
import { ClassComponent } from '../ts-helpers';

export type GetNotificationParam = {
  isRead?: boolean;
  isActioned?: boolean;
  sortBy?: string;
  sortOrder?: number;
  limit?: number;
  page?: number;
  search?: string;
  module?: string;
};

export type NotificationItemType = {
  _id: string;
  user: string;
  title: string;
  detail: string;
  category:
    | 'settings'
    | 'user'
    | 'chat'
    | 'barricade'
    | 'file-edit'
    | 'list-check'
    | 'team'
    | 'user-star'
    | 'change-password'
    | 'check'
    | 'close'
    | 'delete'
    | 'ticket'
    | 'bug';
  isManager?: boolean;
  isRead: boolean;
  isReadOnly: boolean;
  module:
    | 'Account Member'
    | 'Project'
    | 'API & Server '
    | 'Comment'
    | 'Quality Control';
  severity: StatusSeverity;
  type?: string | null;
  data?: {
    description?: string;
    projectId?: string;
    moduleId?: string;
    subModuleId?: string;
    taskId?: string;
    ticketId?: string;
    platform?: string;
    user?: {
      _id: string;
      nickName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export interface NotificationItemProps {
  /**
   * The notification item to show
   */
  notification: NotificationItemType;
}

export type NotificationItemEmits = {
  /**
   * Emits when a notification is read
   */
  read: [id: string];
  /**
   * Emits when a notification should open a task detail dialog
   */
  openTask: [taskId?: string, projectId?: string];
  /**
   * Emits when the notification container should be closed
   */
  close: [];
};

declare class NotificationItem extends ClassComponent<
  NotificationItemProps,
  unknown,
  NotificationItemEmits
> {}

export default NotificationItem;
