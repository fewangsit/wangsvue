import { TaskStatus } from 'lib/types/wangsStatus.type';
import { FetchResponse } from '../datatable/DataTable.vue.d';
import { ClassComponent } from '../ts-helpers';
import { MultiSelectOption } from 'lib/types/options.type';
import { Member } from 'lib/dto/member.dto';

export interface DialogAdjustmentTaskProps {
  /**
   * Pass Member id to get task that connected to memberId
   */
  members: Pick<AssignedTo, '_id' | 'nickName' | 'key'>[];
  /**
   * V-model dialog visibility
   */
  visibility: boolean;
  /**
   * Prevent Dialog To even show when data list length 0 and then emptylist emit will be trigger
   * @default false
   */
  preventAppear?: boolean;
  /**
   * Close dialog after form validated and submitted.
   * @default true
   */
  closeOnSubmit?: boolean;
  /**
   * Header Dialog Title.
   * @default 'Assign Task'
   */
  header?: string;
  /**
   * Custom Query Params Get List
   */
  customQueryParams?: Record<string, unknown>;
  /**
   * Custom Status Filter Option
   */
  customStatusFilter?: MultiSelectOption[];
  /**
   * Custom members for assign member dropdown
   */
  customMemberOptions?: Pick<
    Member,
    '_id' | 'key' | 'nickName' | 'profilePictureBig' | 'progress'
  >[];
}

export type DialogAdjustmentTaskEmits = {
  /**
   * Will get trigger if data list length below or equal with 0
   */
  'emptyList': [];
  /**
   * Get trigger everytime visibility change
   */
  'update:visibility': [visible: boolean];
  /**
   * Trigger when assign & unassign successfully save to server
   */
  'successAssignUnAssign': [];
  /**
   * Trigger when assign & unassign failed save to server
   */
  'failedAssignUnAssign': [error: unknown];
  /**
   * Trigger when cancel btn clicked
   */
  'cancel': [];
  /**
   * Trigger When Failed getting task list
   */
  'failedGetTaskList': [];
};

declare class DialogAdjustmentTask extends ClassComponent<
  DialogAdjustmentTaskProps,
  unknown,
  DialogAdjustmentTaskEmits
> {}

export default DialogAdjustmentTask;

export type DialogAdjustmentTaskSingleActionType =
  | 'assign-new-member'
  | 'unassign-new-member'
  | 'detail-task';

export type DialogAdjustmentTaskBulkActionType =
  | 'assign-new-member'
  | 'unassign-new-member';

export interface TaskListResponse extends FetchResponse {
  status: number;
  message: string;
  data: TaskData;
}

interface TaskData {
  totalRecords: number;
  data: Task[];
}

export interface Task {
  _id: string;
  process: Process;
  project: Project;
  module: Module;
  subModule: Module;
  name: string;
  assignedTo: AssignedTo[];
  team: string[];
  status: TaskStatus;
  priority: number;
  timeReportedBug: number;
  productBacklogItem: string | null;
  childTask: number;
  dependency: Dependency;
  lastUpdatedAt: string;
}

interface Process {
  name: string;
  _id: string;
}

interface Project {
  name: string;
  initial: string;
  _id: string;
}

interface Module {
  name: string;
  initial: string;
  _id: string;
}

export interface AssignedTo extends Record<string, unknown> {
  fullName: string;
  nickName: string;
  key: number;
  progress: string;
  profilePictureBig: string;
  profilePictureMedium: string;
  profilePictureSmall: string;
  _id: string;
}

export interface Dependency {
  done?: number;
  onProgress?: number;
}

export interface UpdateTaskMemberItemLocal {
  task: Task;
  newMember: AssignedTo[];
}
