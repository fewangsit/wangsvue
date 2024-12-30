import { JSONContent } from '../editor/Editor.vue.d';
import { ClassComponent } from '../ts-helpers';
import { Project, Teams } from 'lib/types/project.type';
import { User } from 'lib/types/user.type';

type PbiCategory = 'Fitur' | 'Bug' | 'Performance & Security' | 'Dokumentasi';

type PbiStatus =
  | 'Backlog'
  | 'Overdue'
  | 'Reported Bug'
  | 'Sprint'
  | 'Pending Testing'
  | 'Selesai';

type Platform = 'Web' | 'Mobile';

export type Pbi = {
  _id: string;
  name: string;
  sprint?: {
    _id: string;
    key: number;
  } | null;
  category: PbiCategory;
  status: PbiStatus;
  totalTask?: number;
  estimateDuration?: string;
  duration?: string;
  iteration?: number;
  editedBy: Partial<Pick<User, '_id' | 'nickName'> & { imageUrl: string }>;
  createdBy: {
    _id: string;
    teams: Teams[];
  };
  createdAt: string;
  lastModified?: string;
  finishedAt?: string;
  description?: JSONContent;
  isMemberAssigned: boolean;
  platform: Platform;
  totalBug?: number;
};

export type TaskStatus =
  | 'Waiting Approval'
  | 'Backlog'
  | 'Sprint'
  | 'Pending Review Leader'
  | 'Reported Bug'
  | 'Fixing Bug'
  | 'Penyesuaian'
  | 'Selesai';

export interface TaskOptions {
  project?: string;
  module?: string;
  subModule?: string;
  pbi?: string;
  excludePbi?: string;
  status?: string;
  member?: string;
  memberOptions?: boolean;
  projectOptions?: boolean;
  moduleOptions?: boolean;
  taskOptions?: boolean;
  subModuleOptions?: boolean;
  processOptions?: boolean;
}

export type AssignedMember = Pick<User, '_id' | 'key' | 'nickName'> & {
  imageUrl: string;
  progress: string;
  team: Teams;
  tasks?: {
    _id: string;
    status: string;
  }[];
};

export interface AssignedMemberOptions {
  member?: boolean;
  team?: boolean;
}

export interface DialogDetailPbiProps {
  /**
   * The boolean modelValue to show dialog.
   */
  visible: boolean;
  /**
   * PBI data to display on the dialog
   */
  selectedPbi?: Pbi;
  /**
   * Project detail, used to determine whether the current user is a PM or not
   */
  project?: Project;
  /**
   * Whether the PBI can be edited or not
   *
   * @default true
   */
  editable?: boolean;
  /**
   * Whether the current user is a QC or not
   *
   * @default false
   */
  isQc?: boolean;
}

declare class DialogDetailPbi extends ClassComponent<
  DialogDetailPbiProps,
  unknown,
  unknown
> {}

export default DialogDetailPbi;
