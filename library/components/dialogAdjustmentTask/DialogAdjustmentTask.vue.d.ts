import { FetchResponse } from '../datatable/DataTable.vue.d';
import { ClassComponent } from '../ts-helpers';

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
  'failedAssignUnAssign': [];
  /**
   * Trigger when cancel btn clicked
   */
  'cancel': [];
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
  subModule: string | null;
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

export type TaskStatus =
  | 'Penyesuaian'
  | 'Fixing Bug'
  | 'Reported Bug'
  | 'Pending Review Leader'
  | 'Sprint'
  | 'Backlog';

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

interface AssignedTo {
  fullName: string;
  nickName: string;
  key: number;
  profilePictureBig: string;
  profilePictureMedium: string;
  profilePictureSmall: string;
  _id: string;
}

export interface Dependency {
  done: number;
  onProgress: number;
}
