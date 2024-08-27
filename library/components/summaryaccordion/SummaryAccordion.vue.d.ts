export interface Summary {
  name: string;
  priority: number;
  status: 'Backlog' | 'Sprint' | 'Selesai';
  initialName: string;
  /**
   * Progress percentage of all module in project in rounded number (Math.round())
   */
  progress: number;
  totalModule: number;
  totalCompletedModule: number;
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

export interface SummaryAccordionProps {
  type: 'project' | 'module';
  summary: Summary;
}
