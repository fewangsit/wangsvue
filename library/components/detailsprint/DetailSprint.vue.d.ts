import { Project } from 'lib/types/project.type';
import { Pbi } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { ClassComponent } from '../ts-helpers';

export type SprintSummary = {
  membersDetails: SummaryMemberDetail[];
  remainingTasks: number;
  finishedTasks: number;
  date: string;
};

type SummaryMemberDetail = {
  taskProgress: string;
  _id?: string;
  nickName?: string;
};

export type SprintStatus =
  | 'Backlog'
  | 'Waiting for Approval'
  | 'Ready to Sprint'
  | 'Sprint'
  | 'Selesai';

export type Sprint = {
  _id: string;
  sprintNumber: number;
  status: SprintStatus;
  totalProductBacklogItems: number;
  totalTasks?: number;
  progressTasks?: string;
  sprintInterval: string;
  startAt: number;
  finishedAt: number;
  isNeedApproval: boolean;
};

export type SprintDetail = Omit<Sprint, 'finishedAt'> & {
  finishAt: number;
  sprintInterval: number;
  sprintIntervalUnit: string;
  productBacklogItems: Pick<Pbi, '_id' | 'name' | 'status'>[];
};

export interface PbiOptions {
  sprint?: boolean;
  editedBy?: boolean;
}

export interface IntervalPut {
  period: number;
  periodUnit: string;
}

export interface DetailSprintProps {
  /**
   * ID of sprint to display
   */
  sprintId: string;
  /**
   * Project detail, used to determine whether the current user is a PM or not
   */
  project?: Project;
  /**
   * Whether the sprint is being approved or not
   *
   * @default false
   */
  isApproving?: boolean;
  /**
   * ID of sprint's approval
   */
  approvalId?: string;
}

export type DetailSprintEmits = {
  approveAndRejectApprovalResponse: [isApprove: boolean, isSuccess: boolean];
};

declare class DetailSprint extends ClassComponent<
  DetailSprintProps,
  unknown,
  DetailSprintEmits
> {}

export default DetailSprint;
