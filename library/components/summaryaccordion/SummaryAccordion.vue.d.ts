export type SubModuleStatus =
  | 'Pending E2E Testing'
  | 'Reported Bug'
  | 'Sprint'
  | 'Backlog';

export interface Summary {
  name: string;
  priority: number;
  status: 'Backlog' | 'Sprint' | 'Selesai';
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

export interface SubModuleSummary extends Summary {
  type: 'submodule';
  moduleName: string;
  progressWeb: number;
  progressMobile: number;
  statusWeb: SubModuleStatus;
  statusMobile: SubModuleStatus;
}

export interface SummaryAccordionProps {
  summary: ProjectSummary | ModuleSummary | SubModuleSummary;
}
