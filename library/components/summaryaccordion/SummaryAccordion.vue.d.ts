import { DevelopmentStatus, ProjectStatus } from 'lib/types/wangsStatus.type';

export interface Summary {
  name: string;
  priority: number;
  status: ProjectStatus;
  initialName: string;
  /**
   * Task with status 'Sprint'
   */
  totalSprintTask: number;
  /**
   * Task with status 'Selesai'
   */
  totalCompletedTask: number;
  /**
   * Task with status 'Backlog'
   */
  totalBacklogTask: number;
  /**
   * The maximum points that can be reached for the project (calculated as the sum of the maximum points for all Sprint tasks).
   */
  totalSprintPoint: number;
  /**
   * How many Report Bug actions happened
   */
  totalBugHistories: number;
}

export interface ProjectSummary extends Summary {
  type: 'project';
  totalModule: number;
  totalCompletedModule: number;
}

export interface ModuleSummary extends Summary {
  type: 'module';
  totalSubModule: number;
}

export interface SubModuleSummary extends Omit<Summary, 'initialName'> {
  type: 'submodule';
  moduleName: string;
  progressWeb?: number;
  progressMobile?: number;
  statusWeb?: DevelopmentStatus;
  statusMobile?: DevelopmentStatus;
}

export interface UserProfileSummary
  extends Omit<Summary, 'name' | 'priority' | 'status'> {
  type: 'profile';
  nickName: string;
  fullName: string;
  aliasName?: string;
  division: string;
  position: string;
  isActive: boolean;
  profilePicture?: string;
  email: string;
  phoneNumber: string;
  teams: string[];
  sprintPoint: number;
  totalSprintTaskDuration: number;
}

export interface SummaryAccordionProps {
  summary?:
    | ProjectSummary
    | ModuleSummary
    | SubModuleSummary
    | UserProfileSummary;
}
